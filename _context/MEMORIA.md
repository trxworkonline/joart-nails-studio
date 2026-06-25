# MEMORIA DEL PROYECTO — JOART NAILS STUDIO
*Este archivo lo completa Claude Code automáticamente al ejecutar /init*
*Actualízalo al final de cada sesión con lo que se completó*

## ESTADO DEL PROYECTO
- [x] Setup inicial Next.js + dependencias
- [x] Repositorio GitHub creado y conectado a Vercel (auto-deploy en push a main — confirmado funcionando)
- [x] Skills personalizadas creadas (.claude/skills/)
- [x] Fondo Three.js partículas warm (acotado al Hero — ver sesión 2026-06-25)
- [x] SECTION-HERO completo
- [x] SECTION-SERVICIOS completo (grid + modal con carrusel — varias rondas de fixes, ver abajo)
- [x] SECTION-TESTIMONIOS completo (marquee CSS de comentarios reales de Instagram)
- [x] SECTION-CTA-FINAL-FOOTER completo (`CTAFinalSection.tsx` + `Footer.tsx`, ver sesión 2026-06-23)
- [x] SVG botanicals: entrada del Hero ahora se repite con ScrollTrigger al volver a subir (ver sesión 2026-06-25). Pendiente aparte: SVG nuevo y distinto para CTA Final (idea propia de Joan, aún sin construir — NO usar las flores ahí, sería repetitivo).
- [ ] Globo de chat animado
- [x] Flujo WhatsApp — funciona en Hero, Servicios y CTA Final, todos con el mismo número real de negocio (`56988210335`) desde la sesión 2026-06-23
- [ ] Lenis smooth scroll
- [x] Optimización mobile 390px (prioridad en cada sección)
- [ ] Deploy final / revisión completa

## REPOSITORIO
- GitHub: https://github.com/trxworkonline/joart-nails-studio
- Vercel: conectado, auto-deploy funcionando en push a `main` (confirmado visualmente varias veces)
- URL de producción: https://joart-web.vercel.app (sin dominio propio todavía — usado como base en metadataBase/sitemap/robots/JSON-LD; si se conecta un dominio propio hay que actualizar esa constante en `app/layout.tsx`, `app/robots.ts` y `app/sitemap.ts`)
- Branch principal: main (todo el trabajo se hace directo en main, sin PRs/worktrees)

## SESIÓN 2026-06-24 (auditoría SEO/UX + bloque de riesgo cero)

Se hizo una auditoría completa (SEO + diseño/UX) usando la skill `ui-ux-pro-max` como referencia de checklist + lectura directa del código. Nota general dada: 7.3/10 — el sitio ya cumple el objetivo de "lucir premium" para el tráfico real (referido desde Instagram/WhatsApp), pero le falta SEO técnico básico y las piezas de animación que cerrarían la brecha con la ambición original "nivel Awwwards" (Three.js, Lenis, SVG animados — siguen pendientes).

Implementado el bloque de **riesgo cero** (commit `0e81e9e`):
- **Open Graph + Twitter Card** + `metadataBase` en `app/layout.tsx`, apuntando a `https://joart-web.vercel.app`.
- **`app/opengraph-image.tsx`**: imagen social 1200×630 generada por código con `next/og` (`ImageResponse`), sin depender de ningún archivo de imagen externo. **Bug encontrado:** con el runtime por defecto (`nodejs`), `@vercel/og` falla en Windows al resolver una URL de fuente interna (`TypeError: Invalid URL` en `fileURLToPath`) — se resuelve agregando `export const runtime = 'edge'`. Si en el futuro se vuelve a tocar este archivo y aparece ese error, esa es la causa y el fix.
- JSON-LD `LocalBusiness` enriquecido con `image`, `url`, `priceRange`.
- `app/robots.ts` y `app/sitemap.ts` (convención de Next.js, generan `/robots.txt` y `/sitemap.xml`).
- Dots del carrusel de Servicios: área táctil real de 44×44px (antes 6-8px) manteniendo el punto visual chico — el botón ahora es un cuadrado invisible con un `<span>` centrado adentro.
- `prefers-reduced-motion` extendido a Hero (timeline GSAP completo salta al estado final sin animar), ServiciosSection (ScrollTrigger no se registra) y CTAFinalSection (via `useReducedMotion()` de Framer Motion) — antes solo lo respetaba el marquee de Testimonios.
- Brillo (`.tarjeta-shine`/`.cta-shine`) cambiado de animar `left` a animar `transform: translateX()` — mismo resultado visual exacto (matemática: como el elemento mide 60% del padre, -100%/150% del padre equivalen a -166.67%/250% del propio elemento), pero ya no fuerza layout/repaint en cada frame.

