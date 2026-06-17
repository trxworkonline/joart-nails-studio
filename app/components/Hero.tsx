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

    const parser = new DOMParser();

    Promise.all([
      fetch('/assets/flores-hero-final.svg').then(r => r.text()),
      fetch('/assets/mano-hero-final.svg').then(r => r.text()),
    ]).then(([floresSvg, manoSvg]) => {
      if (dead || !floresWrapRef.current || !manoWrapRef.current) return;

      // --- FLORES ---
      const floresDoc = parser.parseFromString(floresSvg, 'image/svg+xml');
      const floresEl = floresDoc.querySelector('svg')!;
      floresEl.removeAttribute('width');
      floresEl.removeAttribute('height');
      floresEl.style.cssText = 'width:100%;height:100%;display:block;position:absolute;top:0;left:0;';
      floresWrapRef.current.appendChild(floresEl);

      const floresPaths = Array.from(floresEl.querySelectorAll<SVGPathElement>('path'));
      floresPaths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, {
          fill: 'none',
          stroke: '#A07860',
          strokeWidth: 0.8,
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      // --- MANO ---
      const manoDoc = parser.parseFromString(manoSvg, 'image/svg+xml');
      const manoEl = manoDoc.querySelector('svg')!;
      manoEl.removeAttribute('width');
      manoEl.removeAttribute('height');
      manoEl.style.cssText = 'width:100%;height:100%;display:block;position:absolute;top:0;left:0;';
      manoEl.querySelectorAll('path').forEach(p => {
        p.removeAttribute('style');
        p.setAttribute('fill', '#A07860');
      });
      manoWrapRef.current.appendChild(manoEl);

      // --- TIMELINE ---
      tl = gsap.timeline();

      // 1. Logo
      tl.to(logoRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);

      // 2. Flores draw secuencial (p000 → p098)
      tl.to(floresPaths, {
        strokeDashoffset: 0,
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

      // 4. Botón CTA
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
      );

      // 5. Mano: reveal desde abajo hacia arriba
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
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#EDE3DC',
        width: '100%',
        maxWidth: 390,
        minHeight: '100dvh',
        margin: '0 auto',
      }}
    >
      {/* Mano ilustrada — overlay full-canvas, aparece en zona inferior */}
      <div
        ref={manoWrapRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Flores botánicas — overlay full-canvas, zona superior derecha */}
      <div
        ref={floresWrapRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Logo — esquina superior derecha */}
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

      {/* Bloque de texto + CTA */}
      <div
        className="absolute"
        style={{ top: 240, left: 24, right: 24, zIndex: 5 }}
      >
        <h1
          ref={h1Ref}
          className="font-playfair"
          style={{ fontSize: 38, lineHeight: 1.15, color: '#A07860', margin: 0 }}
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

        <a
          ref={ctaRef}
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-poppins font-bold uppercase"
          style={{
            marginTop: 12,
            width: 232,
            height: 54,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
