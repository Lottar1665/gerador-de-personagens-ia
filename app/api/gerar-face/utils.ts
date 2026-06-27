import { faceParameters } from "@/lib/face-parameters"

// 🧠 FUNÇÃO DE BUSCA CIRÚRGICA POR CHAVE CURTA DE IA
export const buscarValorNoJson = (objeto: any, sliderId: string, sliderLabel: string, labelAI: string): number | undefined => {
  if (!objeto || typeof objeto !== 'object') return undefined;

  // Limpa os identificadores passados pelo loop de montagem
  const cleanId = sliderId?.toString().trim();

  // 1. Pesca direta pelo ID curto (Ex: se cleanId for "sk1", lê objeto["sk1"])
  if (objeto[cleanId] !== undefined && typeof objeto[cleanId] === 'number') {
    return objeto[cleanId];
  }

  // 2. Busca profunda padrão caso haja alguma variação
  for (const key in objeto) {
    if (typeof objeto[key] === 'object') {
      const resultado = buscarValorNoJson(objeto[key], sliderId, sliderLabel, labelAI);
      if (resultado !== undefined) return resultado;
    }
  }
  return undefined;
};


// 🟢 FUNÇÃO DE CONFIGURAÇÃO DE ÁRVORE PADRÃO
export const mapearArvoreBiometrica = (flatSlidersMap: any, slidersMatematicos: Record<string, number>) => {
  const structureResult: any = {};

  faceParameters.forEach((categoryRaw: any) => {
    const category = categoryRaw as any;
    structureResult[category.label] = {};

    if (category.mainTabs && Array.isArray(category.mainTabs)) {
      category.mainTabs.forEach((tab: any) => {
        structureResult[category.label][tab.label] = {};
        if (tab.subTabs && Array.isArray(tab.subTabs)) {
          tab.subTabs.forEach((sub: any) => {
            structureResult[category.label][tab.label][sub.label] = {};
            if (sub.groups && Array.isArray(sub.groups)) {
              sub.groups.forEach((group: any) => {
                structureResult[category.label][tab.label][sub.label][group.label] = {};
                group.sliders?.forEach((slider: any) => {
                  const aiValue = buscarValorNoJson(flatSlidersMap, slider.id, slider.label, slider.labelAI);
                  const mathValue = slidersMatematicos[slider.label?.toLowerCase() || ""];
                  structureResult[category.label][tab.label][sub.label][group.label][slider.label] = 
                    typeof mathValue === "number" ? mathValue : (typeof aiValue === "number" ? aiValue : (slider.default ?? 50));
                });
              });
            }
          });
        }
      });
    } 
    else if (category.subTabs && Array.isArray(category.subTabs)) {
      category.subTabs.forEach((sub: any) => {
        structureResult[category.label][sub.label] = {};
        if (sub.groups && Array.isArray(sub.groups)) {
          sub.groups.forEach((group: any) => {
            structureResult[category.label][sub.label][group.label] = {};
            group.sliders?.forEach((slider: any) => {
              const aiValue = buscarValorNoJson(flatSlidersMap, slider.id, slider.label, slider.labelAI);
              const mathValue = slidersMatematicos[slider.label?.toLowerCase() || ""];
              structureResult[category.label][sub.label][group.label][slider.label] = 
                typeof mathValue === "number" ? mathValue : (typeof aiValue === "number" ? aiValue : (slider.default ?? 50));
            });
          });
        }
      });
    }
  });

  return structureResult;
};
