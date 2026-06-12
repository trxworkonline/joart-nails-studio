# Fondo de partículas Three.js + Lenis smooth scroll — Diseño

## Contexto

JoArt Nails Studio (`_context/PROYECTO.md`) pide un "fondo Three.js (partículas warm nude)" global, con colores `#F7D9E0` / `#E8B4C0` / blanco, máximo 300 partículas, reactivo a scroll y mouse. El glassmorphism de las cards de servicios (`joart-glassmorphism` skill) necesita ver este fondo a través del blur.

La web es **mobile-first** (`_context/MEMORIA.md`: "Prioridad mobile 390px iPhone — diseño mobile first"): la mayoría de las visitas serán desde celular, así que el fondo y el scroll deben priorizar performance y sensación nativa en touch por sobre efectos de mouse en desktop.

Esta tarea cubre dos piezas que se acoplan necesariamente:
1. **Lenis smooth scroll** global (para que ScrollTrigger de `joart-animations` funcione bien a futuro).
2. **Fondo de partículas Three.js** que reacciona a ese scroll + al mouse (desktop) + animación ambiental.

## Objetivo

Capa de fondo global, full-viewport, detrás de todo el contenido, con:
- Animación ambiental sutil (flotación de partículas).
- Reacción leve a movimiento del mouse (parallax, desktop).
- Reacción leve al scroll (vía Lenis).
- Sin impacto perceptible en performance/batería en mobile (390px).

## Arquitectura

### Archivos nuevos

```
app/components/LenisProvider.tsx   ("use client")
app/components/ParticleBackground.tsx ("use client")
app/components/ParticleScene.tsx   ("use client")
```

### `LenisProvider.tsx`
- Client component que envuelve `{children}` en `app/layout.tsx`.
- Crea una instancia de `Lenis` (`@studio-freight/lenis`) en `useEffect`.
- Corre el loop vía `gsap.ticker.add((time) => lenis.raf(time * 1000))` + `gsap.ticker.lagSmoothing(0)` (integración estándar Lenis+GSAP, necesaria para que `ScrollTrigger` de `joart-animations` funcione correctamente a futuro).
- Conecta `lenis.on('scroll', ScrollTrigger.update)`.
- Configura el comportamiento táctil revisando las opciones de la versión instalada de `@studio-freight/lenis` (p.ej. `syncTouch`/`smoothTouch`) para que el scroll en mobile se sienta nativo, no "amortiguado".
- Expone `{ lenis }` vía React Context para que `ParticleScene` (y futuros componentes) se suscriban.
- Cleanup en `useEffect` return: `lenis.destroy()`, `gsap.ticker.remove(...)`.

### `ParticleBackground.tsx`
- Wrapper simple: `dynamic(() => import('./ParticleScene'), { ssr: false })`.
- Renderiza el canvas como capa `fixed inset-0 -z-10 pointer-events-none`.

### `ParticleScene.tsx`
- Setup de Three.js: `Scene`, `PerspectiveCamera`, `WebGLRenderer`, `Points` (`BufferGeometry` + `PointsMaterial`, `vertexColors: true`).
- **Conteo de partículas adaptativo**: `window.matchMedia('(max-width: 768px)')` → 150 partículas en mobile, 300 en desktop (punto de partida, ajustable visualmente).
- Colores: mezcla aleatoria de `#F7D9E0`, `#E8B4C0`, `#FFFFFF`.
- **DPR cap**: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))`.
- Animación ambiental: pequeña oscilación continua de posición/rotación de las partículas (loop independiente del scroll).
- Parallax de mouse: listener `pointermove` (no-op en touch — no se reemplaza por nada táctil, es un extra de desktop).
- Reacción a scroll: se suscribe a `lenis.on('scroll', ({ scroll, velocity }) => ...)` desde el contexto de `LenisProvider`, mapea a una rotación/traslación sutil de `points`/cámara.
- Pausa el RAF cuando `document.visibilityState === 'hidden'`.
- Cleanup completo en unmount: `dispose()` de geometry/material/renderer, `cancelAnimationFrame`, remove listeners (`resize`, `pointermove`, `visibilitychange`, unsubscribe de `lenis.on('scroll', ...)`).

### `app/layout.tsx`
```tsx
<body className={...}>
  <LenisProvider>
    <ParticleBackground />
    {children}
  </LenisProvider>
</body>
```

## Data flow

```
LenisProvider crea Lenis ──► gsap.ticker (raf) ──► lenis.on('scroll', ScrollTrigger.update)
        │
        └─ Context { lenis } ──► ParticleScene.useEffect:
                                     lenis.on('scroll', ({scroll, velocity}) => points.rotation.y += ...)

pointermove (solo desktop) ──► ParticleScene: parallax independiente del scroll
```

## Mobile-first

- Viewport de referencia para verificación: **390px primero**, luego desktop.
- Partículas: ~120-150 (mobile) vs 300 (desktop), vía `matchMedia`.
- DPR cap: 1.5 (mobile) vs 2 (desktop).
- Lenis: configurar para que el touch scroll se sienta nativo (no añadir "smoothing" agresivo en touch).
- Parallax de mouse es un extra de desktop; su ausencia en mobile no afecta la experiencia (no se sustituye por gestos táctiles — fuera de alcance).

## Edge cases / cleanup

- **SSR**: todo Three.js queda detrás de `dynamic(..., { ssr: false })` — evita `window is not defined` en `next build`.
- **Resize**: listener actualiza `renderer.setSize` y `camera.aspect`/`updateProjectionMatrix`.
- **Tab oculta**: pausa el loop de animación de Three.js (Lenis sigue corriendo, es liviano).
- **Unmount/HMR**: dispose de geometry/material/renderer, remove de todos los listeners, `lenis.destroy()`.
- **pointer-events-none** en el canvas: no debe bloquear clicks/taps en contenido futuro (Hero, cards de Servicios).

## Verificación

1. `npm run dev`, abrir en navegador con viewport 390px (DevTools mobile) primero.
2. Confirmar: partículas visibles detrás del contenido placeholder, animación ambiental corriendo, sin errores en consola.
3. Agregar temporalmente `min-h-[200vh]` al placeholder de `app/page.tsx` para tener scroll real, y confirmar que Lenis suaviza el scroll y que el fondo reacciona sutilmente. Este alto extra puede quedar hasta que existan las secciones reales (Hero/Servicios/CTA), que ya aportarán su propio alto.
4. Repetir en viewport desktop, confirmar parallax de mouse.
5. `npm run build` — debe compilar sin errores (verifica que el `ssr: false` funciona).

## Fuera de alcance

- Sustituir el parallax de mouse por gestos táctiles en mobile.
- Animaciones GSAP/ScrollTrigger por sección (eso es `joart-animations`, tarea aparte — esta tarea solo deja la integración Lenis+GSAP lista para que funcione).
- Ajuste fino de color/opacidad/velocidad — se hace por inspección visual durante la implementación, dentro de los rangos ya definidos en `joart-three` skill.
