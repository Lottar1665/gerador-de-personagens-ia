// lib/pele.ts
export const faceParametersPeleChunk = [
  // 🟢 MACRO-REGIÃO 1: CABEÇA
  {
    id: "macro-cabeca",
    label: "Cabeça", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "temples-skin",
        label: "Têmporas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "temples-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p1", label: "Têmporas", labelAI: "temple morphology", default: 25 },
            ],
          },
        ],
      },
    ],
  },

  // 🟢 MACRO-REGIÃO 2: SOBRANCELHAS
  {
    id: "macro-sobrancelhas",
    label: "Sobrancelhas", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "eyebrows-center",
        label: "Centro das sobrancelhas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "eyebrows-center-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p2", label: "Altura", labelAI: "eyebrow center height", default: 47 },
              { id: "p3", label: "Espessura", labelAI: "eyebrow center thickness", default: 16 },
            ],
          },
        ],
      },
      {
        id: "eyebrows-spacing",
        label: "Distância entre sobrancelhas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "eyebrows-spacing-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p4", label: "Altura", labelAI: "eyebrow spacing height", default: 46 },
              { id: "p5", label: "Distância", labelAI: "interbrow distance", default: 73 },
            ],
          },
        ],
      },
    ],
  },

  // 🟢 MACRO-REGIÃO 3: OLHOS
  {
    id: "macro-olhos",
    label: "Olhos", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "eyelid-fold-center",
        label: "Parte central da dobra da pálpebra", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "eyelid-fold-center-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p6", label: "Espessura", labelAI: "central eyelid fold thickness", default: 62 },
              { id: "p7", label: "Altura", labelAI: "central eyelid fold height", default: 50 },
              { id: "p8", label: "Profundidade", labelAI: "central eyelid fold depth", default: 65 },
              { id: "p9", label: "Tamanho", labelAI: "central eyelid fold size", default: 56 },
            ],
          },
        ],
      },
      {
        id: "eyelid-fold-outer",
        label: "Parte externa da dobra da pálpebra", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "eyelid-fold-outer-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p10", label: "Espessura", labelAI: "outer eyelid fold thickness", default: 34 },
              { id: "p11", label: "Altura", labelAI: "outer eyelid fold height", default: 96 },
              { id: "p12", label: "Profundidade", labelAI: "outer eyelid fold depth", default: 47 },
              { id: "p13", label: "Tamanho", labelAI: "outer eyelid fold size", default: 18 },
            ],
          },
        ],
      },
      {
        id: "inner-part-of-the-eyelid-crease",
        label: "Parte interna da dobra da pálpebra", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-part-of-the-eyelid-crease-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p14", label: "Espessura", labelAI: "inner eyelid fold thickness", default: 34 },
              { id: "p15", label: "Altura", labelAI: "inner eyelid fold height", default: 96 },
              { id: "p16", label: "Profundidade", labelAI: "inner eyelid fold depth", default: 47 },
              { id: "p17", label: "Tamanho", labelAI: "inner eyelid fold size", default: 18 },
            ],
          },
        ],
      },
      {
        id: "central-part-of-the-lower-eyelid",
        label: "Parte central da pálpebra inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "central-part-of-the-lower-eyelid-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p18", label: "Espessura", labelAI: "lower eyelid fold thickness", default: 34 },
              { id: "p19", label: "Altura", labelAI: "lower eyelid fold height", default: 96 },
              { id: "p20", label: "Profundidade", labelAI: "lower eyelid fold depth", default: 47 },
              { id: "p21", label: "Tamanho", labelAI: "lower eyelid fold size", default: 18 },
            ],
          },
        ],
      },
      {
        id: "outer-part-of-the-lower-eyelid",
        label: "Parte externa da pálpebra inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-part-of-the-lower-eyelid-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p22", label: "Espessura", labelAI: "outer eyelid fold thickness", default: 34 },
              { id: "p23", label: "Altura", labelAI: "outer eyelid fold height", default: 96 },
              { id: "p24", label: "Profundidade", labelAI: "outer eyelid fold depth", default: 47 },
            ],
          },
        ],
      },
            {
        id: "inner-part-of-the-lower-eyelid",
        label: "Parte interna da pálpebra inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-part-of-the-lower-eyelid-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p25", label: "Fino / Ampliar", labelAI: "inner lower eyelid width narrow expand", default: 56 },
              { id: "p26", label: "Baixo / Cima", labelAI: "inner lower eyelid height position", default: 57 },
              { id: "p27", label: "Maior / Menor", labelAI: "inner lower eyelid scale size", default: 57 },
            ],
          },
        ],
      },
            {
        id: "central-part-of-the-upper-eyelid",
        label: "Parte central da pálpebra superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "central-part-of-the-upper-eyelid-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p28", label: "Fino / Ampliar", labelAI: "central upper eyelid width narrow expand", default: 25 },
              { id: "p29", label: "Baixo / Cima", labelAI: "central upper eyelid height position", default: 72 },
              { id: "p30", label: "Neutro / Frente", labelAI: "central upper eyelid depth projection", default: 0 },
              { id: "p31", label: "Maior / Menor", labelAI: "central upper eyelid scale size", default: 50 },
            ],
          },
        ],
      },
            {
        id: "outer-part-of-the-upper-eyelid",
        label: "Parte externa da pálpebra superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-part-of-the-upper-eyelid-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p32", label: "Fino / Ampliar", labelAI: "outer upper eyelid width narrow expand", default: 35 },
              { id: "p33", label: "Baixo / Cima", labelAI: "outer upper eyelid height position", default: 85 },
              { id: "p34", label: "Maior / Menor", labelAI: "outer upper eyelid scale size", default: 59 },
            ],
          },
        ],
      },
            {
        id: "inner-part-of-the-upper-eyelid",
        label: "Parte interna da pálpebra superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-part-of-the-upper-eyelid-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
                            { id: "p35", label: "Fino / Ampliar", labelAI: "inner upper eyelid width narrow expand", default: 56 },
              { id: "p36", label: "Baixo / Cima", labelAI: "inner upper eyelid height position", default: 44 },
              { id: "p37", label: "Maior / Menor", labelAI: "inner upper eyelid scale size", default: 52 },
            ],
          },
        ],
      },
      {
        id: "outer-part-of-the-eye-corner",
        label: "Parte externa do canto dos olhos", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-part-of-the-eye-corner-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p38", label: "Fino / Ampliar", labelAI: "outer eye corner canthus width narrow expand", default: 49 },
              { id: "p39", label: "Baixo / Cima", labelAI: "outer eye corner canthus height position", default: 77 },
              { id: "p40", label: "Maior / Menor", labelAI: "outer eye corner canthus scale size", default: 17 },
            ],
          },
        ],
      },
      {
        id: "inner-part-of-the-eye-corner",
        label: "Parte interna do canto dos olhos", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-part-of-the-eye-corner-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p41", label: "Fino / Ampliar", labelAI: "inner eye corner canthus width narrow expand", default: 55 },
              { id: "p42", label: "Baixo / Cima", labelAI: "inner eye corner canthus height position", default: 42 },
              { id: "p43", label: "Maior / Menor", labelAI: "inner eye corner canthus scale size", default: 33 },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 🟢 MACRO-REGIÃO 4: ORELHAS
  // ==========================================================================
  {
    id: "macro-orelhas",
    label: "Orelhas", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "outer-upper-part-of-the-ears",
        label: "Parte externa superior das orelhas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-upper-part-of-the-ears-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p44", label: "Fino / Ampliar", labelAI: "outer upper ear helix width narrow expand", default: 63 },
              { id: "p45", label: "Baixo / Cima", labelAI: "outer upper ear helix height position", default: 69 },
              { id: "p46", label: "Voltar / Frente", labelAI: "outer upper ear helix depth projection", default: 83 },
            ],
          },
        ],
      },
            {
        id: "outer-central-part-of-the-ear",
        label: "Parte central exterior da orelha", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-central-part-of-the-ear-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p47", label: "Fino / Ampliar", labelAI: "outer central ear concha width narrow expand", default: 59 },
              { id: "p48", label: "Baixo / Cima", labelAI: "outer central ear concha height position", default: 33 },
              { id: "p49", label: "Voltar / Frente", labelAI: "outer central ear concha depth projection", default: 67 },
            ],
          },
        ],
      },
            {
        id: "outer-lower-part-of-the-ears",
        label: "Parte externa inferior das orelhas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-lower-part-of-the-ears-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p50", label: "Fino / Ampliar", labelAI: "outer lower ear lobe width narrow expand", default: 17 },
              { id: "p51", label: "Baixo / Cima", labelAI: "outer lower ear lobe height position", default: 36 },
              { id: "p52", label: "Voltar / Frente", labelAI: "outer lower ear lobe depth projection", default: 69 },
            ],
          },
        ],
      },
            {
        id: "inner-upper-part-of-the-ear",
        label: "Parte interna superior da orelha", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-upper-part-of-the-ear-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p53", label: "Fino / Ampliar", labelAI: "inner upper ear antihelix width narrow expand", default: 43 },
              { id: "p54", label: "Baixo / Cima", labelAI: "inner upper ear antihelix height position", default: 47 },
              { id: "p55", label: "Voltar / Frente", labelAI: "inner upper ear antihelix depth projection", default: 70 },
            ],
          },
        ],
      },      {
        id: "inner-lower-part-of-the-ear",
        label: "Parte interna inferior da orelha", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-lower-part-of-the-ear-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p56", label: "Fino / Ampliar", labelAI: "inner lower ear antitragus width narrow expand", default: 82 },
              { id: "p57", label: "Baixo / Cima", labelAI: "inner lower ear antitragus height position", default: 70 },
              { id: "p58", label: "Voltar / Frente", labelAI: "inner lower ear antitragus depth projection", default: 70 },
            ],
          },
        ],
      },
            {
        id: "earlobe",
        label: "Lóbulo", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "earlobe-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p59", label: "Fino / Ampliar", labelAI: "earlobe width narrow expand", default: 8 },
              { id: "p60", label: "Baixo / Cima", labelAI: "earlobe height position", default: 44 },
              { id: "p61", label: "Voltar / Frente", labelAI: "earlobe depth projection", default: 95 },
            ],
          },
        ],
      },
            {
        id: "tragus",
        label: "Tragus", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "tragus-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p62", label: "Fino / Ampliar", labelAI: "ear tragus width narrow expand", default: 0 },
              { id: "p63", label: "Baixo / Cima", labelAI: "ear tragus height position", default: 46 },
              { id: "p64", label: "Voltar / Frente", labelAI: "ear tragus depth projection", default: 90 },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 🟢 MACRO-REGIÃO 5: NARIZ
  // ==========================================================================
  {
    id: "macro-nariz",
    label: "Nariz", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "upper-part-of-the-nostrils",
        label: "Parte superior das narinas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-part-of-the-nostrils-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p65", label: "Fino / Ampliar", labelAI: "upper nostrils width narrow expand", default: 42 },
              { id: "p66", label: "Baixo / Cima", labelAI: "upper nostrils height position", default: 50 },
              { id: "p67", label: "Voltar / Frente", labelAI: "upper nostrils depth projection", default: 67 },
              { id: "p68", label: "Redondo / Anguloso", labelAI: "upper nostrils shape round angular definition", default: 20 },
            ],
          },
        ],
      },
            {
        id: "outer-upper-part-of-the-nostrils",
        label: "Parte externa superior das narinas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-upper-part-of-the-nostrils-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p69", label: "Fino / Ampliar", labelAI: "outer upper nostrils width narrow expand", default: 31 },
              { id: "p70", label: "Baixo / Cima", labelAI: "outer upper nostrils height position", default: 83 },
              { id: "p71", label: "Voltar / Frente", labelAI: "outer upper nostrils depth projection", default: 32 },
              { id: "p72", label: "Redondo / Anguloso", labelAI: "outer upper nostrils shape round angular definition", default: 17 },
            ],
          },
        ],
      },
            {
        id: "central-upper-part-of-the-nostrils",
        label: "Parte central superior das narinas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "central-upper-part-of-the-nostrils-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p73", label: "Fino / Ampliar", labelAI: "central upper nostrils width narrow expand", default: 52 },
              { id: "p74", label: "Baixo / Cima", labelAI: "central upper nostrils height position", default: 19 },
              { id: "p75", label: "Voltar / Frente", labelAI: "central upper nostrils depth projection", default: 84 },
              { id: "p76", label: "Redondo / Anguloso", labelAI: "central upper nostrils shape round angular definition", default: 0 },
            ],
          },
        ],
      },
            {
        id: "lower-part-of-the-nostrils",
        label: "Parte inferior das narinas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-part-of-the-nostrils-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p77", label: "Fino / Ampliar", labelAI: "lower nostrils width narrow expand", default: 50 },
              { id: "p78", label: "Baixo / Cima", labelAI: "lower nostrils height position", default: 45 },
              { id: "p79", label: "Voltar / Frente", labelAI: "lower nostrils depth projection", default: 71 },
              { id: "p80", label: "Redondo / Anguloso", labelAI: "lower nostrils shape round angular definition", default: 95 },
            ],
          },
        ],
      },
            {
        id: "outer-lower-part-of-the-nostrils",
        label: "Parte externa inferior das narinas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-lower-part-of-the-nostrils-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p81", label: "Fino / Ampliar", labelAI: "outer lower nostrils width narrow expand", default: 3 },
              { id: "p82", label: "Baixo / Cima", labelAI: "outer lower nostrils height position", default: 98 },
              { id: "p83", label: "Voltar / Frente", labelAI: "outer lower nostrils depth projection", default: 67 },
              { id: "p84", label: "Redondo / Anguloso", labelAI: "outer lower nostrils shape round angular definition", default: 24 },
            ],
          },
        ],
      },
            {
        id: "central-lower-part-of-the-nostrils",
        label: "Parte central inferior das narinas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "central-lower-part-of-the-nostrils-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p85", label: "Fino / Ampliar", labelAI: "central lower nostrils width narrow expand", default: 83 },
              { id: "p86", label: "Baixo / Cima", labelAI: "central lower nostrils height position", default: 87 },
              { id: "p87", label: "Voltar / Frente", labelAI: "central lower nostrils depth projection", default: 14 },
              { id: "p88", label: "Redondo / Anguloso", labelAI: "central lower nostrils shape round angular definition", default: 39 },
            ],
          },
        ],
      },
            {
        id: "upper-part-of-the-nose-tip",
        label: "Parte superior da ponta do nariz", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-part-of-the-nose-tip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p89", label: "Fino / Ampliar", labelAI: "upper nose tip width narrow expand", default: 36 },
              { id: "p90", label: "Baixo / Cima", labelAI: "upper nose tip height position", default: 93 },
              { id: "p91", label: "Voltar / Frente", labelAI: "upper nose tip depth projection", default: 63 },
              { id: "p92", label: "Redondo / Anguloso", labelAI: "upper nose tip shape round angular definition", default: 69 },
              { id: "p93", label: "Mover para a esquerda / Mover para a direita", labelAI: "upper nose tip horizontal shift position", default: 57 },
            ],
          },
        ],
      },
            {
        id: "lower-part-of-the-nose-tip",
        label: "Parte de baixo da ponta do nariz", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-part-of-the-nose-tip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p94", label: "Fino / Ampliar", labelAI: "lower nose tip width narrow expand", default: 43 },
              { id: "p95", label: "Baixo / Cima", labelAI: "lower nose tip height position", default: 12 },
              { id: "p96", label: "Voltar / Frente", labelAI: "lower nose tip depth projection", default: 96 },
              { id: "p97", label: "Redondo / Anguloso", labelAI: "lower nose tip shape round angular definition", default: 10 },
              { id: "p98", label: "Mover para a esquerda / Mover para a direita", labelAI: "lower nose tip horizontal shift position", default: 67 },
            ],
          },
        ],
      },
            {
        id: "bottom-part-of-the-nose-tip",
        label: "Parte inferior da ponta do nariz", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "bottom-part-of-the-nose-tip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p99", label: "Fino / Ampliar", labelAI: "bottom nose tip width narrow expand", default: 41 },
              { id: "p100", label: "Baixo / Cima", labelAI: "bottom nose tip height position", default: 45 },
              { id: "p101", label: "Voltar / Frente", labelAI: "bottom nose tip depth projection", default: 85 },
              { id: "p102", label: "Redondo / Anguloso", labelAI: "bottom nose tip shape round angular definition", default: 82 },
              { id: "p103", label: "Mover para a esquerda / Mover para a direita", labelAI: "bottom nose tip horizontal shift position", default: 58 },
            ],
          },
        ],
      },
        ],
  },

  // ==========================================================================
  // 🟢 MACRO-REGIÃO 6: BOCHECHAS
  // ==========================================================================
  {
    id: "macro-bochechas",
    label: "Bochechas", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "cheeks-general",
        label: "Bochechas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "cheeks-general-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p104", label: "Baixo / Cima", labelAI: "cheekbone height vertical position", default: 81 },
              { id: "p105", label: "Menos / Mais", labelAI: "cheek volume fullness prominence", default: 35 },
            ],
          },
        ],
      },
            {
        id: "outer-upper-cheeks",
        label: "Bochechas externas superiores", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-upper-cheeks-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p106", label: "Menos / Mais", labelAI: "outer upper cheek volume fullness prominence", default: 58 },
            ],
          },
        ],
      },
            {
        id: "inner-upper-part-of-the-eyes-cheek",
        label: "Parte interna superior dos olhos", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-upper-part-of-the-eyes-cheek-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p107", label: "Baixo / Cima", labelAI: "inner upper cheek suborbital height position", default: 65 },
              { id: "p108", label: "Menos / Mais", labelAI: "inner upper cheek suborbital volume fullness", default: 62 },
            ],
          },
        ],
      },
            {
        id: "inner-upper-cheeks",
        label: "Bochechas internas superiores", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "inner-upper-cheeks-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p109", label: "Menos / Mais", labelAI: "inner upper cheek volume fullness prominence", default: 30 },
            ],
          },
        ],
      },
            {
        id: "outer-lower-part-of-the-cheeks",
        label: "Parte externa inferior das bochechas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "outer-lower-part-of-the-cheeks-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p110", label: "Neutro / Menos", labelAI: "outer lower cheek hollow reduction prominence", default: 50 },
            ],
          },
        ],
      },
            {
        id: "lower-part-of-the-inner-cheeks",
        label: "Parte inferior das bochechas internas", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-part-of-the-inner-cheeks-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p111", label: "Neutro / Menos", labelAI: "inner lower cheek reduction prominence", default: 50 },
            ],
          },
        ],
      },
          ],
  },

  // ==========================================================================
  // 🟢 MACRO-REGIÃO 7: BOCA
  // ==========================================================================
  {
    id: "macro-boca",
    label: "Boca", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "mouth-corners",
        label: "Cantos da boca", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "mouth-corners-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p112", label: "Fino / Ampliar", labelAI: "mouth corners width narrow expand", default: 55 },
              { id: "p113", label: "Baixo / Cima", labelAI: "mouth corners height vertical position", default: 76 },
              { id: "p114", label: "Voltar / Frente", labelAI: "mouth corners depth projection", default: 42 },
              { id: "p115", label: "Redondo / Anguloso", labelAI: "mouth corners shape round angular definition", default: 41 },
            ],
          },
        ],
      },
            {
        id: "center-of-the-interlabial-gap",
        label: "Centro da distância entre lábios", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "center-of-the-interlabial-gap-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p116", label: "Fino / Ampliar", labelAI: "center mouth interlabial gap width narrow expand", default: 45 },
              { id: "p117", label: "Baixo / Cima", labelAI: "center mouth interlabial gap height position", default: 50 },
              { id: "p118", label: "Voltar / Frente", labelAI: "center mouth interlabial gap depth projection", default: 21 },
              { id: "p119", label: "Redondo / Anguloso", labelAI: "center mouth interlabial gap shape round angular definition", default: 86 },
            ],
          },
        ],
      },
            {
        id: "sides-of-the-interlabial-gap",
        label: "Laterais da distância entre lábios", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "sides-of-the-interlabial-gap-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p120", label: "Fino / Ampliar", labelAI: "lateral mouth interlabial gap width narrow expand", default: 22 },
              { id: "p121", label: "Baixo / Cima", labelAI: "lateral mouth interlabial gap height position", default: 46 },
              { id: "p122", label: "Voltar / Frente", labelAI: "lateral mouth interlabial gap depth projection", default: 32 },
              { id: "p123", label: "Redondo / Anguloso", labelAI: "lateral mouth interlabial gap shape round angular definition", default: 35 },
            ],
          },
        ],
      },
            {
        id: "upper-center-of-the-upper-lip",
        label: "Centro superior do lábio superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-center-of-the-upper-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p124", label: "Fino / Ampliar", labelAI: "upper center upper lip width narrow expand", default: 16 },
              { id: "p125", label: "Baixo / Cima", labelAI: "upper center upper lip height position", default: 54 },
              { id: "p126", label: "Voltar / Frente", labelAI: "upper center upper lip depth projection", default: 51 },
              { id: "p127", label: "Redondo / Anguloso", labelAI: "upper center upper lip shape round angular definition", default: 25 },
              { id: "p128", label: "Mover para a esquerda / Mover para a direita", labelAI: "upper center upper lip horizontal shift position", default: 69 },
            ],
          },
        ],
      },
            {
        id: "upper-lateral-parts-of-the-upper-lip",
        label: "Laterais superiores do lábio superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-lateral-parts-of-the-upper-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p129", label: "Fino / Ampliar", labelAI: "upper lateral upper lip width narrow expand", default: 58 },
              { id: "p130", label: "Baixo / Cima", labelAI: "upper lateral upper lip height position", default: 62 },
              { id: "p131", label: "Voltar / Frente", labelAI: "upper lateral upper lip depth projection", default: 51 },
              { id: "p132", label: "Redondo / Anguloso", labelAI: "upper lateral upper lip shape round angular definition", default: 50 },
            ],
          },
        ],
      },
            {
        id: "upper-corners-of-the-upper-lip",
        label: "Cantos superiores do lábio superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-corners-of-the-upper-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p133", label: "Fino / Ampliar", labelAI: "upper outer corners upper lip width narrow expand", default: 20 },
              { id: "p134", label: "Baixo / Cima", labelAI: "upper outer corners upper lip height position", default: 66 },
              { id: "p135", label: "Voltar / Frente", labelAI: "upper outer corners upper lip depth projection", default: 47 },
              { id: "p136", label: "Redondo / Anguloso", labelAI: "upper outer corners upper lip shape round angular definition", default: 34 },
            ],
          },
        ],
      },
            {
        id: "lower-central-part-of-the-upper-lip",
        label: "Parte inferior central do lábio superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-central-part-of-the-upper-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p137", label: "Fino / Ampliar", labelAI: "lower center upper lip width narrow expand", default: 93 },
              { id: "p138", label: "Baixo / Cima", labelAI: "lower center upper lip height position", default: 48 },
              { id: "p139", label: "Voltar / Frente", labelAI: "lower center upper lip depth projection", default: 29 },
              { id: "p140", label: "Redondo / Anguloso", labelAI: "lower center upper lip shape round angular definition", default: 38 },
              { id: "p141", label: "Mover para a esquerda / Mover para a direita", labelAI: "lower center upper lip horizontal shift position", default: 61 },
            ],
          },
        ],
      },
            {
        id: "lower-lateral-parts-of-the-upper-lip",
        label: "Laterais inferiores do lábio superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-lateral-parts-of-the-upper-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p142", label: "Fino / Ampliar", labelAI: "lower lateral upper lip width narrow expand", default: 35 },
              { id: "p143", label: "Baixo / Cima", labelAI: "lower lateral upper lip height position", default: 33 },
              { id: "p144", label: "Voltar / Frente", labelAI: "lower lateral upper lip depth projection", default: 30 },
              { id: "p145", label: "Redondo / Anguloso", labelAI: "lower lateral upper lip shape round angular definition", default: 64 },
            ],
          },
        ],
      },
            {
        id: "upper-lip-volume",
        label: "Volume do lábio superior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-lip-volume-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p146", label: "Fino / Ampliar", labelAI: "upper lip fullness volume thickness narrow expand", default: 39 },
              { id: "p147", label: "Baixo / Cima", labelAI: "upper lip fullness volume vertical height position", default: 52 },
              { id: "p148", label: "Voltar / Frente", labelAI: "upper lip fullness volume depth protrusion", default: 42 },
              { id: "p149", label: "Redondo / Anguloso", labelAI: "upper lip fullness volume shape round angular definition", default: 50 },
            ],
          },
        ],
      },
            {
        id: "philtrum",
        label: "Filtro labial", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "philtrum-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p150", label: "Fino / Ampliar", labelAI: "philtrum dimple column width narrow expand", default: 69 },
              { id: "p151", label: "Baixo / Cima", labelAI: "philtrum vertical length height position", default: 87 },
              { id: "p152", label: "Voltar / Frente", labelAI: "philtrum ridge depth projection prominence", default: 100 },
              { id: "p153", label: "Redondo / Anguloso", labelAI: "philtrum definition shape round angular", default: 70 },
              { id: "p154", label: "Mover para a esquerda / Mover para a direita", labelAI: "philtrum horizontal shift deviation position", default: 69 },
            ],
          },
        ],
      },
            {
        id: "lower-lip-volume",
        label: "Volume do lábio inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-lip-volume-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p155", label: "Fino / Ampliar", labelAI: "lower lip fullness volume thickness narrow expand", default: 51 },
              { id: "p156", label: "Baixo / Cima", labelAI: "lower lip fullness volume vertical height position", default: 48 },
              { id: "p157", label: "Voltar / Frente", labelAI: "lower lip fullness volume depth protrusion", default: 26 },
              { id: "p158", label: "Redondo / Anguloso", labelAI: "lower lip fullness volume shape round angular definition", default: 26 },
            ],
          },
        ],
      },
            {
        id: "upper-center-of-the-lower-lip",
        label: "Centro superior do lábio inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-center-of-the-lower-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p159", label: "Fino / Ampliar", labelAI: "upper center lower lip width narrow expand", default: 30 },
              { id: "p160", label: "Baixo / Cima", labelAI: "upper center lower lip height position", default: 35 },
              { id: "p161", label: "Voltar / Frente", labelAI: "upper center lower lip depth projection", default: 16 },
              { id: "p162", label: "Redondo / Anguloso", labelAI: "upper center lower lip shape round angular definition", default: 47 },
              { id: "p163", label: "Mover para a esquerda / Mover para a direita", labelAI: "upper center lower lip horizontal shift position", default: 47 },
            ],
          },
        ],
      },
            {
        id: "upper-lateral-parts-of-the-lower-lip",
        label: "Laterais superiores do lábio inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "upper-lateral-parts-of-the-lower-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p164", label: "Fino / Ampliar", labelAI: "upper lateral lower lip width narrow expand", default: 43 },
              { id: "p165", label: "Baixo / Cima", labelAI: "upper lateral lower lip height position", default: 25 },
              { id: "p166", label: "Voltar / Frente", labelAI: "upper lateral lower lip depth projection", default: 21 },
              { id: "p167", label: "Redondo / Anguloso", labelAI: "upper lateral lower lip shape round angular definition", default: 84 },
            ],
          },
        ],
      },
            {
        id: "lower-central-part-of-the-lower-lip",
        label: "Parte inferior central do lábio inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-central-part-of-the-lower-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p168", label: "Fino / Ampliar", labelAI: "bottom center lower lip width narrow expand", default: 0 },
              { id: "p169", label: "Baixo / Cima", labelAI: "bottom center lower lip height position", default: 62 },
              { id: "p170", label: "Voltar / Frente", labelAI: "bottom center lower lip depth projection", default: 10 },
              { id: "p171", label: "Redondo / Anguloso", labelAI: "bottom center lower lip shape round angular definition", default: 85 },
              { id: "p172", label: "Mover para a esquerda / Mover para a direita", labelAI: "bottom center lower lip horizontal shift position", default: 60 },
            ],
          },
        ],
      },
            {
        id: "lower-lateral-parts-of-the-lower-lip",
        label: "Laterais inferiores do lábio inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-lateral-parts-of-the-lower-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p173", label: "Fino / Ampliar", labelAI: "bottom lateral lower lip width narrow expand", default: 54 },
              { id: "p174", label: "Baixo / Cima", labelAI: "bottom lateral lower lip height position", default: 45 },
              { id: "p175", label: "Voltar / Frente", labelAI: "bottom lateral lower lip depth projection", default: 31 },
              { id: "p176", label: "Redondo / Anguloso", labelAI: "bottom lateral lower lip shape round angular definition", default: 83 },
            ],
          },
        ],
      },
            {
        id: "lower-corners-of-the-lower-lip",
        label: "Cantos inferiores do lábio inferior", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "lower-corners-of-the-lower-lip-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p177", label: "Fino / Ampliar", labelAI: "bottom outer corners lower lip width narrow expand", default: 30 },
              { id: "p178", label: "Baixo / Cima", labelAI: "bottom outer corners lower lip height position", default: 37 },
              { id: "p179", label: "Voltar / Frente", labelAI: "bottom outer corners lower lip depth projection", default: 40 },
              { id: "p180", label: "Redondo / Anguloso", labelAI: "bottom outer corners lower lip shape round angular definition", default: 82 },
            ],
          },
        ],
      },
            {
        id: "mouth-corners-wrinkles",
        label: "Rugas dos cantos da boca", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "mouth-corners-wrinkles-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p181", label: "Neutro / Menos", labelAI: "mouth corners marionette lines wrinkles intensity reduction", default: 50 },
            ],
          },
        ],
      },
      ],
  },

  // ==========================================================================
  // 🟢 MACRO-REGIÃO 8: QUEIXO
  // ==========================================================================
  {
    id: "macro-queixo",
    label: "Queixo", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "chin-dimple",
        label: "Cova do queixo", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "chin-dimple-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p182", label: "Baixo / Cima", labelAI: "chin dimple cleft vertical height position", default: 64 },
              { id: "p183", label: "Mover para a esquerda / Mover para a direita", labelAI: "chin dimple cleft horizontal shift position", default: 42 },
            ],
          },
        ],
      },
            {
        id: "sides-of-the-chin",
        label: "Laterais do queixo", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "sides-of-the-chin-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p184", label: "Neutro / Menos", labelAI: "chin lateral pads width reduction prominence", default: 50 },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 🟢 MACRO-REGIÃO 9: MAXILAR
  // ==========================================================================
  {
    id: "macro-maxilar",
    label: "Maxilar", // Vai para o Carrossel Superior
    subTabs: [
      {
        id: "jaw-general",
        label: "Maxilar", // Vai para o Carrossel Inferior Embutido
        groups: [
          {
            id: "jaw-general-adjustments",
            label: "Ajustes de Proporção",
            defaultOpen: true,
            sliders: [
              { id: "p185", label: "Menos / Mais", labelAI: "jawline mandible bone width prominence", default: 19 },
            ],
          },
        ],
      },
    ],
  },
];