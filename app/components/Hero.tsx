'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function Hero() {
  const logoRef = useRef<HTMLDivElement>(null);
  const floresWrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const sub1Ref = useRef<HTMLParagraphElement>(null);
  const sub2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const manoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;
    let dead = false;

    gsap.set(logoRef.current, { opacity: 0 });
    gsap.set([h1Ref.current, sub1Ref.current, sub2Ref.current, ctaRef.current], { opacity: 0 });
    gsap.set(manoWrapRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });

    Promise.all([
      fetch('/assets/flores-hero-final.svg').then(r => r.text()),
      fetch('/assets/mano-hero-final.svg').then(r => r.text()),
    ]).then(([floresSvg, manoSvg]) => {
      if (dead || !floresWrapRef.current || !manoWrapRef.current) return;

      // FIX 1: innerHTML es más fiable que DOMParser+appendChild para SVG en el DOM
      // --- FLORES ---
      floresWrapRef.current.innerHTML = floresSvg;
      const floresEl = floresWrapRef.current.querySelector('svg')!;
      floresEl.removeAttribute('width');
      floresEl.removeAttribute('height');
      floresEl.style.cssText = 'width:100%;height:100%;display:block;';

      const floresPaths = Array.from(floresEl.querySelectorAll<SVGPathElement>('path'));
      floresPaths.forEach(path => {
        const length = path.getTotalLength();
        // Usar setAttribute (attr SVG) — más confiable que CSS property para stroke-dashoffset
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#A07860');
        path.setAttribute('stroke-width', '0.8');
        path.setAttribute('stroke-dasharray', String(length));
        path.setAttribute('stroke-dashoffset', String(length));
      });

      // --- MANO ---
      manoWrapRef.current.innerHTML = manoSvg;
      const manoEl = manoWrapRef.current.querySelector('svg')!;
      manoEl.removeAttribute('width');
      manoEl.removeAttribute('height');
      manoEl.style.cssText = 'width:100%;height:100%;display:block;';
      manoEl.querySelectorAll('path').forEach(p => {
        p.removeAttribute('style');
        p.setAttribute('fill', '#A07860');
      });

      // --- GSAP TIMELINE ---
      tl = gsap.timeline();

      // 1. Logo
      tl.to(logoRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);

      // 2. Flores draw-on (stroke-dashoffset via attr plugin — garantiza animación de atributo SVG)
      tl.to(floresPaths, {
        attr: { 'stroke-dashoffset': 0 },
        duration: 0.4,
        ease: 'power1.out',
        stagger: 0.008,
      }, 0.2);

      // 3. Texto fade-in + slide-up
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

      // 5. Mano reveal desde abajo
      tl.to(manoWrapRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1,
        ease: 'power2.inOut',
      });
    });

    return () => {
      dead = true;
      tl?.kill();
    };
  }, []);

  const waHref = `https://wa.me/56931924796?text=${encodeURIComponent('Hola, vengo de tu web y me gustaría agendar una cita 💅')}`;

  return (
    // FIX 2: Flexbox + clamp para responsive — no más position:absolute con top fijo en px
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
        // paddingTop empuja el texto a ~28% del alto de pantalla en cualquier dispositivo
        paddingTop: 'clamp(160px, 28dvh, 280px)',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 48,
        boxSizing: 'border-box',
      }}
    >
      {/* Mano ilustrada — overlay full-canvas, z:1 (debajo de flores y texto) */}
      <div
        ref={manoWrapRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Flores botánicas — overlay full-canvas, z:2 */}
      <div
        ref={floresWrapRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Logo — esquina superior derecha, z:10 */}
      <div
        ref={logoRef}
        className="absolute"
        style={{ top: 24, right: 24, zIndex: 10 }}
      >
        <Image
          src="/assets/logo.png"
          alt="JoArt Nails Studio"
          width={90}
          height={90}
          style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
          priority
        />
      </div>

      {/* Bloque de texto + CTA — fluye dentro del flex, relativo al paddin-top */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        {/* FIX 3: clamp() para escalar el H1 con el viewport */}
        <h1
          ref={h1Ref}
          className="font-playfair"
          style={{
            fontSize: 'clamp(32px, 9.5vw, 38px)',
            lineHeight: 1.15,
            color: '#A07860',
            margin: 0,
          }}
        >
          Joart<br />Nails Studio
        </h1>

        <p
          ref={sub1Ref}
          className="font-poppins font-bold"
          style={{ marginTop: 4, fontSize: 15, color: '#7A5040' }}
        >
          Studio de nails premium en Ñuñoa
        </p>

        <p
          ref={sub2Ref}
          className="font-poppins"
          style={{ marginTop: 4, fontSize: 14, color: '#5C3D3D' }}
        >
          Diseños personalizados. Resultados que duran.
        </p>

        {/* FIX 4: glassmorphism — sin clases Tailwind que sobreescriban el background */}
        <a
          ref={ctaRef}
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-poppins font-bold uppercase"
          style={{
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
            letterSpacing: '0.08em',
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          AGENDAR CITA
        </a>
      </div>
    </section>
  );
}
