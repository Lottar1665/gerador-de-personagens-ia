"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface ParameterRowProps {
  slider: {
    id: string
    label: string
    defaultValue?: number
  }
  overrideValue?: number // Valor numérico de 0 a 100 injetado pelo Gemini
}

export function ParameterRow({ slider, overrideValue }: ParameterRowProps) {
  // Estado para controlar se o usuário já espelhou esse parâmetro no videogame
  const [done, setDone] = useState(false)

  // Se a IA mandou o número, usamos ele. Se não, usa o original do template do v0
  const valorFinal = overrideValue !== undefined ? overrideValue : (slider.defaultValue ?? 50)

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/30 py-3 transition-colors hover:bg-secondary/10 px-1 rounded-lg">
      
      {/* LADO ESQUERDO: Nome do Slider e a Barra Física */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between text-xs pr-2">
          <span className={cn(
            "font-medium truncate transition-colors", 
            done ? "text-muted-foreground line-through" : "text-foreground/90"
          )}>
            {slider.label}
          </span>
          {/* Badge Numérico em Porcentagem (Neon) */}
          <span className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">
            {valorFinal}%
          </span>
        </div>
        
        {/* Barra de Progresso Visual (Apenas leitura para refletir o dado da IA) */}
        <div className="pointer-events-none pt-1 pr-2">
          <Slider 
            value={[valorFinal]} 
            max={100} 
            step={1} 
            className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-secondary [&>span_span]:bg-primary"
          />
        </div>
      </div>

      {/* LADO DIREITO: Botão de Checkbox "Concluído" */}
      <label
        className={cn(
          "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground transition-all select-none",
          done ? "border-primary/40 bg-primary/10 text-primary" : "bg-secondary/20 hover:border-border/80 hover:text-foreground",
        )}
      >
        <Checkbox
          checked={done}
          onCheckedChange={(v) => setDone(v === true)}
          className="size-3.5 border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <span className="hidden sm:inline">Concluído</span>
      </label>

    </div>
  )
}
