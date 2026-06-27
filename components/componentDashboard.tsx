"use client"

import { useRef, useState } from "react"
import { Upload, Wand2, X } from "lucide-react"

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
      alert("Por favor, selecione ou envie uma foto primeiro.")
      return
    }
    setIsLoading(true)
    try {
      const base64String = await createPreviewDataUrl(imagemSelecionada)
      
      // 🟢 CORREÇÃO 1: Aponta para a rota unificada /api/gerar-preset que montamos
      const response = await fetch("/api/gerar-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64String,
          mimeType: imagemSelecionada.type || "image/jpeg",
          landmarksFrente: (window as any).landmarksFrente || [] // 🟢 Envia landmarks se existirem no escopo global
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha na requisição da API.")
      }

      const data = await response.json()
      
      // 🟢 CORREÇÃO 2: Valida tanto o data.parameters quanto a propriedade de sucesso do backend
      if (data && data.parameters) {
        onParametrosGerados(data.parameters)
        
        if (postToCommunity) {
          await saveCommunityPost(data.parameters)
        }
        
        alert("Parâmetros faciais gerados e aplicados com sucesso!")
      } else {
        throw new Error("A IA processou a imagem, mas não retornou a estrutura de parâmetros válida.")
      }
    } catch (error: any) {
      console.error("Erro ao gerar parâmetros:", error)
      alert(error.message || "Erro ao processar imagem com o Gemini.")
    } finally {
      setIsLoading(false)
    }
  }


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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Tabs defaultValue={initialTab} className="h-full">

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
                  onParametrosGerados={setResultadoIA}
                  resultadoIA={resultadoIA}
                  userEmail={user.email}
                  userName={user.displayName}
                  userPhotoUrl={user.photoURL}
                />
              </div>
              <Card className="border-border bg-card lg:h-[calc(100vh-7rem)]">
                <CardContent className="h-full overflow-hidden">
                  <ResultsPanel data={resultadoIA} />
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
