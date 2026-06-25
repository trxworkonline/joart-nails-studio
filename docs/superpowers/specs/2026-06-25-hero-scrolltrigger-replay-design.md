# Hero — reanimar entrada con ScrollTrigger (replay al volver) — Diseño

## Contexto

Roadmap de la auditoría 7.3→9/10: "SVG botanicals animados al hacer scroll". El proyecto solo tiene 2 SVG (`flores-hero-final.svg`, `mano-hero-final.svg`), ambos ya usados y animados (draw-on/clip-path reveal) en el Hero, pero disparados una sola vez al montar el componente, no por scroll.

Se descartó crear un divisor botánico nuevo o reusar las flores en el CTA Final — el usuario tiene una idea propia de un SVG distinto para esa sección (aún sin construir, queda pendiente como tarea futura separada). El alcance acordado para este paso: convertir el trigger de la animación de entrada existente del Hero de "una vez al montar" a `ScrollTrigger`, para que se repita si el usuario vuelve a subir al Hero después de bajar.

## Cambio

Acotado 100% a `app/components/Hero.tsx`:

1. Nuevo `heroRef = useRef<HTMLElement>(null)` en la `<section>` del Hero (hoy no tiene ref propio).
2. `import { ScrollTrigger } from 'gsap/ScrollTrigger'` + `gsap.registerPlugin(ScrollTrigger)` (mismo patrón ya usado en `ServiciosSection.tsx`).
3. El `gsap.timeline()` existente (logo fade → flores draw-on → texto slide-up → CTA scale-in → mano reveal) pasa a `gsap.timeline({ scrollTrigger: { trigger: heroRef.current, start: 'top 80%', toggleActions: 'restart none restart none' } })`. Ninguna tween individual cambia.
4. Cleanup: además de `tlRef.current?.kill()`, se llama `tlRef.current?.scrollTrigger?.kill()` (matar el timeline no mata automáticamente su ScrollTrigger asociado).
5. El branch de `prefers-reduced-motion` no se toca — sigue aplicando el estado final sin animar, sin ScrollTrigger.

## Por qué este `start`/`toggleActions`

- `start: 'top 80%'`: en la carga inicial el Hero ya está en viewport (su top está en 0, por debajo del 80% del alto del viewport), así que `ScrollTrigger` lo detecta como "ya activo" al crearse y dispara `onEnter` de inmediato — visualmente idéntico al comportamiento actual de "animar al montar".
- `toggleActions: 'restart none restart none'`: `onEnter: restart` (carga inicial), `onLeave: none` (al bajar, queda en su estado final, no se reversa), `onEnterBack: restart` (al volver a subir al Hero, se repite desde cero), `onLeaveBack: none` (no aplica, el Hero es la primera sección).
- Las tweens `.to()` (logo, flores, texto, CTA) cachean su valor inicial la primera vez que se renderizan; `.fromTo()` (mano) declara su valor inicial explícito. Un `restart` del timeline reproduce ambos casos correctamente sin necesitar resetear nada a mano.

## Fuera de alcance

- Crear el SVG nuevo para CTA Final (pendiente, el usuario lo va a definir más adelante).
- Cualquier cambio a Servicios/Testimonios/CTA Final.

## Verificación

1. `npm run build` sin errores.
2. `npm run dev`: confirmar que la animación de entrada se ve igual que antes al cargar la página.
3. Scroll manual: bajar hasta Servicios/CTA y volver a subir al Hero — confirmar que la secuencia (logo, flores, texto, CTA, mano) se repite desde cero.
4. DevTools `prefers-reduced-motion: reduce`: confirmar que el Hero sigue mostrando el estado final sin animar, sin que aparezca ningún error de ScrollTrigger en consola.
