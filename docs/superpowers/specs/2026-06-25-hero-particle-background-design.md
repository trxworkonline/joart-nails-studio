# Fondo de partículas Three.js en el Hero — Diseño

> Reemplaza a `2026-06-12-particle-background-lenis-design.md` (nunca implementado). Ese spec planteaba un fondo global fixed + integración con Lenis + parallax de mouse. Quedó obsoleto: cada sección de la web (Hero, Servicios, Testimonios, CTA) tiene su propio `backgroundColor` sólido y opaco, así que un fondo global fixed quedaría oculto detrás de esos bloques a menos que se vuelvan semi-transparentes — un cambio cruzado de mayor riesgo que no se justifica para esta etapa. Este spec acota el fondo de partículas solo al Hero.

## Contexto

Auditoría SEO/UX del proyecto (nota 7.3/10, sesión 2026-06-24): los cambios de "riesgo cero" ya se implementaron (OG image, JSON-LD, sitemap/robots, área táctil de dots, `prefers-reduced-motion`, shine con `transform`). La siguiente etapa para llegar a 9/10 es Three.js + Lenis + SVG botanicals animados, implementados de uno en uno para aislar riesgo. Este spec cubre el primero: **fondo de partículas Three.js, acotado al Hero**.

## Objetivo

Capa de fondo decorativa dentro del Hero (`app/components/Hero.tsx`), detrás del contenido existente (logo, flores SVG, mano SVG, texto, CTA), con:
- Partículas "warm nude" (`#F7D9E0`, `#E8B4C0`, blanco) dispersas, con glow sutil (additive blending).
- Flotación ambiental autónoma — sin reaccionar a mouse ni scroll (decisión explícita de esta sesión: el Hero es la primera pantalla, poco scroll real dentro de sí mismo, y Lenis todavía no existe en el proyecto).
- Look lento, suave, artístico — coherente con la estética femenina/botánica del resto del sitio. Nada veloz ni brusco.
- Densidad adaptada a mobile vs desktop, sin afectar performance/Lighthouse en 390px.

## Arquitectura

### Archivos nuevos

```
app/components/ParticleBackground.tsx   ("use client")
app/components/ParticleScene.tsx        ("use client")
```

### `ParticleBackground.tsx`
Wrapper mínimo:
```tsx
'use client';
import dynamic from 'next/dynamic';

const ParticleScene = dynamic(() => import('./ParticleScene'), { ssr: false });

export default function ParticleBackground() {
  return <ParticleScene />;
}
```
Necesario porque Three.js usa `window`/`canvas` — debe cargarse solo en cliente.

### `ParticleScene.tsx`
- Canvas `position:absolute; inset:0; z-index:0; pointer-events:none` — vive dentro del Hero, no full-viewport ni fixed.
- Setup Three.js: `Scene`, `PerspectiveCamera`, `WebGLRenderer({ alpha: true })` (alpha para que se vea el `backgroundColor:'#EDE3DC'` del Hero detrás, no un fondo negro de WebGL).
- `BufferGeometry` + `Points` única (un solo draw call) + `PointsMaterial({ vertexColors: true, transparent: true, opacity: ~0.6, blending: THREE.AdditiveBlending })`.
- Conteo fijo al montar (no se recalcula en resize): `window.innerWidth < 768 ? 120 : 300`.
- Colores: mezcla aleatoria por partícula entre `#F7D9E0` / `#E8B4C0` / `#FFFFFF`.
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.

### `Hero.tsx`
Se agrega `<ParticleBackground />` como primer hijo de la `<section>`, antes del resto del contenido existente. No se modifica ningún otro elemento ni z-index existente — todos los elementos actuales (logo, flores, mano, texto, CTA) quedan visualmente por delante por orden natural del DOM.

## Animación — flotación autónoma

- Sin listeners de `pointermove` ni `scroll`. Todo el movimiento ocurre dentro del propio loop de `requestAnimationFrame`.
- Cada partícula recibe al crearse: fase inicial aleatoria (`0..2π`) y período propio (**11s ± 3s aleatorio**, es decir 8–14s).
- En cada frame: `newPos = origenPos + amplitud * Math.sin(elapsed * (2π / periodo) + fase)`, aplicado sobre cada eje del `BufferAttribute` de posición, luego `geometry.attributes.position.needsUpdate = true`.
- Amplitud: ~3–5% del rango de la escena (escena en rango aprox. `-10..10`, por lo que amplitud ≈ `0.3–0.5` unidades) — desplazamiento apenas perceptible, nunca "viaja" por la pantalla.
- Sin `ease` agresivo: función seno pura, movimiento continuo y redondeado.

## Performance, ciclo de vida y accesibilidad

- `document.visibilitychange` → si `document.hidden`, `cancelAnimationFrame`; al volver a visible, reanuda el loop.
- `prefers-reduced-motion: reduce` (vía `window.matchMedia`) → el loop de render sigue montado (para que el canvas no quede en blanco) pero se omite el cálculo de drift; las partículas quedan estáticas en su posición de origen. Mismo patrón que ya usan `.tarjeta-shine`/`.cta-shine`/marquee en `globals.css`.
- `resize`: throttled (ej. vía simple flag + `requestAnimationFrame`), actualiza `renderer.setSize` y `camera.aspect` + `updateProjectionMatrix`. No reconstruye la geometría ni recalcula el conteo de partículas post-mount.
- Cleanup en `useEffect` return: `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`, `cancelAnimationFrame(frameId)`, `removeEventListener('resize', ...)`, `removeEventListener('visibilitychange', ...)`.

## Manejo de errores

Todo el setup de `ParticleScene.tsx` va dentro de un `try/catch` en el `useEffect` (mismo patrón que el fetch de SVGs en `Hero.tsx`). Si falla la creación del contexto WebGL, se hace `console.error` explícito y el componente no renderiza nada — el resto del Hero (logo, flores, mano, texto, CTA) sigue funcionando con normalidad, sin depender del fondo de partículas.

## Fuera de alcance

- Reacción a mouse o scroll (decisión explícita de esta sesión — se evaluará si se agrega más adelante, no en esta iteración).
- Integración con Lenis (Lenis es el último paso del roadmap de la auditoría, todavía no instalado/integrado en el proyecto).
- Fondo global fixed para todas las secciones (ver nota de supersesión arriba).

## Verificación

1. `npm run build` sin errores de TypeScript/lint.
2. `npm run dev`, revisión visual en viewport 390px (mobile, 120 partículas) y un viewport desktop ancho (300 partículas) — confirmar que el drift se ve lento/sutil y no compite con flores/mano.
3. DevTools: emular `prefers-reduced-motion: reduce` y confirmar que las partículas quedan estáticas.
4. Confirmar que no hay overflow de canvas fuera de los límites del Hero, y que no bloquea clicks/taps (CTA, etc. — `pointer-events:none` en el canvas).
5. Verificar en DevTools Memory/Performance que un HMR (guardar el archivo en dev) no acumula renderers/geometrías sin disponer (cleanup correcto).
