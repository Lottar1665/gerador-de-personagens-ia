"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CommunityPost = {
  id: string
  userPhotoUrl?: string
  uploadedBy?: string
  createdAt?: { seconds?: number; nanoseconds?: number } | string | null
  result?: any
}

function NestedResultView({ data }: { data: any }) {
  if (!data || typeof data !== "object") {
    return <p className="text-xs text-muted-foreground">Sem dados de parâmetros disponíveis.</p>
  }

  const renderNode = (node: any, depth = 0): ReactNode => {
    if (node === null) {
      return null
    }

    if (typeof node !== "object") {
      return (
        <div className="text-xs text-muted-foreground">
          {String(node)}
        </div>
      )
    }

    if (Array.isArray(node)) {
      return (
        <div className="space-y-2">
          {node.map((item, index) => (
            <div key={`${depth}-array-${index}`} className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Item {index + 1}</div>
              <div className="rounded-2xl border-l border-border/40 pl-4">
                {renderNode(item, depth + 1)}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {Object.entries(node).map(([key, value]) => {
          const isLeaf = value === null || typeof value !== "object"
          const baseKey = `${depth}-${key}`

          if (isLeaf) {
            return (
              <div key={baseKey} className="flex flex-col gap-1 rounded-2xl border border-border/50 bg-secondary/5 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{key}</div>
                <div className="text-sm text-foreground">{String(value)}</div>
              </div>
            )
          }

          return (
            <div key={baseKey} className="space-y-2">
              <div className={depth === 0 ? "text-sm font-semibold text-foreground" : "text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"}>
                {key}
              </div>
              <div className="rounded-2xl border-l border-border/40 pl-4">
                {renderNode(value, depth + 1)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return <div className="space-y-4">{renderNode(data)}</div>
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
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)

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
              Veja os parâmetros gerados e compartilhados pela comunidade.
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
                <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/5 px-4 py-4">
                  <Avatar className="size-12 border border-border">
                    {post.userPhotoUrl ? (
                      <AvatarImage src={post.userPhotoUrl} alt={post.uploadedBy || "Usuário"} />
                    ) : (
                      <AvatarFallback>{(post.uploadedBy || "A").charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {post.uploadedBy ? post.uploadedBy : "Anônimo"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                    className="w-full rounded-2xl border border-border/70 bg-secondary/80 px-3 py-2 text-left text-sm font-medium text-foreground transition hover:border-primary/70"
                  >
                    {expandedPostId === post.id ? "Ocultar parâmetros" : "Ver parâmetros gerados"}
                  </button>

                  {expandedPostId === post.id ? (
                    <div className="rounded-3xl border border-border/50 bg-background/80 p-4 text-xs text-muted-foreground">
                      {post.result ? (
                        <NestedResultView data={post.result} />
                      ) : (
                        <p>Sem dados de parâmetros disponíveis.</p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-secondary/80 px-3 py-2 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Parâmetros gerados</p>
                      <p className="mt-1 text-xs leading-5">{post.result ? Object.keys(post.result || {}).slice(0, 3).join(", ") : "Sem dados"}</p>
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
