export const faceParametersPeleChunk = [
  {
    id: "skin-head",
    label: "Pele",
    subTabs: [
      {
        id: "temples-skin",
        label: "Têmporas",
        groups: [
          {
            id: "temples-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              {
                id: "p1",
                label: "Têmporas",
                labelAI: "temple morphology",
                default: 25,
              },
            ],
          },
        ],
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
              {
                id: "p2",
                label: "Altura",
                labelAI: "eyebrow center height",
                default: 47,
              },
              {
                id: "p3",
                label: "Espessura",
                labelAI: "eyebrow center thickness",
                default: 16,
              },
            ],
          },
        ],
      },

      {
        id: "eyebrows-spacing",
        label: "Distância entre sobrancelhas",
        groups: [
          {
            id: "eyebrows-spacing-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              {
                id: "p4",
                label: "Altura",
                labelAI: "eyebrow spacing height",
                default: 46,
              },
              {
                id: "p5",
                label: "Distância",
                labelAI: "interbrow distance",
                default: 73,
              },
            ],
          },
        ],
      },

      {
        id: "eyelid-fold-center",
        label: "Parte central da dobra da pálpebra",
        groups: [
          {
            id: "eyelid-fold-center-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              {
                id: "p6",
                label: "Espessura",
                labelAI: "central eyelid fold thickness",
                default: 62,
              },
              {
                id: "p7",
                label: "Altura",
                labelAI: "central eyelid fold height",
                default: 50,
              },
              {
                id: "p8",
                label: "Profundidade",
                labelAI: "central eyelid fold depth",
                default: 65,
              },
              {
                id: "p9",
                label: "Tamanho",
                labelAI: "central eyelid fold size",
                default: 56,
              },
            ],
          },
        ],
      },

      {
        id: "eyelid-fold-outer",
        label: "Parte externa da dobra da pálpebra",
        groups: [
          {
            id: "eyelid-fold-outer-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              {
                id: "p10",
                label: "Espessura",
                labelAI: "outer eyelid fold thickness",
                default: 34,
              },
              {
                id: "p11",
                label: "Altura",
                labelAI: "outer eyelid fold height",
                default: 96,
              },
              {
                id: "p12",
                label: "Profundidade",
                labelAI: "outer eyelid fold depth",
                default: 47,
              },
              {
                id: "p13",
                label: "Tamanho",
                labelAI: "outer eyelid fold size",
                default: 18,
              },
            ],
          },
        ],
      },
    ],
  },
];
