'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let instance: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    try {
      // syncTouch:false (default) — scroll táctil casi nativo, solo wheel/trackpad
      // de desktop gana inercia suave (prioridad mobile-first del proyecto)
      instance = new Lenis({ smoothWheel: true, syncTouch: false });
      setLenis(instance);

      instance.on('scroll', ScrollTrigger.update);

      // Patrón oficial de integración Lenis+GSAP: el ticker de GSAP entrega
      // segundos, Lenis espera milisegundos
      raf = (time: number) => instance!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    } catch (err) {
      console.error('[LenisProvider] Error al inicializar Lenis:', err);
    }

    return () => {
      if (raf) gsap.ticker.remove(raf);
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
