---
name: joart-animations
description: Use when adding scroll-triggered animations, animated text reveals, SVG draw-on effects, or interactive button motion to JoArt Nails Studio sections.
---

# JoArt Animations (GSAP + ScrollTrigger + SplitType)

## Overview
Animation patterns specific to JoArt: SVG botanicals that "draw themselves" on scroll, staggered text reveals, hero entrance, chat bubble pop-in, and a magnetic CTA button.

## Setup
```tsx
"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```
Registrar plugins una sola vez por componente cliente que lo necesite.

## Patterns

### SVG botanical draw-on-scroll (stroke-dashoffset)
```tsx
useEffect(() => {
  const paths = svgRef.current!.querySelectorAll("path");
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: { trigger: path, start: "top 80%" },
    });
  });
}, []);
```

### Hero entrance (mano + flores + texto)
Timeline secuencial: flores y mano entran con `opacity`/`y` + stagger, el texto entra después con SplitType.

### SplitType — títulos con stagger desde abajo
```tsx
import SplitType from "split-type";

const split = new SplitType(titleRef.current!, { types: "chars" });
gsap.from(split.chars, {
  y: 40,
  opacity: 0,
  stagger: 0.03,
  duration: 0.6,
  ease: "power3.out",
  scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
});
```

### ScrollTrigger por sección
Cada sección (`Hero`, `Servicios`, `CTAFooter`) registra su propio `ScrollTrigger` con `start: "top 80%"` y `toggleActions: "play none none none"` para que la animación corra una sola vez.

### Globo de chat — typing dots → pop-in con bounce
Timeline: 3 dots con `repeat: -1` y `stagger`, luego al entrar al viewport, `kill()` el loop de dots y animar el globo con `scale: 0 → 1` y `ease: "back.out(1.7)"`.

### Magnetic button (CTA Agendar)
```tsx
function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - left - width / 2) * 0.3;
  const y = (e.clientY - top - height / 2) * 0.3;
  gsap.to(e.currentTarget, { x, y, duration: 0.3, ease: "power2.out" });
}
function onMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
  gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
}
```

## Common Mistakes
- Olvidar `gsap.registerPlugin(ScrollTrigger)` por componente cliente → animaciones no disparan.
- No usar `"use client"` en componentes con GSAP — Next.js App Router los renderiza en servidor por defecto.
- ScrollTrigger sin `revert()`/cleanup en el `return` del `useEffect` → duplica triggers en HMR.
