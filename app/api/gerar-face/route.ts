import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
// 🚀 IMPORTAÇÃO CHAVE: Importamos a lista real com centenas de parâmetros do seu app
import { faceParameters } from "@/lib/face-parameters"

export async function POST(request: Request) {
  try {
    const { descricao, imagemBase64, mimeType } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Configuração do servidor ausente (Chave API)." }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // 🧠 ENGENHARIA DE PROMPT DINÂMICA: Varremos o arquivo do v0 para extrair todos os nomes exatos de sliders
    const estruturaJogoMapeada = faceParameters.map(tab => {
      const subAbas = tab.subTabs.map(sub => {
        const sliders = sub.groups.flatMap(g => g.sliders).map(s => `"${s.label}"`)
        return `    "${sub.label}": { ${sliders.join(": 0 a 100, ") || ""} }`
      })
      return `"${tab.label}": {\n${subAbas.join(",\n")}\n  }`
    }).join(",\n")

    const promptSistema = `
      Você é o motor de inteligência artificial de alta precisão do EA FC 26.
      Sua tarefa é analisar minuciosamente a descrição textual ou os traços antropométricos da foto enviada e convertê-los nos valores exatos de sliders faciais (0 a 100).
      
      Você DEVE retornar OBRIGATORIAMENTE apenas um objeto JSON puro e válido, sem qualquer tipo de formatação ou blocos de código markdown (NÃO use aspas triplas ou \`\`\`json).
      
      Para que o sistema funcione com erro zero, use EXATAMENTE a estrutura de chaves e nomes de sliders em português listados abaixo. Não invente termos e não mude a grafia. Preencha o máximo de sliders que conseguir identificar com base nos dados do usuário:

      {
        ${estruturaJogoMapeada}
      }
    `

    const conteudoParaEnviar: any[] = [promptSistema, descricao]

    if (imagemBase64 && mimeType) {
      conteudoParaEnviar.push({
        inlineData: {
          data: imagemBase64,
          mimeType: mimeType
        }
      })
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: conteudoParaEnviar,
    })

    const textoResposta = response.text || "{}"
    console.log("Resposta massiva da IA:", textoResposta)
    
    const jsonLimpo = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim()
    const dadosConvertidos = JSON.parse(jsonLimpo)

    return NextResponse.json(dadosConvertidos)

  } catch (error: any) {
    console.error("Erro interno no servidor de mapeamento:", error)
    return NextResponse.json({ error: "Erro ao processar a árvore massiva de parâmetros faciais." }, { status: 500 })
  }
}
