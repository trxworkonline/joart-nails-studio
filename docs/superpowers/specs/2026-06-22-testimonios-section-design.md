# Sección Testimonios — Diseño

## Contexto

`_context/PROYECTO.md` define la web como 3 secciones (Hero, Servicios, CTA Final + Footer), pero no incluye ningún elemento de prueba social. Joali (la dueña) tiene comentarios reales y orgánicos en Instagram que nunca se reusaron en la web.

Se decidió agregar una cuarta sección, **Testimonios**, entre `<ServiciosSection />` y la futura sección de CTA Final + Footer (aún no construida, `app/page.tsx` hoy solo renderiza `Hero` y `ServiciosSection`).

**Restricción ética acordada con el cliente:** no se inventan testimonios ni se atribuyen frases a clientas que no las dijeron, y no se expone nombre/usuario de Instagram de nadie (privacidad). Solo se usan los 7 comentarios reales que el cliente recopiló, mostrados sin atribución personal — la etiqueta de cada tarjeta dice únicamente "Comentario real de Instagram".

## Contenido (texto real, literal)

```ts
const TESTIMONIOS = [
  "hermosas",
  "las quiero",
  "fue un gran servicio y espacio",
  "Esas son las mías",
  "La mejor ❤️❤️❤️❤️❤️",
  "La mejor del mundo mundial <3",
  "Hermosaaaas !! Que seca !!",
] as const;
```

Son 7 frases, largos heterogéneos (de 1 palabra a una oración corta) — el ancho de cada tarjeta se ajusta a su contenido (no hay un ancho fijo uniforme).

## Objetivo

Sección de prueba social honesta, liviana, que se sienta orgánica y no genérica: un marquee horizontal infinito donde las tarjetas de comentarios entran por la izquierda, cruzan el centro (zona de lectura nítida) y se disuelven saliendo por la derecha, con una máscara de degradado en los bordes del contenedor.

## Arquitectura

### Archivo nuevo

```
app/components/TestimoniosSection.tsx   ("use client" — usa hooks/animación si se agrega entrada por scroll)
```

### Integración

`app/page.tsx`:
```tsx
import Hero from './components/Hero';
import ServiciosSection from './components/ServiciosSection';
import TestimoniosSection from './components/TestimoniosSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiciosSection />
      <TestimoniosSection />
    </main>
  );
}
```

### Estructura interna de `TestimoniosSection.tsx`

1. **Título** — `<h2 className="font-playfair">`, texto **"Cariño que nos llegó"**, mismo tratamiento que el h2 de `ServiciosSection` (`fontSize: 'clamp(28px, 7vw, 34px)'`, centrado).
2. **Marquee** — contenedor `overflow:hidden`, ancho completo, con `maskImage`/`WebkitMaskImage: linear-gradient(to right, transparent, black 12%, black 88%, transparent)` para el efecto de disolución en los bordes.
   - Pista interna: `display:flex`, contiene el array de 7 testimonios **duplicado dos veces** (14 tarjetas en el DOM) para que el loop sea perfectamente continuo sin salto visible.
   - Animación vía `@keyframes` en `globals.css` (mismo patrón que `.tarjeta-shine`/`.cta-shine` ya existentes): `translateX(-50%)` → `translateX(0%)`, `animation: testimonios-marquee 40s linear infinite`. Dirección izquierda→derecha (las tarjetas aparecen por la izquierda y se van por la derecha, según lo pedido).
   - `animationPlayState: 'paused'` en `:hover` del contenedor (vía clase CSS, no inline) — pausa solo en desktop con mouse; en mobile no se agrega pausa por touch porque las frases son cortas y se leen sin necesidad de detener el movimiento.
