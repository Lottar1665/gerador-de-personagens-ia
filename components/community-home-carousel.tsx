"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type CommunityPost = {
  id: string
  uploadedBy?: string
  createdAt?: { seconds?: number; nanoseconds?: number } | string | null
  result?: any
}

function formatDate(value: CommunityPost["createdAt"]) {
  if (!value) return "Data desconhecida"
  if (typeof value === "string") {
    return new Date(value).toLocaleDateString("pt-BR")
  }
  const seconds = typeof value === "object" ? value.seconds ?? 0 : 0
  return new Date(seconds * 1000).toLocaleDateString("pt-BR")
}

function formatSummary(result: any) {
  if (!result || typeof result !== "object") {
    return "Parâmetros públicos compartilhados pela comunidade."
  }

  const categories = Object.entries(result)
    .slice(0, 3)
    .map(([category, tabs]) => {
      if (!tabs || typeof tabs !== "object") {
        return category
      }

      const firstTab = Object.entries(tabs)[0]
      if (!firstTab) {
        return category
      }

      const [tabLabel, groups] = firstTab
      const firstGroup = groups && typeof groups === "object" ? Object.keys(groups)[0] : ""
      return `${category} / ${tabLabel}${firstGroup ? ` / ${firstGroup}` : ""}`
    })

  return categories.join(" • ") || "Parâmetros permitidos pela comunidade."
}

export default function CommunityHomeCarousel() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let active = true

    fetch("/api/firebase")
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Falha ao carregar a galeria pública.")
        }
        return response.json()
      })
      .then((data) => {
        if (!active) return
        const items = Array.isArray(data) ? data : data.items || []
        const published = items.filter((post: CommunityPost) => post.result)
        setPosts(published.slice(0, 8))
      })
      .catch(() => {
        setPosts([])
      })

    return () => {
      active = false
    }
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((current) => (posts.length > 0 ? (current + 1) % posts.length : 0))
  }, [posts.length])

  useEffect(() => {
    if (isHovered || posts.length <= 1) {
      return
    }
    const timer = window.setInterval(nextSlide, 4000)
    return () => window.clearInterval(timer)
  }, [isHovered, nextSlide, posts.length])

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/80 p-10 text-center text-sm text-muted-foreground">
        Nenhum parâmetro público disponível no momento.
      </div>
    )
  }

  return (
    <div
      className="group relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card/80 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex min-h-[340px] items-center justify-center">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
            )}
          >
            <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-border/50 bg-background/90 p-8 text-left text-foreground shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <span>Compartilhado por</span>
                  <span className="rounded-full border border-border/70 bg-secondary/80 px-2 py-1 text-[11px] text-foreground">
                    {post.uploadedBy || "Anônimo"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    Parâmetros permitidos pela comunidade
                  </h2>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/70 bg-card p-6">
                <p className="text-sm leading-7 text-foreground/80">{formatSummary(post.result)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCurrentIndex((current) => (current === 0 ? posts.length - 1 : current - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-secondary/80 p-3 text-foreground transition hover:bg-secondary"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-secondary/80 p-3 text-foreground transition hover:bg-secondary"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {posts.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  )
}
