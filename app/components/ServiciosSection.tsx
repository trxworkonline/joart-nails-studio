'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WA_NUM = '56988210335';
const waLink = (nombre: string) =>
  `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Hola, quiero agendar ${nombre}`)}`;

// ── SVG Icons ──────────────────────────────────────────────────────────────

function ManicuraIcon({ color = '#A07860' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20C9 15 10 9 12 7C14 9 15 15 15 20" />
      <path d="M9 20Q12 22 15 20" />
      <path d="M8 21.5Q12 23 16 21.5" />
    </svg>
  );
}

function PolygelIcon({ color = '#A07860' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 21C9.5 16 10.5 8 12 4C13.5 8 14.5 16 14.5 21" />
      <path d="M9.5 21Q12 22.5 14.5 21" />
      <path d="M8.5 22.5Q12 23.5 15.5 22.5" />
    </svg>
  );
}

function PedicuraIcon({ color = '#A07860' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="5" cy="5" rx="1.8" ry="2.5" />
      <ellipse cx="9" cy="3.5" rx="1.8" ry="3" />
      <ellipse cx="13" cy="3.5" rx="1.8" ry="3" />
      <ellipse cx="17" cy="4.5" rx="1.8" ry="2.5" />
      <ellipse cx="20.5" cy="7" rx="1.5" ry="2" />
      <path d="M3.5 7.5C3 12 5 20 9 21.5H16C20 20 21.5 13 21 7.5" />
    </svg>
  );
}

function CejasIcon({ color = '#A07860' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 15Q6 6 13 7Q18 8 22 13" />
      <path d="M3 17.5Q7 9 13 10Q18 11 21.5 15.5" />
    </svg>
  );
}

function getIcon(key: string, color?: string) {
  switch (key) {
    case 'manicura': return <ManicuraIcon color={color} />;
    case 'polygel':  return <PolygelIcon color={color} />;
    case 'pedicura': return <PedicuraIcon color={color} />;
    case 'cejas':    return <CejasIcon color={color} />;
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
  console.log(`[Carrusel] "${nombre}" — ${imagenes.length} imágenes:`, imagenes);
  const [idx, setIdx]     = useState(0);
  const containerRef      = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(342);

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
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
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

      {/* Dots inside image container, above the info card overlap zone */}
      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
        zIndex: 3,
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
              pointerEvents: 'all',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ServiciosSection() {
  const [activo, setActivo] = useState<Servicio | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Grid entrance animations: left column slides from left, right column from right
  useEffect(() => {
    const seccionServicios = document.querySelector('#servicios');
    if (!seccionServicios) {
      console.warn('[ServiciosSection] #servicios no encontrado — ScrollTrigger no se registrará');
      return;
    }

    const tl1 = gsap.from('.tarjeta-columna-izquierda', {
      x: -40,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: seccionServicios,
        start: 'top 75%',
        invalidateOnRefresh: true,
      },
    });

    const tl2 = gsap.from('.tarjeta-columna-derecha', {
      x: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: seccionServicios,
        start: 'top 75%',
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tl1.scrollTrigger?.kill();
      tl2.scrollTrigger?.kill();
    };
  }, []);

  return (
    <>
      {/* ── GRID SECTION ──────────────────────────────────────────── */}
      <section
        id="servicios"
        ref={sectionRef}
        style={{
          width: '100%',
          maxWidth: 390,
          margin: '0 auto',
          padding: '96px 24px 48px',
          boxSizing: 'border-box',
          backgroundColor: '#EDE3DC',
        }}
      >
        {/* Section title — centered */}
        <h2
          className="font-playfair"
          style={{
            fontSize: 'clamp(28px, 7vw, 34px)',
            color: '#A07860',
            margin: '0 0 8px 0',
            lineHeight: 1.15,
            textAlign: 'center',
          }}
        >
          Servicios
        </h2>

        {/* Short copy — replaces previous long paragraph */}
        <p
          className="font-poppins"
          style={{
            fontSize: 15,
            color: '#7A6055',
            margin: '0 0 32px 0',
            textAlign: 'center',
          }}
        >
          Manicura rusa, nail art en polygel y más, en el corazón de Ñuñoa.
        </p>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {servicios.map((s, i) => (
            <motion.div
              key={s.id}
              className={i % 2 === 0 ? 'tarjeta-columna-izquierda' : 'tarjeta-columna-derecha'}
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
              {s.destacado && <span className="tarjeta-shine" aria-hidden="true" />}
            </motion.div>
          ))}
        </div>

        {/* Closing paragraph after the grid */}
        <p
          className="font-poppins"
          style={{
            fontSize: 14,
            color: '#7A6055',
            lineHeight: 1.7,
            textAlign: 'center',
            maxWidth: 320,
            margin: '40px auto 0',
          }}
        >
          Cada servicio en Joart Nails Studio combina técnica, productos premium y un cuidado
          meticuloso en cada sesión. Porque sabemos que un buen manicure no es solo estética:
          es la confianza que llevas contigo a todas partes.
        </p>
      </section>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activo && (
          // Overlay — centered flex container, no dark background (intentional)
          <motion.div
            key={activo.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActivo(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10vh 24px',
            }}
          >
            {/* Back button — screen corner, outside the bloque */}
            <button
              autoFocus
              onClick={e => { e.stopPropagation(); setActivo(null); }}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                zIndex: 60,
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

            {/* Bloque: image container + info card as one piece */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={activo.nombre}
              style={{
                width: '100%',
                maxWidth: 342,
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image container — fills available vertical space */}
              <div style={{
                flex: 1,
                minHeight: 0,
                borderRadius: 24,
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
              }}>
                <Carrusel key={activo.id} imagenes={activo.imagenes} nombre={activo.nombre} />
              </div>

              {/* Info card — overlaps image by 10%, height auto resolves BUG 2 */}
              <div style={{
                height: 'auto',
                marginTop: '-10%',
                borderRadius: 24,
                position: 'relative',
                zIndex: 2,
                padding: 24,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden',
              }}>
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
                    {getIcon(activo.icono, '#FFFFFF')}
                  </div>
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
                  <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)' }} />
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
                      color: '#FFFFFF',
                      margin: 0,
                    }}>
                      {activo.precio}
                    </p>
                  </div>
                </div>

                {/* e) CTA button */}
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
