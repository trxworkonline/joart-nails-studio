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
- [x] SECTION-CTA-FINAL-FOOTER completo (`CTAFinalSection.tsx` + `Footer.tsx`, ver sesión 2026-06-23)
- [ ] SVG botanicals animados (assets existen: flores-hero-final.svg, mano-hero-final.svg — usados estáticos en Hero, sin animación stroke-dashoffset todavía)
- [ ] Globo de chat animado
- [x] Flujo WhatsApp — funciona en Hero, Servicios y CTA Final, todos con el mismo número real de negocio (`56988210335`) desde la sesión 2026-06-23
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
