// app/api/gerar-preset/route.ts
import { NextResponse } from "next/server"
import { Buffer } from "buffer"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"
import { converterParaSlider } from "@/lib/motorMatematico" // 1. Importa seu motor

const normalizeKey = (key: string) =>
  key
    .toString()
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const DEFAULT_NUMERIC_CONFIDENCE = 60

// Função auxiliar para calcular distância 3D entre os pontos enviados
const dist3D = (p1: any, p2: any) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

const parseFlatJson = (text: string) => {
  const jsonStartIndex = text.indexOf("{")
  const jsonEndIndex = text.lastIndexOf("}")

  if (jsonStartIndex === -1 || jsonEndIndex === -1) {
    throw new Error(`Gemini retornou um formato inválido ou incompleto: ${text}`)
  }

  let jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1).trim()
  jsonString = jsonString
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/([,{])\s*([^"\s][^:"]*?)\s*:/g, '$1"$2":')
    .replace(/'/g, '"')
    .replace(/,\s*}/g, "}")

  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.warn("Falha ao fazer o parse inicial do JSON da IA, tentando limpar chaves...")
    const retry = jsonString.replace(/([\w\s-]+):/g, '"$1":')
    return JSON.parse(retry)
  }
}

export async function POST(request: Request) {
  try {
    // 2. Adiciona o recebimento das landmarks vindas do MediaPipe do frontend
    const { imageBase64, mimeType, landmarksFrente } = await request.json()
    const mimeTypeClean = mimeType || "image/jpeg"

    if (!imageBase64) {
      return NextResponse.json({ error: "Imagem não fornecida." }, { status: 400 })
    }

    const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY não foi configurada no ambiente.")
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey })

    // 3. SE AS LANDMARKS EXISTIREM: O servidor calcula a base anatômica 3D rígida
    let slidersMatematicos: Record<string, number> = {};
    if (landmarksFrente && landmarksFrente.length > 0) {
      const dip = dist3D(landmarksFrente[133], landmarksFrente[362]);
      
      slidersMatematicos = {
        "largura maxilar": converterParaSlider('largura_maxilar', dist3D(landmarksFrente[172], landmarksFrente[397]) / dip),
        "distancia sobrancelha ao olho": converterParaSlider('distancia_sobrancelha_olho', dist3D(landmarksFrente[70], landmarksFrente[159]) / dip),
        "largura do nariz": converterParaSlider('largura_nariz', dist3D(landmarksFrente[61], landmarksFrente[291]) / dip),
        "largura da boca": converterParaSlider('largura_boca', dist3D(landmarksFrente[57], landmarksFrente[287]) / dip),
        "abertura vertical da palpebra": converterParaSlider('abertura_palpebra', dist3D(landmarksFrente[159], landmarksFrente[145]) / dip)
      };
    }

    const sliderLabelsList = faceParameters
  .flatMap(category => category.mainTabs || [])
  .flatMap(tab => tab.subTabs || [])
  .flatMap(sub => sub.groups || [])
  .flatMap(g => g.sliders || [])
  .map(s => `"${s.labelAI}"`)
  .join(", ")


    // 4. Injeta os dados geométricos calculados no System Prompt para o Gemini refinar esteticamente
    const systemPrompt = [
      "You are an EA FC 26 face analysis engine.",
      "",
      "Analyze the face in the image.",
      "",
      "You will receive a base estimation of sliders calculated from 3D rigid geometry. Your job is to visually inspect the face textures, shadows, and ethnic details to adjust these numbers by at most +=12 or -=12 points, and guess the remaining sliders.",
      landmarksFrente ? `Base geometric sliders to refine: ${JSON.stringify(slidersMatematicos)}` : "",
      "",
      "Return ONLY a flat JSON object where keys are the exact names from the valid list below.",
      "",
      "Rules:",
      "1. Use ONLY the exact slider names provided in the valid list.",
      "2. For each slider key, return an integer value between 0 and 100.",
      "3. Do NOT wrap values in nested objects like {value: 50}.",
      "4. Do NOT add explanations, commentary, or markdown blocks.",
      "",
      "Valid sliders list:",
      "[ " + sliderLabelsList + " ]",
    ].join("\n")

    const sendToGemini = async (prompt: string) => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          prompt,
          {
            inlineData: {
              data: rawBase64,
              mimeType: mimeTypeClean
            }
          }
        ],
        config: {
          temperature: 0,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      })

      return response.text ?? "{}"
    }

    const rawTextResponse = await sendToGemini(systemPrompt)
    const flatSlidersMap = parseFlatJson(rawTextResponse)
    const normalizedResponseMap = new Map<string, any>()

    Object.entries(flatSlidersMap).forEach(([key, value]) => {
      const normalizedKeyStr = normalizeKey(key)
      
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if (Object.prototype.hasOwnProperty.call(value, "value")) {
          normalizedResponseMap.set(normalizedKeyStr, (value as any).value)
        }
      } else {
        normalizedResponseMap.set(normalizedKeyStr, value)
      }
    })

    const structureResult: any = {}
    const missingKeys: string[] = []
    const confidencesMap: Record<string, number | null> = {}

    faceParameters.forEach((category) => {
  structureResult[category.label] = {}
  
  category.mainTabs.forEach((tab) => {
    structureResult[category.label][tab.label] = {}
    
    tab.subTabs.forEach((sub) => {
      structureResult[category.label][tab.label][sub.label] = {}
      
      sub.groups.forEach((group) => {
        structureResult[category.label][tab.label][sub.label][group.label] = {}
        
        group.sliders.forEach((slider) => {
          const fallbackValue = (slider as any).default ?? (slider as any).value ?? 50
          const targetKey = normalizeKey(slider.labelAI)
          const altKey = normalizeKey(slider.label)
          
          let aiValue = normalizedResponseMap.get(targetKey)
          let confidence: number | null = null

          if (aiValue === undefined) {
            aiValue = normalizedResponseMap.get(altKey)
          }

          if (aiValue === undefined) {
            const match = [...normalizedResponseMap.entries()].find(([receivedKey]) =>
              receivedKey === targetKey ||
              receivedKey === altKey ||
              receivedKey.includes(targetKey) ||
              targetKey.includes(receivedKey)
            )
            if (match) {
              aiValue = match[1] 
            }
          }

          let finalValue = fallbackValue
          if (typeof aiValue === "number") {
            finalValue = Math.max(0, Math.min(100, Math.round(aiValue)))
          } else if (typeof aiValue === "string") {
            const parsed = parseInt(aiValue, 10)
            if (!isNaN(parsed)) {
              finalValue = Math.max(0, Math.min(100, parsed))
            }
          }

          if (aiValue !== undefined) {
            confidence = DEFAULT_NUMERIC_CONFIDENCE
          }

          // Monta o JSON final respeitando os 5 níveis aninhados para o seu frontend ler sem travar
          structureResult[category.label][tab.label][sub.label][group.label][slider.label] = finalValue
          confidencesMap[slider.labelAI] = confidence

          if (aiValue === undefined) {
            missingKeys.push(slider.labelAI)
          }
        })
      })
    })
  })
})


    return NextResponse.json({
      parameters: structureResult,
      meta: {
        missingKeys,
        confidences: confidencesMap
      }
    })

  } catch (error: any) {
    console.error("❌ Erro geral na API:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno no servidor." },
      { status: 500 }
    )
  }
}