**Bug falso encontrado durante la verificación (anotado para no perder tiempo de nuevo):** en `npm run dev`, con React Strict Mode, 2 de las 4 cards del grid de Servicios quedaban en `opacity:0` permanentemente (atrapadas en el estado inicial de `gsap.from`) al probarlas con Playwright. **Se confirmó que es ruido de desarrollo, no un bug real:** contra `npm run build && npm run start` (producción), las 4 cards llegan a `opacity:1` sin problema. No tocar el código de animación de Servicios por este síntoma si vuelve a aparecer en dev — confirmar primero contra producción.

**Pendiente para llegar a un 9/10 (acordado con el usuario, próxima etapa):** Three.js (fondo de partículas), Lenis (smooth scroll), SVG botanicals animados al hacer scroll — esto sí tiene riesgo técnico real (Lenis puede chocar con el scroll bloqueado del modal de Servicios) y se va a implementar de a una cosa por vez, con verificación real después de cada una.

## SESIÓN 2026-06-25 (fondo Three.js partículas — primer paso de la etapa hacia el 9/10)

Commit: `f2ea212` — "feat: agrega fondo de particulas Three.js al Hero". Spec: `docs/superpowers/specs/2026-06-25-hero-particle-background-design.md` (reemplaza/supera al spec viejo `2026-06-12-particle-background-lenis-design.md`, que nunca se implementó y planteaba un fondo global con Lenis — descartado porque cada sección tiene su propio `backgroundColor` sólido, así que un fondo fixed global quedaría tapado).

**Decisión de alcance (acordada con el usuario):** el fondo de partículas queda acotado **solo al Hero**, no a toda la página — es el cambio más aislado de los 3 pendientes (Three.js / SVG botanicals / Lenis), consistente con la estrategia de "uno por uno para no romper varias cosas a la vez".

Archivos nuevos:
- `app/components/ParticleBackground.tsx` — wrapper `dynamic(..., { ssr: false })`.
- `app/components/ParticleScene.tsx` — Three.js vanilla (no react-three-fiber, para no introducir un patrón distinto al resto del código que es todo imperativo con refs+GSAP): `Points` único con `BufferGeometry`, colores `#F7D9E0`/`#E8B4C0`/blanco, `AdditiveBlending`. 120 partículas en mobile (<768px) / 300 en desktop, decidido una sola vez al montar.

Comportamiento: **flotación 100% autónoma** — sin reaccionar a mouse ni scroll (decisión explícita: el Hero es la primera pantalla, Lenis todavía no existe en el proyecto). Drift lento vía `Math.sin`, período aleatorio 8-14s por partícula y por eje, amplitud baja (~0.4 unidades en una escena de rango -10..10) — buscado a propósito "polvo flotando", nunca brusco, acorde a la estética femenina/botánica del sitio. Respeta `prefers-reduced-motion` (partículas estáticas). Pausa el loop en `visibilitychange`. Cleanup completo de geometry/material/renderer en unmount.

Verificado: `npm run build` sin errores TS/lint, `npm run dev` levantó y respondió 200. **Pendiente: confirmación visual real de Joan en su celular vía Vercel** (igual que las secciones anteriores) — el push ya está hecho para que el auto-deploy lo refleje.

