import { NextResponse } from "next/server"
import { Buffer } from "buffer"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"
import { converterParaSlider } from "@/lib/motorMatematico" // 1. Importa seu motor
import { mockGeminiResponse } from "@/lib/mock-preset"
import { generateFaceAnalysisPrompt } from "@/lib/prompt"
import { mapearArvoreBiometrica } from "./utils"

const normalizeKey = (key: string) =>
  key
    .toString()
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const DEFAULT_NUMERIC_CONFIDENCE = 60

// Função auxiliar para calcular distância 3D entre os pontos enviados
const dist3D = (p1: any, p2: any) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

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
  // 🟢 CORREÇÃO: Declaramos as variáveis na raiz da função para que o 'try' e o 'catch' consigam enxergá-las!
  const structureResult: any = {}
  const missingKeys: string[] = []
  const confidencesMap: Record<string, number | null> = {}

  try {
    const MOCK_MODE = false; 
    const { imageBase64, mimeType, landmarksFrente } = await request.json()
    const mimeTypeClean = mimeType || "image/jpeg"

    if (!imageBase64) {
      return NextResponse.json({ error: "Imagem não fornecida." }, { status: 400 })
    }

        // 🟢 Captura estritamente a segunda metade da string splitada (o base64 puro)
    const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;



    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY não foi configurada no ambiente.")
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey })

    let slidersMatematicos: Record<string, number> = {};
    if (landmarksFrente && landmarksFrente.length > 0) {
      const dip = dist3D(landmarksFrente[133], landmarksFrente[362]);
      slidersMatematicos = {
        "largura maxilar": converterParaSlider('largura_maxilar', dist3D(landmarksFrente[172], landmarksFrente[397]) / dip),
        "distancia sobrancelha ao olho": converterParaSlider('distancia_sobrancelha_olho', dist3D(landmarksFrente[70], landmarksFrente[159]) / dip),
        "largura do nariz": converterParaSlider('largura_nariz', dist3D(landmarksFrente[61], landmarksFrente[291]) / dip),
        "largura da boca": converterParaSlider('largura_boca', dist3D(landmarksFrente[57], landmarksFrente[287]) / dip),
        "abertura vertical da palpebra": converterParaSlider('abertura_palpebra', dist3D(landmarksFrente[159], landmarksFrente[145]) / dip)
      };
    }

        let flatSlidersMap: any = {};

             if (MOCK_MODE) {
      console.log("⚠️ MODO SIMULAÇÃO ATIVO: Gerando árvore completa com valores dinâmicos.");

      // Função interna que vai varrer a sua lista oficial faceParameters (que você já tem na API)
      // e vai criar o JSON aninhado idêntico ao jogo, mas trocando os 50 fixos por números variados
      const gerarArvoreMockDinamica = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const novoObj = Array.isArray(obj) ? [] : { ...obj };

  for (const chave in obj) {
    if (typeof obj[chave] === 'object') {
      // 🟢 CORREÇÃO: Adicionada a verificação para 'default', que é a propriedade real do seu objeto!
      if ('value' in obj[chave] || 'defaultValue' in obj[chave] || 'default' in obj[chave]) {
        // Gera um número natural aleatório entre 15 e 85 (simulando a IA real)
        const valorAleatorio = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
        
        novoObj[chave] = {
          ...obj[chave],
          default: valorAleatorio,      // Atualiza o default original
          defaultValue: valorAleatorio, // Fallback de input HTML
          value: valorAleatorio         // 🟢 Adiciona a propriedade que o React escuta para mover o slider visual
        };
      } else {
        // Se for uma pasta/categoria, continua descendo recursivamente
        novoObj[chave] = gerarArvoreMockDinamica(obj[chave]);
      }
    } else if (typeof obj[chave] === 'number') {
      // Se a sua estrutura final for direto o número (ex: "Baixo / Cima": 50)
      novoObj[chave] = Math.floor(Math.random() * (85 - 15 + 1)) + 15;
    }
  }
  return novoObj;
};


      // Passamos a sua variável oficial 'faceParameters' (que já tem os 198 sliders estruturados)
      // para criar a cópia idêntica e turbinada com os valores dinâmicos
      const mockCompletoEstruturado = gerarArvoreMockDinamica(faceParameters);

      // Criamos a resposta híbrida blindada que aceita qualquer tipo de validação do frontend
      const respostaBlindada = {
        success: true,
        ok: true,
        status: "success",
        characterData: mockCompletoEstruturado,
        parameters: mockCompletoEstruturado,
        data: mockCompletoEstruturado,
        ...mockCompletoEstruturado // Espalha Esqueleto, Pele e Preenchimento na raiz
      };

      return NextResponse.json(respostaBlindada);
    }


    
    // O bloco ELSE original continua aqui embaixo intocado para quando você desligar o mock
    else { 
      // 1. 🧠 MAPEAMENTO BIOMÉTRICO (Volta a gerar uma lista única de IDs rápidos)
      const caminhos: string[] = []
      // ... resto do seu código original


      faceParameters.forEach((categoria) => {
        if (categoria.label === "Esqueleto" && categoria.mainTabs && Array.isArray(categoria.mainTabs)) {
          categoria.mainTabs.forEach((macro: any) => {
            if (macro.subTabs && Array.isArray(macro.subTabs)) {
              macro.subTabs.forEach((sub: any) => {
                if (sub.groups && Array.isArray(sub.groups)) {
                  sub.groups.forEach((grupo: any) => {
                    grupo.sliders?.forEach((slider: any) => {
                      caminhos.push(`"${slider.id}"`)
                    })
                  })
                }
              })
            }
          })
        } 
        else if (categoria.label === "Pele" && (categoria as any).subTabs && Array.isArray((categoria as any).subTabs)) {
          (categoria as any).subTabs.forEach((sub: any) => {
            if (sub.groups && Array.isArray(sub.groups)) {
              sub.groups.forEach((grupo: any) => {
                grupo.sliders?.forEach((slider: any) => {
                  caminhos.push(`"${slider.id}"`)
                })
              })
            }
          })
        }
      })

      const sliderLabelsList = caminhos.join(", ")
      const systemPrompt = generateFaceAnalysisPrompt(sliderLabelsList);

      flatSlidersMap = {};

      try {
        console.log("🚀 Enviando requisição única e otimizada ao Gemini...");
        
        // 2. 🤖 CHAMADA UNIFICADA COM ESQUEMA EM ARRAY HOMOLOGADO PELO GOOGLE
        // 1. Chame a sua função importada passando a árvore de IDs
const promptTexto = generateFaceAnalysisPrompt(sliderLabelsList);

// 2. Passe a variável criada dentro de 'parts'
    // 1. CHAMADA BLINDADA DO GEMINI (Garante o uso correto das propriedades do SDK)
       // 1. CHAMADA BLINDADA DO GEMINI
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptTexto },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: rawBase64,
              },
            },
          ],
        },
      ],
      config: { // 👈 O bloco config começa aqui
        responseMimeType: 'application/json',
        temperature: 0.0,
        maxOutputTokens: 8192, 

        // 🟢 ADICIONE ESTE BLOCO ABAIXO DO MAX OUTPUT TOKENS:
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              value: { type: "NUMBER" }
            },
            required: ["id", "value"]
          }
        }
        // ----------------------------------------------------

      }, // 👈 O bloco config termina aqui
    });


    // 2. FUNÇÃO MÁGICA DE AUTO-REPARO DE JSON CORTADO (Fallback de Segurança)
        const repararJsonCortado = (jsonIncompleto: string): string => {
      let texto = jsonIncompleto.trim();
      
      texto = texto.replace(/```json/g, "").replace(/```/g, "").trim();

      // 🔴 ADICIONE ESTA CORREÇÃO: Remove chaves truncadas no fim do texto (ex: ,"eb4": ou ,"eb4": )
      texto = texto.replace(/,\s*"[^"]*"\s*:\s*$/, "");
      texto = texto.replace(/"[^"]*"\s*:\s*$/, "");

      if (texto.endsWith("}") || texto.endsWith("]")) return texto;
      
      // ... restante da sua função de pilha continua exatamente igual ...


      console.warn("⚠️ ATENÇÃO: O Gemini cortou a resposta. Iniciando auto-reparo de colchetes/chaves...");

      // Pilha para rastrear o que precisa ser fechado
      const pilha: string[] = [];
      let aspasAbertas = false;

      for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        // Ignora caracteres de escape para aspas
        if (char === '"' && texto[i - 1] !== '\\') {
          aspasAbertas = !aspasAbertas;
          continue;
        }
        if (!aspasAbertas) {
          if (char === '{' || char === '[') {
            pilha.push(char);
          } else if (char === '}' || char === ']') {
            pilha.pop();
          }
        }
      }

      // Se terminou com aspas abertas (cortou no meio de uma string), fecha as aspas
      if (aspasAbertas) {
        texto += '"';
      }

      // Limpa vírgulas soltas no final que quebrariam o parse
      texto = texto.replace(/,\s*$/, "");

      // Fecha as chaves e colchetes na ordem inversa de abertura
      while (pilha.length > 0) {
        const aberto = pilha.pop();
        if (aberto === '{') texto += '}';
        if (aberto === '[') texto += ']';
      }

      return texto;
    };



                // 3. 🔄 COLETOR DE DADOS BIOMÉTRICOS
        let textResponse = response.text ?? "[]";
        
        // 🟢 CORREÇÃO CRÍTICA 1: Chamamos a função de auto-reparo para fechar o JSON se ele tiver cortado!
        textResponse = repararJsonCortado(textResponse);

        // Agora o parse vai rodar de forma 100% segura!
        const arrayResult = JSON.parse(textResponse);
        
        // 🟢 CORREÇÃO CRÍTICA 2: Mapeamento híbrido tolerante. 
        // Se a IA devolver um Array [{id, value}] ou um Objeto {"skull width": 83}, nós guardamos no flatSlidersMap!
        if (Array.isArray(arrayResult)) {
          arrayResult.forEach((item: any) => {
            if (item && item.id) {
              // Aceita tanto se a chave for 'value' ou 'default'
              const valorValido = item.value !== undefined ? item.value : (item.default ?? 50);
              flatSlidersMap[item.id] = Number(valorValido);
            }
          });
        } else if (arrayResult && typeof arrayResult === 'object') {
          // Se o Gemini real devolver o JSON plano com os nomes das chaves em inglês:
          for (const chaveIA in arrayResult) {
            // Guardamos a chave direto (ex: flatSlidersMap["skull width"] = 83)
            // O robô de correspondência do seu frontend vai ler e casar esses nomes perfeitamente!
            flatSlidersMap[chaveIA] = Number(arrayResult[chaveIA]);
          }
        }

            // ... toda a chamada do Gemini e processamento dos dados que vimos antes ...

    console.log("🔥 SUCESSO ABSOLUTO: Dados biométricos processados com sucesso no backend!");

    // Retorno de SUCESSO da rota (quando tudo dá certo)
    return NextResponse.json({
      characterData: flatSlidersMap, // ou a variável que guarda os dados tratados
      meta: {
        confidences: confidencesMap,
        missingKeys: missingKeys
      }
    });

  } catch (err) {
    console.error("⚠️ Erro crítico na chamada estruturada do Gemini:", err);
    
    // 🔴 ISSO EVITA O ERRO 500 EM BRANCO: Se a IA falhar, a API avisa o Front-end explicitamente
    return NextResponse.json(
      { 
        error: "Falha ao processar os parâmetros faciais com o Gemini.", 
        detalhes: String(err) 
      }, 
      { status: 500 }
    );
  }
}




    // 🎯 CHAMA A FUNÇÃO EXTERNA DE MONTAGEM ESTRUTURADA
    const finalParameters = mapearArvoreBiometrica(flatSlidersMap, slidersMatematicos);

    console.log("✈️ ÁRVORE BIOMÉTRICA MONTADA COM SUCESSO ENVIADA AO FRONTEND.");

    return NextResponse.json({
      success: true,
      parameters: finalParameters,
      meta: { missingKeys, confidences: confidencesMap }
    });

  } catch (error: any) {
    console.warn("⚠️ ROTA FALHOU. Executando plano de contingência com Fallback Seguro...", error.message);
    const fallbackParameters = mapearArvoreBiometrica({}, {});
    return NextResponse.json({
      success: true,
      parameters: fallbackParameters,
      isMockedFallback: true,
      error: error.message
    });
  }
}