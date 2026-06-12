---
name: joart-svg-botanicals
description: Use when creating or animating the botanical SVG divider, CTA decorations, or the dashed chat bubble for JoArt Nails Studio.
---

# JoArt SVG Botanicals

## Overview
SVGs de línea fina (botanicals) que se dibujan solos al hacer scroll, usados como divisor Hero→Servicios, decoración del CTA final, y el globo de chat con borde dashed.

## Color variables en SVG
Definir el trazo como variable CSS para poder recolorear sin tocar el SVG:
```svg
<svg style="--stroke-color: #7A5040" ...>
  <path stroke="var(--stroke-color)" fill="none" stroke-width="1.5" .../>
</svg>
```
Cambiar `--stroke-color` desde Tailwind (`text-joart-brand` + `stroke-current`) para reusar el mismo SVG en distintos contextos.

## Divisor botánico (Hero → Servicios)
- Rama horizontal con flores, `viewBox` ancho (ej. `0 0 1440 120`), `preserveAspectRatio="xMidYMid meet"`.
- `mix-blend-mode: multiply` si el asset tiene fondo blanco (decisión técnica del proyecto — hace transparente el fondo blanco sobre `joart-vanilla`).

## Elementos decorativos CTA final
- SVGs laterales (ramas/flores), posicionados absolutos en los costados del bloque CTA, `opacity-40` a `opacity-60` para no competir con el texto.

## Globo de chat (borde dashed)
```svg
<rect x="1" y="1" width="W-2" height="H-2" rx="16" ry="16"
      fill="none" stroke="#F2B8C6" stroke-width="2" stroke-dasharray="6 4" />
```
Animación: ver **joart-animations** (typing dots → pop-in con `back.out`).

## Animación stroke-dashoffset (draw-on-scroll)
Patrón completo de implementación GSAP+ScrollTrigger en **joart-animations**. Requisitos del SVG:
- `fill="none"`, `stroke="..."`, `stroke-width` consistente (1.5px línea fina).
- Paths separados por elemento (no un solo `path` gigante) para poder hacer stagger por flor/rama.

## Common Mistakes
- SVG con `fill` en lugar de `stroke` → `stroke-dashoffset` no produce efecto de dibujo.
- Olvidar `mix-blend-mode: multiply` en assets PNG/SVG con fondo blanco → se ve un recuadro blanco sobre `joart-vanilla`.
- Un solo `<path>` para toda la ilustración → la animación de dibujo no se puede stagger por elemento.
