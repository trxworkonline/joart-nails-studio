# Sección Testimonios — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una sección de testimonios (marquee horizontal infinito en CSS puro con 7 comentarios reales de Instagram) entre `<ServiciosSection />` y la futura sección de CTA Final + Footer.

**Architecture:** Un componente nuevo `app/components/TestimoniosSection.tsx` (cliente, sin estado), con un array hardcodeado de 7 strings reales, renderizado dos veces dentro de una pista flex que anima `translateX` en loop infinito vía `@keyframes` en `globals.css`. Un contenedor con `mask-image` produce el efecto de disolución en los bordes. Cero JS de animación (no Framer Motion, no GSAP) — todo el movimiento es CSS.

**Tech Stack:** Next.js 14 App Router, React (Server/Client Components), Tailwind (solo para `className` de fuentes, el resto inline `style` siguiendo el patrón ya usado en `ServiciosSection.tsx`), CSS puro para la animación.

## Global Constraints

- No hay test runner configurado en este proyecto (`CLAUDE.md`) — la verificación de cada tarea es `npm run build` (type-check + lint) más verificación visual con Playwright (instalado ad-hoc con `npm install --no-save playwright`, ya usado en sesiones anteriores de este mismo proyecto) o revisión manual en `npm run dev`.
- Paleta de colores exacta (de `app/globals.css` / `tailwind.config.ts`): `--joart-vanilla:#FFF9F4`, `--joart-nude:#F5E8DC`, `--joart-rose:#E8B4C0`, `--joart-brand:#7A5040`, `--joart-text:#5C3D3D`, `--joart-text-muted:#B89090`.
- Texto de los 7 testimonios es **literal y real** — no se inventa ni se modifica contenido, no se agrega nombre/usuario de Instagram (privacidad). Ver spec: `docs/superpowers/specs/2026-06-22-testimonios-section-design.md`.
- Copy fijo aprobado: título `"Cariño que nos llegó"`, cierre `"Te esperamos para sumar tu historia"`.
- Mobile-first: verificar siempre primero en viewport 390px de ancho.
- Tras cada tarea completa y funcional: commit en español (convención del proyecto, `CLAUDE.md`). El push final a `main` se hace en la última tarea.

---

### Task 1: Animación CSS del marquee en `globals.css`

**Files:**
- Modify: `app/globals.css` (agregar al final del archivo, después del bloque `@keyframes shine` en la línea 70)

**Interfaces:**
- Produces: clase CSS `.testimonios-track` (con animación aplicada + pausa en `:hover`) y `@keyframes testimonios-marquee`, que la Task 2 usará como `className` en la pista del marquee.

- [ ] **Step 1: Agregar las keyframes y la clase al final de `app/globals.css`**

Agregar este bloque al final del archivo (después de la línea 70, `}` que cierra `@keyframes shine`):

```css

/* Marquee de testimonios — loop infinito izquierda→derecha, pista duplicada x2 */
@keyframes testimonios-marquee {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0%); }
}

.testimonios-track {
  animation: testimonios-marquee 40s linear infinite;
}

.testimonios-track:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .testimonios-track {
    animation: none;
  }
}
```

- [ ] **Step 2: Verificar que el CSS es válido**

Run: `npm run build`
Expected: el build compila sin errores (Next.js valida el CSS global durante el build; un error de sintaxis CSS rompería el build).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: agrega animacion CSS del marquee de testimonios"
```

---

### Task 2: Componente `TestimoniosSection.tsx`

**Files:**
- Create: `app/components/TestimoniosSection.tsx`

**Interfaces:**
- Consumes: clase `.testimonios-track` de Task 1 (debe existir en `app/globals.css` antes de este paso, o el marquee no se moverá).
- Produces: `export default function TestimoniosSection()` — un Server Component (no necesita `"use client"`, no usa hooks ni estado), que la Task 3 importa y renderiza en `app/page.tsx`.

- [ ] **Step 1: Crear el archivo completo**

```tsx
// app/components/TestimoniosSection.tsx

const TESTIMONIOS = [
  "hermosas",
  "las quiero",
  "fue un gran servicio y espacio",
  "Esas son las mías",
  "La mejor ❤️❤️❤️❤️❤️",
  "La mejor del mundo mundial <3",
  "Hermosaaaas !! Que seca !!",
] as const;

