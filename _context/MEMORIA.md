# MEMORIA DEL PROYECTO — JOART NAILS STUDIO
*Este archivo lo completa Claude Code automáticamente al ejecutar /init*
*Actualízalo al final de cada sesión con lo que se completó*

## ESTADO DEL PROYECTO
- [x] Setup inicial Next.js + dependencias
- [x] Repositorio GitHub creado y conectado a Vercel (auto-deploy en push a main — confirmado funcionando)
- [x] Skills personalizadas creadas (.claude/skills/)
- [ ] Fondo Three.js partículas warm (instalado pero sin implementar)
- [x] SECTION-HERO completo
- [x] SECTION-SERVICIOS completo (grid + modal con carrusel — varias rondas de fixes, ver abajo)
- [x] SECTION-TESTIMONIOS completo (marquee CSS de comentarios reales de Instagram)
- [ ] SECTION-CTA-FINAL-FOOTER — **en diseño, brainstorming casi cerrado, falta 1 decisión (ver "EN CURSO" abajo) antes de escribir la spec**
- [ ] SVG botanicals animados (assets existen: flores-hero-final.svg, mano-hero-final.svg — usados estáticos en Hero, sin animación stroke-dashoffset todavía)
- [ ] Globo de chat animado
- [x] Flujo WhatsApp — funciona en Hero y en Servicios, **pero con dos números distintos (ver pendiente abajo)**
- [ ] Lenis smooth scroll
- [x] Optimización mobile 390px (prioridad en cada sección)
- [ ] Deploy final / revisión completa

## REPOSITORIO
- GitHub: https://github.com/trxworkonline/joart-nails-studio
- Vercel: conectado, auto-deploy funcionando en push a `main` (confirmado visualmente varias veces)
- Branch principal: main (todo el trabajo se hace directo en main, sin PRs/worktrees)

## ASSETS DISPONIBLES
- Mano ilustrada: `public/assets/mano-hero-final.svg`
- Flores botánicas: `public/assets/flores-hero-final.svg`
- Logo JoArt: `public/assets/logo.png`
- Fotos de servicios: `public/assets/servicios/` (18 PNGs reales: manicura-rusa, nails-polygel, pedicura-spa, perfilado-cejas)
- **Pendiente**: 2 imágenes PNG de "frascos de esmalte" (botones de WhatsApp e Instagram para la sección CTA Final) — las está haciendo Joan, avisa cuando estén listas.

## DECISIONES TÉCNICAS TOMADAS
- Sin barra de navegación (logo como ancla, top-left)
- Glassmorphism clear en cards/modal de Servicios y Testimonios
- WhatsApp: el número de negocio real es **56988210335** (usado en Servicios). Hero.tsx todavía tiene el número viejo `56931924796` — **pendiente unificar todos los botones de WhatsApp de toda la web a 56988210335** (se va a corregir junto con la implementación de la sección CTA Final).
- Testimonios: solo se usan comentarios reales de Instagram, sin inventar contenido y sin exponer nombre/usuario de clientas (decisión ética + privacidad, ver spec).
- Colores realmente más usados en el código (no necesariamente los "oficiales" del token `--joart-brand`): `#A07860` (marrón cálido, el que más se repite — flores, mano, botones, íconos) y de fondo `#FFF9F4` (vainilla, el background de toda la página). El token documentado `--joart-brand: #7A5040` casi no se usa en la práctica.
- Footer (CTA Final): va a llevar **solo** el crédito "Hecho por [marca/nombre de CenitDigitalPro]" con link al Instagram **personal** de Joan (`@jmdrade`) — el Instagram de la marca CenitDigitalPro está inactivo y es más de rubro inmobiliario, no aplica acá.
- SEO: se va a agregar JSON-LD `LocalBusiness` (invisible, sin impacto visual) con nombre, área (Ñuñoa, Santiago), Instagram del negocio (@joart.cl), teléfono — en vez de agregar texto SEO visible al footer.

## EN CURSO — Sesión 2026-06-22 (CTA Final + Footer, brainstorming)

Se está diseñando la última sección pendiente del sitio (`CTAFinalSection.tsx` + `Footer.tsx`), entre `TestimoniosSection` y el cierre del sitio. Diseño acordado hasta ahora:

