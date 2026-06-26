// lib/face-parameters.ts
import { esqueletoParameters } from "./esqueleto"
import { faceParametersPeleChunk } from "./pele" 

export type Slider = {
  id: string
  label: string
  /** O idioma em inglês que vai oculto para a inteligência artificial */
  labelAI: string
  /** Valor padrão onde a barra começa (geralmente 50) */
  default: number
  value?: number
  done?: boolean
}

export type AccordionGroup = {
  id: string
  label: string
  defaultOpen?: boolean
  sliders: Slider[]
}

export type SubTab = {
  id: string
  label: string
  groups: AccordionGroup[]
}

export type MainTab = {
  id: string
  label: string
  subTabs: SubTab[]
}

// 1. Nova interface raiz para controlar as 3 grandes divisões do jogo
export type FaceCategory = {
  id: string
  label: string // "Esqueleto", "Pele" ou "Preenchimento"
  mainTabs: MainTab[]
}

/**
 * Painel Central de Parâmetros do Projeto
 * Unifica os arquivos isolados em uma estrutura limpa de Categorias
 */
export const faceParameters: FaceCategory[] = [
  // ==========================================================================
  // CATEGORIA 1: ESQUELETO (Puxando dados do seu arquivo isolado esqueleto.ts)
  // ==========================================================================
  {
    id: "esqueleto",
    label: "Esqueleto",
    mainTabs: esqueletoParameters
  },

  // ==========================================================================
  // CATEGORIA 2: PELE (Espaço pronto para você plugar o arquivo de prints)
  // ==========================================================================
  {
    id: "pele",
    label: "Pele",
    mainTabs: typeof faceParametersPeleChunk !== 'undefined' ? faceParametersPeleChunk : []
  },

  // ==========================================================================
  // CATEGORIA 3: PREENCHIMENTO (Gaveta vazia guardando os futuros lotes de volumes)
  // ==========================================================================
  {
    id: "preenchimento",
    label: "Preenchimento",
    mainTabs: []
  }
]
