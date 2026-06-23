import { NextResponse } from "next/server"
import { faceParameters } from "@/lib/face-parameters"

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: "Imagem não fornecida." }, { status: 400 })
    }

    // O Ollama e o Fooocus esperam o Base64 "limpo" (sem o cabeçalho 'data:image/jpeg;base64,')
    const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

    // Extracts all valid slider labels from the game configurations file
    const sliderLabelsList = faceParameters
      .flatMap(tab => tab.subTabs)
      .flatMap(sub => sub.groups)
      .flatMap(g => g.sliders)
      .map(s => `"${s.label}"`)
      .join(", ")

    const systemPrompt = `
      You are the core AI engine of EA FC 26 game. Analyze the visual facial features provided and estimate facial slider values (from 0 to 100).
      Return EXCLUSIVELY a clean, raw flat JSON object mapping the slider names to their calculated numeric percent integers. 
      Do not include any conversational text, no introductions, no explanations, and no markdown formatting blocks.
      
      Strict output template format:
      {
        "Largura da Face": 65,
        "Espessura Central": 75
      }

      Valid available sliders for you to populate: [ ${sliderLabelsList} ]
    `

    console.log("1. Extraindo parâmetros no Ollama...")
    
    // 🚀 OLLAMA (LLaVA)
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava", 
        prompt: systemPrompt,
        images: [rawBase64], 
        stream: false,
        format: "json" 
      })
    })

    if (!ollamaResponse.ok) throw new Error("Local Ollama connection refused.")

    const ollamaData = await ollamaResponse.json()
    const rawTextResponse = ollamaData.response || "{}"

    const jsonStartIndex = rawTextResponse.indexOf("{")
    const jsonEndIndex = rawTextResponse.lastIndexOf("}")
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error(`Ollama returned an incomplete or invalid string payload: ${rawTextResponse}`)
    }

    const sanitizedJsonString = rawTextResponse.substring(jsonStartIndex, jsonEndIndex + 1).trim()
    const flatSlidersMap = JSON.parse(sanitizedJsonString)

    // Reconstructs the 4-level layout tree required by the results panel
    const structureResult: any = {}
    faceParameters.forEach(tab => {
      structureResult[tab.label] = {}
      tab.subTabs.forEach(sub => {
        structureResult[tab.label][sub.label] = {}
        sub.groups.forEach(group => {
          structureResult[tab.label][sub.label][group.label] = {}
          group.sliders.forEach(slider => {
            const fallbackValue = (slider as any).default ?? (slider as any).value ?? 50
            const computedValue = flatSlidersMap[slider.label] !== undefined 
              ? flatSlidersMap[slider.label] 
              : fallbackValue
            structureResult[tab.label][sub.label][group.label][slider.label] = Number(computedValue)
          })
        })
      })
    })

    // Prepares the text summary instruction prompt for Fooocus
    structureResult.resumoPrompt = `3D game avatar character render, EA FC 26 player selection screen, face close-up, Frostbite engine graphics, jaw width ${flatSlidersMap["Largura da Mandíbula"] || 50}, nose shape ${flatSlidersMap["Largura da Ponta do Nariz"] || 50}`

    console.log("2. Gerando Imagem 3D no Fooocus API...")

    // 🚀 FOOOCUS API
    try {
      const fooocusResponse = await fetch("http://127.0.0.1:8888/v1/generation/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: structureResult.resumoPrompt,
          negative_prompt: "cartoon, anime, bad anatomy, deformed, sketch, ugly, realistic photograph",
          style_selections: ["Fooocus V2", "Fooocus Masterpiece"],
          performance_selection: "Speed", 
          aspect_ratio: "1:1",
          require_base64: true, // Força o envio da imagem de volta
          image_prompts: [
            {
              cn_img: rawBase64, 
              cn_stop: 0.85,
              cn_weight: 0.85,
              cn_type: "FaceSwap"
            }
          ]
        })
      })

      if (fooocusResponse.ok) {
        const fooocusData = await fooocusResponse.json()
        
        console.log("📥 Resposta crua do Fooocus:", JSON.stringify(fooocusData).substring(0, 200) + "...") 
        
        let imagemBase64 = null;

        if (Array.isArray(fooocusData) && fooocusData.length > 0) {
            imagemBase64 = fooocusData[0].base64 || fooocusData[0].url;
        } else if (fooocusData.images && fooocusData.images.length > 0) {
            imagemBase64 = fooocusData.images[0].base64 || fooocusData.images[0].url;
        } else if (fooocusData.data && fooocusData.data.length > 0) {
            imagemBase64 = fooocusData.data[0].base64 || fooocusData.data[0].url;
        }

        if (imagemBase64) {
          // Verifica e formata a imagem de forma inteligente
          if (imagemBase64.startsWith("http") || imagemBase64.startsWith("data:image")) {
            structureResult.previewUrl = imagemBase64;
          } else {
            structureResult.previewUrl = `data:image/png;base64,${imagemBase64}`;
          }
          console.log("✅ 3. Sucesso! Imagem extraída e pronta para o frontend.")
        } else {
          console.error("❌ Aviso: A API respondeu com sucesso, mas não encontramos a chave 'base64'.")
        }
      } else {
        const erroDetalhado = await fooocusResponse.text()
        console.error("❌ O FOOOCUS RECUSOU O PEDIDO:", erroDetalhado)
      }
    } catch (fooocusError) {
      console.error("❌ FALHA DE CONEXÃO COM O FOOOCUS:", fooocusError)
    }

    // Sucesso Total! Retorna os parâmetros do Ollama e a Imagem do Fooocus para a tela
    return NextResponse.json(structureResult)

  } catch (error: any) {
    // Esse catch captura erros gerais (ex: Ollama fora do ar)
    console.error("❌ Erro geral na API:", error)
    return NextResponse.json({ error: "Local pipeline processing error.", details: error.message }, { status: 500 })
  }
}