import { MainTab } from "@/types/face";

// Função para calcular a distância tridimensional entre dois pontos
function calcularDistancia3D(p1: any, p2: any): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow(p1.z - p2.z, 2)
  );
}

// Converte a proporção geométrica em um slider de 0 a 100
function mapearParaEscala(valor: number, minReal: number, maxReal: number): number {
  const resultado = ((valor - minReal) / (maxReal - minReal)) * 100;
  return Math.min(100, Math.max(0, Math.round(resultado)));
}

export function preencherSlidersComLandmarks(
  landmarks: any[], 
  estruturaOriginal: MainTab[]
): MainTab[] {
  // Cria uma cópia profunda para não quebrar a imutabilidade do React
  const novaEstrutura: MainTab[] = JSON.parse(JSON.stringify(estruturaOriginal));

  // --- MEDIDAS DE REFERÊNCIA BASE DO ROSTO DO USUÁRIO ---
  const orelhaEsq = landmarks[234];
  const orelhaDir = landmarks[454];
  const topoCabeca = landmarks[10];
  const baseQueixo = landmarks[152];

  const larguraRostoRef = calcularDistancia3D(orelhaEsq, orelhaDir);
  const alturaRostoRef = calcularDistancia3D(topoCabeca, baseQueixo);

  // --- VARREDURA DA SUA ESTRUTURA CASCATA ---
  novaEstrutura.forEach((tab) => {
    tab.subTabs.forEach((subTab) => {
      subTab.groups.forEach((group) => {
        group.sliders.forEach((slider) => {
          
          switch (slider.id) {
            // ==========================================
            // TESTA SUPERIOR - LARGURA (id: uf1)
            // ==========================================
            case "uf1": {
              const extremidadeTestaEsq = landmarks[109];
              const extremidadeTestaDir = landmarks[338];
              const larguraTesta = calcularDistancia3D(extremidadeTestaEsq, extremidadeTestaDir);
              
              const proporcao = larguraTesta / larguraRostoRef;
              slider.value = mapearParaEscala(proporcao, 0.50, 0.75);
              break;
            }

            // ==========================================
            // SOBRANCELHAS - ALTURA (id: eb2)
            // ==========================================
            case "eb2": {
              const centroSobrancelha = landmarks[105];
              const centroOlho = landmarks[159];
              const distanciaSobrancelhaOlho = calcularDistancia3D(centroSobrancelha, centroOlho);
              
              const proporcao = distanciaSobrancelhaOlho / alturaRostoRef;
              slider.value = mapearParaEscala(proporcao, 0.04, 0.12);
              break;
            }

            // ==========================================
            // CENTRO DA SOBRANCELHA - LARGURA/AFASTAMENTO (id: ebc1)
            // ==========================================
            case "ebc1": {
              const inicioSobrancelhaEsq = landmarks[55];
              const inicioSobrancelhaDir = landmarks[285];
              const espacoEntreSobrancelhas = calcularDistancia3D(inicioSobrancelhaEsq, inicioSobrancelhaDir);
              
              const proporcao = espacoEntreSobrancelhas / larguraRostoRef;
              slider.value = mapearParaEscala(proporcao, 0.12, 0.22);
              break;
            }

            // Sliders que dependem de perfil 3D (ex: crânio e nuca) iniciam com o padrão 50
            default:
              slider.value = slider.default;
              break;
          }

        });
      });
    });
  });

  return novaEstrutura;
}
