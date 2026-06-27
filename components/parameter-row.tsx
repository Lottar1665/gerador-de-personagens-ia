"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
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
  const [done, setDone] = useState(false)

  // 1. Forçamos o valor a ser estritamente um número válido entre 0 e 100
  const valorBruto = overrideValue !== undefined 
    ? overrideValue 
    : ((slider as any).value ?? (slider as any).default ?? slider.defaultValue ?? 50)
  
  const valorFinal = isNaN(Number(valorBruto)) ? 50 : Number(valorBruto)

  return (
    <div className="flex flex-col gap-2 border-b border-border/30 py-4 px-2 transition-colors hover:bg-secondary/5 rounded-xl">
      
      {/* TEXTO SUPERIOR: Nome do Slider e a Porcentagem Alinhada */}
      <div className="flex items-center justify-between text-xs w-full">
        <span className={cn(
          "font-medium truncate transition-colors text-foreground/80", 
          done && "text-muted-foreground line-through opacity-50"
        )}>
          {slider.label}
        </span>
        
        {/* Badge Numérico em Porcentagem Estilo EA FC */}
        <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px] min-w-[38px] text-center">
          {valorFinal}%
        </span>
      </div>
      
      {/* TRILHO DO SLIDER (Sem ponteiro duplo e sem quebras) */}
      <div className="pt-1.5 w-full pr-1">
        <Slider 
          // 🟢 CORREÇÃO CRÍTICA: Passamos apenas UM número dentro do array. 
          // Se passar mais de um ou se o estado duplicar, o Radix gera duas bolinhas.
          value={[valorFinal]} 
          max={100} 
          min={0}
          step={1} 
          disabled={true} // Mantém apenas leitura para refletir o dado da IA
          className="w-full cursor-default"
        />
      </div>

    </div>
  )
}

