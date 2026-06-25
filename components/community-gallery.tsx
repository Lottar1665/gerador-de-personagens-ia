"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type CommunityPost = {
  id: string
  previewDataUrl?: string
  uploadedBy?: string
  createdAt?: { seconds?: number; nanoseconds?: number } | string | null
  result?: any
}

function formatDate(value: CommunityPost["createdAt"]) {
  if (!value) return "Data desconhecida"

  if (typeof value === "string") {
    return new Date(value).toLocaleString("pt-BR")
  }

  const seconds = typeof value === "object" ? value.seconds ?? 0 : 0
  return new Date(seconds * 1000).toLocaleString("pt-BR")
}

export default function CommunityGallery() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetch("/api/firebase")
      .then(async (response) => {
        if (!response.ok) {
          // Tenta ler o erro real enviado pelo backend
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Erro detalhado retornado pelo servidor:", errorData);
          throw new Error(errorData.details || errorData.error || "Falha ao carregar posts da comunidade");
        }

        const data = await response.json()
        
        // CORREÇÃO AQUI: Se 'data' for uma array, usa ela direto. Se for um objeto com .items, usa .items.
        if (Array.isArray(data)) {
          return data as CommunityPost[]
        }
        return (data.items || []) as CommunityPost[]
      })
      .then((items) => {
        if (!active) return
        setPosts(items ?? [])
      })
      .catch((err) => {
        if (!active) return
        console.error("Erro capturado no frontend:", err)
        setError(err.message || "Não foi possível carregar a galeria da comunidade.")
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <Card className="border-border bg-card">
      <CardContent>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-lg font-semibold">Galeria da Comunidade</p>
            <p className="text-sm text-muted-foreground">
              Veja as últimas imagens e presets postados pela comunidade.
            </p>
          </div>
          <Badge className="bg-primary/15 text-primary">Últimos 20</Badge>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-secondary/10 px-6 py-12 text-center text-sm text-muted-foreground">
            Carregando posts...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-12 text-center text-sm text-destructive">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-secondary/10 px-6 py-12 text-center text-sm text-muted-foreground">
            Nenhum post encontrado ainda. Faça upload de uma imagem para aparecer aqui.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-zinc-950">
                  {post.previewDataUrl ? (
                    <img
                      src={post.previewDataUrl}
                      alt={`Post da comunidade de ${post.uploadedBy ?? "usuário"}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-sm text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="space-y-2 px-4 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {post.uploadedBy ? post.uploadedBy : "Anônimo"}
                    </p>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  {post.result ? (
                    <div className="rounded-2xl bg-secondary/80 px-3 py-2 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Parâmetros gerados</p>
                      <p className="mt-1 text-xs leading-5">{Object.keys(post.result || {}).slice(0, 3).join(", ")}</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-secondary/80 px-3 py-2 text-xs text-muted-foreground">
                      Sem dados de IA disponíveis.
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
