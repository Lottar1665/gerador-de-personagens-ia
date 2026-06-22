export type Slider = {
  id: string
  label: string
  /** Valor de 0 a 100 */
  value: number
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
export const faceParameters: MainTab[] = [
  {
    id: "cabeca",
    label: "Cabeça",
    subTabs: [
      {
        id: "formato",
        label: "Formato",
        groups: [
          {
            id: "estrutura-craniana",
            label: "Estrutura Craniana",
            defaultOpen: true,
            sliders: [
              { id: "c1", label: "Largura", value: 62 },
              { id: "c2", label: "Altura", value: 48 },
              { id: "c3", label: "Profundidade", value: 55, done: true },
              { id: "c4", label: "Inclinação", value: 40 },
              { id: "c5", label: "Arredondamento", value: 71 },
            ],
          },
          {
            id: "linha-do-cabelo",
            label: "Linha do Cabelo",
            sliders: [
              { id: "c6", label: "Recuo", value: 33 },
              { id: "c7", label: "Densidade", value: 80 },
            ],
          },
        ],
      },
      {
        id: "pele",
        label: "Pele",
        groups: [
          {
            id: "tom",
            label: "Tom da Pele",
            sliders: [
              { id: "c8", label: "Saturação", value: 52 },
              { id: "c9", label: "Brilho", value: 44 },
              { id: "c10", label: "Vermelhidão", value: 38 },
            ],
          },
          {
            id: "textura",
            label: "Textura",
            sliders: [
              { id: "c11", label: "Rugosidade", value: 21 },
              { id: "c12", label: "Poros", value: 35 },
            ],
          },
        ],
      },
      {
        id: "esqueleto",
        label: "Esqueleto",
        groups: [
          {
            id: "macas-do-rosto",
            label: "Maçãs do Rosto",
            sliders: [
              { id: "c13", label: "Altura", value: 58 },
              { id: "c14", label: "Largura", value: 47 },
              { id: "c15", label: "Projeção", value: 63 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "olhos",
    label: "Olhos",
    subTabs: [
      {
        id: "formato",
        label: "Formato",
        groups: [
          {
            id: "globo-ocular",
            label: "Globo Ocular",
            defaultOpen: true,
            sliders: [
              { id: "o1", label: "Tamanho", value: 55 },
              { id: "o2", label: "Largura", value: 49 },
              { id: "o3", label: "Profundidade", value: 42, done: true },
              { id: "o4", label: "Rotação", value: 38 },
            ],
          },
          {
            id: "palpebras",
            label: "Pálpebras",
            sliders: [
              { id: "o5", label: "Superior", value: 60 },
              { id: "o6", label: "Inferior", value: 44 },
              { id: "o7", label: "Abertura", value: 67 },
            ],
          },
        ],
      },
      {
        id: "posicionamento",
        label: "Posicionamento",
        groups: [
          {
            id: "espacamento",
            label: "Espaçamento",
            sliders: [
              { id: "o8", label: "Distância", value: 50 },
              { id: "o9", label: "Altura", value: 53 },
            ],
          },
        ],
      },
      {
        id: "sobrancelhas",
        label: "Sobrancelhas",
        groups: [
          {
            id: "forma-sobrancelha",
            label: "Forma",
            sliders: [
              { id: "o10", label: "Espessura", value: 41 },
              { id: "o11", label: "Arco", value: 57 },
              { id: "o12", label: "Comprimento", value: 64 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "nariz",
    label: "Nariz",
    subTabs: [
      {
        id: "formato",
        label: "Formato",
        groups: [
          {
            id: "ponte",
            label: "Ponte Nasal",
            defaultOpen: true,
            sliders: [
              { id: "n1", label: "Altura", value: 52 },
              { id: "n2", label: "Largura", value: 38 },
              { id: "n3", label: "Curvatura", value: 45 },
              { id: "n4", label: "Projeção", value: 60, done: true },
            ],
          },
          {
            id: "ponta",
            label: "Ponta do Nariz",
            sliders: [
              { id: "n5", label: "Tamanho", value: 47 },
              { id: "n6", label: "Inclinação", value: 51 },
              { id: "n7", label: "Definição", value: 39 },
            ],
          },
        ],
      },
      {
        id: "esqueleto",
        label: "Esqueleto",
        groups: [
          {
            id: "narinas",
            label: "Narinas",
            sliders: [
              { id: "n8", label: "Largura", value: 43 },
              { id: "n9", label: "Abertura", value: 36 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "boca",
    label: "Boca",
    subTabs: [
      {
        id: "formato",
        label: "Formato",
        groups: [
          {
            id: "labio-superior",
            label: "Lábio Superior",
            defaultOpen: true,
            sliders: [
              { id: "b1", label: "Espessura", value: 54 },
              { id: "b2", label: "Largura", value: 61 },
              { id: "b3", label: "Curvatura", value: 47 },
              { id: "b4", label: "Profundidade", value: 39 },
              { id: "b5", label: "Projeção", value: 58, done: true },
            ],
          },
          {
            id: "labio-inferior",
            label: "Lábio Inferior",
            sliders: [
              { id: "b6", label: "Espessura", value: 49 },
              { id: "b7", label: "Largura", value: 56 },
              { id: "b8", label: "Projeção", value: 44 },
            ],
          },
          {
            id: "cantos-da-boca",
            label: "Cantos da Boca",
            sliders: [
              { id: "b9", label: "Altura", value: 52 },
              { id: "b10", label: "Tensão", value: 35 },
            ],
          },
        ],
      },
      {
        id: "pele",
        label: "Pele",
        groups: [
          {
            id: "tom-labios",
            label: "Tom dos Lábios",
            defaultOpen: true,
            sliders: [
              { id: "b11", label: "Saturação", value: 48 },
              { id: "b12", label: "Brilho", value: 41 },
              { id: "b13", label: "Hidratação", value: 66 },
              { id: "b14", label: "Contorno", value: 53 },
            ],
          },
        ],
      },
      {
        id: "posicionamento",
        label: "Posicionamento",
        groups: [
          {
            id: "altura-boca",
            label: "Altura & Distância",
            sliders: [
              { id: "b15", label: "Altura", value: 50 },
              { id: "b16", label: "Distância do Nariz", value: 57 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "queixo",
    label: "Queixo",
    subTabs: [
      {
        id: "formato",
        label: "Formato",
        groups: [
          {
            id: "estrutura-queixo",
            label: "Estrutura do Queixo",
            defaultOpen: true,
            sliders: [
              { id: "q1", label: "Largura", value: 55 },
              { id: "q2", label: "Altura", value: 48 },
              { id: "q3", label: "Projeção", value: 62, done: true },
              { id: "q4", label: "Definição", value: 51 },
            ],
          },
          {
            id: "mandibula",
            label: "Mandíbula",
            sliders: [
              { id: "q5", label: "Largura", value: 59 },
              { id: "q6", label: "Ângulo", value: 46 },
              { id: "q7", label: "Comprimento", value: 53 },
            ],
          },
        ],
      },
      {
        id: "esqueleto",
        label: "Esqueleto",
        groups: [
          {
            id: "osso-mandibular",
            label: "Osso Mandibular",
            sliders: [
              { id: "q8", label: "Densidade", value: 42 },
              { id: "q9", label: "Projeção Lateral", value: 37 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "avancado",
    label: "Avançado",
    subTabs: [
      {
        id: "esqueleto",
        label: "Esqueleto",
        groups: [
          {
            id: "proporcoes-globais",
            label: "Proporções Globais",
            defaultOpen: true,
            sliders: [
              { id: "a1", label: "Simetria", value: 88 },
              { id: "a2", label: "Densidade Óssea", value: 54 },
              { id: "a3", label: "Volume Facial", value: 47 },
              { id: "a4", label: "Idade Aparente", value: 35 },
              { id: "a5", label: "Massa Muscular", value: 61 },
            ],
          },
        ],
      },
      {
        id: "pele",
        label: "Pele",
        groups: [
          {
            id: "detalhes-pele",
            label: "Detalhes da Pele",
            sliders: [
              { id: "a6", label: "Sardas", value: 12 },
              { id: "a7", label: "Cicatrizes", value: 0 },
              { id: "a8", label: "Rugas", value: 18 },
              { id: "a9", label: "Oleosidade", value: 33 },
            ],
          },
        ],
      },
      {
        id: "posicionamento",
        label: "Posicionamento",
        groups: [
          {
            id: "ajuste-fino",
            label: "Ajuste Fino",
            sliders: [
              { id: "a10", label: "Offset Horizontal", value: 50 },
              { id: "a11", label: "Offset Vertical", value: 50 },
              { id: "a12", label: "Rotação Global", value: 50 },
            ],
          },
        ],
      },
    ],
  },
]
