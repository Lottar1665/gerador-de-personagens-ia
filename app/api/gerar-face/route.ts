import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"

export async function POST(request: Request) {
  try {
    // ✅ CORREÇÃO: Voltamos a ler a 'descricao' para bater com o envio do front-end
    const { descricao, imagemBase64, mimeType } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Configuração do servidor ausente." }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // Extrai uma lista simples contendo os nomes de todos os sliders reais do jogo
    const listaNomesSliders = faceParameters
      .flatMap(tab => tab.subTabs)
      .flatMap(sub => sub.groups)
      .flatMap(g => g.sliders)
      .map(s => `"${s.label}"`)
      .join(", ")

    const promptSistema = `
      Você é o motor de IA do EA FC 26. Analise a foto fornecida e estime os valores de sliders faciais (0 a 100).
      Retorne APENAS um objeto JSON plano contendo as chaves com os nomes dos sliders e seus respectivos valores numéricos.
      
      NÃO use blocos de código markdown (\`\`\`json). Retorne estritamente neste formato limpo:
      {
        "Largura da Face": 65,
        "Espessura Central": 75,
        "Comprimento do Nariz": 50
      }

      Sliders válidos disponíveis no jogo para você preencher: [ ${listaNomesSliders} ]
    `

    // Prepara o array de conteúdos
    const conteudoParaEnviar: any[] = [promptSistema]
    if (descricao) {
      conteudoParaEnviar.push(`Contexto adicional do usuário: ${descricao}`)
    }
    if (imagemBase64 && mimeType) {
      conteudoParaEnviar.push({ inlineData: { data: imagemBase64, mimeType: mimeType } })
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: conteudoParaEnviar,
      config: { responseMimeType: "application/json" }
    })

    const textoResposta = response.text || "{}"
    const jsonLimpo = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim()
    const slidersPlanos = JSON.parse(jsonLimpo)

    // Remonta a árvore respeitando os 4 níveis exigidos pelo v0
    const dadosConvertidos: any = {}
    
    faceParameters.forEach(tab => {
      dadosConvertidos[tab.label] = {}
      
      tab.subTabs.forEach(sub => {
        dadosConvertidos[tab.label][sub.label] = {}
        
        sub.groups.forEach(group => {
          dadosConvertidos[tab.label][sub.label][group.label] = {}
          
          group.sliders.forEach(slider => {
            const valorOriginal = (slider as any).default ?? (slider as any).value ?? (slider as any).defaultValue ?? 50

const valorCalculado = slidersPlanos[slider.label] !== undefined 
  ? slidersPlanos[slider.label] 
  : valorOriginal
              
            dadosConvertidos[tab.label][sub.label][group.label][slider.label] = Number(valorCalculado)
          })
        })
      })
    })

    // ✅ CORREÇÃO: URL corrigida com crases e rota oficial de vetores estáveis do DiceBear
    const sementeAleatoria = Math.floor(Math.random() * 100000)
    dadosConvertidos.previewUrl = `https://dicebear.com{sementeAleatoria}`

    return NextResponse.json(dadosConvertidos)

  } catch (error: any) {
    console.error("Erro no back-end reconstrutor:", error)
    return NextResponse.json({ error: "Erro ao processar parâmetros.", details: error.message }, { status: 500 })
  }
}
