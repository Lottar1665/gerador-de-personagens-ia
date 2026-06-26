"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ParameterRow } from "@/components/parameter-row"
import { faceParameters, type AccordionGroup, type SubTab } from "@/lib/face-parameters"

function Stepper({
  label,
  onPrev,
  onNext,
  indented,
}: {
  label: string
  onPrev: () => void
  onNext: () => void
  indented?: boolean
}) {
  return (
    <div className={indented ? "relative pl-5" : undefined}>
      {indented && (
        <span
          aria-hidden
          className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-bl-md border-b border-l border-border"
        />
      )}
      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/60 px-1.5 py-1.5">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Anterior"
          className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="truncate px-2 text-center text-sm font-semibold text-foreground">
          {label}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="Próximo"
          className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

type AreaOption = {
  subTab: SubTab
  group: AccordionGroup
}

export function ResultsPanel({ data }: { data: any }) {
  const [tabIndex, setTabIndex] = useState(0)
  const [areaIndex, setAreaIndex] = useState(0)

  const tab = faceParameters[tabIndex]

  // components/results-panel.tsx - Linhas 65 a 68
const areaOptions = useMemo<any[]>(() => {
  const t = tab as any;
  if (!t) return [];

  // Se for o novo objeto envelopado (Categoria que contém mainTabs)
  if (t.mainTabs && Array.isArray(t.mainTabs)) {
    return t.mainTabs.flatMap((mainTab: any) =>
      (mainTab.subTabs || []).flatMap((subTab: any) =>
        (subTab.groups || []).map((group: any) => ({ subTab, group }))
      )
    );
  }

  // Se for o formato de Aba Direta (que contém subTabs)
  if (t.subTabs && Array.isArray(t.subTabs)) {
    return t.subTabs.flatMap((subTab: any) =>
      (subTab.groups || []).map((group: any) => ({ subTab, group }))
    );
  }

  return [];
}, [tab]);


  const area = areaOptions[Math.min(areaIndex, areaOptions.length - 1)]

  useEffect(() => {
    setAreaIndex(0)
  }, [tabIndex])

  const cycleTab = (dir: 1 | -1) => {
    setTabIndex((current) => (current + dir + faceParameters.length) % faceParameters.length)
  }

  const cycleArea = (dir: 1 | -1) => {
    setAreaIndex((current) => (current + dir + areaOptions.length) % areaOptions.length)
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border/50">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Aguardando Análise</h3>
        <p className="text-sm max-w-[260px]">
          Faça o upload de uma foto e clique em gerar para ver os parâmetros do EA FC 26.
        </p>
      </div>
    )
  }

  const activeArea = area ?? {
    subTab: tab.subTabs[0],
    group: tab.subTabs[0]?.groups[0] ?? { id: "", label: "", sliders: [] },
  }

  const areaLabel = `${activeArea.subTab.label} · ${activeArea.group.label}`

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <div>
            <p className="text-sm font-semibold">Parâmetros gerados</p>
            <p className="text-xs text-muted-foreground">Painel EA FC</p>
          </div>
        </div>
        <Badge className="bg-primary/15 text-primary">IA pronta</Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-2xl border border-border bg-card/80 p-3">
        <Stepper
          label={`${tab.label} (${tabIndex + 1}/${faceParameters.length})`}
          onPrev={() => cycleTab(-1)}
          onNext={() => cycleTab(1)}
        />

        <Stepper
          label={`${areaLabel} (${areaIndex + 1}/${areaOptions.length})`}
          onPrev={() => cycleArea(-1)}
          onNext={() => cycleArea(1)}
          indented
        />

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent scrollbar-thumb-slate-700/40">
          <div className="space-y-4 py-2">
            {activeArea.group.sliders.map((slider) => {
              const rawValue = data?.[tab.label]?.[activeArea.subTab.label]?.[activeArea.group.label]?.[slider.label]
              const sliderValue = typeof rawValue === "number" ? rawValue : Number(rawValue ?? slider.default)

              return (
                <ParameterRow
                  key={slider.id}
                  slider={{ ...slider, defaultValue: slider.default }}
                  overrideValue={sliderValue}
                />
              )
            })}
          </div>
        </div>

        <p className="px-1 text-center text-[11px] text-muted-foreground">
          Toque em um parâmetro para marcar como concluído
        </p>
      </div>
    </div>
  )
}
