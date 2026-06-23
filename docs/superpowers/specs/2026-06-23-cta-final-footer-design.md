# CTA Final + Footer — Diseño

## Contexto

`_context/PROYECTO.md` define la 3ra sección de la web como "CTA Final + Footer — Instagram CTA + datos de contacto". Hoy `app/page.tsx` renderiza `Hero`, `ServiciosSection` y `TestimoniosSection`; esta es la última sección pendiente para considerar el sitio completo.

Joan (dueño/desarrollador, no la clienta) ya tiene listas las dos imágenes botón ("esmaltes") que Joali iba a pintar — `WhatssapE.png` e `InstagramE.png`, ambas en `OneDrive/Desktop/JoArt-Web/Elementos Visuales/`. Son ilustraciones de línea fina (mismo estilo que la mano/flores del Hero: trazo color `#A07860`, fondo realmente transparente — verificado leyendo el canal alfa con `System.Drawing`, esquinas en `A=0`).

**Problema detectado al inspeccionar los PNG:** el frasco de WhatsApp tiene relleno café semi-opaco (`A≈171`, RGB≈`117,92,74`, cercano a `#A07860`) que se distingue bien sobre el fondo. El frasco de Instagram tiene relleno **completamente opaco pero casi blanco** (`A=255`, RGB≈`253,248,242` ≈ `#FDF8F2`), prácticamente idéntico al fondo vainilla de toda la página (`--joart-vanilla: #FFF9F4`) — visualmente "desaparece" y no se lee como un botón tocable. De ahí la necesidad explícita del cliente de agregar un tratamiento de fondo que haga que ambas imágenes se vean "entre botón y dibujo", sin tocar el arte original.

## Objetivo

Construir la última sección del sitio: un footer asimétrico con texto + CTA a la izquierda y dos botones-imagen (estilo esmalte de uñas) a la derecha que llevan a WhatsApp e Instagram, con un halo de color detrás de cada uno para que se perciban como botones reales. Cierra con un crédito de autoría enlazado al Instagram personal del desarrollador. Se aprovecha para corregir el número de WhatsApp inconsistente y agregar SEO básico invisible (JSON-LD).

**Alcance:** solo mobile, viewport de referencia 390px — igual que el resto del sitio. No se diseña una versión desktop.

## Arquitectura

### Archivos nuevos

```
app/components/CTAFinalSection.tsx   ('use client' — usa Framer Motion)
app/components/Footer.tsx            (estático, sin 'use client')
public/assets/footer/esmalte-whatsapp.png   (copiado y renombrado desde Elementos Visuales/WhatssapE.png)
public/assets/footer/esmalte-instagram.png  (copiado y renombrado desde Elementos Visuales/InstagramE.png)
```

### Integración en `app/page.tsx`

```tsx
import Hero from './components/Hero';
import ServiciosSection from './components/ServiciosSection';
import TestimoniosSection from './components/TestimoniosSection';
import CTAFinalSection from './components/CTAFinalSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiciosSection />
      <TestimoniosSection />
      <CTAFinalSection />
      <Footer />
    </main>
  );
}
```

## `CTAFinalSection.tsx` — Layout

Contenedor `maxWidth:390px`, `margin:'0 auto'`, padding `96px 24px 64px` (mismo criterio de separación que usa `ServiciosSection` respecto a la sección anterior). Sin `backgroundColor` propio — hereda el vainilla (`--joart-vanilla`) del `body`, igual que `TestimoniosSection`.

Dos columnas asimétricas, `display:flex`, `alignItems:center`, `gap` generoso (~16-20px):

- **Columna texto** (`flex:1`): copy final, alineado a la izquierda.
- **Columna botellas** (`flex:'0 0 auto'`, ancho determinado por el contenido): las dos botellas-botón con profundidad escalonada, anclada al borde derecho del padding de la sección (sin margin-right adicional).

## Botellas-botón — detalle visual

Ambas imágenes con proporción intrínseca `1080:1920` (≈0.5625 ancho:alto), renderizadas con `next/image`.

| | Instagram (frente) | WhatsApp (atrás) |
|---|---|---|
| Ancho | ~92px | ~81px (88% del de Instagram) |
| Alto | ~164px | ~144px |
| Posición | anclada al borde derecho de la columna, `z-index: 2` | desplazada hacia atrás/arriba-izquierda, `translateY(-10px)` aprox., `z-index: 1` |
| Solape de siluetas | — | ~15-18% de su ancho se superpone con Instagram (da el efecto "pegadas" con profundidad) |
| Color del halo | `joart-rose` (`#E8B4C0`) | `joart-blush` (`#F7D9E0`) |

**Halo:** un `<div>` independiente por botella, detrás de la imagen (no se toca el PNG original):
- `position:absolute`, círculo (`aspect-ratio:1`), diámetro ≈1.3× el ancho de su botella (Instagram ~120px, WhatsApp ~105px).
- `background: radial-gradient(circle, <color> 0%, transparent 70%)`.
- `filter: blur(20px)` para difuminar el borde y que se vea como resplandor tipo acuarela, no un círculo de borde duro.
- Centrado horizontalmente sobre la botella; centrado verticalmente al ~65% de la altura de la imagen (donde está el cuerpo real de la botella, no la tapa — la tapa es mayormente transparente/vacía en el canvas de 1920px de alto).
- Como ambos halos son degradados muy difuminados, si llegan a tocarse en el punto de solape se funden en un solo resplandor continuo (no compiten como formas de borde duro) — la profundidad escalonada además separa sus centros en dos ejes, evitando que coincidan del todo.

**Interacción:** cada grupo (halo + imagen) envuelto en `motion.a` de Framer Motion con `whileTap={{ scale: 0.93 }}` — mismo patrón ya usado en las cards de `ServiciosSection`.