3. **Tarjeta individual** — por cada comentario:
   - Fondo `joart-nude` (o blanco), `border: 1px solid rgba(232,180,192,0.3)` (mismo tono rosa que `joart-glassmorphism` usa como borde — coherente con la paleta aunque aquí no hay blur, porque no hay contenido detrás que justifique glassmorphism real).
   - Ícono de comillas pequeño (`"` o SVG simple) en `#7A5040` (joart-brand), arriba del texto.
   - Texto del comentario en `font-poppins`, color `joart-text`.
   - Atribución fija debajo, chica y en `joart-text-muted`: *"— Comentario real de Instagram"*.
   - `borderRadius: 18-20px`, padding ~20px, `width` por contenido (no fijo) con un `max-width` razonable (~260px) para que las frases largas no estiren demasiado la tarjeta.
4. **Cierre** — párrafo centrado debajo del marquee, sin botón: **"Te esperamos para sumar tu historia"** (font-playfair o poppins italic, a definir visualmente durante la implementación), funciona como puente emocional hacia la futura sección de CTA Final.

## Comportamiento de la animación

```
Pista (14 tarjetas = 7 reales x2) ancho total = 2× ancho de una copia
@keyframes testimonios-marquee {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0%); }
}
.track { animation: testimonios-marquee 40s linear infinite; }
.track:hover { animation-play-state: paused; }  /* solo desktop */
```

Con 7 tarjetas y 40s de ciclo, cada tarjeta pasa por la zona central de lectura cada ~5-6s — ritmo cómodo para frases de 1 a 6 palabras.

## Mobile-first

- Viewport de referencia: 390px primero.
- Tarjetas con ancho por contenido — en mobile se ven 2-3 tarjetas parciales a la vez dentro del viewport, suficiente para que el efecto de "entran/salen" se perciba.
- Sin pausa por touch (decisión consciente, ver arriba) — si en verificación visual se siente necesario, se puede agregar `onTouchStart`/`onTouchEnd` más adelante, pero no es parte de este alcance inicial.
- Sin Framer Motion ni GSAP para el marquee — CSS puro, cero JS de animación, costo de performance mínimo en mobile.

## Edge cases / cleanup

- `prefers-reduced-motion`: agregar `@media (prefers-reduced-motion: reduce) { .track { animation: none; } }` en `globals.css` — accesibilidad básica, el contenido debe seguir siendo legible (estático) si el usuario pidió reducir movimiento.
- Textos con emojis (❤️, <3) deben renderizar bien en `font-poppins` — verificar visualmente, sin tratamiento especial de código necesario (son caracteres normales en el string).
- El componente no depende de `ParticleBackground`/Lenis (aún no implementados) ni de ningún estado global — es autocontenido.

## Verificación

1. `npm run dev`, abrir en viewport 390px primero. Confirmar: las 7 frases (sin duplicados visibles raros) circulan en loop continuo, sin salto perceptible al reiniciar.
2. Confirmar visualmente el efecto de máscara: una tarjeta debe verse nítida en el centro y disolverse (no cortarse abruptamente) cerca de los bordes izquierdo/derecho del contenedor.
3. En desktop, pasar el mouse sobre el marquee y confirmar que se pausa; al sacar el mouse, continúa desde donde quedó (no salta ni reinicia).
4. Confirmar que ninguna tarjeta queda con texto cortado o ícono de comillas mal alineado, especialmente la más larga ("fue un gran servicio y espacio", "Hermosaaaas !! Que seca !!").
5. `npm run build` — debe compilar sin errores de tipos/lint.
6. Revisión visual final de Joan en su dispositivo real (mismo patrón que se usó para verificar el modal de Servicios).

## Fuera de alcance

- Pausa por touch/tap en mobile (se deja como posible mejora futura, no bloquea esta entrega).
- Cualquier testimonio adicional inventado o con nombre/usuario real — explícitamente descartado por motivos éticos y de privacidad.
- Entrada animada por scroll (GSAP ScrollTrigger) del título/cierre — se puede agregar después reusando el patrón ya existente en `ServiciosSection`, pero no es parte de esta spec.
- Construcción de la sección "CTA Final + Footer" — sigue pendiente, fuera de esta tarea.
