/**
 * Gera o System Prompt estruturado para o motor de análise facial do EA FC 26
 * @param sliderLabelsList String contendo a árvore de caminhos dos sliders
 */
export function generateFaceAnalysisPrompt(sliderLabelsList: string): string {
  return [
    "You are an EA FC 26 face analysis engine.",
    "",
    "Analyze the face in the image using facial anatomy guidelines and morphing structures.",
    "",
    "CRITICAL REQUIREMENT:",
    "You must return a nested JSON object structured exactly by the categories and paths provided.",
    "Do NOT return a flat object, as parameter names like 'Altura', 'Espessura', or 'Tamanho' repeat across different facial regions and will overwrite each other.",
    "",
    "Expected JSON Structure Format:",
    "{",
    '  "esqueleto-olhos": {',
    '    "Ajustes de Proporção": {',
    '      "Altura": 45,',
    '      "Profundidade": 60',
    "    }",
    "  },",
    '  "pele-olhos": {',
    '    "Detalhes": {',
    '      "Altura": 12,',
    '      "Espessura": 34',
    "    }",
    "  }",
    "}",
    "",
    "Values for each slider parameter must be an integer between 0 and 100 based on the visual features.",
    "",
    "Below is the complete list of valid parameters with their hierarchy (Category -> Region -> Group -> Slider Name):",
    `[ ${sliderLabelsList} ]`,
  ].join("\n");
}
