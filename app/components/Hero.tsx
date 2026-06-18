'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function Hero() {
  const logoRef    = useRef<HTMLDivElement>(null);
  const floresRef  = useRef<HTMLDivElement>(null);
  const h1Ref      = useRef<HTMLHeadingElement>(null);
  const sub1Ref    = useRef<HTMLParagraphElement>(null);
  const sub2Ref    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLAnchorElement>(null);
  const manoRef    = useRef<HTMLDivElement>(null);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let dead = false;
    let raf: number;

    (async () => {
      try {
        const [rawFlores, rawMano] = await Promise.all([
          fetch('/assets/flores-hero-final.svg').then(r => r.text()),
          fetch('/assets/mano-hero-final.svg').then(r => r.text()),
        ]);

        if (dead) return;

        // --- FLORES ---
        // Strip <?xml?> — rompe innerHTML en algunos parsers
        const floresSvg = rawFlores.replace(/<\?xml[^?]*\?>\s*/i, '');
        floresRef.current!.innerHTML = floresSvg;
        const floresEl = floresRef.current!.querySelector('svg');
        if (!floresEl) { console.error('[Hero] flores SVG no encontrado'); return; }

        floresEl.removeAttribute('width');
        floresEl.removeAttribute('height');
        floresEl.style.cssText = 'width:100%;height:100%;display:block;';
        // xMaxYMin slice: alinea el ramo al borde derecho y lo escala para cubrir el
        // contenedor en cualquier alto de pantalla — el exceso se recorta con overflow:hidden
        floresEl.setAttribute('preserveAspectRatio', 'xMaxYMin slice');

        // requestAnimationFrame garantiza que el browser haya procesado el layout
        // antes de llamar getTotalLength() — sin esto puede devolver 0
        await new Promise<void>(res => { raf = requestAnimationFrame(() => res()); });
        if (dead) return;

        const paths = Array.from(floresEl.querySelectorAll<SVGPathElement>('path'));
        paths.forEach(path => {
          const len = path.getTotalLength();
          path.setAttribute('fill',                'none');
          path.setAttribute('stroke',              '#A07860');
          path.setAttribute('stroke-width',        '0.8');
          path.setAttribute('stroke-dasharray',    String(len));
          path.setAttribute('stroke-dashoffset',   String(len)); // inicial = oculto
        });

        // --- MANO ---
        const manoSvg = rawMano.replace(/<\?xml[^?]*\?>\s*/i, '');
        manoRef.current!.innerHTML = manoSvg;
        const manoEl = manoRef.current!.querySelector('svg');
        if (!manoEl) { console.error('[Hero] mano SVG no encontrado'); return; }

        manoEl.removeAttribute('width');
        manoEl.removeAttribute('height');
        manoEl.style.cssText = 'width:100%;height:100%;display:block;';
        manoEl.querySelectorAll('path').forEach(p => {
          p.removeAttribute('style');
          p.setAttribute('fill', '#A07860');
        });

        if (dead) return;

        // --- GSAP TIMELINE ---
        const tl = gsap.timeline();
        tlRef.current = tl;

        // 1. Logo fade-in (estado inicial opacity:0 viene del JSX)
        tl.to(logoRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);

        // 2. Flores draw-on via stroke-dashoffset (attr plugin — opera sobre atributo SVG)
        if (paths.length > 0) {
          tl.to(
            paths,
            { attr: { 'stroke-dashoffset': 0 }, duration: 0.4, ease: 'power1.out', stagger: 0.008 },
            0.2,
          );
        }

        // 3. Texto slide-up (estado inicial opacity:0 en JSX)
        tl.fromTo(
          [h1Ref.current, sub1Ref.current, sub2Ref.current],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
          0.9,
        );

        // 4. CTA scale-in
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
        );

        // 5. Mano reveal desde abajo (estado inicial clipPath en JSX del div wrapper)
        tl.fromTo(
          manoRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' },
        );
      } catch (err) {
        console.error('[Hero] Error al cargar SVGs:', err);
      }
    })();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      tlRef.current?.kill();
    };
  }, []);

  const waHref = `https://wa.me/56931924796?text=${encodeURIComponent('Hola, vengo de tu web y me gustaría agendar una cita 💅')}`;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#EDE3DC',
        width: '100%',
        maxWidth: 390,
        minHeight: '100dvh',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        // clamp: ~186px en iPhone SE, ~236px en iPhone 12, ~261px en iPhone 15 Pro Max
        paddingTop: 'clamp(160px, 28dvh, 280px)',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 48,
        boxSizing: 'border-box',
      }}
    >
      {/* Mano — overlay full-canvas z:1; clipPath inicial en JSX */}
      <div
        ref={manoRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, clipPath: 'inset(100% 0% 0% 0%)' }}
      />

      {/* Flores — overlay full-canvas z:2 */}
      <div
        ref={floresRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Logo — esquina superior IZQUIERDA (per PROYECTO.md); opacity:0 inicial en JSX */}
      <div
        ref={logoRef}
        className="absolute"
        style={{ top: 24, left: 24, zIndex: 10, opacity: 0 }}
      >
        <Image
          src="/assets/logo.png"
          alt="JoArt Nails Studio"
          width={110}
          height={110}
          style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
          priority
        />
      </div>

      {/* Bloque de texto + CTA — fluye dentro del flex section */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <h1
          ref={h1Ref}
          className="font-playfair"
          style={{
            fontSize: 'clamp(32px, 9.5vw, 38px)',
            lineHeight: 1.15,
            color: '#A07860',
            margin: 0,
            opacity: 0,  // GSAP anima a 1
          }}
        >
          Joart<br />Nails Studio
        </h1>

        <p
          ref={sub1Ref}
          className="font-poppins font-bold"
          style={{ marginTop: 4, fontSize: 15, color: '#7A5040', opacity: 0 }}
        >
          Studio de nails premium en Ñuñoa
        </p>

        <p
          ref={sub2Ref}
          className="font-poppins"
          style={{ marginTop: 4, fontSize: 14, color: '#5C3D3D', opacity: 0 }}
        >
          Diseños personalizados. Resultados que duran.
        </p>

        {/* CTA glassmorphism — Playfair + shine animado */}
        <a
          ref={ctaRef}
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-playfair font-bold uppercase"
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            width: 232,
            height: 54,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(160,120,96,0.3)',
            borderRadius: 27,
            color: '#A07860',
            letterSpacing: '0.12em',
            fontSize: 14,
            textDecoration: 'none',
            opacity: 0,  // GSAP anima a 1
          }}
        >
          {/* Shine — pseudo-efecto de brillo que recorre el botón en loop */}
          <span className="cta-shine" aria-hidden="true" />
          {/* Texto por encima del shine */}
          <span style={{ position: 'relative', zIndex: 1 }}>AGENDAR CITA</span>
        </a>
      </div>
    </section>
  );
}
