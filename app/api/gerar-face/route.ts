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

    // 🚀 ENGENHARIA DE PROCESSAMENTO EM LOTE E CACHE PARALELO
    const promessasDeMapeamento = faceParameters.map(async (tab) => {
      // Gera a árvore de chaves estática baseada no seu arquivo de configuração
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

      // 🧠 REGRA DE OURO DO CACHE: O conteúdo imutável e massivo (System Prompt) DEVE ser o primeiro!
      const conteudoParaEnviar: any[] = [promptSistema]

      // O texto descritivo complementar (se existir) entra na sequência
      if (descricao) {
        conteudoParaEnviar.push(`Descrição adicional do usuário: ${descricao}`)
      }

      // Os binários mutáveis da imagem (que mudam a cada requisição) entram por ÚLTIMO de tudo.
      // Isso permite que o Google congele o topo do prompt e processe apenas o final, economizando tempo e tokens.
      if (imagemBase64 && mimeType) {
        conteudoParaEnviar.push({
          inlineData: { 
            data: imagemBase64, 
            mimeType: mimeType 
          }
        })
      }

      // Disparamos o modelo Flash-Lite (focado em latência ultra-baixa)
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite", 
        contents: conteudoParaEnviar,
        config: { 
          responseMimeType: "application/json" 
        }
      })

      const textoResposta = response.text || "{}"
      const jsonLimpo = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim()
      
      return { 
        aba: tab.label, 
        dados: JSON.parse(jsonLimpo)[tab.label] || {} 
      }
    })

    // Aguarda o retorno de todas as abas processadas em paralelo pelos servidores da Google
    const resultadosPorAba = await Promise.all(promessasDeMapeamento)
    
    // Remonta o objeto JSON final com todas as chaves aninhadas para o seu front-end
    resultadosPorAba.forEach(resultado => {
      dadosFinais[resultado.aba] = resultado.dados
    })

    // Insere o link de visualização referencial do avatar para o painel esquerdo
    dadosFinais.previewUrl = `https://unsplash.com`

    return NextResponse.json(dadosFinais)

  } catch (error: any) {
    console.error("Erro interno no pipeline de cacheamento por lotes:", error)
    return NextResponse.json({ 
      error: "Erro ao processar a árvore massiva de parâmetros faciais.",
      details: error.message 
    }, { status: 500 })
  }
}
