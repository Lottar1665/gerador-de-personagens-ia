"use client"

import { useState, useEffect } from "react"
import { faceParameters } from "@/lib/face-parameters" // Confirme se o caminho da sua pasta lib está correto
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

export function ResultsPanel({ data }: { data: any }) {

  console.log("DADOS RECEBIDOS NA RESULTS PANEL:", JSON.stringify(data, null, 2));

  // Controle de Navegação (Menu Superior)
  const [activeTabId, setActiveTabId] = useState(faceParameters[0].id)
  
  // Encontra a aba principal ativa no momento
  const activeTab = faceParameters.find((t) => t.id === activeTabId) || faceParameters[0]

  // Controle da Sub-aba
  const [activeSubTabId, setActiveSubTabId] = useState(activeTab.subTabs[0].id)
  
  // Sempre que o usuário trocar a Aba Principal, volta para a primeira Sub-aba dela
  useEffect(() => {
    const tab = faceParameters.find((t) => t.id === activeTabId)
    if (tab && tab.subTabs.length > 0) {
      setActiveSubTabId(tab.subTabs[0].id)
    }
  }, [activeTabId])

  const activeSubTab = activeTab.subTabs.find((st) => st.id === activeSubTabId) || activeTab.subTabs[0]

  const currentTabIndex = faceParameters.findIndex((t) => t.id === activeTabId)
  const currentSubTabIndex = activeTab.subTabs.findIndex((st) => st.id === activeSubTabId)

  const changeTabBy = (delta: number) => {
    const nextIndex = (currentTabIndex + delta + faceParameters.length) % faceParameters.length
    setActiveTabId(faceParameters[nextIndex].id)
  }

  const changeSubTabBy = (delta: number) => {
    const subTabs = activeTab.subTabs
    const nextIndex = (currentSubTabIndex + delta + subTabs.length) % subTabs.length
    setActiveSubTabId(subTabs[nextIndex].id)
  }

  // Controle dos Accordions (Grupos de sliders expandidos)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  // Inicia os grupos abertos por padrão
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {}
    activeSubTab?.groups.forEach((g) => {
      initialOpenState[g.id] = g.defaultOpen ?? true
    })
    setOpenGroups(initialOpenState)
  }, [activeSubTab])

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  // Estado Vazio (Antes da IA rodar)
  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border/50">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Aguardando Análise</h3>
        <p className="text-sm max-w-[250px]">
          Faça o upload de uma foto e clique em gerar para ver os parâmetros do EA FC 26.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-border bg-background">
      <aside className="hidden w-[320px] shrink-0 flex-col gap-4 border-r border-border/70 bg-secondary/10 px-4 py-5 lg:flex">
        <div className="rounded-[28px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-4">Classe</p>
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-border/70 bg-secondary/80 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{activeTab.label}</p>
              <p className="text-xs text-muted-foreground">{activeTab.subTabs.length} subclasses</p>
            </div>
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {currentTabIndex + 1}/{faceParameters.length}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeTabBy(-1)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-border/70 bg-background text-foreground transition hover:border-primary hover:text-primary"
              aria-label="Classe anterior"
            >
              <ChevronDown className="size-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => changeTabBy(1)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-border/70 bg-background text-foreground transition hover:border-primary hover:text-primary"
              aria-label="Próxima classe"
            >
              <ChevronDown className="size-4 -rotate-90" />
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Subclasse</p>
              <p className="text-sm font-semibold text-foreground">{activeSubTab.label}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {currentSubTabIndex + 1}/{activeTab.subTabs.length}
            </span>
          </div>
          <div className="space-y-2">
            {activeTab.subTabs.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTabId(sub.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-3xl border px-3 py-3 text-left text-sm font-medium transition",
                  activeSubTabId === sub.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-secondary/80 text-muted-foreground hover:border-primary hover:bg-secondary"
                )}
              >
                <span>{sub.label}</span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Sub</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeSubTabBy(-1)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-border/70 bg-background text-foreground transition hover:border-primary hover:text-primary"
              aria-label="Subclasse anterior"
            >
              <ChevronDown className="size-5 rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => changeSubTabBy(1)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-border/70 bg-background text-foreground transition hover:border-primary hover:text-primary"
              aria-label="Próxima subclasse"
            >
              <ChevronDown className="size-5 -rotate-90" />
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-background p-4 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Parâmetros</p>
          <div className="grid gap-2">
            {activeSubTab.groups.flatMap((group) => group.sliders).map((slider) => (
              <span
                key={slider.id}
                className="inline-flex items-center rounded-full bg-secondary/80 px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                {slider.label}
              </span>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#0b1724]">
        {/* Header com título + badge */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#102233] p-2 text-xl">📦</div>
            <div>
              <p className="text-sm font-semibold text-white">Parâmetros gerados</p>
            </div>
          </div>
          <div className="rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-semibold text-black">IA pronta</div>
        </div>

        {/* Pills de Classe e Subclasse — estilo do screenshot */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <button
              onClick={() => changeTabBy(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-transparent border border-transparent text-white/80"
              aria-label="Classe anterior"
            >
              <ChevronDown className="size-4 rotate-90" />
            </button>
            <div className="flex items-center justify-center rounded-xl border border-[#28404f] bg-[#0f2533] py-3 px-4 text-center text-sm font-semibold text-white">
              {activeTab.label}
            </div>
            <button
              onClick={() => changeTabBy(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-transparent border border-transparent text-white/80"
              aria-label="Próxima classe"
            >
              <ChevronDown className="size-4 -rotate-90" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => changeSubTabBy(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-transparent border border-transparent text-white/80"
              aria-label="Subclasse anterior"
            >
              <ChevronDown className="size-4 rotate-90" />
            </button>
            <div className="flex items-center justify-center rounded-xl border border-[#28404f] bg-[#0f2533] py-3 px-4 text-center text-sm font-semibold text-white">
              {activeSubTab.label}
            </div>
            <button
              onClick={() => changeSubTabBy(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-transparent border border-transparent text-white/80"
              aria-label="Próxima subclasse"
            >
              <ChevronDown className="size-4 -rotate-90" />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {activeSubTab?.groups.map((group) => {
            const isOpen = openGroups[group.id]

            return (
              <div key={group.id} className="overflow-hidden rounded-[20px] border border-[#253241] bg-[#07101a] p-4">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-3.5 w-3.5 rounded-full bg-emerald-400/80" />
                    <div>
                      <p className="text-sm font-semibold text-white">{group.label}</p>
                      <p className="text-xs text-white/70">{group.sliders.length} ajustes</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="size-5 text-white/70" /> : <ChevronDown className="size-5 text-white/70" />}
                </button>

                {isOpen && (
                  <div className="space-y-6 border-t border-[#20313d] px-2 pt-4 pb-2">
                    {group.sliders.map((slider) => {
                      const valorDaIA =
                        data?.[activeTab.label]?.[activeSubTab.label]?.[group.label]?.[slider.label] ??
                        slider.default

                      if (data && data?.[activeTab.label]?.[activeSubTab.label]?.[group.label]?.[slider.label] === undefined) {
                        console.warn(`Não achei: ${activeTab.label} -> ${activeSubTab.label} -> ${group.label} -> ${slider.label}`)
                      }

                      const parts = slider.label.split('/')
                      const left = parts[0] ? parts[0].trim() : slider.label
                      const right = parts[1] ? parts[1].trim() : ''

                      return (
                        <div key={slider.id} className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-white/90">
                            <span className="truncate">{left}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-white/70">{right}</span>
                              <span className="text-lg font-bold text-white">{valorDaIA}</span>
                            </div>
                          </div>

                          <div className="px-2">
                            <Slider
                              value={[valorDaIA]}
                              max={100}
                              step={1}
                              className="w-full [&>span[data-slot='slider-track']]:bg-[#20313d] [&>span[data-slot='slider-range']]:bg-emerald-400"
                            />
                          </div>
                        </div>
                      )
                    })}

                    <div className="h-8" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 py-6 text-center text-xs text-white/60">Toque em um parâmetro para marcar como concluído</div>
      </div>
    </div>
  )
}