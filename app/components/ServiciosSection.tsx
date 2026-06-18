'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const WA_NUM = '56988210335';
const waLink = (nombre: string) =>
  `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Hola, quiero agendar ${nombre}`)}`;

const servicios = [
  {
    id: 'manicura-rusa',
    nombre: 'Manicura Rusa',
    destacado: true,
    descripcion:
      'Set para nails naturales de tamaño corto con nivelación en gel, duración de 3 a 4 semanas.',
    precio: '$19.990',
    precioPrefijo: 'Valor:',
    nota: 'Incluye limpieza profunda, limado, exfoliación e hidratación.',
    imagenes: [
      '/assets/servicios/manicura-rusa-4.png',
      '/assets/servicios/manicura-rusa-1.png',
      '/assets/servicios/manicura-rusa-2.png',
      '/assets/servicios/manicura-rusa-3.png',
      '/assets/servicios/manicura-rusa-5.png',
    ],
  },
  {
    id: 'nails-polygel',
    nombre: 'Nails Polygel',
    destacado: true,
    descripcion:
      'Set especial para extender tus nails al largo y forma que gustes, duración de 3 a 4 semanas.',
    precio: '$24.990',
    precioPrefijo: 'Valor desde:',
    nota: 'El valor final varía según el largo y diseño elegido.',
    imagenes: [
      '/assets/servicios/nails-polygel-3.png',
      '/assets/servicios/nails-polygel-1.png',
      '/assets/servicios/nails-polygel-2.png',
      '/assets/servicios/nails-polygel-4.png',
      '/assets/servicios/nails-polygel-5.png',
    ],
  },
  {
    id: 'pedicura-spa',
    nombre: 'Pedicura Spa',
    destacado: false,
    descripcion:
      'Set para las nails de tus pies que incluye hidro-spa temperado, limpieza, hidratación y esmaltado en gel, duración de 4 a 5 semanas.',
    precio: '$19.990',
    precioPrefijo: 'Valor:',
    nota: 'Esmaltado disponible en unicolor o francés.',
    imagenes: [
      '/assets/servicios/pedicura-spa-1.png',
      '/assets/servicios/pedicura-spa-2.png',
      '/assets/servicios/pedicura-spa-3.png',
      '/assets/servicios/pedicura-spa-4.png',
    ],
  },
  {
    id: 'perfilado-cejas',
    nombre: 'Perfilado de Cejas',
    destacado: false,
    descripcion: 'Limpieza y perfilado de cejas con cera de banda temperada, acabado natural.',
    precio: '$6.990',
    precioPrefijo: 'Valor:',
    nota: 'Resultado natural, no invasivo.',
    imagenes: [
      '/assets/servicios/perfilado-cejas-1.png',
      '/assets/servicios/perfilado-cejas-2.png',
      '/assets/servicios/perfilado-cejas-3.png',
      '/assets/servicios/perfilado-cejas-4.png',
    ],
  },
];

type Servicio = (typeof servicios)[0];

// ---------------------------------------------------------------------------
// Carrusel: swipeable image gallery with dots navigation
// ---------------------------------------------------------------------------

function Carrusel({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [idx, setIdx]           = useState(0);
  const containerRef            = useRef<HTMLDivElement>(null);
  const [width, setWidth]       = useState(390);

  // Measure container on mount and resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = (n: number) => Math.max(0, Math.min(imagenes.length - 1, n));

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Animated strip */}
      <motion.div
        animate={{ x: -idx * width }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        drag="x"
        dragConstraints={{ left: -(imagenes.length - 1) * width, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x < -40) setIdx(i => clamp(i + 1));
          else if (info.offset.x > 40) setIdx(i => clamp(i - 1));
        }}
        style={{ display: 'flex', height: '100%', willChange: 'transform' }}
      >
        {imagenes.map((src, i) => (
          <div
            key={i}
            style={{ flexShrink: 0, width, height: '100%', position: 'relative' }}
          >
            <Image
              src={src}
              alt={`${nombre} ${i + 1}`}
              fill
              style={{ objectFit: 'cover', userSelect: 'none', pointerEvents: 'none' }}
              sizes="(max-width: 480px) 100vw, 480px"
              priority={i === 0}
            />
          </div>
        ))}
      </motion.div>

      {/* Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          zIndex: 10,
        }}
      >
        {imagenes.map((_, i) => (
          <button
            key={i}
            aria-label={`Imagen ${i + 1} de ${imagenes.length}`}
            onClick={() => setIdx(i)}
            style={{
              width:   i === idx ? 8 : 6,
              height:  i === idx ? 8 : 6,
              borderRadius: '50%',
              background: 'white',
              opacity: i === idx ? 1 : 0.5,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ServiciosSection — grid + modal
// ---------------------------------------------------------------------------

export default function ServiciosSection() {
  const [activo, setActivo] = useState<Servicio | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activo]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActivo(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── GRID ──────────────────────────────────────────────────── */}
      <section
        id="servicios"
        style={{
          width: '100%',
          maxWidth: 390,
          margin: '0 auto',
          padding: '48px 24px',
          boxSizing: 'border-box',
          backgroundColor: '#EDE3DC',
        }}
      >
        <h2
          className="font-playfair"
          style={{
            fontSize: 'clamp(28px, 7vw, 34px)',
            color: '#A07860',
            margin: '0 0 20px 0',
            lineHeight: 1.15,
          }}
        >
          Servicios
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {servicios.map(s => (
            <motion.div
              key={s.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActivo(s)}
              style={{
                position: 'relative',
                aspectRatio: s.destacado ? '1/1.3' : '1/1.1',
                borderRadius: 18,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* Cover image */}
              <Image
                src={s.imagenes[0]}
                alt={s.nombre}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 390px) 50vw, 195px"
              />

              {/* Gradient overlay for text legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.52), transparent 60%)',
                }}
              />

              {/* Service name */}
              <p
                className="font-poppins"
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 700,
                  margin: 0,
                  padding: '0 6px',
                  zIndex: 2,
                  lineHeight: 1.3,
                }}
              >
                {s.nombre}
              </p>

              {/* Shine sweep for destacado cards */}
              {s.destacado && <span className="tarjeta-shine" aria-hidden="true" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activo && (
          // key = activo.id forces full re-mount when switching between services
          <div key={activo.id} style={{ position: 'fixed', inset: 0, zIndex: 40 }}>

            {/* Dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActivo(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
            />

            {/* Modal panel — slides up */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                maxWidth: 480,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1c1410',
                overflow: 'hidden',
              }}
              role="dialog"
              aria-modal="true"
              aria-label={activo.nombre}
            >
              {/* Carousel — takes all remaining height */}
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <Carrusel
                  key={activo.id}
                  imagenes={activo.imagenes}
                  nombre={activo.nombre}
                />

                {/* Back button */}
                <button
                  autoFocus
                  onClick={() => setActivo(null)}
                  aria-label="Cerrar"
                  style={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    zIndex: 20,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M12 4L6 10L12 16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Info card — glassmorphism, height = content */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px 24px 0 0',
                  background: 'rgba(255,255,255,0.13)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  padding: 24,
                  overflow: 'hidden',
                }}
              >
                {/* Subtle shine on info card for destacado services */}
                {activo.destacado && <span className="tarjeta-shine" aria-hidden="true" />}

                {/* Nombre */}
                <h3
                  className="font-playfair"
                  style={{
                    fontSize: 24,
                    color: '#ffffff',
                    margin: '0 0 8px 0',
                    lineHeight: 1.2,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {activo.nombre}
                </h3>

                {/* Descripción */}
                <p
                  className="font-poppins"
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.82)',
                    margin: '0 0 12px 0',
                    lineHeight: 1.55,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {activo.descripcion}
                </p>

                {/* Precio */}
                <p
                  className="font-poppins"
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#C49A78',
                    margin: '0 0 16px 0',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {activo.precioPrefijo} {activo.precio}
                </p>

                {/* Botón Agendar — full-width, solid brand color + shine */}
                <a
                  href={waLink(activo.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-poppins"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 50,
                    borderRadius: 25,
                    background: '#A07860',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    marginBottom: 8,
                    boxSizing: 'border-box',
                  }}
                >
                  <span className="cta-shine" aria-hidden="true" />
                  <span style={{ position: 'relative', zIndex: 1 }}>AGENDAR</span>
                </a>

                {/* Nota */}
                <p
                  className="font-poppins"
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.55)',
                    margin: 0,
                    lineHeight: 1.5,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {activo.nota}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
