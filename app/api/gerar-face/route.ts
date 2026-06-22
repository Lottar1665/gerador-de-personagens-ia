import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"

export async function POST(request: Request) {
  try {
    const { imagemBase64, mimeType } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Configuração do servidor ausente (Chave API)." }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const dadosFinais: any = {}

    // 🚀 ENGENHARIA DE PROCESSAMENTO EM LOTE: Enviamos uma requisição separada para cada aba principal (paralelo)
    const promessasDeMapeamento = faceParameters.map(async (tab) => {
      // Monta a lista de sliders apenas desta aba específica para não estourar os tokens
      const subAbas = tab.subTabs.map(sub => {
        const sliders = sub.groups.flatMap(g => g.sliders).map(s => `"${s.label}": 50`)
        return `    "${sub.label}": { ${sliders.join(", ")} }`
      })
      const estruturaAbaOtimizada = `  "${tab.label}": {\n${subAbas.join(",\n")}\n  }`

      const promptSistema = `
        Você é o motor de IA do EA FC 26. Sua tarefa é analisar a foto fornecida e estimar os valores de sliders faciais (0 a 100) APENAS para a categoria "${tab.label}".
        
        Você DEVE retornar obrigatoriamente apenas o objeto JSON preenchido. Siga estritamente esta estrutura:
        {
  ${estruturaAbaOtimizada}
        }
      `

      const conteudoParaEnviar: any[] = [promptSistema]
      if (imagemBase64 && mimeType) {
        conteudoParaEnviar.push({
          inlineData: { data: imagemBase64, mimeType: mimeType }
        })
      }

      // Executa a chamada focada apenas nesta categoria
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: conteudoParaEnviar,
        config: { responseMimeType: "application/json" }
      })

      const textoResposta = response.text || "{}"
      const jsonLimpo = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim()
      
      return { aba: tab.label, dados: JSON.parse(jsonLimpo)[tab.label] || {} }
    })

    // Aguarda todas as abas responderem ao mesmo tempo (Super Rápido!)
    const resultadosPorAba = await Promise.all(promessasDeMapeamento)
    
    // Junta os blocos individuais no objeto final do boneco
    resultadosPorAba.forEach(resultado => {
      dadosFinais[resultado.aba] = resultado.dados
    })

    // Adiciona o link do preview visual no final
    dadosFinais.previewUrl = `https://unsplash.com`

    return NextResponse.json(dadosFinais)

  } catch (error: any) {
    console.error("Erro interno no servidor de loteamento:", error)
    return NextResponse.json({ 
      error: "Erro ao processar a árvore massiva de parâmetros faciais.",
      details: error.message 
    }, { status: 500 })
  }
}