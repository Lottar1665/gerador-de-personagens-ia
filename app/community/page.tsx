"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CommunityPost = {
  id: string
  userPhotoUrl?: string
  uploadedBy?: string
  createdAt?: { seconds?: number; nanoseconds?: number } | string | null
  result?: any
}

const FILTERS = ["Todos", "Mais recentes", "Com dados", "Com foto"] as const

type FilterValue = (typeof FILTERS)[number]

function NestedResultView({ data }: { data: any }) {
  if (!data || typeof data !== "object") {
    return <p className="text-xs text-fc-text3">Sem dados de parâmetros disponíveis.</p>
  }

  const renderNode = (node: any, depth = 0): ReactNode => {
    if (node === null) {
      return null
    }

    if (typeof node !== "object") {
      return <div className="text-xs text-fc-text3">{String(node)}</div>
    }

    if (Array.isArray(node)) {
      return (
        <div className="space-y-2">
          {node.map((item, index) => (
            <div key={`${depth}-array-${index}`} className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.14em] text-fc-text3">Item {index + 1}</div>
              <div className="rounded-2xl border-l border-fc/40 pl-4">
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
              <div key={baseKey} className="flex flex-col gap-1 rounded-2xl border border-fc/50 bg-fc-bg3/70 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fc-text3">{key}</div>
                <div className="text-sm text-fc-text">{String(value)}</div>
              </div>
            )
          }

          return (
            <div key={baseKey} className="space-y-2">
              <div className={depth === 0 ? "text-sm font-semibold text-fc-text" : "text-xs font-semibold uppercase tracking-[0.14em] text-fc-text3"}>
                {key}
              </div>
              <div className="rounded-2xl border-l border-fc/40 pl-4">
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

function getPostDateValue(post: CommunityPost) {
  if (!post.createdAt) return 0

  if (typeof post.createdAt === "string") {
    return new Date(post.createdAt).getTime()
  }

  return (post.createdAt.seconds ?? 0) * 1000
}

export default function CommunityGallery() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Todos")
  const [search, setSearch] = useState("")

  useEffect(() => {
    let active = true

    fetch("/api/firebase")
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("❌ Erro detalhado retornado pelo servidor:", errorData)
          throw new Error(errorData.details || errorData.error || "Falha ao carregar posts da comunidade")
        }

        const data = await response.json()

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

  const visiblePosts = [...posts]
    .filter((post) => {
      const query = search.trim().toLowerCase()
      if (!query) return true
      return `${post.uploadedBy || ""} ${post.id}`.toLowerCase().includes(query)
    })
    .filter((post) => {
      if (activeFilter === "Com dados") return Boolean(post.result)
      if (activeFilter === "Com foto") return Boolean(post.userPhotoUrl)
      return true
    })
    .sort((a, b) => {
      if (activeFilter === "Mais recentes") {
        return getPostDateValue(b) - getPostDateValue(a)
      }
      return 0
    })

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-fc-text">Comunidade</h1>
          <p className="mt-0.5 text-sm text-fc-text2">Presets gerados por outros jogadores</p>
        </div>
        <input
          type="search"
          placeholder="🔍 Buscar jogador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full sm:w-56"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
              activeFilter === filter
                ? "border-fc-green bg-fc-green-dim text-fc-green"
                : "border-fc2 text-fc-text2 hover:border-fc-green hover:text-fc-green"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-fc/50 bg-fc-bg3/50 px-6 py-12 text-center text-sm text-fc-text3">
          Carregando posts...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-fc-green/20 bg-fc-green-dim px-6 py-12 text-center text-sm text-fc-text">
          {error}
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="rounded-2xl border border-fc/50 bg-fc-bg3/40 px-6 py-12 text-center text-sm text-fc-text3">
          <div className="mb-4 text-5xl">🔍</div>
          <p>Nenhum preset encontrado para "{search}"</p>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => {
            const isExpanded = expandedPostId === post.id
            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-xl border border-fc bg-fc-card transition-all duration-200 hover:-translate-y-0.5 hover:border-fc-green"
              >
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[var(--green-dim)] to-fc-bg3">
                  <Avatar className="size-14 border border-fc">
                    {post.userPhotoUrl ? (
                      <AvatarImage src={post.userPhotoUrl} alt={post.uploadedBy || "Usuário"} />
                    ) : (
                      <AvatarFallback>{(post.uploadedBy || "A").charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="absolute right-2 top-2 rounded-md bg-fc-green px-2 py-0.5 text-xs font-black text-black">
                    {post.result ? "OK" : "PÚB"}
                  </span>
                </div>

                <div className="p-3">
                  <div className="text-sm font-bold text-fc-text">{post.uploadedBy || "Anônimo"}</div>
                  <div className="mb-2 text-xs text-fc-text3">{formatDate(post.createdAt)}</div>

                  <button
                    type="button"
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="w-full rounded-2xl border border-fc/70 bg-fc-bg3 px-3 py-2 text-left text-sm font-medium text-fc-text transition hover:border-fc-green"
                  >
                    {isExpanded ? "Ocultar parâmetros" : "Ver parâmetros gerados"}
                  </button>

                  {isExpanded ? (
                    <div className="mt-3 rounded-3xl border border-fc/50 bg-fc-bg3/70 p-4 text-xs text-fc-text3">
                      {post.result ? (
                        <NestedResultView data={post.result} />
                      ) : (
                        <p>Sem dados de parâmetros disponíveis.</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl bg-fc-bg3 px-3 py-2 text-xs text-fc-text2">
                      <p className="font-medium text-fc-text">Parâmetros gerados</p>
                      <p className="mt-1 leading-5">{post.result ? Object.keys(post.result || {}).slice(0, 3).join(", ") : "Sem dados"}</p>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
