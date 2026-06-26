import Link from "next/link"
import CommunityHomeCarousel from "@/components/community-home-carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-14 text-foreground">
      <div className="mx-auto max-w-6xl">
        <section className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Bem-vindo ao gerador de rostos</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Veja os parâmetros gerados pela comunidade</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Aqui você encontra os parâmetros liberados pelos usuários em um carrossel animado, com a mesma interface do dashboard.
          </p>
        </section>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-border bg-card">
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground">Acesse rapidamente</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Vá direto para o painel de geração, veja a galeria da comunidade ou acesse os parâmetros que você mesmo publicou.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/dashboard?tab=generate" className="block">
                  <Button size="sm" className="w-full">Gerar parâmetros</Button>
                </Link>
                <Link href="/dashboard?tab=community" className="block">
                  <Button variant="outline" size="sm" className="w-full">Galeria da comunidade</Button>
                </Link>
                <Link href="/dashboard?tab=meus" className="block">
                  <Button variant="secondary" size="sm" className="w-full">Minha área</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-[2rem] border border-border bg-card p-6">
            <p className="text-sm font-medium text-foreground">Como funciona</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="rounded-2xl border border-border/50 bg-secondary/10 p-3">A home mostra um carrossel animado com parâmetros aprovados pela comunidade.</li>
              <li className="rounded-2xl border border-border/50 bg-secondary/10 p-3">A galeria pública exibe apenas parâmetros compartilhados pelos usuários.</li>
              <li className="rounded-2xl border border-border/50 bg-secondary/10 p-3">Sua área mostra apenas os parâmetros que você publicou.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <CommunityHomeCarousel />
        </div>
      </div>
    </main>
  )
}
