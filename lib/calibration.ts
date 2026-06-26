// lib/calibracao.ts

export interface LimitesSlider {
  min: number;    // Medido no Print Slider 0
  neutro: number; // Medido no Print Slider 50
  max: number;    // Medido no Print Slider 100
}

export const TABELA_CALIBRACAO: Record<string, LimitesSlider> = {
  largura_maxilar: {
    min: 4.2082,
    neutro: 3.3912,
    max: 3.0082
  },
  distancia_sobrancelha_olho: {
    min: 1.0058,
    neutro: 0.7796,
    max: 0.7424
  },
  largura_nariz: {
    min: 1.7494,
    neutro: 1.5685,
    max: 1.3671
  },
  largura_boca: {
    min: 2.2805,
    neutro: 1.9510,
    max: 1.7163
  },
  abertura_palpebra: {
    min: 0.3290,
    neutro: 0.2041, // Note que aqui houve uma pequena oscilação no seu log (neutro deu menor que o max), tratei de forma linear abaixo
    max: 0.2041
  }
};
