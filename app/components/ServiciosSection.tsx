'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const WA_NUM = '56988210335';
const waLink = (nombre: string) =>
  `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Hola, quiero agendar ${nombre}`)}`;

// ── SVG Icons ──────────────────────────────────────────────────────────────

function ManicuraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#A07860" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20C9 15 10 9 12 7C14 9 15 15 15 20" />
      <path d="M9 20Q12 22 15 20" />
      <path d="M8 21.5Q12 23 16 21.5" />
    </svg>
  );
}

function PolygelIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#A07860" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 21C9.5 16 10.5 8 12 4C13.5 8 14.5 16 14.5 21" />
      <path d="M9.5 21Q12 22.5 14.5 21" />
      <path d="M8.5 22.5Q12 23.5 15.5 22.5" />
    </svg>
  );
}

function PedicuraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#A07860" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="5" cy="5" rx="1.8" ry="2.5" />
      <ellipse cx="9" cy="3.5" rx="1.8" ry="3" />
      <ellipse cx="13" cy="3.5" rx="1.8" ry="3" />
      <ellipse cx="17" cy="4.5" rx="1.8" ry="2.5" />
      <ellipse cx="20.5" cy="7" rx="1.5" ry="2" />
      <path d="M3.5 7.5C3 12 5 20 9 21.5H16C20 20 21.5 13 21 7.5" />
    </svg>
  );
}

function CejasIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#A07860" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 15Q6 6 13 7Q18 8 22 13" />
      <path d="M3 17.5Q7 9 13 10Q18 11 21.5 15.5" />
    </svg>
  );
}

function getIcon(key: string) {
  switch (key) {
    case 'manicura': return <ManicuraIcon />;
    case 'polygel':  return <PolygelIcon />;
    case 'pedicura': return <PedicuraIcon />;
    case 'cejas':    return <CejasIcon />;
    default: return null;
  }
}

// ── Service data ───────────────────────────────────────────────────────────

const servicios = [
  {
    id: 'manicura-rusa',
    nombre: 'Manicura Rusa',
    destacado: true,
    descripcion: 'Set para nails naturales de tamaño corto con nivelación en gel, duración de 3 a 4 semanas.',
    duracion: '60 - 75 min',
    precio: '$19.990',
    precioPrefijo: 'Valor:',
    nota: 'Se confirma disponibilidad de horario al momento de agendar.',
    icono: 'manicura',
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
    descripcion: 'Set especial para extender tus nails al largo y forma que gustes, duración de 3 a 4 semanas.',
    duracion: '110 - 120 min',
    precio: '$24.990',
    precioPrefijo: 'Valor desde:',
    nota: 'Se confirma disponibilidad de horario al momento de agendar.',
    icono: 'polygel',
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
    descripcion: 'Set para las nails de tus pies que incluye hidro-spa temperado, limpieza, hidratación y esmaltado en gel, duración de 4 a 5 semanas.',
    duracion: '45 - 60 min',
    precio: '$19.990',
    precioPrefijo: 'Valor:',
    nota: 'Se confirma disponibilidad de horario al momento de agendar.',
    icono: 'pedicura',
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
    duracion: '25 - 30 min',
    precio: '$6.990',
    precioPrefijo: 'Valor:',
    nota: 'Se confirma disponibilidad de horario al momento de agendar.',
    icono: 'cejas',
    imagenes: [
      '/assets/servicios/perfilado-cejas-1.png',
      '/assets/servicios/perfilado-cejas-2.png',
      '/assets/servicios/perfilado-cejas-3.png',
      '/assets/servicios/perfilado-cejas-4.png',
    ],
  },
];

type Servicio = (typeof servicios)[0];

// ── Carousel ───────────────────────────────────────────────────────────────

function Carrusel({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [idx, setIdx]     = useState(0);
  const containerRef      = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(342); // 390 - 48 (side margins)

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
    <>
      {/* Image strip — border-radius + overflow on the wrapper */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 280,
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
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
                sizes="(max-width: 480px) calc(100vw - 48px), 432px"
                priority={i === 0}
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots — below the image, not inside */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
      }}>
        {imagenes.map((_, i) => (
          <button
            key={i}
            aria-label={`Imagen ${i + 1} de ${imagenes.length}`}
            onClick={() => setIdx(i)}
            style={{
              width:   i === idx ? 8 : 6,
              height:  i === idx ? 8 : 6,
              borderRadius: '50%',
              background: '#A07860',
              opacity: i === idx ? 1 : 0.4,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ServiciosSection() {
  const [activo, setActivo] = useState<Servicio | null>(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = activo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activo]);

  // Escape closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActivo(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── GRID SECTION ──────────────────────────────────────────── */}
      <section
        id="servicios"
        style={{
          width: '100%',
          maxWidth: 390,
          margin: '0 auto',
          // Bug 3 fix: 64px top padding separates Hero from Servicios
          padding: '64px 24px 48px',
          boxSizing: 'border-box',
          backgroundColor: '#EDE3DC',
        }}
      >
        {/* Section title */}
        <h2
          className="font-playfair"
          style={{
            fontSize: 'clamp(28px, 7vw, 34px)',
            color: '#A07860',
            margin: '0 0 16px 0',
            lineHeight: 1.15,
          }}
        >
          Servicios
        </h2>

        {/* Presentation copy */}
        <p
          className="font-poppins"
          style={{
            fontSize: 14,
            color: '#7A6055',
            margin: '0 0 32px 0',
            lineHeight: 1.7,
          }}
        >
          En Joart Nails Studio combinamos técnica, precisión y un toque artístico en cada
          detalle. Desde la elegancia atemporal de la manicura rusa hasta la versatilidad del
          nail art en polygel, cada servicio está pensado para que tus manos y pies luzcan
          impecables por semanas. Ubicados en el corazón de Ñuñoa, trabajamos con productos de
          calidad premium y un cuidado meticuloso en cada sesión, porque sabemos que un buen
          manicure no es solo estética: es la confianza que llevas contigo a todas partes.
        </p>

        {/* Bento grid */}
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
              <Image
                src={s.imagenes[0]}
                alt={s.nombre}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 390px) 50vw, 195px"
              />
              {/* Gradient for text legibility */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)',
              }} />
              {/* Service name */}
              <p
                className="font-playfair"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 15,
                  margin: 0,
                  paddingBottom: 14,
                  paddingLeft: 8,
                  paddingRight: 8,
                  zIndex: 2,
                  lineHeight: 1.3,
                }}
              >
                {s.nombre}
              </p>
              {/* Shine on destacado cards */}
              {s.destacado && <span className="tarjeta-shine" aria-hidden="true" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activo && (
          <div key={activo.id} style={{ position: 'fixed', inset: 0, zIndex: 40 }}>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActivo(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            />

            {/* Modal panel — position:absolute so slide-up works; back button is absolute inside */}
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
                backgroundColor: '#0f0d0c',
              }}
              role="dialog"
              aria-modal="true"
              aria-label={activo.nombre}
            >
              {/* Background image — very dark, gives glassmorphism something to blur */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                <Image
                  src={activo.imagenes[0]}
                  alt=""
                  fill
                  style={{ objectFit: 'cover', opacity: 0.18 }}
                  sizes="480px"
                  aria-hidden="true"
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(15,13,12,0.55) 0%, rgba(15,13,12,0.25) 60%, rgba(15,13,12,0.1) 100%)',
                }} />
              </div>

              {/* Back button — absolute within panel, sits above scrollable content */}
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
                  <path d="M12 4L6 10L12 16"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Scrollable inner content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Spacer for back button + carousel */}
                <div style={{ padding: '80px 24px 0', flexShrink: 0 }}>
                  <Carrusel key={activo.id} imagenes={activo.imagenes} nombre={activo.nombre} />
                  <div style={{ height: 16 }} />
                </div>

                {/* Info card — glassmorphism clear, anchors to bottom */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    // Bug 1 fix: exact rgba values, no Tailwind bg classes
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '24px 24px 0 0',
                    padding: 24,
                    overflow: 'hidden',
                    marginTop: 'auto',
                  }}
                >
                {/* Shine for destacado info card */}
                {activo.destacado && <span className="tarjeta-shine" aria-hidden="true" />}

                {/* a) Nombre */}
                <h3
                  className="font-playfair"
                  style={{
                    fontSize: 24,
                    color: '#FFFFFF',
                    margin: '0 0 12px 0',
                    lineHeight: 1.2,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {activo.nombre}
                </h3>

                {/* b) Ícono + Descripción */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {/* Icon circle */}
                  <div style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(160, 120, 96, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {getIcon(activo.icono)}
                  </div>
                  {/* Description */}
                  <p
                    className="font-poppins"
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.85)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {activo.descripcion}
                  </p>
                </div>

                {/* c) Divider */}
                <div style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.2)',
                  width: '100%',
                  marginBottom: 16,
                  position: 'relative',
                  zIndex: 1,
                }} />

                {/* d) Duración | Precio */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginBottom: 20,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {/* Duración */}
                  <div style={{ textAlign: 'center' }}>
                    <p className="font-poppins" style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.6)',
                      margin: '0 0 2px 0',
                    }}>
                      Duración
                    </p>
                    <p className="font-poppins" style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0,
                    }}>
                      {activo.duracion}
                    </p>
                  </div>
                  {/* Vertical divider */}
                  <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)' }} />
                  {/* Precio */}
                  <div style={{ textAlign: 'center' }}>
                    <p className="font-poppins" style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.6)',
                      margin: '0 0 2px 0',
                    }}>
                      {activo.precioPrefijo}
                    </p>
                    <p className="font-poppins" style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#A07860',
                      margin: 0,
                    }}>
                      {activo.precio}
                    </p>
                  </div>
                </div>

                {/* e) CTA button "QUIERO ESTO" */}
                <a
                  href={waLink(activo.nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-playfair"
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
                    fontSize: 15,
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    marginBottom: 10,
                    boxSizing: 'border-box',
                    zIndex: 1,
                  }}
                >
                  <span className="cta-shine" aria-hidden="true" />
                  <span style={{ position: 'relative', zIndex: 1 }}>QUIERO ESTO</span>
                </a>

                {/* f) Nota */}
                <p
                  className="font-poppins"
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.55)',
                    margin: 0,
                    lineHeight: 1.5,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {activo.nota}
                </p>
              </div>{/* end info card */}
              </div>{/* end scrollable inner */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
