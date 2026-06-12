# JOART NAILS STUDIO — CONTEXTO DEL PROYECTO

## QUÉ ES ESTE PROYECTO
Mini web premium para JoArt Nails Studio, salón de uñas de Joali Andrade Moncayo ubicado en Ñuñoa, Santiago, Chile. El objetivo es convertir visitas en reservas directas por WhatsApp.

## OBJETIVO VISUAL
Nivel Awwwards. Feminidad botánica luminosa. Línea fina, calidez, elegancia accesible. Referencias: webs de lujo femenino con animaciones de scroll, ilustraciones botánicas que se dibujan solas, glassmorphism real.

## STACK TECNOLÓGICO COMPLETO
- **Framework:** Next.js 14 con App Router
- **Estilos:** Tailwind CSS con paleta JoArt customizada
- **Animaciones scroll:** GSAP + ScrollTrigger
- **Texto animado:** SplitType
- **Smooth scroll:** Lenis (@studio-freight/lenis)
- **Animaciones React:** Framer Motion
- **Partículas 3D:** Three.js (fondo WebGL warm nude)
- **SVG animados:** GSAP stroke-dashoffset para botanicals
- **Fuentes:** Google Fonts (Playfair Display, Pinyon Script, Poppins)
- **Deploy:** GitHub + Vercel (auto-deploy desde main)

## PALETA DE COLORES
```
--joart-vanilla:    #FFF9F4   /* fondo principal */
--joart-nude:       #F5E8DC   /* nude caliente */
--joart-blush:      #F7D9E0   /* rosa pastel */
--joart-rose:       #E8B4C0   /* rosa acento */
--joart-brand:      #7A5040   /* marrón marca — COLOR PRINCIPAL */
--joart-text:       #5C3D3D   /* texto oscuro */
--joart-text-soft:  #8B6A6A   /* texto suave */
--joart-text-muted: #B89090   /* texto muted */
```

## TIPOGRAFÍAS
- **Playfair Display** — títulos principales, serif elegante
- **Pinyon Script** — acento caligráfico, equivalente al "Flash" de su marca
- **Poppins 300/400/500** — cuerpo, descripciones, botones

## ESTRUCTURA DE LA WEB (3 SECCIONES)
1. **Hero** — logo + tagline + mano ilustrada + flores botánicas + globo chat + CTA
2. **Servicios** — grid de cards con foto, tap-to-expand con glassmorphism
3. **CTA Final + Footer** — Instagram CTA + datos de contacto

## SERVICIOS Y PRECIOS
| Servicio | Precio | Duración |
|---|---|---|
| Manicura Rusa | $19.990 | 3-4 semanas |
| Nails Polygel | desde $24.990 | 3-4 semanas |
| Pedicura Spa | $19.990 | 4-5 semanas |
| Perfilado Cejas | $6.990 | — |
| Combo Manos+Pies | $27.990 | — |
| Retiro Material Externo | $4.990 | — |

## WHATSAPP
Número: +56931924796
Mensaje pre-escrito: "Hola soy [nombre], vengo de tu web y me interesa el servicio [servicio]"

## INSTAGRAM
Handle: @joart.cl
URL: https://instagram.com/joart.cl

## UBICACIÓN
Ñuñoa, Santiago, Chile (NO mostrar dirección exacta)

## FLUJO DE RESERVA (interacción clave)
1. Usuaria ve grid de servicios (cards colapsadas con foto + nombre)
2. Toca una card → se expande con animación suave
3. Ve foto grande (60% altura), card glassmorphism abajo (40%)
4. Toca "Agendar" → aparece mini modal pidiendo nombre
5. Escribe nombre → toca "Enviar" → abre WhatsApp con mensaje pre-escrito
6. Si toca fuera del modal o la flecha ← → se cierra la card expandida

## DISEÑO DE CARDS EXPANDIDAS
- Foto: 60% de la altura de pantalla, ancho completo
- Card info: glassmorphism clear — background rgba(255,255,255,0.15), backdrop-filter blur(16px)
- Borde: 1px solid rgba(232,180,192,0.3) — rose suave
- Texto: #5C3D3D sobre el glass
- Botón Agendar: fondo #5C3D3D, texto #FFF9F4, border-radius 12px
- Flecha regreso: círculo glassmorphism, flecha en #5C3D3D

## ELEMENTOS VISUALES (assets disponibles)
- Mano ilustrada línea fina (PNG sin fondo) — esquina inferior derecha hero
- Flores botánicas línea fina (PNG sin fondo) — esquina superior derecha hero
- Logo JoArt (PNG) — esquina superior izquierda, sin navbar
- Globo de chat animado — SVG o CSS, color #F2B8C6, borde dashed
- Divisor botánico — SVG animado entre hero y servicios
- Elementos CTA final — SVG botánicos laterales
