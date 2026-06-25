"use client"

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PRESETS = [
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
];

export default function PresetsCarousel() {
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let mounted = true

    fetch("/api/presets")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar presets")
        }
        return response.json()
      })
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data.presets) && data.presets.length > 0) {
          setPresets(data.presets)
          setCurrentIndex(0)
        }
      })
      .catch(() => {
        // Mantém os presets padrão caso a API falhe
      })

    return () => {
      mounted = false
    }
  }, []);


  // Função para avançar (memorizada para o useEffect não se perder)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === presets.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? presets.length - 1 : prev - 1));
  };

  // O motor do Autoplay
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(nextSlide, 3500); // Troca a cada 3.5 segundos
      return () => clearInterval(timer); // Limpa o timer se o componente desmontar
    }
  }, [isHovered, nextSlide]);

  return (
    <div 
      className="relative w-full max-w-sm mx-auto flex flex-col items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="h-[1px] w-8 bg-border"></span>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Inspirações da Comunidade
        </h3>
        <span className="h-[1px] w-8 bg-border"></span>
      </div>

      {/* Container da Imagem com Crossfade */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border bg-muted shadow-lg">
        {presets.map((preset, index) => (
          <div
            key={preset.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {/* Quando tiver suas imagens, troque <img> por <Image> do Next */}
            <img
              src={preset.imagemUrl}
              alt={preset.nome}
              className="w-full h-full object-cover"
            />
            
            {/* Gradiente escuro embaixo para o texto ficar legível */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex flex-col">
              <span className="text-zinc-100 font-bold text-lg drop-shadow-md">
                {preset.nome}
              </span>
              <span className="text-emerald-400 text-xs font-mono">
                {preset.parametros.mandíbula} JAW // {preset.parametros.centro} MID
              </span>
            </div>
          </div>
        ))}

        {/* Botões de Navegação (Aparecem no Hover) */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Indicadores Visuais (Dots) */}
      <div className="flex gap-1.5 mt-4">
        {presets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
            )}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}