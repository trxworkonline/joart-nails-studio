# SKILLS — JOART NAILS STUDIO

## SKILLS A ACTIVAR AL INICIO DE CADA SESIÓN
Ejecuta siempre al inicio:
```
Activa skills /ui-ux-pro-max y /claude
```

## SKILLS A CREAR CON SKILL-CREATOR (primera sesión)
Usa la habilidad /skill-creator para crear estas 7 skills personalizadas del proyecto. Créalas todas en la primera sesión antes de escribir código.

---

### 1. /joart-design-system
**Propósito:** Sistema de diseño completo de JoArt. Paleta, tipografías, componentes base, tokens CSS.
**Contenido que debe tener:**
- Variables CSS completas con todos los colores de la paleta JoArt
- Configuración de Tailwind con los colores personalizados
- Clases utilitarias para tipografía (Playfair, Pinyon Script, Poppins)
- Componente base de botón JoArt
- Componente base glassmorphism card
- Reglas de espaciado y border-radius del proyecto

---

### 2. /joart-animations
**Propósito:** Patrones de animación GSAP + ScrollTrigger + SplitType específicos para JoArt.
**Contenido que debe tener:**
- Animación de stroke-dashoffset para SVG botanicals (se dibujan solos al hacer scroll)
- Animación de entrada del hero (mano + flores + texto)
- SplitType para títulos — chars entran desde abajo con stagger
- ScrollTrigger para cada sección
- Animación del globo de chat (typing dots → pop-in con bounce)
- Magnetic button effect para el botón de agendar

---

### 3. /joart-three
**Propósito:** Configuración del fondo Three.js con partículas warm nude para JoArt.
**Contenido que debe tener:**
- Setup de Three.js en Next.js (dynamic import para evitar SSR issues)
- Sistema de partículas: colores #F7D9E0, #E8B4C0, blanco, muy sparse
- Reacción al scroll con Lenis
- Reacción al mouse (parallax suave)
- Performance: máximo 300 partículas, sin impacto en mobile
- Cleanup correcto al desmontar el componente

---

### 4. /joart-services
**Propósito:** Componente de servicios con tap-to-expand y flujo WhatsApp.
**Contenido que debe tener:**
- Grid 2 columnas colapsado con cards de servicios
- Animación de expansión: card se abre con GSAP, foto ocupa 60% altura
- Glassmorphism panel inferior con info del servicio
- Modal de nombre: input + botón enviar
- Función buildWhatsAppURL(nombre, servicio) que construye el link
- Cierre al tocar fuera o en flecha ←
- Prevención de scroll del body cuando card está abierta

---

### 5. /joart-glassmorphism
**Propósito:** Implementación correcta de glassmorphism clear para JoArt.
**Contenido que debe tener:**
- Mixin CSS glassmorphism clear JoArt: background rgba(255,255,255,0.15) backdrop-filter blur(16px) border rgba(232,180,192,0.3)
- Componente React GlassCard con props de variante
- Fallback para browsers sin backdrop-filter
- Integración con el fondo Three.js (el glass deja ver las partículas detrás)

---

### 6. /joart-svg-botanicals
**Propósito:** SVG animados de botanicals para hero, divisor y CTA final.
**Contenido que debe tener:**
- SVG del divisor botánico (rama horizontal con flores) para transición hero→servicios
- SVG de elementos decorativos para CTA final
- SVG del globo de chat con borde dashed
- Animación stroke-dashoffset: los SVG se dibujan solos al entrar al viewport
- Variables de color en SVG para fácil cambio de paleta

---

### 7. /joart-deploy
**Propósito:** Workflow de deploy automático GitHub + Vercel para JoArt.
**Contenido que debe tener:**
- Usar MCP de GitHub para crear repositorio joart-nails-studio
- Inicializar git, agregar remote origin
- Commit y push inicial a main
- Instrucciones para conectar Vercel al repo (Joan hace esto manualmente una vez)
- Después de cada cambio completado: git add . → git commit -m "descripción" → git push origin main
- NUNCA pushear código roto o incompleto
- Mensajes de commit descriptivos en español

## WORKFLOW DE SESIÓN
```
Inicio de sesión:
1. Activa /ui-ux-pro-max y /claude
2. Lee PROYECTO.md y MEMORIA.md
3. Abre SOLO el archivo en el que vas a trabajar
4. Ejecuta la tarea
5. git add . → git commit → git push origin main
6. Confirma que Vercel desplegó correctamente
```
