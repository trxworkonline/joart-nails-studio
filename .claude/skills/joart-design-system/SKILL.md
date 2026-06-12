---
name: joart-design-system
description: Use when building any UI for JoArt Nails Studio and you need the brand color palette, typography classes, base button, or glass card tokens.
---

# JoArt Design System

## Overview
Design tokens and base primitives for JoArt Nails Studio: warm nude/rose palette, Playfair Display + Pinyon Script + Poppins typography, and the two recurring UI primitives (brand button, glass card).

## Color Palette
Defined in `tailwind.config.ts` (`theme.colors.joart`) and mirrored as CSS vars in `app/globals.css`.

| Token | Hex | Uso |
|---|---|---|
| `joart-vanilla` | #FFF9F4 | fondo principal |
| `joart-nude` | #F5E8DC | nude cálido |
| `joart-blush` | #F7D9E0 | rosa pastel |
| `joart-rose` | #E8B4C0 | rosa acento |
| `joart-brand` | #7A5040 | marca / acentos fuertes |
| `joart-text` | #5C3D3D | texto principal |
| `joart-text-soft` | #8B6A6A | texto secundario |
| `joart-text-muted` | #B89090 | texto deshabilitado/hint |

Usar siempre `bg-joart-*` / `text-joart-*`, nunca hex hardcodeado.

## Typography
- `font-playfair` — Playfair Display, títulos principales (serif)
- `font-pinyon` — Pinyon Script, acento caligráfico (equivalente al "Flash" de la marca)
- `font-poppins` — Poppins 300/400/500, cuerpo y botones (fuente por defecto del `body`)

## Base Components

### JoartButton
```tsx
export function JoartButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-xl bg-joart-text px-6 py-3 font-poppins text-sm font-medium text-joart-vanilla transition-transform active:scale-95"
    >
      {children}
    </button>
  );
}
```
`border-radius: 12px` (`rounded-xl`) es el estándar para botones y cards de JoArt.

### GlassCard
Ver **joart-glassmorphism** para la implementación completa (mixin + fallback). Variante mínima:
```tsx
export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[rgba(232,180,192,0.3)] bg-white/15 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}
```

## Spacing & Radius Rules
- Radio estándar: `12px` (`rounded-xl`) — botones, glass cards, modal de nombre.
- Radio de íconos/avatares circulares: `rounded-full`.
- Padding interno: `px-6 py-3` (botones), `p-6` (cards).

## Common Mistakes
- Hardcodear hex en lugar de usar `joart-*` / CSS vars — rompe la sincronía entre `tailwind.config.ts` y `globals.css`.
- Usar `font-sans` por defecto en lugar de `font-poppins`/`font-playfair`/`font-pinyon` explícitos en títulos vs cuerpo.
