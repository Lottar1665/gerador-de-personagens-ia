"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { AuthScreen } from "@/components/auth-screen"
import { Dashboard } from "@/components/dashboard"

type View = "auth" | "dashboard"

export default function Page() {
  const [view, setView] = useState<View>("auth")

  return (
    <div className="min-h-screen bg-background">
      {/* Seletor de visão para o preview */}
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/90 p-1 shadow-xl backdrop-blur">
        {(
          [
            { id: "auth", label: "Autenticação" },
            { id: "dashboard", label: "Dashboard" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              view === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "auth" ? (
        <AuthScreen />
      ) : (
        <Dashboard onLogout={() => setView("auth")} />
      )}
    </div>
  )
}
