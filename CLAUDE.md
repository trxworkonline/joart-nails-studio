# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mini sitio Next.js para **JoArt Nails Studio** (salón de uñas de Joali Andrade Moncayo, Ñuñoa, Santiago, Chile). Objetivo único: convertir visitas en reservas por WhatsApp. El brief completo del diseño, paleta, copy, precios y flujo de interacción vive en `_context/PROYECTO.md` — leerlo antes de tocar UI.

`_context/` contiene los documentos fuente de verdad para este proyecto:
- `PROYECTO.md` — stack, paleta de colores, tipografías, estructura de las 3 secciones, tabla de servicios/precios, número de WhatsApp, flujo de reserva, specs de glassmorphism.
- `SKILLS.md` — define 7 skills personalizadas por crear (`joart-design-system`, `joart-animations`, `joart-three`, `joart-services`, `joart-glassmorphism`, `joart-svg-botanicals`, `joart-deploy`) y el workflow de sesión/deploy.
- `MEMORIA.md` — checklist de progreso y decisiones técnicas tomadas; **actualizar al final de cada sesión** con lo completado y lo pendiente.

## Commands

```
npm run dev      # servidor de desarrollo
npm run build    # build de producción (también corre type-check + lint de tipos)
npm run lint     # ESLint (eslint-config-next)
npm run start    # servir build de producción
```

No hay test runner configurado.

## Architecture

- **Next.js 14, App Router**, sin carpeta `src/` — todo vive en `app/`. Alias de import `@/*` → raíz del proyecto (`tsconfig.json`).
- **Tailwind** (`tailwind.config.ts`) extiende `theme.colors.joart.*` con la paleta de marca (`vanilla`, `nude`, `blush`, `rose`, `brand`, `text`, `text-soft`, `text-muted`) y `theme.fontFamily` con `playfair`, `pinyon`, `poppins` — usar estas utilities (`bg-joart-vanilla`, `text-joart-brand`, `font-playfair`, etc.) en vez de hex/fonts hardcodeados.
- **Fuentes**: `Playfair Display`, `Pinyon Script`, `Poppins` (300/400/500) cargadas vía `next/font/google` en `app/layout.tsx`, expuestas como CSS vars `--font-playfair` / `--font-pinyon` / `--font-poppins` y consumidas en `globals.css`/Tailwind.
- `app/globals.css` define los mismos tokens de color como CSS vars `--joart-*` (espejo de `tailwind.config.ts`) — mantener ambos sincronizados si cambia la paleta.
- Sin navbar: el logo actúa como ancla (decisión de diseño en `_context/MEMORIA.md`).
- Dependencias de animación ya instaladas pero sin uso todavía: `gsap` (+ScrollTrigger), `@studio-freight/lenis` (smooth scroll), `framer-motion`, `split-type` (texto animado), `three` + `@types/three` (fondo de partículas WebGL).

## Workflow

- Cada sesión: activar `/ui-ux-pro-max`, leer `_context/PROYECTO.md` y `_context/MEMORIA.md` antes de trabajar.
- Tras cada cambio completo y funcional: `git add .` → commit descriptivo **en español** → `git push origin main`. Nunca pushear código roto o incompleto.
- Mobile-first, viewport de referencia 390px (iPhone).
