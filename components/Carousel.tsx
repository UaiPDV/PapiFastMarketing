import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
  slidesToShow?: number;
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  children, 
  slidesToShow = 3,
  autoPlay = true,
  interval = 5000 
}) => {
  // Converte children para array e filtra nulos/undefined
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  const originalLength = childrenArray.length;
  
  const [visibleSlides, setVisibleSlides] = useState(slidesToShow);
  
  // Se houver poucos itens, não precisa de lógica complexa de loop
  const needsInfinite = originalLength > visibleSlides;
  
  // Estado inicial considera os clones se for infinito
  const [currentIndex, setCurrentIndex] = useState(needsInfinite ? visibleSlides : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Determina quantos slides mostrar baseado na tela
  useEffect(() => {
    const handleResize = () => {
      let newVisibleSlides = 1;
      if (window.innerWidth >= 1024) {
        newVisibleSlides = slidesToShow;
      } else if (window.innerWidth >= 768) {
        // Se pediu 1 (ex: fluxos mobile), mantém 1. Se pediu 3+, baixa pra 2.
        newVisibleSlides = slidesToShow === 1 ? 1 : Math.min(2, slidesToShow);
      }
      setVisibleSlides(newVisibleSlides);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShow]);

  // Reseta o index quando o número de slides visíveis muda para evitar buracos
  useEffect(() => {
    if (needsInfinite) {
       setCurrentIndex(visibleSlides);
    } else {
       setCurrentIndex(0);
    }
  }, [visibleSlides, needsInfinite]);

  // Configura lista estendida (Clones no inicio e fim) para efeito infinito
  const getExtendedSlides = () => {
    if (!needsInfinite) return childrenArray;
    // Clona os últimos 'visibleSlides' para o começo
    const clonesStart = childrenArray.slice(-visibleSlides);
    // Clona os primeiros 'visibleSlides' para o fim
    const clonesEnd = childrenArray.slice(0, visibleSlides);
    return [...clonesStart, ...childrenArray, ...clonesEnd];
  };

  const extendedSlides = getExtendedSlides();

  const next = useCallback(() => {
    if (!needsInfinite) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning, needsInfinite]);

  const prev = useCallback(() => {
    if (!needsInfinite) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning, needsInfinite]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !needsInfinite || isPaused) return;

    const timer = setInterval(() => {
      next();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, needsInfinite, isPaused, next, interval]);

  // Lógica de "Teleporte" (Reset silencioso) quando atinge as bordas clonadas
  const handleTransitionEnd = () => {
    if (!needsInfinite) return;
    setIsTransitioning(false);

    // O comprimento total da lista estendida é: visibleSlides (clones) + original + visibleSlides (clones)
    // Índices válidos "reais" estão entre [visibleSlides] e [visibleSlides + originalLength - 1]

    // Se avançou além do último item real (entrou nos clones do fim)
    if (currentIndex >= originalLength + visibleSlides) {
      // Pula para o primeiro item real (que é visualmente idêntico ao clone do fim)
      setCurrentIndex(visibleSlides);
    } 
    // Se recuou antes do primeiro item real (entrou nos clones do início)
    else if (currentIndex < visibleSlides) {
      // Pula para o último item real
      setCurrentIndex(originalLength + visibleSlides - 1);
    }
  };

  if (originalLength === 0) return null;

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div 
            className="flex"
            style={{ 
              // O container move uma porcentagem baseada em quantos slides cabem na tela.
              // Ex: se cabem 3, cada slide tem 33.33%. Mover 1 index = mover 33.33%.
              transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
              transition: isTransitioning ? 'transform 500ms ease-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((child, index) => (
            <div 
              key={index} 
              style={{ 
                  width: `${100 / visibleSlides}%`, // Largura fixa baseada na tela
                  flexShrink: 0 
              }}
              className="px-3" // Espaçamento entre slides (gutter)
            >
              <div className="h-full">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {needsInfinite && (
        <>
            <button 
                onClick={prev} 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={next} 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                aria-label="Próximo"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </>
      )}
    </div>
  );
};