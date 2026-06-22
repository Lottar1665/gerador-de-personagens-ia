import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"

export async function POST(request: Request) {
  try {
    const { descricao, imagemBase64, mimeType } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Configuração do servidor ausente (Chave API)." }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // Monta o mapa de parâmetros idêntico ao front-end
    const estruturaJogoMapeada = faceParameters.map(tab => {
      const subAbas = tab.subTabs.map(sub => {
        const sliders = sub.groups.flatMap(g => g.sliders).map(s => `"${s.label}": 50`)
        return `    "${sub.label}": { ${sliders.join(", ")} }`
      })
      return `  "${tab.label}": {\n${subAbas.join(",\n")}\n  }`
    }).join(",\n")

    const promptSistema = `
      Você é o motor de IA do EA FC 26. Sua tarefa é analisar a descrição/foto e convertê-la em valores de sliders faciais (0 a 100).
      
      Retorne APENAS o objeto JSON preenchido com as estimativas. Siga EXATAMENTE a estrutura de chaves fornecida abaixo:
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

    // Disparamos o modelo atualizado configurando o formato estrito de saída JSON
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: conteudoParaEnviar,
      config: {
        // 🔥 Força o servidor do Google a validar o JSON antes de enviar para nós
        responseMimeType: "application/json"
      }
    })

    const textoResposta = response.text || "{}"
    console.log("Resposta corrigida da IA:", textoResposta)
    
    // Limpeza de segurança contra quebras de linha ou markdown acidentais
    const jsonLimpo = textoResposta
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const dadosConvertidos = JSON.parse(jsonLimpo)
    return NextResponse.json(dadosConvertidos)

  } catch (error: any) {
    console.error("Erro interno no servidor de mapeamento:", error)
    return NextResponse.json({ 
      error: "Erro ao processar a árvore massiva de parâmetros faciais.",
      details: error.message 
    }, { status: 500 })
  }
}
