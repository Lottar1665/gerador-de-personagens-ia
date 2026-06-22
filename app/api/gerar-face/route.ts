import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"
// 🚀 INCLUSÃO: Motor local de avatares livre de bloqueios do navegador
import { createAvatar } from "@dicebear/core"
import { adventurerNeutral } from "@dicebear/collection"

export async function POST(request: Request) {
  try {
    const { descricao, imagemBase64, mimeType } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Configuração do servidor ausente (Chave API)." }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    const dadosFinais: any = {}

    // 🚀 PIPELINE DE PROCESSAMENTO EM LOTE E INTEGRAÇÃO DO CACHE
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

      // Ordem focada no Context Caching: Fixo no topo, mutável por último
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

    // 🚀 INFALÍVEL: Cria uma imagem baseada em texto local direto no servidor
    const sementeAleatoria = Math.random().toString(36).substring(7)
    const avatar = createAvatar(adventurerNeutral, {
      seed: sementeAleatoria,
      size: 400,
    })

    // Converte o vetor em uma string binária segura (Data URI) que carrega instantaneamente
    const svgString = avatar.toDataUri()
    dadosFinais.previewUrl = svgString

    return NextResponse.json(dadosFinais)

  } catch (error: any) {
    console.error("Erro interno no servidor de processamento:", error)
    return NextResponse.json({ 
      error: "Erro ao processar a árvore de parâmetros faciais.",
      details: error.message 
    }, { status: 500 })
  }
}
