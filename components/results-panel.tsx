"use client"

import { useState } from "react"
import { Layers } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ParameterRow } from "@/components/parameter-row"
import { faceParameters, type MainTab } from "@/lib/face-parameters"

interface SubTabContentProps {
  tab: MainTab
  apiData: any
}

function SubTabContent({ tab, apiData }: SubTabContentProps) {
  const [activeSub, setActiveSub] = useState(tab.subTabs[0].id)
  const activeSubTab =
    tab.subTabs.find((s) => s.id === activeSub) ?? tab.subTabs[0]

  const openByDefault = activeSubTab.groups
    .filter((g) => g.defaultOpen)
    .map((g) => g.id)

  return (
    <div className="flex flex-col gap-3">
      {/* SUB-TABS (Nível 2) */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-custom">
        {tab.subTabs.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => setActiveSub(sub.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
              sub.id === activeSub
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
            )}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* ACCORDIONS (Nível 3) */}
      <Accordion
        key={activeSubTab.id}
        multiple
        defaultValue={
          openByDefault.length > 0
            ? openByDefault
            : [activeSubTab.groups[0].id]
        }
        className="flex flex-col gap-2"
      >
        {activeSubTab.groups.map((group) => (
          <AccordionItem
            key={group.id}
            value={group.id}
            className="rounded-xl border border-border bg-secondary/30 px-3 not-last:border-b"
          >
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {group.label}
              </span>
              <Badge
                variant="secondary"
                className="mr-2 ml-auto bg-background/60 text-[10px] text-muted-foreground"
              >
                {group.sliders.length}
              </Badge>
            </AccordionTrigger>
            
            {/* SLIDERS (Nível 4) */}
            <AccordionContent className="pb-3">
              <div className="flex flex-col gap-0.5">
                {group.sliders.map((slider) => {
                  
                  // 🧠 BUSCA POR APROXIMAÇÃO SEMÂNTICA: Cruza variações de nomes entre IA e v0
                  const encontrarValorGarantido = () => {
                    if (!apiData) return undefined

                    const mainKey = tab.label.toLowerCase().trim()
                    const sliderKey = slider.label.toLowerCase().trim()

                    // 1. Localiza a categoria principal correta
                    let dadosAbaPrincipal: any = null
                    for (const key in apiData) {
                      if (key.toLowerCase().trim() === mainKey) {
                        dadosAbaPrincipal = apiData[key]
                        break
                      }
                    }

                    if (!dadosAbaPrincipal) return undefined

                    // Escaneia a sub-árvore atrás do termo mais parecido
                    const buscarMelhorMatch = (objetoAlvo: any): number | undefined => {
                      let melhorValor: number | undefined = undefined
                      let maiorSemelhanca = 0

                      const escanear = (obj: any) => {
                        for (const k in obj) {
                          if (typeof obj[k] === "object") {
                            escanear(obj[k])
                          } else {
                            const nomeChaveIA = k.toLowerCase().trim()
                            
                            if (nomeChaveIA.includes(sliderKey) || sliderKey.includes(nomeChaveIA)) {
                              const score = Math.min(nomeChaveIA.length, sliderKey.length)
                              if (score > maiorSemelhanca) {
                                maiorSemelhanca = score
                                melhorValor = obj[k]
                              }
                            }
                          }
                        }
                      }

                      escanear(objetoAlvo)
                      return melhorValor
                    }

                    return buscarMelhorMatch(dadosAbaPrincipal)
                  }

                  const valorIA = encontrarValorGarantido()

                  return (
                    <ParameterRow 
                      key={slider.id} 
                      slider={slider} 
                      overrideValue={valorIA !== undefined ? Number(valorIA) : undefined} 
                    />
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export function ResultsPanel({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState(faceParameters[0].id)
  const current =
    faceParameters.find((t) => t.id === activeTab) ?? faceParameters[0]

  const temDadosDaIA = data && Object.keys(data).length > 0

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Parâmetros gerados</h2>
        </div>
        <Badge className={cn(temDadosDaIA ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground")}>
          {temDadosDaIA ? "IA Pronta" : "Aguardando Foto"}
        </Badge>
      </div>

      {/* MAIN TABS (Nível 1) */}
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 scrollbar-custom">
        {faceParameters.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              tab.id === activeTab
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SCROLL AREA */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-custom">
        <SubTabContent key={current.id} tab={current} apiData={data} />
      </div>
    </div>
  )
}
