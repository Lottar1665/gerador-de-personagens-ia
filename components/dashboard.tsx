"use client"

import { useRef, useState } from "react"
import { LogOut, Sparkles, Upload, Wand2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ResultsPanel } from "@/components/results-panel"

function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="font-bold tracking-tight">
            Crie seu char <span className="text-primary">com IA</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border border-border">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              FC
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
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Upload className="size-5" />
        </span>
        <span className="text-sm font-medium">
          Arraste sua foto aqui ou clique para anexar
        </span>
        <span className="text-xs text-muted-foreground">
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

function InputZone({ onParametrosGerados, resultadoIA }: { onParametrosGerados: (dados: any) => void, resultadoIA: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null)

  const handleGerarParametros = async () => {
    if (!imagemSelecionada) {
      alert("Por favor, anexe uma foto antes de gerar os parâmetros.")
      return
    }

    setIsLoading(true)
    try {
      console.log("Iniciando processamento da imagem...")

      let base64String = ""
      let mimeType = imagemSelecionada.type

      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const raw = reader.result as string
          resolve(raw.split(",")[1])
        }
      })
      reader.readAsDataURL(imagemSelecionada)
      base64String = await base64Promise

      const response = await fetch("/api/gerar-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descricao: "Gerar avatar realista baseado na foto enviada",
          imagemBase64: base64String,
          mimeType: mimeType
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha na requisição.")
      }

      const dadosDoBoneco = await response.json()
      onParametrosGerados(dadosDoBoneco)
      alert("IA processou o rosto com sucesso!")
      
    } catch (error: any) {
      console.error("Erro no front:", error)
      alert(`Erro: ${error.message || "Não foi possível conectar à IA."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex h-full flex-col border-border bg-card">
      <CardContent className="flex flex-1 flex-col gap-5 justify-between py-6">
        
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Preview do Avatar</h2>
          <p className="text-xs text-muted-foreground text-pretty">
            {resultadoIA?.previewUrl 
              ? "Aparência estimada baseada nos sliders calculados." 
              : "Suba uma foto para visualizar a renderização 3D do seu personagem."
            }
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-3 rounded-xl border border-border bg-secondary/10 p-4 min-h-64 justify-center items-center relative">
          {resultadoIA?.previewUrl ? (
            <div className="relative aspect-square w-full max-h-56 overflow-hidden rounded-lg border border-border bg-muted shadow-lg animate-fade-in">
              <img 
                src={resultadoIA.previewUrl} 
                alt="Preview do Personagem EA FC" 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-all hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center py-8 animate-pulse text-muted-foreground/70">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary/60 border border-border/40 text-muted-foreground/50">
                👤
              </div>
              <span className="text-sm font-medium tracking-wide">
                Seu personagem aparecerá aqui
              </span>
              <span className="text-[11px] text-muted-foreground/50 max-w-[200px]">
                O preview visual 3D será renderizado após o clique no botão abaixo.
              </span>
            </div>
          )}
        </div>

        <UploadArea onFileSelect={setImagemSelecionada} />

        <Button 
          size="lg" 
          className="h-12 w-full text-base font-semibold"
          onClick={handleGerarParametros}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processando Face...
            </>
          ) : (
            <>
              <Wand2 data-icon="inline-start" className="mr-2" />
              {resultadoIA?.previewUrl ? "Regerar Parâmetros com IA" : "Gerar Parâmetros com IA"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [resultadoIA, setResultadoIA] = useState<any>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar onLogout={onLogout} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <div className="lg:h-[calc(100vh-7rem)]">
            <InputZone onParametrosGerados={setResultadoIA} resultadoIA={resultadoIA} />
          </div>

          <Card className="border-border bg-card lg:h-[calc(100vh-7rem)]">
            <CardContent className="h-full overflow-hidden">
              <ResultsPanel data={resultadoIA} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