**Siguiente paso del roadmap 9/10 (en su momento):** SVG botanicals animados, después Lenis al final (es el que más puede chocar con cosas existentes — ScrollTrigger de Servicios, scroll bloqueado del modal).

**Ajuste mismo día (commit `7f5a1e1`):** Joan probó en su celular vía Vercel y pidió 2 cosas — (1) las partículas se veían cuadradas (`PointsMaterial` sin `map` dibuja sprites cuadrados por defecto): se agregó una textura circular generada por canvas (radial gradient blanco→transparente) como `map`/`alphaMap`. (2) Agregar el mismo fondo a la sección Servicios. `ParticleScene` ahora acepta prop `density: 'normal' | 'subtle'` (Hero sigue en 'normal' 120/300, Servicios usa 'subtle' 60/150 porque queda mayormente tapado por el grid de cards). **Detalle de stacking importante si se reutiliza este patrón de nuevo:** en Servicios el título/grid no tenían `position` propio (a diferencia del Hero, donde todo ya estaba posicionado) — un canvas absoluto con z-index:0 como hermano de contenido *estático* pintaría POR ENCIMA del contenido, no detrás, por las reglas de stacking de CSS (los elementos no posicionados pintan antes que los posicionados de nivel 0). Se resolvió envolviendo todo el contenido de la sección en un `<div style={{position:'relative', zIndex:1}}>`. Si se agrega `ParticleBackground` a otra sección (CTA Final, Testimonios), revisar primero si su contenido ya tiene `position`/`zIndex` explícito o si necesita el mismo wrapper.

## SESIÓN 2026-06-25 (continuación — Hero ScrollTrigger replay)

Commit `78416e4` — el timeline de entrada del Hero (logo → flores draw-on → texto → CTA → mano) pasó de "una vez al montar" a `ScrollTrigger` (`start: 'top 80%'`, `toggleActions: 'restart none restart none'`): en la carga inicial se ve igual que antes, pero ahora se repite si el usuario baja a otra sección y vuelve a subir al Hero. Cambio acotado 100% a `Hero.tsx`. Spec: `docs/superpowers/specs/2026-06-25-hero-scrolltrigger-replay-design.md`.

**Decisión importante para no olvidar:** se descartó usar `flores-hero-final.svg` como decoración del CTA Final (hubiera sido repetitivo, ya se usa en el Hero). **Joan tiene una idea propia para un SVG nuevo y distinto para esa sección — todavía no lo ha construido.** Cuando esté listo ese asset, retomar la pieza "CTA final decorations" de la skill `joart-svg-botanicals` con ese SVG nuevo (no antes).

**Roadmap 9/10 — queda solo:** Lenis smooth scroll (último paso, mayor riesgo de cruce con ScrollTrigger de Servicios y el scroll bloqueado del modal).

## ASSETS DISPONIBLES
- Mano ilustrada: `public/assets/mano-hero-final.svg`
- Flores botánicas: `public/assets/flores-hero-final.svg`
- Logo JoArt: `public/assets/logo.png`
- Fotos de servicios: `public/assets/servicios/` (18 PNGs reales: manicura-rusa, nails-polygel, pedicura-spa, perfilado-cejas)
- Botellas-botón del CTA Final: `public/assets/footer/esmalte-whatsapp.png` y `esmalte-instagram.png` (recortadas a su bounding box real — los originales en `OneDrive/Desktop/JoArt-Web/Elementos Visuales/WhatssapE.png` e `InstagramE.png` tenían ~40-45% de margen transparente alrededor del dibujo).

