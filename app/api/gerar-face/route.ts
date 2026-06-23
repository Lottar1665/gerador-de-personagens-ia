import { NextResponse } from "next/server"
import { faceParameters } from "@/lib/face-parameters"

export async function POST(request: Request) {
  try {
    const { imageBase64, mimeType } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: "Imagem não fornecida." }, { status: 400 })
    }

    // Limpa o cabeçalho do Base64
    const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

    // Puxa a URL dinâmica da Vercel (Localtunnel) ou usa localhost se estiver rodando no seu PC
    const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"

    const sliderLabelsList = faceParameters
  .flatMap(tab => tab.subTabs)
  .flatMap(sub => sub.groups)
  .flatMap(g => g.sliders)
  .map(s => `"${s.labelAI}"`)
  .join(", ")

    const systemPrompt = `
You are an EA FC 26 face analysis engine.

Analyze the face in the image.

Return ONLY a flat JSON object.

Rules:

1. Use ONLY the slider names provided.
2. Return integer values between 0 and 100.
3. Do NOT explain anything.
4. Do NOT add markdown.
5. Do NOT create nested objects.
6. Populate as many sliders as possible.

Example:

{
  "skull width": 63,
  "skull height": 58,
  "nose width": 72
}

Valid sliders:

[ ${sliderLabelsList} ]
`

    console.log(`1. Conectando ao Ollama no endereço: ${ollamaBaseUrl}...`)
    
    // 🚀 OLLAMA (Lê a foto usando o túnel)
    const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/generate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true" // Fura a tela de bloqueio do Localtunnel
      },
      body: JSON.stringify({
        model: "llava", 
        prompt: systemPrompt,
        images: [rawBase64], 
        stream: false,
        format: "json" 
      })
    })

    if (!ollamaResponse.ok) throw new Error("A conexão pelo túnel com o Ollama foi recusada.")

    const ollamaData = await ollamaResponse.json()
    const rawTextResponse = ollamaData.response || "{}"

    const jsonStartIndex = rawTextResponse.indexOf("{")
    const jsonEndIndex = rawTextResponse.lastIndexOf("}")
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error(`Ollama retornou um formato inválido: ${rawTextResponse}`)
    }

    const sanitizedJsonString = rawTextResponse.substring(jsonStartIndex, jsonEndIndex + 1).trim()
    const flatSlidersMap = JSON.parse(sanitizedJsonString)

    console.log("================================")
console.log("JSON RECEBIDO DA IA")
console.log(flatSlidersMap)
console.log("================================")

    // Reconstrói a árvore para preencher a interface do site
    const structureResult: any = {}
    faceParameters.forEach(tab => {
      structureResult[tab.label] = {}
      tab.subTabs.forEach(sub => {
        structureResult[tab.label][sub.label] = {}
        sub.groups.forEach(group => {
          structureResult[tab.label][sub.label][group.label] = {}
          group.sliders.forEach(slider => {
            const fallbackValue = (slider as any).default ?? (slider as any).value ?? 50
            const aiValue = flatSlidersMap[slider.labelAI]

const computedValue =
  typeof aiValue === "number"
    ? Math.max(0, Math.min(100, aiValue))
    : fallbackValue
            structureResult[tab.label][sub.label][group.label][slider.label] = Number(computedValue)
          })
        })
      })
    })

    // Como não vamos gerar imagem 3D, devolvemos null para a imagem não quebrar
    structureResult.previewUrl = null;

    console.log("✅ Sucesso! Parâmetros gerados e enviados para o frontend.")

    return NextResponse.json(structureResult)

  } catch (error: any) {
    console.error("❌ Erro geral na API:", error)
    return NextResponse.json({ error: `Falha na requisição: ${error.message}` }, { status: 500 })
  }
}