**Layout (asimétrico):**
- Texto a la izquierda (copy enfocado en Instagram, ya que reservar por WhatsApp está cubierto en Hero/Servicios).
- A la derecha, con padding generoso entre el texto y los botones (para que "respire"): **frasco de WhatsApp** (al medio, entre el texto y el frasco de Instagram) y **frasco de Instagram** (pegado al borde derecho — esa posición, no el tamaño, es lo que le da protagonismo a Instagram; ambos frascos son del mismo tamaño).
- Cada frasco es un botón — al tocar, crece un poco (mismo patrón `whileTap` que ya se usa en las cards de Servicios).
- Las imágenes de los frascos son PNG que Joan está creando — **mientras no estén listas, se implementa con un placeholder simple (forma de frasco en los colores de marca)**.
- Instagram del negocio: `@joart.cl` (https://instagram.com/joart.cl). WhatsApp: número de negocio `56988210335`.

**Footer:**
- Solo el crédito "Hecho por CenitDigitalPro" (texto exacto a confirmar), con link a `https://instagram.com/jmdrade` (Instagram personal de Joan).
- Sin datos de contacto adicionales, sin aviso legal (no es necesario, el sitio no tiene formularios ni guarda datos).
- SEO: JSON-LD `LocalBusiness` invisible, no afecta el footer visible.

**Pendiente — única decisión abierta antes de escribir la spec:**
Elegir la pareja de colores para que Joan pinte los frascos PNG. Dos opciones sobre la mesa:
1. `#A07860` + `#E8B4C0` (recomendado: el marrón dominante real + el rosa "rose" oficial de la paleta, todavía sin usar en ningún componente — más coherente con la estética "feminidad botánica" del brief).
2. `#A07860` + `#FFF9F4` (los 2 que literalmente más se repiten en el código hoy, pero el vainilla casi blanco se vería lavado como color de frasco).

**Próximos pasos al retomar:**
1. Cerrar la decisión de color (pregunta ya hecha a Joan, sin responder al momento de guardar esto).
2. Escribir la spec en `docs/superpowers/specs/` (flujo de brainstorming ya en curso, falta presentar diseño final + escribir doc).
3. Plan de implementación (`docs/superpowers/plans/`).
4. Implementar: `CTAFinalSection.tsx`, `Footer.tsx`, fix del número de WhatsApp en `Hero.tsx`, JSON-LD LocalBusiness, integración en `page.tsx`.
5. Placeholder de frascos hasta que Joan entregue los PNG reales — avisar cuando lleguen para swap final.

## SESIONES ANTERIORES (resumen consolidado)

**Setup inicial (2026-06-12):** Next.js 14 App Router + TS, Tailwind con paleta/tipografías JoArt, dependencias de animación instaladas (gsap, lenis, framer-motion, split-type, three — la mayoría sin usar todavía salvo framer-motion), 7 skills personalizadas, repo GitHub creado.

**Hero (`app/components/Hero.tsx`):** Logo top-left (mix-blend-mode multiply), flores y mano SVG animadas con GSAP (cargadas vía fetch+innerHTML para acceso a paths individuales), timeline de entrada (logo → flores → texto → CTA → mano), CTA WhatsApp con shine animado, varias rondas de fixes (parsing SVG, responsive con flexbox en vez de posiciones fijas, robustez del init async).

**Servicios (`app/components/ServiciosSection.tsx`):** Grid bento 2 columnas + modal con carrusel (Framer Motion, drag horizontal, dots). El modal pasó por **muchas iteraciones de bugs de layout**, la más relevante: la tarjeta de info dentro del modal competía por espacio flex con la imagen (`marginTop` negativo sobre un hermano `flex:1`), lo que la hacía tapar entre 35% y 60% de la imagen según el alto real del viewport del celular (medido y confirmado con Playwright variando viewport heights, no solo en el simulador "limpio" de 844px). **Fix final (causa raíz, no parche):** imagen con `aspect-ratio` fijo (4/5, no depende del alto disponible), tarjeta de info vuelve al flujo normal debajo de la imagen con solo 16px de solape cosmético, overlay con `display:grid + overflowY:auto` para permitir scroll en pantallas muy chicas sin cortar contenido, botón de cerrar anclado al bloque (no al viewport) para que no quede flotando cuando el modal se centra por contenido.

**Testimonios (`app/components/TestimoniosSection.tsx`):** Marquee CSS puro (sin Framer Motion/GSAP) con 7 comentarios reales de Instagram, sin nombre/usuario por privacidad, etiquetados "Comentario real de Instagram". Máscara de degradado en los bordes, pausa en hover, `prefers-reduced-motion` desactiva la animación. Verificado con Playwright (14 tarjetas en loop, animationName/duration correctos, hover pausa, accesibilidad de movimiento reducido).

**Incidente de deploy:** un push no se reflejó en Vercel (causa no confirmada — probablemente webhook puntual fallido). Se resolvió con un commit vacío para forzar un nuevo evento de push; si vuelve a pasar, revisar en el dashboard de Vercel: Settings → Git (conexión del repo, Production Branch = main) y la pestaña Deployments para ver si el webhook está disparando.

## NOTAS IMPORTANTES
- Prioridad mobile 390px iPhone — diseño mobile first, verificar siempre ese viewport primero.
- La dirección exacta NO aparece en la web, solo "Ñuñoa, Santiago".
- No hay test runner configurado — verificación es `npm run build` + revisión visual con Playwright (instalado ad-hoc con `npm install --no-save playwright` cuando se necesita) + confirmación final de Joan en dispositivo real.
- Cuidado al correr `npm run build` mientras `npm run dev` sigue corriendo — comparten `.next` y se corrompe el dev server. Si pasa: matar procesos node, `rm -rf .next`, reiniciar `npm run dev` limpio.
- Workflow de specs/plans: este proyecto usa `docs/superpowers/specs/` y `docs/superpowers/plans/` (brainstorming → spec → plan → implementación) para features nuevas no triviales.
