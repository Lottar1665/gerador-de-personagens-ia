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
    const dadosFinais: any = {}

    // Pipeline leve de processamento em lote por aba
    const promessasDeMapeamento = faceParameters.map(async (tab) => {
      const subAbas = tab.subTabs.map(sub => {
        const sliders = sub.groups.flatMap(g => g.sliders).map(s => `"${s.label}": 50`)
        return `    "${sub.label}": { ${sliders.join(", ")} }`
      })
      const estruturaAbaOtimizada = `  "${tab.label}": {\n${subAbas.join(",\n")}\n  }`

      const promptSistema = `
        Você é o motor de inteligência artificial de alta precisão do EA FC 26.
        Sua tarefa é analisar minuciosamente os traços antropométricos da foto enviada pelo usuário e convertê-los nos valores exatos de sliders faciais (0 a 100) APENAS para a categoria "${tab.label}".
        
        Você DEVE retornar obrigatoriamente apenas um objeto JSON puro preenchido, sem qualquer tipo de formatação ou blocos de código markdown (NÃO use aspas triplas ou \`\`\`json).
        
        Siga estritamente esta estrutura de chaves:
        {
  ${estruturaAbaOtimizada}
        }
      `

      const conteudoParaEnviar: any[] = [promptSistema]
      if (descricao) {
        conteudoParaEnviar.push(`Descrição adicional do usuário: ${descricao}`)
      }
      if (imagemBase64 && mimeType) {
        conteudoParaEnviar.push({
          inlineData: { data: imagemBase64, mimeType: mimeType }
        })
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite", 
        contents: conteudoParaEnviar,
        config: { responseMimeType: "application/json" }
      })

      const textoResposta = response.text || "{}"
      const jsonLimpo = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim()
      
      return { 
        aba: tab.label, 
        dados: JSON.parse(jsonLimpo)[tab.label] || {} 
      }
    })

    const resultadosPorAba = await Promise.all(promessasDeMapeamento)
    
    resultadosPorAba.forEach(resultado => {
      dadosFinais[resultado.aba] = resultado.dados
    })

    // 🚀 SOLUÇÃO DEFINITIVA: Gera um link dinâmico leve que não consome memória da Vercel
    // Cria um ID de avatar estilizado de jogo de forma aleatória a cada clique
    const sementeAleatoria = Math.floor(Math.random() * 100000)
    dadosFinais.previewUrl = `https://dicebear.com{sementeAleatoria}`

    return NextResponse.json(dadosFinais)

  } catch (error: any) {
    console.error("Erro interno no pipeline:", error)
    return NextResponse.json({ 
      error: "Erro ao processar a árvore de parâmetros faciais.",
      details: error.message 
    }, { status: 500 })
  }
}
