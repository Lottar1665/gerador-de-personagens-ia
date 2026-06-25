import { NextResponse } from "next/server"
import { Buffer } from "buffer"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"

const normalizeKey = (key: string) =>
  key
    .toString()
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const DEFAULT_NUMERIC_CONFIDENCE = 60

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
    const { imageBase64, mimeType } = await request.json()
    const mimeTypeClean = mimeType || "image/jpeg"

    if (!imageBase64) {
      return NextResponse.json({ error: "Imagem não fornecida." }, { status: 400 })
    }

    // Limpa o cabeçalho do Base64 corretamente extraindo a segunda parte do array
    const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY não foi configurada no ambiente.")
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey })
    if (!mimeType || mimeType === "") {
      console.warn("mimeType vazio recebido da requisição — usando fallback image/jpeg")
    }

    const sliderLabelsList = faceParameters
      .flatMap(tab => tab.subTabs)
      .flatMap(sub => sub.groups)
      .flatMap(g => g.sliders)
      .map(s => `"${s.labelAI}"`)
      .join(", ")

    const systemPrompt = [
      "You are an EA FC 26 face analysis engine.",
      "",
      "Analyze the face in the image.",
      "",
      "Return ONLY a JSON object.",
      "",
      "Rules:",
      "",
      "1. Use ONLY the slider names provided in the valid list.",
      "2. For each slider key return either:",
      "   - an integer value between 0 and 100, OR",
      "   - an object with exactly two fields: { \"value\": an integer between 0 and 100, \"confidence\": an integer between 0 and 100 }.",
      "3. If you are uncertain about a value, still provide your best estimate and set a lower 'confidence' (0-100).",
      "4. Do NOT add explanations or commentary.",
      "5. Do NOT add markdown.",
      "6. Do NOT invent new keys — use the exact key text shown in the valid list.",
      "7. Use integers only (no decimals).",
      "",
      "Example valid formats: a numeric value (e.g. 63) OR an object with 'value' and 'confidence' fields (e.g. {value:72, confidence:85}).",
      "",
      "Valid sliders:",
      "",
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

      const text = response.text ?? "{}"
      console.log("================================")
      console.log("IA RAW RESPONSE:", text)
      return text
    }

    const rawTextResponse = await sendToGemini(systemPrompt)
    const flatSlidersMap = parseFlatJson(rawTextResponse)
    const normalizedResponseMap = new Map<string, any>()

    // Mapeia diretamente os valores e trata se houver algum aninhamento ou objeto estruturado
    const isNested = Object.values(flatSlidersMap).some((v) => v && typeof v === "object" && !Object.prototype.hasOwnProperty.call(v, "value"))
    
    if (isNested) {
      console.log("IA retornou objeto aninhado estrutural — aplicando flatten para extrair sliders.")
      const valueTokens = new Set(["value", "valor"])
      const flatten = (obj: any, path: string[] = []) => {
        Object.entries(obj).forEach(([k, v]) => {
          if (v !== null && typeof v === "object" && !Object.prototype.hasOwnProperty.call(v, "value")) {
            flatten(v, [...path, k])
          } else {
            const leafKey = k
            const fullPathArr = [...path, k]
            const fullPath = fullPathArr.join(" ")
            const normLeaf = normalizeKey(leafKey)

            if (valueTokens.has(normLeaf)) {
              const pathWithoutLeaf = normalizeKey(path.join(" "))
              normalizedResponseMap.set(pathWithoutLeaf, v)
            } else {
              const cleanedFull = normalizeKey(fullPath).replace(/\b(value|valor)\b/g, "").replace(/\s+/g, " ").trim()
              normalizedResponseMap.set(normalizeKey(leafKey), v)
              normalizedResponseMap.set(cleanedFull, v)
            }
          }
        })
      }
      flatten(flatSlidersMap)
    } else {
      Object.entries(flatSlidersMap).forEach(([key, value]) => {
        normalizedResponseMap.set(normalizeKey(key), value)
      })
    }

    console.log("IA KEYS RECEBIDAS:", Object.keys(flatSlidersMap))
    console.log("IA MAPA CONFIGURADO:", [...normalizedResponseMap.keys()])

    const structureResult: any = {}
    const missingKeys: string[] = []
    const recognizedKeys = new Set<string>()
    const confidencesMap: Record<string, number | null> = {}
    const lowConfidenceKeys: string[] = []

    faceParameters.forEach((tab) => {
      structureResult[tab.label] = {}
      tab.subTabs.forEach((sub) => {
        structureResult[tab.label][sub.label] = {}
        sub.groups.forEach((group) => {
          structureResult[tab.label][sub.label][group.label] = {}
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
                targetKey.includes(receivedKey) ||
                receivedKey.includes(altKey) ||
                altKey.includes(receivedKey)
              )
              if (match) {
                aiValue = match[1] // 👈 CORREÇÃO: Captura apenas o VALOR (segundo item da array)
                recognizedKeys.add(match[0]) // Guarda a chave de texto correspondente
              }
            } else {
              recognizedKeys.add(targetKey)
            }



            // Garante a extração se o valor vier empacotado como objeto de confiança
            if (aiValue !== undefined && aiValue !== null && typeof aiValue === "object") {
              if (Object.prototype.hasOwnProperty.call(aiValue, "value")) {
                const maybeValue = (aiValue as any).value
                const maybeConfidence = (aiValue as any).confidence
                if (typeof maybeValue === "number") aiValue = maybeValue
                if (typeof maybeConfidence === "number") confidence = maybeConfidence
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

            if (confidence === null && aiValue !== undefined) {
              confidence = DEFAULT_NUMERIC_CONFIDENCE
            }

            structureResult[tab.label][sub.label][group.label][slider.label] = finalValue
            confidencesMap[slider.labelAI] = confidence

            if (aiValue === undefined) {
              missingKeys.push(slider.labelAI)
            } else if (confidence !== null && confidence < 50) {
              lowConfidenceKeys.push(slider.labelAI)
            }
          })
        })
      })
    })

    return NextResponse.json({
      parameters: structureResult,
      meta: {
        missingKeys,
        lowConfidenceKeys,
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