## Links

```ts
const waHref = `https://wa.me/56988210335?text=${encodeURIComponent('Hola, vengo de tu web y me gustaría agendar una cita 💅')}`;
const igHref = 'https://instagram.com/joart.cl';
```

El número de WhatsApp es el real de negocio (`56988210335`), igual al que ya usa `ServiciosSection`.

**Nota de alcance:** `Hero.tsx` todavía usa el número viejo `56931924796` (inconsistencia anotada en `_context/MEMORIA.md`). No es parte del diseño de esta sección, pero es un cambio de una sola línea (cambiar el número en `waHref`) que se hace en la misma entrega para no dejar la inconsistencia a medias — se incluye en el plan de implementación, no en "Fuera de alcance".

Ambos `<a>` con `target="_blank" rel="noopener noreferrer"`.

## Copy

```tsx
<h2 className="font-playfair" style={{ color: '#A07860', fontSize: 'clamp(24px, 7.5vw, 30px)', lineHeight: 1.15 }}>
  Sigue el<br/>proceso
</h2>
<p className="font-poppins" style={{ color: '#8B6A6A', fontSize: 14, marginTop: 8 }}>
  Míranos en Instagram<br/>o escríbenos por WhatsApp.
</p>
```

Saltos de línea (`<br/>`) puestos a mano en los puntos elegidos — mismo recurso que ya usa el `<h1>` del Hero ("Joart\<br/\>Nails Studio") — para que nunca quede una palabra huérfana sola en la última línea, dado que la columna de texto es angosta (asimétrica, comparte espacio con las botellas).

## Animación de entrada

Para no dejar la sección "seca" frente al resto del sitio (que sí anima su entrada), toda la sección usa un único `whileInView` de Framer Motion: fade (`opacity 0→1`) + leve subida (`y: 16→0`), sin GSAP ni ScrollTrigger nuevo. Es la única animación de esta sección — no hay timeline adicional.

## `Footer.tsx`

Componente estático, sin animación ni `'use client'`.

```tsx
<footer style={{ textAlign: 'center', padding: '64px 24px 40px' }}>
  <a
    href="https://instagram.com/jmdrade"
    target="_blank"
    rel="noopener noreferrer"
    className="font-poppins"
    style={{ fontSize: 12, color: '#B89090', textDecoration: 'none' }}
  >
    Hecho por CenitDigitalPro
  </a>
</footer>
```

## SEO — JSON-LD `LocalBusiness`

Agregado pequeño e independiente del layout visual (decisión explícita del cliente: incluirlo en este spec para no olvidarlo). No afecta nada visible.

- Vive en `app/layout.tsx` (no en `CTAFinalSection` ni `Footer`, para no atarlo al ciclo de vida de un componente visual) como un `<script type="application/ld+json">` dentro del `<head>`/`<body>`.
- Datos: `name: "JoArt Nails Studio"`, `address.addressLocality: "Ñuñoa"`, `address.addressRegion: "Santiago"` (sin dirección exacta, según restricción ya acordada en `_context/PROYECTO.md`), `telephone: "+56988210335"`, `sameAs: ["https://instagram.com/joart.cl"]`.
- Sin librería nueva — es un objeto JS serializado con `JSON.stringify` dentro de un `<script>`, patrón estándar de Next.js App Router.

## Mobile-first

- Viewport de referencia 390px, único alcance (sin desktop).
- Los anchos de columna no son porcentajes fijos: la columna de botellas mide lo que ocupan las imágenes + halo, la columna de texto toma el resto vía `flex:1` — así no hay que recalcular breakpoints.

## Edge cases / cleanup

- Los PNG ya vienen con transparencia real verificada — no se necesita ningún recorte ni tratamiento de fondo adicional sobre el archivo en sí, solo el halo en CSS detrás.
- `next/image` requiere `width`/`height` explícitos (proporción 0.5625) — no usar `fill` para evitar que el halo y la imagen se desincronicen en tamaño.
- El componente no depende de `ParticleBackground`/Lenis (aún no implementados) — es autocontenido, igual que `TestimoniosSection`.

## Verificación

1. `npm run dev`, revisar en viewport 390px: ambas botellas se ven con su halo de color distinguible, ninguna se "pierde" contra el fondo (en particular la de Instagram, que era el problema original).
2. Confirmar que los halos no se ven como dos círculos compitiendo — deben leerse como un resplandor continuo y suave en la zona de solape.
3. Tocar (tap) cada botella: debe sentirse el `scale` del `whileTap` y abrir el link correcto (`wa.me/56988210335` con el mensaje pre-escrito / `instagram.com/joart.cl`) en una pestaña nueva.
4. Confirmar que el título y subtítulo no cortan ninguna palabra a la mitad ni dejan una palabra sola en la última línea.
5. Tocar el crédito del footer: debe abrir `instagram.com/jmdrade` en pestaña nueva.
6. Verificar el JSON-LD con una herramienta de validación de datos estructurados (o inspeccionando el HTML servido) — no debe alterar nada visible en la página.
7. `npm run build` — debe compilar sin errores de tipos/lint.
8. Revisión visual final de Joan en su dispositivo real (mismo patrón usado para verificar Servicios y Testimonios).

## Fuera de alcance

- Versión desktop/tablet de esta sección.
- Cualquier tratamiento que modifique el PNG original (recortes, recoloreo del relleno de Instagram) — la decisión fue resolverlo con el halo de CSS, sin tocar el arte.
- Fondo Three.js, Lenis smooth scroll, SVG botanicals animados, globo de chat — siguen pendientes y no tienen relación con esta sección.
