"use client"

import { useEffect, useState } from "react"
import { type User } from "firebase/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CommunityPost = {
  id: string
  userPhotoUrl?: string
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

export default function UserParametersArea({ user }: { user: User }) {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetch("/api/firebase")
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Falha ao carregar seus parâmetros.")
        }
        return response.json()
      })
      .then((data) => {
        if (!active) return
        const items = Array.isArray(data) ? data : data.items || []
        const userEmail = user.email || ""
        setPosts(
          items
            .filter((post: CommunityPost) => post.uploadedBy === user.displayName || post.uploadedBy === userEmail)
            .sort((a: CommunityPost, b: CommunityPost) => {
              const aTime = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : typeof a.createdAt === "object" ? (a.createdAt.seconds ?? 0) * 1000 : 0
              const bTime = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : typeof b.createdAt === "object" ? (b.createdAt.seconds ?? 0) * 1000 : 0
              return bTime - aTime
            })
        )
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || "Erro ao carregar seus parâmetros.")
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  return (
    <Card className="border-border bg-card">
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border border-border">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.displayName || user.email || "Usuário"} />
                ) : (
                  <AvatarFallback>{(user.displayName || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">Sua área</p>
                <p className="text-xs text-muted-foreground">Acesse os parâmetros que você autorizou publicar.</p>
              </div>
            </div>
            <Badge className="bg-primary/15 text-primary">Privado</Badge>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-border/50 bg-secondary/10 px-4 py-10 text-center text-sm text-muted-foreground">
              Carregando seus parâmetros...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-10 text-center text-sm text-destructive">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-secondary/10 px-4 py-10 text-center text-sm text-muted-foreground">
              Você ainda não publicou parâmetros.
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="rounded-3xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{post.uploadedBy || "Seu post"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                    <Badge className="bg-secondary/80 text-muted-foreground">Publicado</Badge>
                  </div>
                  <div className="mt-3 rounded-2xl border border-border/50 bg-secondary/10 p-3 text-xs text-muted-foreground">
                    <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5">
                      {JSON.stringify(post.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
