// lib/motorMatematico.ts
import { TABELA_CALIBRACAO } from './calibration';

/**
 * Converte a medida da foto do usuário no valor exato do slider do EA FC (0 a 100)
 * tratando a lógica invertida do motor gráfico.
 */
export function converterParaSlider(parametroKey: string, valorUsuario: number): number {
  const limites = TABELA_CALIBRACAO[parametroKey];
  
  if (!limites) return 50; // Neutro de segurança se o parâmetro não existir

  // Caso 1: O valor do usuário está entre o máximo da foto (Slider 0) e o neutro da foto (Slider 50)
  if (valorUsuario >= limites.neutro) {
    if (valorUsuario >= limites.min) return 0;
    
    // Regra de três para mapear o intervalo [limites.neutro, limites.min] para [50, 0]
    const proporcao = (valorUsuario - limites.neutro) / (limites.min - limites.neutro);
    return Math.round(50 - (proporcao * 50));
  } 
  // Caso 2: O valor do usuário está entre o neutro da foto (Slider 50) e o mínimo da foto (Slider 100)
  else {
    if (valorUsuario <= limites.max) return 100;
    
    // Regra de três para mapear o intervalo [limites.max, limites.neutro] para [100, 50]
    const proporcao = (limites.neutro - valorUsuario) / (limites.neutro - limites.max);
    return Math.round(50 + (proporcao * 50));
  }
}
