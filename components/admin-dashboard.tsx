"use client"

import type { User } from "firebase/auth"
import { LogOut, ShieldCheck, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CommunityGallery from "../app/community/page"

export function AdminDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-amber-foreground">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Área do Admin</p>
              <p className="font-bold tracking-tight">{user.displayName || user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut data-icon="inline-start" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardContent>
              <h2 className="text-xl font-semibold">Painel Administrativo</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Aqui você pode revisar as solicitações, gerenciar conteúdo e acessar dados administrativos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent>
              <h3 className="text-lg font-semibold">Usuário autenticado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                E-mail: <span className="font-medium text-foreground">{user.email}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                UID: <span className="font-medium text-foreground">{user.uid}</span>
              </p>
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
