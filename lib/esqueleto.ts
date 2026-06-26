import { MainTab } from './face-parameters'

export const esqueletoParameters: MainTab[] = [
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
  }
]
