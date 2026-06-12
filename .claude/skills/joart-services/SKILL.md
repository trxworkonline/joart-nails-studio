---
name: joart-services
description: Use when building the services grid, the tap-to-expand card interaction, or the WhatsApp booking flow for JoArt Nails Studio.
---

# JoArt Services Grid & WhatsApp Flow

## Overview
Grid 2 columnas de servicios → tap expande la card a foto 60% + panel glass 40% → modal de nombre → abre WhatsApp con mensaje pre-armado.

## Data
```ts
export const SERVICES = [
  { id: "manicura-rusa", name: "Manicura Rusa", price: "$19.990", duration: "3-4 semanas" },
  { id: "polygel", name: "Nails Polygel", price: "desde $24.990", duration: "3-4 semanas" },
  { id: "pedicura-spa", name: "Pedicura Spa", price: "$19.990", duration: "4-5 semanas" },
  { id: "cejas", name: "Perfilado Cejas", price: "$6.990", duration: null },
  { id: "combo", name: "Combo Manos+Pies", price: "$27.990", duration: null },
  { id: "retiro", name: "Retiro Material Externo", price: "$4.990", duration: null },
] as const;
```

## Flujo de interacción
1. Grid 2 columnas, cards colapsadas (foto + nombre).
2. Tap → GSAP expande la card: foto pasa a 60% de altura de pantalla, ancho completo.
3. Panel inferior 40% con `GlassCard` (ver **joart-glassmorphism**): nombre, precio, duración, botón "Agendar".
4. Tap "Agendar" → modal con input de nombre + botón "Enviar".
5. Submit → `buildWhatsAppURL(nombre, servicio)` → `window.open(url, "_blank")`.
6. Tap fuera del modal o flecha `←` → cierra la card expandida.

## buildWhatsAppURL
```ts
const WHATSAPP_NUMBER = "56931924796";

export function buildWhatsAppURL(nombre: string, servicio: string) {
  const message = `Hola soy ${nombre}, vengo de tu web y me interesa el servicio ${servicio}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

## Body scroll lock
Mientras una card está expandida, bloquear el scroll del body:
```ts
useEffect(() => {
  document.body.style.overflow = expanded ? "hidden" : "";
  return () => { document.body.style.overflow = ""; };
}, [expanded]);
```
También pausar/desactivar Lenis (`lenis.stop()` / `lenis.start()`) si está activo.

## Cierre de card expandida
- Click en overlay fuera del modal → cerrar modal (no la card).
- Click en flecha `←` (círculo glass, ver **joart-glassmorphism**) → colapsar card a estado grid.

## Common Mistakes
- Olvidar `encodeURIComponent` en el mensaje de WhatsApp → URL rota con espacios/acentos.
- No reactivar el scroll del body al desmontar o cerrar la card (memory/UX leak).
- Mezclar el cierre del modal con el cierre de la card expandida — son dos estados independientes.