function TestimonioCard({ texto }: { texto: string }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 'max-content',
        maxWidth: 260,
        borderRadius: 20,
        padding: 20,
        background: '#F5E8DC',
        border: '1px solid rgba(232,180,192,0.3)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          fontSize: 28,
          lineHeight: 1,
          color: '#7A5040',
          marginBottom: 8,
        }}
      >
        &ldquo;
      </span>
      <p
        className="font-poppins"
        style={{
          fontSize: 15,
          color: '#5C3D3D',
          margin: '0 0 10px 0',
          lineHeight: 1.4,
        }}
      >
        {texto}
      </p>
      <p
        className="font-poppins"
        style={{
          fontSize: 11,
          color: '#B89090',
          margin: 0,
        }}
      >
        — Comentario real de Instagram
      </p>
    </div>
  );
}

export default function TestimoniosSection() {
  const dobleLista = [...TESTIMONIOS, ...TESTIMONIOS];

  return (
    <section style={{ padding: '64px 0', overflow: 'hidden' }}>
      <h2
        className="font-playfair"
        style={{
          fontSize: 'clamp(28px, 7vw, 34px)',
          color: '#5C3D3D',
          textAlign: 'center',
          margin: '0 0 40px 0',
        }}
      >
        Cariño que nos llegó
      </h2>

      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div
          className="testimonios-track"
          style={{
            display: 'flex',
            gap: 16,
            width: 'max-content',
          }}
        >
          {dobleLista.map((texto, i) => (
            <TestimonioCard key={i} texto={texto} />
          ))}
        </div>
      </div>

      <p
        className="font-playfair"
        style={{
          fontSize: 18,
          fontStyle: 'italic',
          color: '#7A5040',
          textAlign: 'center',
          margin: '40px 24px 0 24px',
        }}
      >
        Te esperamos para sumar tu historia
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Verificar tipos y build**

Run: `npm run build`
Expected: compila sin errores de TypeScript/lint (el archivo no se está usando todavía en ninguna página, pero `next build` igual chequea tipos de todos los archivos en `app/`).

- [ ] **Step 3: Commit**

```bash
git add app/components/TestimoniosSection.tsx
git commit -m "feat: crea componente TestimoniosSection con marquee de comentarios reales"
```

---

### Task 3: Integrar en `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `TestimoniosSection` (default export de Task 2).

- [ ] **Step 1: Editar `app/page.tsx` para que quede así**

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

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: compila sin errores, la ruta `/` aparece en el resumen de salida del build (igual que en builds anteriores del proyecto).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integra TestimoniosSection en la pagina principal"
```

---

### Task 4: Verificación visual con Playwright (mobile-first)

**Files:**
- Create temporalmente (NO commitear, borrar al final del paso): `tmp-verify-testimonios.mjs`

**Interfaces:**
- Consumes: la página completa renderizada por `npm run dev` en `http://localhost:3000` (requiere Tasks 1-3 completas).

- [ ] **Step 1: Asegurar que Playwright está disponible**

Run: `ls node_modules/.bin/playwright || npm install --no-save playwright`
Expected: el binario existe (ya se usó en sesiones anteriores de este proyecto) o se instala sin modificar `package.json`.

- [ ] **Step 2: Levantar el dev server limpio**

Run:
```bash
rm -rf .next
(npm run dev > /tmp/dev.log 2>&1 &)
```
Esperar hasta que `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` devuelva `200` (reintentar con `sleep 1` si no).

Nota: si en la sesión ya se corrió `npm run build` justo antes sin borrar `.next`, el dev server puede corromperse (mismo problema ya documentado en `MEMORIA.md` de este proyecto) — por eso el `rm -rf .next` antes de levantar `npm run dev`.

- [ ] **Step 3: Crear y correr el script de verificación**

Crear `tmp-verify-testimonios.mjs`:

```js
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);

const data = await page.evaluate(() => {
  const track = document.querySelector('.testimonios-track');
  if (!track) return { error: 'no-track' };
  const cs = getComputedStyle(track);
  const cards = track.children.length;
  const wrapper = track.parentElement;
  const wrapperCs = getComputedStyle(wrapper);
  return {
    cardCount: cards,                          // debe ser 14 (7 reales x2)
    animationName: cs.animationName,            // debe ser 'testimonios-marquee'
    animationDuration: cs.animationDuration,    // debe ser '40s'
    maskImage: wrapperCs.maskImage || wrapperCs.webkitMaskImage, // debe contener 'linear-gradient'
  };
});
console.log('antes de hover:', JSON.stringify(data));

// simular hover para confirmar pausa
await page.hover('.testimonios-track');
await page.waitForTimeout(200);
const playStateHover = await page.evaluate(() => {
  const track = document.querySelector('.testimonios-track');
  return getComputedStyle(track).animationPlayState;
});
console.log('animationPlayState en hover:', playStateHover); // debe ser 'paused'

await page.screenshot({ path: 'tmp-testimonios.png', fullPage: false });

// confirmar que prefers-reduced-motion desactiva la animacion (accesibilidad, ver spec)
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
const animNameReduced = await page.evaluate(() => {
  const track = document.querySelector('.testimonios-track');
  return getComputedStyle(track).animationName;
});
console.log('animationName con prefers-reduced-motion:', animNameReduced); // debe ser 'none'

await browser.close();
```

Run: `node tmp-verify-testimonios.mjs`

Expected (salida en consola):
```
antes de hover: {"cardCount":14,"animationName":"testimonios-marquee","animationDuration":"40s","maskImage":"linear-gradient..."}
animationPlayState en hover: paused
animationName con prefers-reduced-motion: none
```

- [ ] **Step 4: Revisar el screenshot**

Abrir `tmp-testimonios.png` y confirmar visualmente:
- El título "Cariño que nos llegó" se ve completo y centrado.
- Al menos 2-3 tarjetas son visibles, con el texto legible y el ícono de comillas alineado arriba del texto.
- Los bordes izquierdo/derecho del marquee muestran el efecto de disolución (tarjetas más tenues cerca del borde, no un corte abrupto).
- La línea de cierre "Te esperamos para sumar tu historia" se ve completa, sin botón.
- Ninguna tarjeta tiene texto cortado o desbordado de su caja (revisar especialmente "fue un gran servicio y espacio" y "Hermosaaaas !! Que seca !!", que son las más largas).

Si algo no se ve bien, corregir el estilo correspondiente en `TestimoniosSection.tsx` (Task 2) antes de continuar, y repetir este Task 4 desde el Step 3.

- [ ] **Step 5: Limpiar archivos temporales y detener el servidor**

```bash
rm -f tmp-verify-testimonios.mjs tmp-testimonios.png
```

Detener el proceso de `npm run dev` (en Windows/Git Bash: `taskkill //F //IM node.exe`).

No hay nada que commitear en este Task — es solo verificación.

---

### Task 5: Build final y push

**Files:** ninguno nuevo (verificación final del estado acumulado de Tasks 1-3).

- [ ] **Step 1: Build limpio final**

```bash
rm -rf .next
npm run build
```
Expected: compila sin errores, mismo resumen de rutas que builds anteriores (`/` y `/_not-found`).

- [ ] **Step 2: Revisar el diff completo antes de pushear**

Run: `git log --oneline -5 && git status`
Expected: working tree limpio (todo ya commiteado en Tasks 1-3), los últimos commits son los de este plan.

- [ ] **Step 3: Push**

```bash
git push origin main
```
Expected: push exitoso a `main`, Vercel dispara el auto-deploy.

- [ ] **Step 4: Pedir confirmación visual en dispositivo real**

Avisarle a Joan que revise la sección de Testimonios en su teléfono real una vez que Vercel termine el deploy (mismo patrón ya usado para verificar los fixes del modal de Servicios) — la verificación con Playwright cubre la lógica y un viewport limpio, pero no reemplaza confirmar cómo se ve/lee en un navegador móvil real.

## Fuera de alcance (recordatorio, ver spec)

- Pausa por touch/tap en mobile.
- Testimonios inventados o con nombre/usuario real.
- Animación de entrada por scroll (GSAP ScrollTrigger) del título/cierre.
- La sección de CTA Final + Footer en sí — sigue pendiente, no es parte de este plan.
