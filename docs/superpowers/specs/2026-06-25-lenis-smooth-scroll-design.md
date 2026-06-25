# Lenis smooth scroll — Diseño

> Reemplaza la parte de "partículas reactivas a Lenis" del spec viejo `2026-06-12-particle-background-lenis-design.md` (las partículas quedaron 100% autónomas, sin reaccionar a scroll/mouse — ver `2026-06-25-hero-particle-background-design.md`). La arquitectura de `LenisProvider` + integración GSAP/ScrollTrigger de ese spec viejo sigue siendo válida y es la base de este documento.

## Contexto

Último paso del roadmap de la auditoría 7.3→9/10 (después de Three.js partículas y el replay del Hero con ScrollTrigger). Es el paso de mayor riesgo identificado desde el principio: Lenis puede chocar con el lock de scroll del modal de Servicios (`ServiciosSection.tsx`, hoy implementado solo con `document.body.style.overflow`) y con los `ScrollTrigger` ya existentes (columnas de Servicios, replay del Hero).

Lenis instalado: `@studio-freight/lenis@1.0.42`. API confirmada en `node_modules/@studio-freight/lenis/dist/types/index.d.ts`: `start()`, `stop()`, `raf(time)`, `on(event, cb)`, `destroy()`, `resize()`, opciones `smoothWheel`/`syncTouch`/etc.

## Decisiones acordadas

- **Touch casi nativo:** `syncTouch: false` (default de Lenis) — en mobile el scroll se siente igual que hoy; Lenis solo agrega inercia suave al wheel/trackpad de desktop. Prioridad mobile-first del proyecto.
- **Respeta `prefers-reduced-motion`:** si está activo, Lenis no se instancia en absoluto — el sitio queda con scroll 100% nativo del navegador, consistente con el resto del proyecto (Hero/Servicios/CTA Final ya respetan esta preferencia).
- **Un solo Context global**, expuesto vía hook `useLenis()`, para que `ServiciosSection` pueda llamar `lenis.stop()/start()` al abrir/cerrar el modal.

## Arquitectura

Archivo nuevo: `app/components/LenisProvider.tsx` (`'use client'`).

```tsx
const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    try {
      const instance = new Lenis({ smoothWheel: true, syncTouch: false });
      setLenis(instance);

      instance.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();

      return () => {
        gsap.ticker.remove(raf);
        instance.destroy();
        setLenis(null);
      };
    } catch (err) {
      console.error('[LenisProvider] Error al inicializar Lenis:', err);
    }
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

`app/layout.tsx`: envuelve `{children}` dentro de `<body>` con `<LenisProvider>`. No requiere `dynamic(..., { ssr: false })` — Lenis solo usa `window` dentro de `useEffect` (a diferencia de Three.js, que necesita acceso a `window`/`canvas` durante el render inicial del módulo).

## Integración GSAP + ScrollTrigger

- `lenis.on('scroll', ScrollTrigger.update)`: cada vez que Lenis mueve el scroll, fuerza a ScrollTrigger a recalcular — evita desfases con los triggers ya existentes (Hero replay, columnas de Servicios).
- `gsap.ticker.add(raf)` + `gsap.ticker.lagSmoothing(0)`: patrón oficial de integración Lenis+GSAP — un solo loop de animación maneja tanto el RAF de Lenis como las animaciones de GSAP, evitando dos loops independientes desincronizados.
- `ScrollTrigger.refresh()` una vez al crear la instancia, para recalcular posiciones con el layout ya montado.
- Ningún `ScrollTrigger` existente (Hero, Servicios) se modifica — siguen funcionando igual porque Lenis mueve el scroll nativo real (`window.scrollY`), no un wrapper/transform custom.

## Fix del lock de scroll en el modal de Servicios

`ServiciosSection.tsx` (~línea 260) pasa de:
```tsx
useEffect(() => {
  document.body.style.overflow = activo ? 'hidden' : '';
  return () => { document.body.style.overflow = ''; };
}, [activo]);
```
a:
```tsx
const lenis = useLenis();

useEffect(() => {
  document.body.style.overflow = activo ? 'hidden' : '';
  if (activo) lenis?.stop(); else lenis?.start();
  return () => {
    document.body.style.overflow = '';
    lenis?.start();
  };
}, [activo, lenis]);
```
El `overflow:hidden` se mantiene como respaldo (cubre el caso sin Lenis: reduced motion o fallo de inicialización); `lenis.stop()/start()` es el control real para cuando Lenis está activo, ya que el lock por CSS solo no es suficiente — Lenis puede seguir moviendo el scroll mediante su propio loop sin depender de `overflow` en `body`.

## Manejo de errores y cleanup

- `try/catch` alrededor de la creación de la instancia — si falla, `console.error` y el sitio sigue con scroll nativo (Context devuelve `null`, todos los `lenis?.` quedan como no-op).
- Cleanup en `useEffect` return: `gsap.ticker.remove(raf)`, `lenis.destroy()`, reset del estado del Context.

## Fuera de alcance

- Reactividad de las partículas Three.js al scroll de Lenis (decisión ya tomada: partículas 100% autónomas).
- Scroll-to-anchor / `lenis.scrollTo()` — no hay links de anclaje (`href="#..."`) en el proyecto actualmente, no aplica.

## Verificación

1. `npm run build` sin errores.
2. Scroll en desktop (mouse wheel): inercia suave, no abrupta.
3. Scroll en mobile (390px, touch real o emulado): se siente igual que antes, sin lag.
4. Abrir el modal de un servicio e intentar scrollear el fondo — no debe moverse.
5. Cerrar el modal — el scroll de la página vuelve a funcionar normal.
6. Confirmar que los `ScrollTrigger` existentes (columnas Servicios, replay Hero) siguen disparando correctamente con Lenis activo.
7. DevTools `prefers-reduced-motion: reduce`: scroll nativo (sin Lenis), modal sigue bloqueando el fondo vía el `overflow:hidden` de respaldo.
