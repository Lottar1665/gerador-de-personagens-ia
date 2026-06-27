export type Slider = {
  id: string
  label: string
  /** O idioma em inglês que vai oculto para a inteligência artificial */
  labelAI: string
  /** Valor padrão onde a barra começa (geralmente 50) */
  default: number
  /** Valor dinâmico que a IA vai preencher depois */
  value?: number
  /** Marcado como concluído dentro do jogo */
  done?: boolean
}

export type AccordionGroup = {
  id: string
  label: string
  /** Aberto por padrão */
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

/**
 * Estrutura profunda em cascata que representa a saída da IA:
 * Tabs (Nível 1) -> Sub-tabs (Nível 2) -> Accordions (Nível 3) -> Sliders (Nível 4)
 */
export const esqueletoParameters: MainTab[] = [
  // ==========================================
  // 1. CABEÇA
  // ==========================================
  {
    id: "head",
    label: "Cabeça",
    subTabs: [
      {
        id: "skull",
        label: "Crânio",
        groups: [
          {
            id: "skull-adjustments",
            label: "Ajustes de Proporção", 
            defaultOpen: true,
            sliders: [
              { id: "sk1", label: "Fino / Ampliar", labelAI: "skull width", default: 50 },
              { id: "sk2", label: "Baixo / Cima", labelAI: "skull height", default: 50 },
              { id: "sk3", label: "Neutro / Frente", labelAI: "skull forward protrusion", default: 50 },
              { id: "sk4", label: "Redondo / Anguloso", labelAI: "skull angularity", default: 50 },
              { id: "sk5", label: "Mover Esq. / Dir.", labelAI: "skull horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "crown-of-head",
        label: "Coroa da cabeça",
        groups: [
          {
            id: "crown-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "cr1", label: "Fino / Ampliar", labelAI: "crown width", default: 50 },
              { id: "cr2", label: "Baixo / Cima", labelAI: "crown height", default: 50 },
              { id: "cr3", label: "Voltar / Frente", labelAI: "crown depth", default: 50 },
              { id: "cr4", label: "Neutro / Redondo", labelAI: "crown roundness", default: 50 },
              { id: "cr5", label: "Mover Esq. / Dir.", labelAI: "crown horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "back-of-skull",
        label: "Parte de trás do crânio",
        groups: [
          {
            id: "back-skull-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "bk1", label: "Fino / Ampliar", labelAI: "back of skull width", default: 50 },
              { id: "bk2", label: "Baixo / Cima", labelAI: "back of skull height", default: 50 },
              { id: "bk3", label: "Voltar / Frente", labelAI: "back of skull depth", default: 50 },
              { id: "bk4", label: "Redondo / Anguloso", labelAI: "back of skull angularity", default: 50 },
              { id: "bk5", label: "Mover Esq. / Dir.", labelAI: "back of skull horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "temples",
        label: "Têmporas",
        groups: [
          {
            id: "temples-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "tp1", label: "Fino / Ampliar", labelAI: "temples width", default: 50 },
              { id: "tp2", label: "Baixo / Cima", labelAI: "temples height", default: 50 },
              { id: "tp3", label: "Voltar / Frente", labelAI: "temples depth", default: 50 },
              { id: "tp4", label: "Redondo / Anguloso", labelAI: "temples angularity", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. TESTA
  // ==========================================
  {
    id: "forehead",
    label: "Testa",
    subTabs: [
      {
        id: "upper-forehead",
        label: "Parte superior da testa",
        groups: [
          {
            id: "upper-forehead-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "uf1", label: "Fino / Ampliar", labelAI: "forehead upper part width", default: 50 },
              { id: "uf2", label: "Voltar / Frente", labelAI: "forehead upper part depth", default: 50 },
              { id: "uf3", label: "Neutro / Cima", labelAI: "forehead upper part height", default: 50 },
              { id: "uf4", label: "Redondo / Anguloso", labelAI: "forehead upper part angularity", default: 50 },
              { id: "uf5", label: "Mover Esq. / Dir.", labelAI: "forehead upper part horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "lower-forehead",
        label: "Parte inferior da testa",
        groups: [
          {
            id: "lower-forehead-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "lf1", label: "Fino / Ampliar", labelAI: "forehead lower part width", default: 50 },
              { id: "lf2", label: "Baixo / Cima", labelAI: "forehead lower part height", default: 50 },
              { id: "lf3", label: "Voltar / Frente", labelAI: "forehead lower part depth", default: 50 },
              { id: "lf4", label: "Redondo / Anguloso", labelAI: "forehead lower part angularity", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. SOBRANCELHAS
  // ==========================================
  {
    id: "eyebrows",
    label: "Sobrancelhas",
    subTabs: [
      {
        id: "eyebrows-main",
        label: "Sobrancelhas",
        groups: [
          {
            id: "eyebrows-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "eb1", label: "Fino / Ampliar", labelAI: "eyebrows thickness", default: 50 },
              { id: "eb2", label: "Baixo / Cima", labelAI: "eyebrows height", default: 50 },
              { id: "eb3", label: "Voltar / Frente", labelAI: "eyebrows depth", default: 50 },
              { id: "eb4", label: "Redondo / Anguloso", labelAI: "eyebrows angularity", default: 50 }
            ]
          }
        ]
      },
      {
        id: "eyebrows-center",
        label: "Centro das sobrancelhas",
        groups: [
          {
            id: "eyebrows-center-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "ebc1", label: "Fino / Ampliar", labelAI: "eyebrows center width", default: 50 },
              { id: "ebc2", label: "Baixo / Cima", labelAI: "eyebrows center height", default: 50 },
              { id: "ebc3", label: "Voltar / Frente", labelAI: "eyebrows center depth", default: 50 },
              { id: "ebc4", label: "Redondo / Anguloso", labelAI: "eyebrows center angularity", default: 50 },
              { id: "ebc5", label: "Mover Esq. / Dir.", labelAI: "eyebrows center horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "eyebrows-outer-upper",
        label: "Parte externa sup. da sobrancelha",
        groups: [
          {
            id: "eyebrows-outer-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "ebo1", label: "Fino / Ampliar", labelAI: "outer eyebrows thickness", default: 50 },
              { id: "ebo2", label: "Baixo / Cima", labelAI: "outer eyebrows height", default: 50 },
              { id: "ebo3", label: "Voltar / Frente", labelAI: "outer eyebrows depth", default: 50 },
              { id: "ebo4", label: "Redondo / Anguloso", labelAI: "outer eyebrows angularity", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 4. OLHOS
  // ==========================================
  {
    id: "eyes",
    label: "Olhos",
    subTabs: [
      {
        id: "eyes-main",
        label: "Olhos",
        groups: [
          {
            id: "eyes-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "e1", label: "Fino / Ampliar", labelAI: "eyes width or distance", default: 50 },
              { id: "e2", label: "Baixo / Cima", labelAI: "eyes height", default: 50 },
              { id: "e3", label: "Voltar / Frente", labelAI: "eyes depth", default: 50 },
              { id: "e4", label: "Maior / Menor", labelAI: "eyes size", default: 50 }
            ]
          }
        ]
      },
      {
        id: "eye-sockets",
        label: "Órbitas",
        groups: [
          {
            id: "eye-sockets-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "os1", label: "Fino / Ampliar", labelAI: "eye sockets width", default: 50 },
              { id: "os2", label: "Baixo / Cima", labelAI: "eye sockets height", default: 50 },
              { id: "os3", label: "Voltar / Frente", labelAI: "eye sockets depth", default: 50 },
              { id: "os4", label: "Maior / Menor", labelAI: "eye sockets size", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 5. ORELHAS
  // ==========================================
  {
    id: "ears",
    label: "Orelhas",
    subTabs: [
      {
        id: "ears-main",
        label: "Orelhas",
        groups: [
          {
            id: "ears-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "er1", label: "Fino / Ampliar", labelAI: "ears flare or width", default: 50 },
              { id: "er2", label: "Baixo / Cima", labelAI: "ears height", default: 50 },
              { id: "er3", label: "Voltar / Frente", labelAI: "ears depth", default: 50 },
              { id: "er4", label: "Maior / Menor", labelAI: "ears size", default: 50 },
              { id: "er5", label: "Mover Esq. / Dir.", labelAI: "ears horizontal asymmetry", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 6. NARIZ
  // ==========================================
  {
    id: "nose",
    label: "Nariz",
    subTabs: [
      {
        id: "nose-main",
        label: "Nariz",
        groups: [
          {
            id: "nose-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "n1", label: "Fino / Ampliar", labelAI: "nose width", default: 50 },
              { id: "n2", label: "Baixo / Cima", labelAI: "nose height", default: 50 },
              { id: "n3", label: "Voltar / Frente", labelAI: "nose depth", default: 50 },
              { id: "n4", label: "Redondo / Anguloso", labelAI: "nose angularity", default: 50 },
              { id: "n5", label: "Mover Esq. / Dir.", labelAI: "nose horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "nose-bridge-sides",
        label: "Laterais do dorso nasal",
        groups: [
          {
            id: "nose-bridge-sides-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "nbs1", label: "Fino / Ampliar", labelAI: "sides of nasal bridge width", default: 50 },
              { id: "nbs2", label: "Baixo / Cima", labelAI: "sides of nasal bridge height", default: 50 },
              { id: "nbs3", label: "Voltar / Frente", labelAI: "sides of nasal bridge depth", default: 50 },
              { id: "nbs4", label: "Redondo / Anguloso", labelAI: "sides of nasal bridge angularity", default: 50 }
            ]
          }
        ]
      },
      {
        id: "nose-bridge-center",
        label: "Centro do dorso nasal",
        groups: [
          {
            id: "nose-bridge-center-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "nbc1", label: "Fino / Ampliar", labelAI: "center of nasal bridge width", default: 50 },
              { id: "nbc2", label: "Baixo / Cima", labelAI: "center of nasal bridge height", default: 50 },
              { id: "nbc3", label: "Voltar / Frente", labelAI: "center of nasal bridge depth", default: 50 },
              { id: "nbc4", label: "Redondo / Anguloso", labelAI: "center of nasal bridge angularity", default: 50 },
              { id: "nbc5", label: "Mover Esq. / Dir.", labelAI: "center of nasal bridge horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "nose-bridge-upper",
        label: "Parte superior do dorso nasal",
        groups: [
          {
            id: "nose-bridge-upper-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "nbu1", label: "Fino / Ampliar", labelAI: "upper nasal bridge width", default: 50 },
              { id: "nbu2", label: "Baixo / Cima", labelAI: "upper nasal bridge height", default: 50 },
              { id: "nbu3", label: "Voltar / Frente", labelAI: "upper nasal bridge depth", default: 50 },
              { id: "nbu4", label: "Redondo / Anguloso", labelAI: "upper nasal bridge angularity", default: 50 },
              { id: "nbu5", label: "Mover Esq. / Dir.", labelAI: "upper nasal bridge horizontal asymmetry", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 7. BOCHECHAS
  // ==========================================
  {
    id: "cheeks",
    label: "Bochechas",
    subTabs: [
      {
        id: "cheeks-main",
        label: "Bochechas",
        groups: [
          {
            id: "cheeks-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "ch1", label: "Fino / Ampliar", labelAI: "cheeks width or fullness", default: 50 },
              { id: "ch2", label: "Baixo / Cima", labelAI: "cheeks height", default: 50 },
              { id: "ch3", label: "Voltar / Frente", labelAI: "cheeks depth or protrusion", default: 50 },
              { id: "ch4", label: "Redondo / Anguloso", labelAI: "cheeks angularity", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 8. BOCA
  // ==========================================
  {
    id: "mouth",
    label: "Boca",
    subTabs: [
      {
        id: "mouth-main",
        label: "Boca",
        groups: [
          {
            id: "mouth-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "m1", label: "Fino / Ampliar", labelAI: "mouth width", default: 50 },
              { id: "m2", label: "Baixo / Cima", labelAI: "mouth height", default: 50 },
              { id: "m3", label: "Voltar / Frente", labelAI: "mouth depth or protrusion", default: 50 },
              { id: "m4", label: "Redondo / Anguloso", labelAI: "mouth angularity", default: 50 },
              { id: "m5", label: "Mover Esq. / Dir.", labelAI: "mouth horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "mouth-outer-upper",
        label: "Parte superior externa da boca",
        groups: [
          {
            id: "mouth-outer-upper-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "mou1", label: "Fino / Ampliar", labelAI: "outer upper mouth width", default: 50 },
              { id: "mou2", label: "Baixo / Cima", labelAI: "outer upper mouth height", default: 50 },
              { id: "mou3", label: "Voltar / Frente", labelAI: "outer upper mouth depth", default: 50 },
              { id: "mou4", label: "Redondo / Anguloso", labelAI: "outer upper mouth angularity", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 9. QUEIXO
  // ==========================================
  {
    id: "chin",
    label: "Queixo",
    subTabs: [
      {
        id: "chin-main",
        label: "Queixo",
        groups: [
          {
            id: "chin-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "q1", label: "Fino / Ampliar", labelAI: "chin width", default: 50 },
              { id: "q2", label: "Baixo / Cima", labelAI: "chin height", default: 50 },
              { id: "q3", label: "Voltar / Frente", labelAI: "chin depth or protrusion", default: 50 },
              { id: "q4", label: "Redondo / Anguloso", labelAI: "chin angularity", default: 50 },
              { id: "q5", label: "Mover Esq. / Dir.", labelAI: "chin horizontal asymmetry", default: 50 }
            ]
          }
        ]
      },
      {
        id: "chin-upper",
        label: "Parte superior do queixo",
        groups: [
          {
            id: "chin-upper-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "qu1", label: "Fino / Ampliar", labelAI: "upper chin width", default: 50 },
              { id: "qu2", label: "Baixo / Cima", labelAI: "upper chin height", default: 50 },
              { id: "qu3", label: "Voltar / Frente", labelAI: "upper chin depth or protrusion", default: 50 },
              { id: "qu4", label: "Redondo / Anguloso", labelAI: "upper chin angularity", default: 50 },
              { id: "qu5", label: "Mover Esq. / Dir.", labelAI: "upper chin horizontal asymmetry", default: 50 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 10. MAXILAR
  // ==========================================
  {
    id: "jaw",
    label: "Maxilar",
    subTabs: [
      {
        id: "jaw-main",
        label: "Maxilar",
        groups: [
          {
            id: "jaw-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "j1", label: "Fino / Ampliar", labelAI: "jaw width", default: 50 },
              { id: "j2", label: "Baixo / Cima", labelAI: "jaw height", default: 50 },
              { id: "j3", label: "Voltar / Frente", labelAI: "jaw depth or protrusion", default: 50 },
              { id: "j4", label: "Redondo / Anguloso", labelAI: "jaw angularity", default: 50 }
            ]
          }
        ]
      },
      {
        id: "jaw-inner-upper",
        label: "Parte superior interna do maxilar",
        groups: [
          {
            id: "jaw-inner-upper-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "jiu1", label: "Fino / Ampliar", labelAI: "inner upper jaw width", default: 50 },
              { id: "jiu2", label: "Baixo / Cima", labelAI: "inner upper jaw height", default: 50 },
              { id: "jiu3", label: "Voltar / Frente", labelAI: "inner upper jaw depth", default: 50 },
              { id: "jiu4", label: "Redondo / Anguloso", labelAI: "inner upper jaw angularity", default: 50 }
            ]
          }
        ]
      },
      {
        id: "jaw-inner-lower",
        label: "Parte inferior interna do maxilar",
        groups: [
          {
            id: "jaw-inner-lower-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "jil1", label: "Fino / Ampliar", labelAI: "inner lower jaw width", default: 50 },
              { id: "jil2", label: "Baixo / Cima", labelAI: "inner lower jaw height", default: 50 },
              { id: "jil3", label: "Voltar / Frente", labelAI: "inner lower jaw depth", default: 50 },
              { id: "jil4", label: "Redondo / Anguloso", labelAI: "inner lower jaw angularity", default: 50 }
            ]
          }
        ]
      }
    ]
  }
];