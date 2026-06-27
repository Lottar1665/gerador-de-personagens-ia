"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ParameterRow } from "@/components/parameter-row"
import { faceParameters } from "@/lib/face-parameters"


export function ResultsPanel({ data }: { data: any }) {

  console.log("DADOS QUE A IA ESTÁ ENTREGANDO DE FATO:", data)

  // Estados para gerenciar as seleções dos carrosséis
  const [tabIndex, setTabIndex] = useState(0)          // Nível 1: Dropdown (Esqueleto, Pele, Preenchimento)
  const [macroIndex, setMacroIndex] = useState(0)      // Nível 2: Macro-Região (Cabeça, Testa, Olhos...)
  const [subTabIndex, setSubTabIndex] = useState(0)    // Nível 3: Sub-aba Real (Crânio, Têmporas, Órbitas...)

  // 🟢 CORREÇÃO MESTRE: Fazemos o painel ler de forma reativa os dados da IA (data) se existirem,
  // caindo no modelo estático de fábrica (faceParameters) apenas quando a página acaba de abrir.
  const tab = useMemo(() => {
    if (data && typeof data === 'object') {
      // Converte o objeto { Esqueleto, Pele, Preenchimento } em um array indexável para os carrosséis
      const listaAbasDinamicas = [data.Esqueleto, data.Pele, data.Preenchimento].filter(Boolean);
      if (listaAbasDinamicas.length > 0) {
        return listaAbasDinamicas[tabIndex];
      }
    }
    // Fallback inicial se não houver dados da IA ainda
    return faceParameters?.[tabIndex];
  }, [data, tabIndex]);

  // 1. Detecta o tipo de estrutura da Aba Pai selecionada de forma inteligente
  const temMacroRegioes = useMemo(() => {
    const t = tab as any
    return !!(t && t.mainTabs && Array.isArray(t.mainTabs))
  }, [tab])

  // 2. Extrai as Macro-Regiões apenas se a categoria pai possuir essa camada (Ex: Esqueleto)
  const macroRegions = useMemo(() => {
    const t = tab as any
    if (!t) return []
    if (temMacroRegioes) return t.mainTabs
    return []
  }, [tab, temMacroRegioes])

  const activeMacro = useMemo(() => {
    if (macroRegions.length === 0) return undefined
    return macroRegions[Math.min(macroIndex, macroRegions.length - 1)]
  }, [macroRegions, macroIndex])

  // 3. Extrai as Sub-abas reais mudando o caminho dinamicamente conforme o tipo da Aba Pai
  const subTabs = useMemo(() => {
    const t = tab as any
    if (!t) return []
    if (temMacroRegioes) return activeMacro?.subTabs || []
    return t.subTabs || []
  }, [tab, temMacroRegioes, activeMacro])

  const activeSubTab = useMemo(() => {
    if (subTabs.length === 0) return undefined
    return subTabs[Math.min(subTabIndex, subTabs.length - 1)]
  }, [subTabs, subTabIndex])

  // 4. Captura o grupo final que contém os sliders correspondentes
  const activeGroup = useMemo(() => {
    return activeSubTab?.groups || []
  }, [activeSubTab])

  // Reseta completamente os ponteiros das setas ao alternar o Dropdown da Aba Pai
  useEffect(() => {
    setMacroIndex(0)
    setSubTabIndex(0)
  }, [tabIndex])

  // Reseta as sub-abas reais se a macro-região superior se mover
  useEffect(() => {
    setSubTabIndex(0)
  }, [macroIndex])

  const cycleMacro = (dir: 1 | -1) => {
    if (macroRegions.length === 0) return
    setMacroIndex((current) => (current + dir + macroRegions.length) % macroRegions.length)
  }

  const cycleSubTab = (dir: 1 | -1) => {
    if (subTabs.length === 0) return
    setSubTabIndex((current) => (current + dir + subTabs.length) % subTabs.length)
  }

    return (
    // 🔒 TRAVA DE DESIGN: Altura imutável em h-[560px] mantém o espaço fixo igual ao seu print
    <div className="flex flex-col gap-4 w-full h-[560px] select-none">
      
      {/* Cabeçalho do painel */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <div>
            <p className="text-sm font-semibold">Parâmetros gerados</p>
            <p className="text-xs text-muted-foreground">Painel EA FC</p>
          </div>
        </div>
        <Badge className="bg-primary/15 text-primary">IA pronta</Badge>
      </div>

      {/* Caixa de Conteúdo Principal */}
      <div className="flex flex-col flex-1 h-full gap-3 rounded-2xl border border-border bg-card/80 p-3 overflow-hidden">
        
        {/* Nível 1: Dropdown (Aba Pai) */}
        <div className="w-full shrink-0">
          <select
            value={tabIndex}
            onChange={(e) => setTabIndex(Number(e.target.value))}
            className="w-full cursor-pointer rounded-lg border border-border bg-secondary/40 p-2 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary"
          >
            {faceParameters.map((item, idx) => (
              <option key={item.id || idx} value={idx} className="bg-card text-foreground">
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* CONTROLES CONDICIONAIS DE CARROSSEL (h-[88px] travado para estabilidade) */}
        <div className="rounded-lg border border-border bg-secondary/60 p-3 h-[88px] min-h-[88px] flex flex-col justify-center gap-2 shrink-0">
          
          {/* Caso 1: A categoria tem Macro-Regiões (Ex: Esqueleto) */}
          {temMacroRegioes && activeMacro ? (
            <>
              {/* Linha do Macro Carrossel */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => cycleMacro(-1)}
                  className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="truncate px-2 text-center text-sm font-bold text-foreground min-w-[140px]">
                  {activeMacro.label} ({macroIndex + 1}/{macroRegions.length})
                </span>
                <button
                  type="button"
                  onClick={() => cycleMacro(1)}
                  className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Linha da Sub-aba Real Embutida e Ramificada */}
              {subTabs.length > 0 && activeSubTab && (
                <div className="relative pl-5 pt-1.5 border-t border-border/30 flex items-center justify-between">
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-bl-md border-b border-l border-border/70"
                  />
                  <button
                    type="button"
                    onClick={() => cycleSubTab(-1)}
                    className="flex size-6 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className="truncate px-2 text-center text-xs font-semibold text-muted-foreground min-w-[140px]">
                    {activeSubTab.label} ({subTabIndex + 1}/{subTabs.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => cycleSubTab(1)}
                    className="flex size-6 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Caso 2: NÃO tem Macro-Região (Ex: Pele). Cria um único carrossel linear de Sub-abas */
            subTabs.length > 0 && activeSubTab && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => cycleSubTab(-1)}
                  className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="truncate px-2 text-center text-sm font-bold text-foreground min-w-[140px]">
                  {activeSubTab.label} ({subTabIndex + 1}/{subTabs.length})
                </span>
                <button
                  type="button"
                  onClick={() => cycleSubTab(1)}
                  className="flex size-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )
          )}
        </div>

        {/* Título Fixo dos Sliders */}
        <div className="pt-1 px-1 shrink-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
            Parâmetros
          </h4>
        </div>

                {/* Lista de Parâmetros com Rolagem Otimizada */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 content-start [scrollbar-width:thin]">
          {activeGroup && activeGroup.length > 0 ? (
            activeGroup.map((group: any, gIdx: number) => (
              <div key={gIdx} className="space-y-1">
                {group?.sliders?.map((slider: { id: string; label: string; labelAI: string; default: number }) => {
                  
                  // 1. Normaliza os textos para criar a chave combinada (ex: "esqueleto-olhos")
                  // Garante letras minúsculas e remove espaços ou acentos se necessário
                  const categoriaBase = (tab?.label || "Pele").toLowerCase();
                  const macroBase = (activeMacro?.label || activeSubTab?.label || "").toLowerCase();
                  
                                    // 1. Coleta os nomes exatos das pastas do menu atual (idêntico ao back-end)
                  const categoriaPai = tab?.label;        // Ex: "Pele" ou "Esqueleto"
                  const macroRegiao = activeMacro?.label;  // Ex: "Cabeça" (undefined se não existir)
                  const subAba = activeSubTab?.label;      // Ex: "Sobrancelhas" ou "Crânio"
                  const subGrupo = group?.label;           // Ex: "Centro das sobrancelhas" ou "Ajustes"
                  const nomeSlider = slider?.label;         // Ex: "Altura", "Espessura"

                  // Captura os parâmetros prontos enviados dentro do objeto 'parameters' da rota
                  const dadosProntos = data?.parameters || data; 

                  // 2. 🧠 LEITURA DIRETA DA ÁRVORE MASTIGADA DO BACK-END
                  let rawValue: number | undefined = undefined;

                  if (dadosProntos && categoriaPai) {
                    // Caso A: Tem Macro-Região (Ex: Esqueleto -> Cabeça -> Crânio -> Ajustes -> Altura)
                    if (macroRegiao) {
                      rawValue = dadosProntos[categoriaPai]?.[macroRegiao]?.[subAba]?.[subGrupo]?.[nomeSlider];
                    } 
                    // Caso B: É categoria direta (Ex: Pele -> Sobrancelhas -> Centro das sobrancelhas -> Altura)
                    else {
                      rawValue = dadosProntos[categoriaPai]?.[subAba]?.[subGrupo]?.[nomeSlider];
                    }
                  }

                  // 3. Aplica o valor numérico injetado pela IA ou cai no default do template do jogo
                  const sliderValue = typeof rawValue === "number" ? rawValue : Number(slider.default);


                  return (
                    <ParameterRow
                      key={slider.id}
                      slider={{ ...slider, defaultValue: slider.default }}
                      overrideValue={sliderValue} // Repassa o valor reativo correto
                    />
                  )
                })}
              </div>
            ))
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-center text-xs text-muted-foreground">
              Nenhum parâmetro encontrado nesta seção.
            </div>
          )}
        </div>



        {/* Rodapé Fixo */}
        <p className="px-1 pt-1 text-center text-[11px] text-muted-foreground border-t border-border/20 shrink-0">
          Toque em um parâmetro para marcar como concluído
        </p>

      </div>
    </div>
  )
}
