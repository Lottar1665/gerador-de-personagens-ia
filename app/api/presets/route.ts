import { NextResponse } from "next/server"

const PRESETS = [
  {
    id: 1,
    nome: "Akemi (Sobrevivente)",
    imagemUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    parametros: { mandíbula: 45, centro: 40 }
  },
  {
    id: 2,
    nome: "Iara (Agente Tática)",
    imagemUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    parametros: { mandíbula: 60, centro: 55 }
  },
  {
    id: 3,
    nome: "Wagner (Operador)",
    imagemUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    parametros: { mandíbula: 50, centro: 65 }
  },
  {
    id: 4,
    nome: "Pro-Player Esports",
    imagemUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    parametros: { mandíbula: 55, centro: 45 }
  }
]

export async function GET() {
  return NextResponse.json({ presets: PRESETS })
}
