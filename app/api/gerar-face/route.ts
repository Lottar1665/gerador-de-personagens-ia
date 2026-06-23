import { NextResponse } from "next/server"
import { faceParameters } from "@/lib/face-parameters"

const normalizeKey = (key: string) =>
  key
    .toString()
    .toLowerCase()
    .replace(/["'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

  const DEFAULT_NUMERIC_CONFIDENCE = 60

const parseFlatJson = (text: string) => {
  const jsonStartIndex = text.indexOf("{")
  const jsonEndIndex = text.lastIndexOf("}")

  if (jsonStartIndex === -1 || jsonEndIndex === -1) {
    throw new Error(`Ollama retornou um formato inválido: ${text}`)
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

    const systemPrompt = [
      "You are an EA FC 26 face analysis engine.",
      "",
      "Analyze the face in the image.",
      "",
      "Return ONLY a JSON object.",
      "",
      "Rules:",
      "",
      "1. Use ONLY the slider names provided in the valid list.",
      "2. For each slider key return either:",
      "   - an integer value between 0 and 100, OR",
      "   - an object with exactly two fields: { \"value\": an integer between 0 and 100, \"confidence\": an integer between 0 and 100 }.",
      "3. If you are uncertain about a value, still provide your best estimate and set a lower 'confidence' (0-100).",
      "4. Do NOT add explanations or commentary.",
      "5. Do NOT add markdown.",
      "6. Do NOT invent new keys — use the exact key text shown in the valid list.",
      "7. Use integers only (no decimals).",
      "",
      "Example valid formats: a numeric value (e.g. 63) OR an object with 'value' and 'confidence' fields (e.g. {value:72, confidence:85}).",
      "",
      "Valid sliders:",
      "",
      "[ " + sliderLabelsList + " ]",
    ].join("\n")

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

    console.log("================================")
    console.log("IA RAW RESPONSE:", rawTextResponse)

    const flatSlidersMap = parseFlatJson(rawTextResponse)
    const normalizedResponseMap = new Map<string, any>()

    const isNested = Object.values(flatSlidersMap).some((v) => v && typeof v === "object")
    if (isNested) {
      console.log("IA retornou objeto aninhado — aplicando flatten para extrair sliders das folhas.")
      const valueTokens = new Set(["value", "valor"]) // palavras que representam o campo 'value' em respostas aninhadas
      const flatten = (obj: any, path: string[] = []) => {
        Object.entries(obj).forEach(([k, v]) => {
          if (v !== null && typeof v === "object") {
            flatten(v, [...path, k])
          } else {
            const leafKey = k
            const fullPathArr = [...path, k]
            const fullPath = fullPathArr.join(" ")

            // Normaliza a chave da folha e do caminho completo
            const normLeaf = normalizeKey(leafKey)

            // Se o nome da folha for apenas 'value'/'valor', grave a chave sem esse sufixo
            if (valueTokens.has(normLeaf)) {
              const pathWithoutLeaf = normalizeKey(path.join(" "))
              normalizedResponseMap.set(pathWithoutLeaf, v)
            } else {
              // grava a chave da folha e também o caminho completo
              const cleanedFull = normalizeKey(fullPath).replace(/\b(value|valor)\b/g, "").replace(/\s+/g, " ").trim()
              normalizedResponseMap.set(normalizeKey(leafKey), v)
              normalizedResponseMap.set(cleanedFull, v)
            }
          }
        })
      }

      flatten(flatSlidersMap)
    } else {
      Object.entries(flatSlidersMap).forEach(([key, value]) => {
        normalizedResponseMap.set(normalizeKey(key), value)
      })
    }

    const validSliderKeys = faceParameters
      .flatMap((tab) => tab.subTabs)
      .flatMap((sub) => sub.groups)
      .flatMap((group) => group.sliders)
      .map((slider) => slider.labelAI)

    const normalizedValidKeys = validSliderKeys.map(normalizeKey)

    console.log("IA KEYS RECEBIDAS:", Object.keys(flatSlidersMap))
    console.log("IA KEYS NORMALIZADAS:", [...normalizedResponseMap.keys()])

    const structureResult: any = {}
    const missingKeys: string[] = []
    const recognizedKeys = new Set<string>()
    const confidencesMap: Record<string, number | null> = {}
    const lowConfidenceKeys: string[] = []

    faceParameters.forEach((tab) => {
      structureResult[tab.label] = {}
      tab.subTabs.forEach((sub) => {
        structureResult[tab.label][sub.label] = {}
        sub.groups.forEach((group) => {
          structureResult[tab.label][sub.label][group.label] = {}
          group.sliders.forEach((slider) => {
            const fallbackValue = (slider as any).default ?? (slider as any).value ?? 50
            const targetKey = normalizeKey(slider.labelAI)
            const altKey = normalizeKey(slider.label)
            let aiValue = normalizedResponseMap.get(targetKey)
            let confidence: number | null = null

            if (aiValue === undefined) {
              aiValue = normalizedResponseMap.get(altKey)
            }

            if (aiValue === undefined) {
              const match = [...normalizedResponseMap.entries()].find(([receivedKey]) =>
                receivedKey === targetKey ||
                receivedKey === altKey ||
                receivedKey.includes(targetKey) ||
                targetKey.includes(receivedKey) ||
                receivedKey.includes(altKey) ||
                altKey.includes(receivedKey)
              )
              if (match) {
                aiValue = match[1]
                recognizedKeys.add(match[0])
              }
            } else {
              recognizedKeys.add(targetKey)
            }

            // If the IA returned an object like { value: 72, confidence: 85 }
            if (aiValue !== undefined && aiValue !== null && typeof aiValue === "object") {
              if (Object.prototype.hasOwnProperty.call(aiValue, "value")) {
                const maybeValue = (aiValue as any).value
                const maybeConfidence = (aiValue as any).confidence
                if (typeof maybeValue === "number") aiValue = maybeValue
                else if (typeof maybeValue === "string") {
                  const numeric = Number(maybeValue.replace(/[^0-9]+/g, ""))
                  if (!Number.isNaN(numeric)) aiValue = numeric
                }
                if (typeof maybeConfidence === "number") confidence = Math.max(0, Math.min(100, maybeConfidence))
                else if (typeof maybeConfidence === "string") {
                  const cnum = Number(maybeConfidence.replace(/[^0-9]+/g, ""))
                  if (!Number.isNaN(cnum)) confidence = Math.max(0, Math.min(100, cnum))
                }
              } else {
                // object but without value property: try to coerce to number later
              }
            }

            if (typeof aiValue === "string") {
              const numeric = Number(aiValue.replace(/[^0-9]+/g, ""))
              if (!Number.isNaN(numeric)) {
                aiValue = numeric
              }
            }

            const computedValue =
              typeof aiValue === "number"
                ? Math.max(0, Math.min(100, aiValue))
                : fallbackValue

            if (aiValue === undefined) {
              missingKeys.push(slider.labelAI)
            }

            // store computed value
            structureResult[tab.label][sub.label][group.label][slider.label] = Number(computedValue)

            // If IA returned a plain number and did not provide confidence, set a conservative default
            if (confidence === null && typeof aiValue === "number") {
              confidence = DEFAULT_NUMERIC_CONFIDENCE // default confidence for numeric-only responses
            }

            // store confidence (or null)
            confidencesMap[slider.labelAI] = confidence === null ? null : Number(confidence)
            if (confidence !== null && confidence < 40) {
              lowConfidenceKeys.push(slider.labelAI)
            }
          })
        })
      })
    })

    const extraKeys = [...normalizedResponseMap.keys()].filter((key) => !normalizedValidKeys.includes(key))

    // If there are missing or low-confidence keys, ask the model a focused follow-up for those keys
    const keysToAsk = Array.from(new Set([...missingKeys, ...lowConfidenceKeys]))
    if (keysToAsk.length > 0) {
      console.log("Solicitando follow-up ao Ollama para chaves faltantes/baixa confiança:", keysToAsk)

      const followUpPrompt = [
        "You are an EA FC 26 face analysis engine.",
        "",
        "Previously you returned a JSON with missing or low-confidence values for the following keys:",
        "",
        JSON.stringify(keysToAsk, null, 2),
        "",
        "For each of those keys return an object with exactly two integer fields: { \"value\": 0-100, \"confidence\": 0-100 }.",
        "Do NOT return other keys. Return ONLY a JSON object containing these keys.",
        "Use integers only (no decimals).",
      ].join("\n")

      try {
        const followResp = await fetch(`${ollamaBaseUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Bypass-Tunnel-Reminder": "true" },
          body: JSON.stringify({ model: "llava", prompt: followUpPrompt, images: [rawBase64], stream: false, format: "json" })
        })

        if (followResp.ok) {
          const followData = await followResp.json()
          const followRaw = followData.response || "{}"
          console.log("IA RAW RESPONSE (FOLLOWUP):", followRaw)

          try {
            const followParsed = parseFlatJson(followRaw)

            // flatten followParsed into a temporary map similar to earlier logic
            const tempMap = new Map<string, any>()
            const isNestedFollow = Object.values(followParsed).some((v) => v && typeof v === "object")
            if (isNestedFollow) {
              const valueTokens = new Set(["value", "valor"])
              const flattenFollow = (obj: any, path: string[] = []) => {
                Object.entries(obj).forEach(([k, v]) => {
                  if (v !== null && typeof v === "object") {
                    flattenFollow(v, [...path, k])
                  } else {
                    const fullPath = [...path, k].join(" ")
                    const normLeaf = normalizeKey(k)
                    if (valueTokens.has(normLeaf)) {
                      tempMap.set(normalizeKey(path.join(" ")), v)
                    } else {
                      const cleanedFull = normalizeKey(fullPath).replace(/\b(value|valor)\b/g, "").replace(/\s+/g, " ").trim()
                      tempMap.set(normalizeKey(k), v)
                      tempMap.set(cleanedFull, v)
                    }
                  }
                })
              }
              flattenFollow(followParsed)
            } else {
              Object.entries(followParsed).forEach(([k, v]) => tempMap.set(normalizeKey(k), v))
            }

            // Merge tempMap into normalizedResponseMap (overwrite existing entries for asked keys)
            for (const [k, v] of tempMap.entries()) {
              normalizedResponseMap.set(k, v)
            }

            // Recompute values/confidences for the affected sliders
            const keysToAskNormalized = keysToAsk.map(normalizeKey)
            lowConfidenceKeys.length = 0 // reset

            faceParameters.forEach((tab) => {
              tab.subTabs.forEach((sub) => {
                sub.groups.forEach((group) => {
                  group.sliders.forEach((slider) => {
                    const targetKey = normalizeKey(slider.labelAI)
                    if (!keysToAskNormalized.includes(targetKey)) return

                    // attempt to extract updated aiValue/confidence from normalizedResponseMap
                    let aiValue = normalizedResponseMap.get(targetKey)
                    let confidence: number | null = null

                    const altKey = normalizeKey(slider.label)
                    if (aiValue === undefined) aiValue = normalizedResponseMap.get(altKey)

                    if (aiValue === undefined) {
                      const match = [...normalizedResponseMap.entries()].find(([receivedKey]) =>
                        receivedKey === targetKey || receivedKey === altKey || receivedKey.includes(targetKey) || targetKey.includes(receivedKey) || receivedKey.includes(altKey) || altKey.includes(receivedKey)
                      )
                      if (match) aiValue = match[1]
                    }

                    if (aiValue !== undefined && aiValue !== null && typeof aiValue === "object") {
                      if (Object.prototype.hasOwnProperty.call(aiValue, "value")) {
                        const maybeValue = (aiValue as any).value
                        const maybeConfidence = (aiValue as any).confidence
                        if (typeof maybeValue === "number") aiValue = maybeValue
                        else if (typeof maybeValue === "string") {
                          const numeric = Number(maybeValue.replace(/[^0-9]+/g, ""))
                          if (!Number.isNaN(numeric)) aiValue = numeric
                        }
                        if (typeof maybeConfidence === "number") confidence = Math.max(0, Math.min(100, maybeConfidence))
                        else if (typeof maybeConfidence === "string") {
                          const cnum = Number(maybeConfidence.replace(/[^0-9]+/g, ""))
                          if (!Number.isNaN(cnum)) confidence = Math.max(0, Math.min(100, cnum))
                        }
                      }
                    }

                    if (typeof aiValue === "string") {
                      const numeric = Number(aiValue.replace(/[^0-9]+/g, ""))
                      if (!Number.isNaN(numeric)) aiValue = numeric
                    }

                    const fallbackValue = (slider as any).default ?? (slider as any).value ?? 50
                    const computedValue = typeof aiValue === "number" ? Math.max(0, Math.min(100, aiValue)) : fallbackValue

                    // If the IA returned a plain number and did not provide confidence, set the configured default
                    if (confidence === null && typeof aiValue === "number") {
                      confidence = DEFAULT_NUMERIC_CONFIDENCE
                    }

                    // update structureResult and confidences
                    structureResult[tab.label][sub.label][group.label][slider.label] = Number(computedValue)
                    confidencesMap[slider.labelAI] = confidence === null ? null : Number(confidence)
                    if (confidence !== null && confidence < 40) {
                      lowConfidenceKeys.push(slider.labelAI)
                    }
                  })
                })
              })
            })

          } catch (err) {
            console.warn("Falha ao parsear follow-up JSON:", err)
          }
        } else {
          console.warn("Follow-up request ao Ollama falhou com status", followResp.status)
        }
      } catch (err) {
        console.warn("Erro durante follow-up ao Ollama:", err)
      }
    }

    if (missingKeys.length > 0) {
      console.warn("PARÂMETROS FALTANTES NA IA:", missingKeys)
    }
    if (extraKeys.length > 0) {
      console.warn("CHAVES IA NÃO RECONHECIDAS:", extraKeys)
    }

    if (lowConfidenceKeys.length > 0) {
      console.warn("CHAVES COM BAIXA CONFIANÇA (CONFIDENCE < 40):", lowConfidenceKeys)
    }

    // expose confidences for debugging/inspection in frontend
    structureResult._confidences = confidencesMap
    structureResult._lowConfidence = lowConfidenceKeys
    structureResult._recognizedKeys = [...recognizedKeys]

    // Como não vamos gerar imagem 3D, devolvemos null para a imagem não quebrar
    structureResult.previewUrl = null;

    // Como não vamos gerar imagem 3D, devolvemos null para a imagem não quebrar
    structureResult.previewUrl = null;

    console.log("✅ Sucesso! Parâmetros gerados e enviados para o frontend.")

    return NextResponse.json(structureResult)

  } catch (error: any) {
    console.error("❌ Erro geral na API:", error)
    return NextResponse.json({ error: `Falha na requisição: ${error.message}` }, { status: 500 })
  }
}