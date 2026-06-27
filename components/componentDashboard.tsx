"use client"

import { useRef, useState } from "react"
import { Upload, Wand2, X } from "lucide-react"
import { useEffect } from "react"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResultsPanel } from "@/components/results-panel"
import PresetsCarousel from "./presets-carousel"
import CommunityGallery from "../app/community/page"
import UserParametersArea from "./user-parameters-area"
import type { User } from "firebase/auth"

// ─────────────────────────────────────────────
// Upload Area
// ─────────────────────────────────────────────
function UploadArea({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [resultadoIA, setResultadoIA] = useState<any>(null)
  const [generationId, setGenerationId] = useState(0)


  const handleFileChange = (file: File | null) => {
    setFileName(file ? file.name : null)
    onFileSelect(file)
    if (!file && inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFileChange(e.dataTransfer.files?.[0] ?? null)
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-secondary/50",
          dragging && "border-primary bg-primary/10",
        )}
      >
        <span className="pointer-events-none flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Upload className="size-5" />
        </span>
        <span className="pointer-events-none text-sm font-medium">
          Arraste sua foto aqui ou clique para anexar
        </span>
        <span className="pointer-events-none text-xs text-muted-foreground">
          PNG, JPG ou WEBP até 10MB
        </span>
      </button>

      {fileName && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2">
          <span className="truncate text-xs text-foreground/90">{fileName}</span>
          <button
            type="button"
            onClick={() => handleFileChange(null)}
            aria-label="Remover arquivo"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Input Zone
// ─────────────────────────────────────────────
function InputZone({
  onParametrosGerados,
  resultadoIA,
  userEmail,
  userName,
  userPhotoUrl,
}: {
  onParametrosGerados: (dados: any) => void
  resultadoIA: any
  userEmail: string | null
  userName: string | null
  userPhotoUrl: string | null
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [postToCommunity, setPostToCommunity] = useState(false)

  const handleFileSelect = (file: File | null) => {
    setImagemSelecionada(file)
    if (file) {
      setImagemPreview(URL.createObjectURL(file))
    } else {
      setImagemPreview(null)
    }
  }

  const createPreviewDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const maxSize = 420
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext("2d")
        if (!ctx) { reject(new Error("Canvas não suportado.")); return }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.75))
      }
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error("Falha ao gerar preview da imagem."))
      }
      img.src = objectUrl
    })
  }

  const saveCommunityPost = async (aiResult: any) => {
    try {
      await fetch("/api/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadedBy: userName || userEmail || "Anônimo",
          userPhotoUrl,
          result: aiResult,
        }),
      })
    } catch (error) {
      console.warn("Não foi possível salvar o post da comunidade:", error)
    }
  }

        const handleGerarParametros = async () => {
    if (!imagemSelecionada) {
      alert("Por favor, selecione uma imagem antes de gerar.");
      return;
    }

        try {
      setIsLoading(true);

      // 1. Processa a imagem para converter em DataURL do navegador
      const fullBase64 = await createPreviewDataUrl(imagemSelecionada);

      // 🟢 CORREÇÃO CRÍTICA: Remove o prefixo "data:image/jpeg;base64," para enviar apenas o Base64 binário puro
      const cleanBase64 = fullBase64.includes(",") ? fullBase64.split(",")[1] : fullBase64;

      // 🟢 COMPACTAÇÃO GEOMÉTRICA (OPCIONAL): Captura apenas as distâncias resumidas 
      // do objeto global se o MediaPipe tiver rodado na tela, sem mandar os 468 pontos brutos.
      let resumoMatematico = {};
      if ((window as any).landmarksFrenteAtual && (window as any).landmarksFrenteAtual.length > 0) {
        const pts = (window as any).landmarksFrenteAtual;
        const dist3D = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2) + Math.pow(p1.z-p2.z,2));
        const base = dist3D(pts[133], pts[362]); // Distância padrão entre os cantos internos dos olhos
        
        resumoMatematico = {
          maxilar_largura: (dist3D(pts[172], pts[397]) / base).toFixed(2),
          nariz_largura: (dist3D(pts[61], pts[291]) / base).toFixed(2),
          boca_largura: (dist3D(pts[57], pts[287]) / base).toFixed(2),
          testa_altura: (dist3D(pts[70], pts[159]) / base).toFixed(2)
        };
      }

      // 2. Faz a chamada para a API enviando apenas o essencial (Limpo e Otimizado)
      const response = await fetch('/api/gerar-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: cleanBase64, 
          mimeType: "image/jpeg",
          mediaPipeData: resumoMatematico // 👈 Enviamos dados biométricos pesando menos de 100 caracteres!
        })
      });

      const data = await response.json();
      // ... todo o restante do seu código estruturado de caminhos A, B e C continua igual abaixo ...


      // 1. Captura a lista ou objeto que veio da API
      const resultadoDaAPI = data.characterData || data.data || data;

      // 2. CAMINHO A: Se a resposta for um ARRAY estruturado (Padrão do seu Mock Local)
      if (Array.isArray(resultadoDaAPI) && resultadoDaAPI.length > 0) {
        const esqueletoNode = resultadoDaAPI.find((item: any) => item?.id === "esqueleto" || item?.label === "Esqueleto");
        const peleNode = resultadoDaAPI.find((item: any) => item?.id === "pele" || item?.label === "Pele");
        const preenchimentoNode = resultadoDaAPI.find((item: any) => item?.id === "preenchimento" || item?.label === "Preenchimento") || { id: "preenchimento", label: "Preenchimento", mainTabs: [] };

        if (esqueletoNode && peleNode) {
          const objetoFormatado = {
            Esqueleto: esqueletoNode,
            Pele: peleNode,
            Preenchimento: preenchimentoNode
          };

          onParametrosGerados(objetoFormatado);
          if (postToCommunity) await saveCommunityPost(objetoFormatado);
          alert("Parâmetros faciais gerados e aplicados com sucesso!");
        } else {
          console.log("❌ Falha interna: não encontrou as abas dentro do array", resultadoDaAPI);
          throw new Error("Abas obrigatórias não encontradas no retorno.");
        }
      } 
      // 3. CAMINHO B: Se a resposta for um OBJETO PLANO em inglês (Padrão da IA Real do Gemini)
      else if (resultadoDaAPI && typeof resultadoDaAPI === 'object' && !resultadoDaAPI.Esqueleto) {
        
        // Função recursiva interna que varre o template padrão e injeta os valores da IA por proximidade de nome
        const preencherValoresDaIA = (objetoAtual: any, caminhoAcumulado: string[] = []): any => {
          if (typeof objetoAtual !== 'object' || objetoAtual === null) return objetoAtual;
          const novaEstrutura = Array.isArray(objetoAtual) ? [] : { ...objetoAtual };

          for (const chave in objetoAtual) {
            const valorAtual = objetoAtual[chave];
            const novoCaminho = [...caminhoAcumulado, chave].map(c => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""));

            // Localize este trecho dentro da função preencherValoresDaIA:
if (typeof valorAtual === 'number') {
  let valorEncontrado = 50;
  for (const chaveIA in resultadoDaAPI) {
    const chaveIALimpa = chaveIA.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (novoCaminho.some(t => chaveIALimpa.includes(t) || t.includes(chaveIALimpa))) {
      const num = Number(resultadoDaAPI[chaveIA]);
      // 🟢 CORREÇÃO: Se a conversão falhar ou der NaN, garante o fallback 50
      valorEncontrado = isNaN(num) ? 50 : num;
      break;
    }
  }
  novaEstrutura[chave] = valorEncontrado;
} else if (valorAtual && typeof valorAtual === 'object') {
  if ('id' in valorAtual || 'value' in valorAtual || 'default' in valorAtual) {
    let valorEncontrado = valorAtual.default ?? valorAtual.value ?? 50;
    const termosSlider = [...novoCaminho, (valorAtual.id || "").toLowerCase(), (valorAtual.labelAI || "").toLowerCase().replace(/[^a-z0-9 ]/g, "")];
    
    for (const chaveIA in resultadoDaAPI) {
      const chaveIALimpa = chaveIA.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (termosSlider.some(t => t && (chaveIALimpa.includes(t) || t.includes(chaveIALimpa)))) {
        const num = Number(resultadoDaAPI[chaveIA]);
        // 🟢 CORREÇÃO: Garante o fallback 50 se o número extraído da IA for inválido
        valorEncontrado = isNaN(num) ? 50 : num;
        break;
      }
    }

    novaEstrutura[chave] = {
      ...valorAtual,
      default: isNaN(valorEncontrado) ? 50 : valorEncontrado,
      defaultValue: isNaN(valorEncontrado) ? 50 : valorEncontrado,
      value: isNaN(valorEncontrado) ? 50 : valorEncontrado
    };
  } else {
    novaEstrutura[chave] = preencherValoresDaIA(valorAtual, novoCaminho);
  }
}

          }
          return novaEstrutura;
        };

        const templateBase = resultadoIA && Object.keys(resultadoIA).length > 0 ? resultadoIA : {};
        
        if (Object.keys(templateBase).length > 0) {
          const arvoreTraduzidaPeloGemini = preencherValoresDaIA(templateBase);
          onParametrosGerados(arvoreTraduzidaPeloGemini);
          if (postToCommunity) await saveCommunityPost(arvoreTraduzidaPeloGemini);
          alert("Parâmetros reais do Gemini traduzidos e aplicados com sucesso!");
        } else {
          onParametrosGerados(resultadoDaAPI);
          alert("Parâmetros aplicados diretamente!");
        }
      }
      // 4. CAMINHO C: Se já vier no formato aninhado final { Esqueleto: ... } (Segurança extra)
      else if (resultadoDaAPI && (resultadoDaAPI.Esqueleto || resultadoDaAPI.esqueleto)) {
        const objetoFormatado = {
          Esqueleto: resultadoDaAPI.Esqueleto || resultadoDaAPI.esqueleto,
          Pele: resultadoDaAPI.Pele || resultadoDaAPI.pele,
          Preenchimento: resultadoDaAPI.Preenchimento || resultadoDaAPI.preenchimento || { mainTabs: [] }
        };
        onParametrosGerados(objetoFormatado);
        if (postToCommunity) await saveCommunityPost(objetoFormatado);
        alert("Parâmetros faciais estruturados aplicados com sucesso!");
      }
      else {
        console.log("❌ Falha na validação. O formato que chegou foi este:", data);
        throw new Error("A IA processou a imagem, mas não retornou a estrutura de parâmetros válida.");
      }

    } catch (error) {
      console.error("Erro ao gerar parâmetros:", error);
      alert("Ocorreu um erro ao processar os parâmetros faciais.");
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <Card className="flex h-full flex-col border-border bg-card">
      <CardContent className="flex flex-1 flex-col gap-6 justify-between py-6">
        <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[340px] bg-secondary/5 rounded-xl border border-border/50 p-4 relative overflow-hidden transition-all">
          {imagemPreview ? (
            <div className="relative w-full max-w-[280px] rounded-xl overflow-hidden shadow-2xl border border-zinc-700 animate-fade-in">
              <img src={imagemPreview} alt="Foto em análise" className="w-full h-auto object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)] animate-scan" />
              )}
              <div className="absolute top-2 right-2 bg-black/80 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md border border-emerald-500/30 tracking-widest flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {isLoading ? "CALCULANDO..." : "BIOMETRIA ATIVA"}
              </div>
            </div>
          ) : (
            <PresetsCarousel />
          )}
        </div>

        <div className="w-full">
          <UploadArea onFileSelect={handleFileSelect} />
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={postToCommunity}
              onChange={(e) => setPostToCommunity(e.target.checked)}
              className="accent-primary"
            />
            Publicar apenas os parâmetros na Galeria da Comunidade
          </label>
        </div>

        <Button
          size="lg"
          className="h-12 w-full text-base font-semibold transition-all shadow-md hover:shadow-primary/20"
          onClick={handleGerarParametros}
          disabled={isLoading || !imagemSelecionada}
        >
          {isLoading ? (
            <><span className="animate-spin mr-2">⏳</span>Analisando Proporções...</>
          ) : (
            <><Wand2 className="mr-2 size-4" />{resultadoIA ? "Regerar Parâmetros" : "Extrair Parâmetros com IA"}</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// Dashboard principal
// ─────────────────────────────────────────────
export function Dashboard({
  user,
  onLogout,
  initialTab = "dashboard",
}: {
  user: User
  onLogout: () => void
  initialTab?: string
}) {
  const [resultadoIA, setResultadoIA] = useState<any>(null)
  const [generationId, setGenerationId] = useState(0)
  
  // 🟢 CORREÇÃO 1: Controla a aba ativamente por estado do React
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  // 🟢 CORREÇÃO 2: Escuta mudanças vindas da URL (?tab=) e sincroniza a aba na tela
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* 🟢 CORREÇÃO 3: Trocado 'defaultValue' por 'value' e amarrado ao 'onValueChange' */}
        <Tabs 
          value={activeTab} 
          onValueChange={(val) => setActiveTab(val)} 
          className="h-full"
        >

          {/* TabsList oculta — a navbar já faz a navegação via ?tab= */}
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">Gerar parâmetros</TabsTrigger>
            <TabsTrigger value="community">Galeria</TabsTrigger>
            <TabsTrigger value="meus">Minha área</TabsTrigger>
          </TabsList>

          {/* Aba: Gerador */}
          <TabsContent value="dashboard" className="h-full">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
              <div className="lg:h-[calc(100vh-7rem)]">
                <InputZone
                  onParametrosGerados={(dados) => {
                    setResultadoIA(dados)
                    setGenerationId(prev => prev + 1) // Força a mudança do ID de geração
                  }}
                  resultadoIA={resultadoIA}
                  userEmail={user.email}
                  userName={user.displayName}
                  userPhotoUrl={user.photoURL}
                />
              </div>
              <Card className="border-border bg-card lg:h-[calc(100vh-7rem)]">
                <CardContent className="h-full overflow-hidden">
                  {/* Injeta a key dinâmica para forçar a re-renderização imediata na tela */}
                  <ResultsPanel key={generationId} data={resultadoIA} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Comunidade */}
          <TabsContent value="community" className="space-y-6 py-4">
            <CommunityGallery />
          </TabsContent>

          {/* Aba: Minha Área */}
          <TabsContent value="meus" className="space-y-6 py-4">
            <UserParametersArea user={user} />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  )
}
