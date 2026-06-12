---
name: joart-glassmorphism
description: Use when implementing glass/translucent panels over the Three.js background or service cards in JoArt Nails Studio, including browser fallbacks.
---

# JoArt Glassmorphism (Clear)

## Overview
Estilo "glass clear" único de JoArt: panel translúcido que deja ver las partículas del fondo Three.js, con borde rosa suave.

## Mixin CSS
```css
.joart-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(232, 180, 192, 0.3);
  border-radius: 12px;
}
```

## Tailwind utility (alternativa inline)
```
bg-white/15 backdrop-blur-xl border border-[rgba(232,180,192,0.3)] rounded-xl
```

## Componente GlassCard
```tsx
type GlassCardProps = {
  children: React.ReactNode;
  variant?: "default" | "solid";
  className?: string;
};

export function GlassCard({ children, variant = "default", className = "" }: GlassCardProps) {
  const base = "rounded-xl border border-[rgba(232,180,192,0.3)]";
  const variants = {
    default: "bg-white/15 backdrop-blur-xl",
    // fallback para navegadores sin backdrop-filter: fondo más opaco, sin blur
    solid: "bg-joart-vanilla/90",
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}
```

## Fallback sin backdrop-filter
```css
@supports not (backdrop-filter: blur(1px)) {
  .joart-glass {
    background: rgba(255, 249, 244, 0.92); /* joart-vanilla casi opaco */
  }
}
```
O usar `variant="solid"` de `GlassCard` directamente cuando se detecte falta de soporte.

## Integración con fondo Three.js
- `GlassCard` debe ir SIEMPRE sobre `ParticleBackground` (ver **joart-three**) en el stacking context — el blur necesita contenido detrás para tener efecto visual.
- No poner `bg-joart-vanilla` sólido detrás del glass o se pierde el efecto.

## Texto sobre el glass
Texto siempre `text-joart-text` (#5C3D3D) — contraste suficiente sobre `rgba(255,255,255,0.15)`.

## Common Mistakes
- Usar `backdrop-blur` sin `-webkit-backdrop-filter` → no funciona en Safari/iOS.
- Glass sin contenido animado detrás → se ve como un rectángulo gris plano, no "glass".
- Border-radius distinto a 12px rompe la consistencia con **joart-design-system**.
