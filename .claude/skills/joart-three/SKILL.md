---
name: joart-three
description: Use when setting up or adjusting the Three.js particle background for JoArt Nails Studio, including scroll/mouse reactivity and performance limits.
---

# JoArt Three.js Particle Background

## Overview
Fondo WebGL de partículas "warm nude" muy disperso, reactivo a scroll (Lenis) y mouse (parallax), con límite estricto de performance.

## Setup (dynamic import, sin SSR)
```tsx
// app/components/ParticleBackground.tsx
"use client";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./ParticleScene"), { ssr: false });
export default function ParticleBackground() {
  return <Scene />;
}
```
Three.js usa `window`/`canvas` — debe cargarse solo en cliente vía `dynamic(..., { ssr: false })`.

## Particle System
- Colores: `#F7D9E0`, `#E8B4C0`, blanco (`#FFFFFF`) — mezclar aleatoriamente por partícula.
- **Máximo 300 partículas** — usar `BufferGeometry` + `Points`, nunca meshes individuales.
- Tamaño y opacidad bajos (sparse, sutil); `THREE.AdditiveBlending` opcional para glow suave.

```tsx
const geometry = new THREE.BufferGeometry();
const count = 300;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const palette = [0xF7D9E0, 0xE8B4C0, 0xFFFFFF].map((c) => new THREE.Color(c));

for (let i = 0; i < count; i++) {
  positions.set([rand(-10, 10), rand(-10, 10), rand(-10, 10)], i * 3);
  palette[i % palette.length].toArray(colors, i * 3);
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.6 });
const points = new THREE.Points(geometry, material);
```

## Scroll reaction (Lenis)
Suscribirse a `lenis.on("scroll", ({ scroll }) => { ... })` y mapear `scroll` a una rotación/translación sutil de `points.rotation.y` o `camera.position`.

## Mouse parallax
```tsx
function onPointerMove(e: PointerEvent) {
  const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
  const y = (e.clientY / window.innerHeight - 0.5) * 0.5;
  gsap.to(points.rotation, { x: y * 0.2, y: x * 0.2, duration: 1, ease: "power2.out" });
}
```

## Cleanup
```tsx
useEffect(() => {
  // ...setup renderer, scene, animation loop...
  return () => {
    renderer.dispose();
    geometry.dispose();
    material.dispose();
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
  };
}, []);
```

## Performance Checklist
- 300 partículas máx, una sola `Points` mesh.
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
- Pausar el loop (`cancelAnimationFrame`) cuando la pestaña no está visible (`document.visibilitychange`).
- Verificar que no afecte el Lighthouse mobile (probar en 390px).

## Common Mistakes
- Cargar Three.js sin `ssr: false` → error `window is not defined` en build.
- No llamar `dispose()` en geometry/material/renderer → memory leak en HMR.
- Usar más de 300 partículas o múltiples draw calls "sparse" — mata el FPS en mobile.
