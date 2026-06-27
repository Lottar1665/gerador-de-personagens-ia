// app/api/gerar-preset/route.ts
import { NextResponse } from "next/server"
import { Buffer } from "buffer"
import { GoogleGenAI } from "@google/genai"
import { faceParameters } from "@/lib/face-parameters"
import { converterParaSlider } from "@/lib/motorMatematico" // 1. Importa seu motor
import { mockGeminiResponse } from "@/lib/mock-preset"
import { generateFaceAnalysisPrompt } from "@/lib/prompt"

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

    const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

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

    let flatSlidersMap;

    if (MOCK_MODE) {
      console.log("⚠️ MODO SIMULAÇÃO ATIVO: Consumo de cota de IA poupado.");
      flatSlidersMap = mockGeminiResponse; 
    }     else {
      // 1. 🧠 MAPEAMENTO BIOMÉTRICO (Substitui os flatMaps antigos para manter a hierarquia)
      const caminhos: string[] = []

      faceParameters.forEach((categoria) => {
        // Se a categoria tiver a camada "mainTabs" (Ex: Esqueleto)
        if (categoria.mainTabs && Array.isArray(categoria.mainTabs)) {
          categoria.mainTabs.forEach((macro) => {
            if (macro.subTabs && Array.isArray(macro.subTabs)) {
              macro.subTabs.forEach((sub) => {
                if (sub.groups && Array.isArray(sub.groups)) {
                  sub.groups.forEach((grupo) => {
                    grupo.sliders?.forEach((slider: any) => {
                      caminhos.push(`"${categoria.label} -> ${macro.label} -> ${sub.label} -> ${grupo.label} -> ${slider.label}"`)
                    })
                  })
                }
              })
            }
          })
        } 
         // Se a categoria for direta (Ex: Pele)
        else if ((categoria as any).subTabs && Array.isArray((categoria as any).subTabs)) {
          (categoria as any).subTabs.forEach((sub: any) => {
            if (sub.groups && Array.isArray(sub.groups)) {
              sub.groups.forEach((grupo: any) => {
                grupo.sliders?.forEach((slider: any) => {
                  caminhos.push(`"${categoria.label} -> ${sub.label} -> ${grupo.label} -> ${slider.label}"`)
                })
              })
            }
          })
        }
      })

      const sliderLabelsList = caminhos.join(", ")

      // 2. Chamada do Prompt Isolado Atualizado
      const systemPrompt = generateFaceAnalysisPrompt(sliderLabelsList);

      // 3. Execução do Gemini com temperatura 0 para máxima precisão técnica
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [systemPrompt, { inlineData: { data: rawBase64, mimeType: mimeTypeClean } }],
        config: { 
          temperature: 0, 
          maxOutputTokens: 8192, 
          responseMimeType: "application/json" 
        }
      })

            // 4. 🔄 LEITURA DA ÁRVORE DO GEMINI (Higienização de Sintaxe Estrita)
      try {
        let cleanText = (response.text ?? "{}")
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        // 🧠 HIGIENIZADOR DE SINTAXE IA:
        // Corrige propriedades mal formatadas, aspas simples e vírgulas órfãs no final de objetos
        cleanText = cleanText
          .replace(/'/g, '"') // Substitui todas as aspas simples por duplas
          .replace(/,\s*}/g, "}") // Remove vírgulas extras antes do fechamento de chaves
          .replace(/,\s*\]/g, "]") // Remove vírgulas extras antes do fechamento de colchetes
          .replace(/([,{])\s*([^"\s][^:"]*?)\s*:/g, '$1"$2":'); // Garante aspas duplas nas propriedades

        flatSlidersMap = JSON.parse(cleanText);
      } catch (err) {
        console.warn("⚠️ Falha na conversão estrita do JSON. Tentando extração de contingência...", err);
        
        // Segunda linha de defesa: Tenta capturar apenas o bloco estrutural principal caso o Gemini tenha inserido texto extra
        try {
          const text = response.text ?? "{}";
          const jsonStartIndex = text.indexOf("{");
          const jsonEndIndex = text.lastIndexOf("}");
          if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const fallbackText = text.substring(jsonStartIndex, jsonEndIndex + 1)
              .replace(/'/g, '"')
              .replace(/,\s*}/g, "}");
            flatSlidersMap = JSON.parse(fallbackText);
          } else {
            flatSlidersMap = {};
          }
        } catch {
          flatSlidersMap = {};
        }
      }
 // Fim do bloco else (MOCK_MODE)

        } // 🟢 FECHA O BLOCO 'else' DO MOCK_MODE QUE FICOU ABERTO NA 2° PARTE!

    // 🧠 FUNÇÃO AUXILIAR DE BUSCA PROFUNDA RECURSIVA PARA O LOOP DE MONTAGEM (CORRIGIDA)
    const buscarValorNoJson = (objeto: any, sliderLabel: string, labelAI: string): number | undefined => {
      if (!objeto || typeof objeto !== 'object') return undefined; // 💡 Corrigido para 'objeto'
      if (typeof objeto[sliderLabel] === 'number') return objeto[sliderLabel]; // 💡 Corrigido para 'objeto'
      if (labelAI && typeof objeto[labelAI] === 'number') return objeto[labelAI]; // 💡 Corrigido para 'objeto'
      for (const key in objeto) {
        const resultado = buscarValorNoJson(objeto[key], sliderLabel, labelAI);
        if (resultado !== undefined) return resultado;
      }
      return undefined;
    };

    // 🟢 MONTAGEM DA ÁRVORE BIOMÉTRICA BLINDADA CONTRA ERROS DE ESTRUTURA
    faceParameters.forEach((categoryRaw: any) => {
      const category = categoryRaw as any;
      structureResult[category.label] = {};

      // Caso A: Categoria possui macro-regiões (Ex: Esqueleto)
      if (category.mainTabs && Array.isArray(category.mainTabs)) {
        category.mainTabs.forEach((tab: any) => {
          structureResult[category.label][tab.label] = {};
          if (tab.subTabs && Array.isArray(tab.subTabs)) {
            tab.subTabs.forEach((sub: any) => {
              structureResult[category.label][tab.label][sub.label] = {};
              if (sub.groups && Array.isArray(sub.groups)) {
                sub.groups.forEach((group: any) => {
                  structureResult[category.label][tab.label][sub.label][group.label] = {};
                  group.sliders?.forEach((slider: any) => {
                    const aiValue = buscarValorNoJson(flatSlidersMap, slider.label, slider.labelAI);
                    // Mescla com valores matemáticos do MediaPipe se houver colisão de ID, senão usa o da IA ou Default
                    const mathValue = slidersMatematicos[slider.label?.toLowerCase() || ""];
                    structureResult[category.label][tab.label][sub.label][group.label][slider.label] = 
                      typeof mathValue === "number" ? mathValue : (typeof aiValue === "number" ? aiValue : (slider.default ?? 50));
                  });
                });
              }
            });
          }
        });
      } 
      // Caso B: Categoria direta sem camada macro (Ex: Pele)
      else if (category.subTabs && Array.isArray(category.subTabs)) {
        category.subTabs.forEach((sub: any) => {
          structureResult[category.label][sub.label] = {};
          if (sub.groups && Array.isArray(sub.groups)) {
            sub.groups.forEach((group: any) => {
              structureResult[category.label][sub.label][group.label] = {};
              group.sliders?.forEach((slider: any) => {
                const aiValue = buscarValorNoJson(flatSlidersMap, slider.label, slider.labelAI);
                const mathValue = slidersMatematicos[slider.label?.toLowerCase() || ""];
                structureResult[category.label][sub.label][group.label][slider.label] = 
                  typeof mathValue === "number" ? mathValue : (typeof aiValue === "number" ? aiValue : (slider.default ?? 50));
              });
            });
          }
        });
      }
    });

       console.log("✈️ ÁRVORE BIOMÉTRICA MONTADA COM SUCESSO ENVIADA AO FRONTEND.");

    return NextResponse.json({
      success: true,
      parameters: structureResult,
      meta: { missingKeys, confidences: confidencesMap }
    });

  } catch (error: any) { 
    console.warn("⚠️ ROTA FALHOU. Executando plano de contingência com Mock...", error.message);

    // 🟢 REDE DE SEGURANÇA SE A IA CAIR: Monta a árvore usando o Mock local com a mesma lógica segura
    faceParameters.forEach((categoryRaw: any) => {
      const category = categoryRaw as any;
      structureResult[category.label] = {};
      
      if (category.mainTabs && Array.isArray(category.mainTabs)) {
        category.mainTabs.forEach((tab: any) => {
          structureResult[category.label][tab.label] = {};
          tab.subTabs?.forEach((sub: any) => {
            structureResult[category.label][tab.label][sub.label] = {};
            sub.groups?.forEach((group: any) => {
              structureResult[category.label][tab.label][sub.label][group.label] = {};
              group.sliders?.forEach((slider: any) => {
                structureResult[category.label][tab.label][sub.label][group.label][slider.label] = slider.default ?? 50;
              });
            });
          });
        });
      } else if (category.subTabs && Array.isArray(category.subTabs)) {
        category.subTabs.forEach((sub: any) => {
          structureResult[category.label][sub.label] = {};
          sub.groups?.forEach((group: any) => {
            structureResult[category.label][sub.label][group.label] = {};
            group.sliders?.forEach((slider: any) => {
              structureResult[category.label][sub.label][group.label][slider.label] = slider.default ?? 50;
            });
          });
        });
      }
    });

    return NextResponse.json({
      success: true,
      parameters: structureResult,
      isMockedFallback: true,
      error: error.message
    });
  } // 🟢 FECHA O BLOCO 'catch' CORRETAMENTE!
} // 🟢 FECHA A FUNÇÃO 'POST' NA ÚLTIMA LINHA DO ARQUIVO!