## DECISIONES TÉCNICAS TOMADAS
- Sin barra de navegación (logo como ancla, top-left)
- Glassmorphism clear en cards/modal de Servicios y Testimonios
- WhatsApp: número de negocio real **56988210335**, unificado en Hero, Servicios y CTA Final desde la sesión 2026-06-23 (antes Hero.tsx tenía el viejo `56931924796`).
- Testimonios: solo se usan comentarios reales de Instagram, sin inventar contenido y sin exponer nombre/usuario de clientas (decisión ética + privacidad, ver spec).
- Colores realmente más usados en el código (no necesariamente los "oficiales" del token `--joart-brand`): `#A07860` (marrón cálido, el que más se repite — flores, mano, botones, íconos) y de fondo `#FFF9F4` (vainilla, el background de toda la página). El token documentado `--joart-brand: #7A5040` casi no se usa en la práctica.
- Footer: solo el crédito "Hecho por CenitDigitalPro" con link al Instagram **personal** de Joan (`@jmdrade`) — el Instagram de la marca CenitDigitalPro está inactivo y es más de rubro inmobiliario, no aplica acá.
- SEO: JSON-LD `LocalBusiness` invisible agregado en `app/layout.tsx` (nombre, Ñuñoa/Santiago, teléfono, Instagram del negocio) — sin texto SEO visible en el footer.

## SESIÓN 2026-06-23 (CTA Final + Footer — implementación completa)

Spec: `docs/superpowers/specs/2026-06-23-cta-final-footer-design.md`. Commits: `63e44a0` (spec) y `793381f` (implementación).

- **Problema real detectado en los PNG de Joan** (`WhatssapE.png`/`InstagramE.png`): el frasco de Instagram tiene relleno opaco pero casi blanco (`#FDF8F2`), casi idéntico al fondo vainilla `#FFF9F4` — por eso "desaparecía" visualmente. El de WhatsApp sí tenía relleno café semi-opaco visible.
- **Fix elegido:** halo de color en CSS detrás de cada botella (radial-gradient + blur), sin tocar el PNG original. Primer intento con `joart-blush` (`#F7D9E0`) para el halo de WhatsApp resultó casi invisible — ese color tiene muy poco contraste contra el fondo vainilla (diff de canal ~3x más chico que `joart-rose`). Se cambió a un halo color marrón (`#A07860`, el mismo del relleno de la propia botella) que sí tiene contraste real. Instagram quedó con halo `joart-rose` (`#E8B4C0`), que sí funcionaba bien desde el primer intento.
- **Bug de overlap encontrado y corregido:** los PNG originales tienen ~40-45% de margen transparente alrededor del dibujo real (verificado escaneando el canal alfa con `System.Drawing` en PowerShell). Esto hacía que las dos botellas, aunque sus cajas (`width`/`height` en el componente) se superpusieran en el cálculo, se vieran con un hueco visual entre ellas en vez de "pegadas". Se resolvió recortando ambos PNG a su bounding box real de contenido (con padding chico) antes de usarlos — ahora el ancho/alto del componente corresponde al dibujo visible de verdad.
- Profundidad escalonada final: Instagram 66×150px (adelante, ancla borde derecho), WhatsApp 60×132px (~88%, atrás, `bottom:10px` más arriba, ~11px de solape con Instagram).
- Verificado con Playwright a 390×844 (capturas + muestreo de píxeles RGB para confirmar que los halos se ven realmente, no solo en el código) — los scripts y capturas se hicieron en una carpeta temporal dentro del repo (no en `/tmp` del sistema, que resultó no ser confiable entre llamadas de distintas herramientas en este entorno) y se borraron al terminar.
- Copy final con saltos de línea (`<br/>`) puestos a mano para evitar palabras huérfanas en la columna angosta de texto — el primer intento de copy (“o escríbenos por WhatsApp.”) sí dejaba “WhatsApp.” solo en la última línea visual a pesar del `<br/>` manual, porque ese segundo tramo seguía siendo más largo que el ancho de columna y el navegador volvía a partirlo. Se acortó el copy en vez de seguir intentando forzar el corte exacto.
- `npm run build` exitoso, sin errores de consola, JSON-LD validado, los 3 links (WhatsApp, Instagram, footer) confirmados apuntando a las URLs correctas.

**Pendiente real:** confirmación visual final de Joan en su dispositivo (igual que las secciones anteriores) — el push ya se hizo a pedido explícito antes de esa confirmación, así que si algo no se ve bien en el dispositivo real puede necesitar un ajuste fino después.

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
