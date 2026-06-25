"use client"

import { useRef, useState } from "react"
import { LogOut, Sparkles, Upload, Wand2, X } from "lucide-react"
import type { User } from "firebase/auth"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ResultsPanel } from "@/components/results-panel"
import PresetsCarousel from "./presets-carousel"
import CommunityGallery from "./community-gallery"

function TopBar({ user, onLogout }: { user: User; onLogout: () => void }) {
  const label = user.displayName || user.email || "Usuário"

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo,</p>
            <p className="font-bold tracking-tight">{label}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border border-border">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              {label.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut data-icon="inline-start" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}

function UploadArea({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | null) => {
    setFileName(file ? file.name : null)
    onFileSelect(file)
    
    // CORREÇÃO: Limpa o input nativo para permitir reenvio do mesmo arquivo
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
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
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
        {/* CORREÇÃO: pointer-events-none nos filhos para evitar pisca-pisca no drag and drop */}
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
          <span className="truncate text-xs text-foreground/90">
            {fileName}
          </span>
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

function InputZone({ onParametrosGerados, resultadoIA, userEmail }: { onParametrosGerados: (dados: any) => void, resultadoIA: any, userEmail: string | null }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)

  const handleFileSelect = (file: File | null) => {
    setImagemSelecionada(file)
    if (file) {
      const urlTemporaria = URL.createObjectURL(file)
      setImagemPreview(urlTemporaria)
    } else {
      setImagemPreview(null)
    }
  }

  const createPreviewDataUrl = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
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

        if (!ctx) {
          reject(new Error("Canvas não suportado."))
          return
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.75))
      }

      img.onerror = (event) => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error("Falha ao gerar preview da imagem."))
      }

      img.src = objectUrl
    })
  }

  const saveCommunityPost = async (previewDataUrl: string, mimeType: string, aiResult: any) => {
    try {
      await fetch("/api/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previewDataUrl,
          mimeType,
          uploadedBy: userEmail || "anônimo",
          result: aiResult,
        }),
      })
    } catch (error) {
      console.warn("Não foi possível salvar o post da comunidade:", error)
    }
  }

  const handleGerarParametros = async () => {
    if (isLoading) {
      return
    }

    if (!imagemSelecionada) {
      alert("Por favor, anexe uma foto antes de gerar os parâmetros.")
      return
    }

    setIsLoading(true)
    try {
      console.log("Iniciando processamento da imagem...")

      let base64String = ""
      let mimeType = imagemSelecionada.type || "image/jpeg"

      const reader = new FileReader()
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1])
          } else {
            reject(new Error("Não foi possível processar a imagem."))
          }
        }
        reader.onerror = () => reject(new Error("Erro na leitura do arquivo."))
      })
      
      reader.readAsDataURL(imagemSelecionada)
      base64String = await base64Promise

      const response = await fetch("/api/gerar-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descricao: "Extrair parâmetros faciais da foto",
          imageBase64: base64String,
          mimeType: mimeType
        })
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("O servidor falhou ou a rota da API não foi encontrada.")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha na requisição da API.")
      }

      const dadosDoBoneco = await response.json()

      onParametrosGerados(dadosDoBoneco)

      try {
        const previewDataUrl = await createPreviewDataUrl(imagemSelecionada)
        await saveCommunityPost(previewDataUrl, mimeType, dadosDoBoneco)
      } catch (error) {
        console.warn("Falha ao preparar o post para a galeria:", error)
      }
    } catch (error: any) {
      console.error("Erro no front:", error)
      alert(`Erro: ${error.message || "Não foi possível conectar à IA."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex h-full flex-col border-border bg-card">
      <CardContent className="flex flex-1 flex-col gap-6 justify-between py-6">
        
        {/* PARTE DE CIMA: Carrossel ou Imagem do Usuário */}
        <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[340px] bg-secondary/5 rounded-xl border border-border/50 p-4 relative overflow-hidden transition-all">
          
          {imagemPreview ? (
            <div className="relative w-full max-w-[280px] rounded-xl overflow-hidden shadow-2xl border border-zinc-700 animate-fade-in">
              <img 
                src={imagemPreview} 
                alt="Foto em análise" 
                className="w-full h-auto object-cover opacity-90"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
              
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)] animate-scan" />
              )}

              <div className="absolute top-2 right-2 bg-black/80 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md border border-emerald-500/30 tracking-widest flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {isLoading ? "CALCULANDO..." : "BIOMETRIA ATIVA"}
              </div>
            </div>
          ) : (
             <PresetsCarousel />
          )}

        </div>

        {/* PARTE DO MEIO: Upload */}
        <div className="w-full">
          <UploadArea onFileSelect={handleFileSelect} />
        </div>

        {/* PARTE DE BAIXO: Botão com a Trava de Segurança */}
        <Button 
          size="lg" 
          className="h-12 w-full text-base font-semibold transition-all shadow-md hover:shadow-primary/20"
          onClick={handleGerarParametros}
          disabled={isLoading || !imagemSelecionada} 
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Analisando Proporções...
            </>
          ) : (
            <>
              <Wand2 data-icon="inline-start" className="mr-2" />
              {resultadoIA ? "Regerar Parâmetros" : "Extrair Parâmetros com IA"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [resultadoIA, setResultadoIA] = useState<any>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar user={user} onLogout={onLogout} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <div className="lg:h-[calc(100vh-7rem)]">
            <InputZone onParametrosGerados={setResultadoIA} resultadoIA={resultadoIA} userEmail={user.email} />
          </div>

          <Card className="border-border bg-card lg:h-[calc(100vh-7rem)]">
            <CardContent className="h-full overflow-hidden">
              <ResultsPanel data={resultadoIA} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <CommunityGallery />
        </div>
      </main>
    </div>
  )
}