'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

const ICONOS = [
  {
    src: '/assets/iconos/icono-calidad.png',
    titulo: 'Materiales premium',
    texto: 'Productos de alta gama para resultados que duran 3 a 4 semanas sin dañar tus uñas.',
  },
  {
    src: '/assets/iconos/icono-asesoria.png',
    titulo: 'Diseño a tu medida',
    texto: 'Te guiamos para elegir lo que más te favorece. Sin presión, con criterio.',
  },
  {
    src: '/assets/iconos/icono-safeplace.png',
    titulo: 'Studio privado',
    texto: 'Espacio íntimo y cómodo en Ñuñoa, pensado para que disfrutes cada minuto.',
  },
];

const GALERIA = Array.from({ length: 7 }, (_, i) => `/assets/galeria/galeria${i + 1}.png`);

const CARD_W = 240;
const CARD_H = 300;
const STEP   = 212;

function Carrusel() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const N = GALERIA.length;

  const go = (delta: number) =>
    setActive(prev => Math.max(0, Math.min(N - 1, prev + delta)));

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -40 || info.velocity.x < -150) go(1);
    else if (info.offset.x > 40 || info.velocity.x > 150) go(-1);
  };

  return (
    <div>
      {/* Pista coverflow */}
      <div
        style={{ position: 'relative', height: CARD_H + 32, overflow: 'hidden' }}
        aria-label="Galería de trabajos JoArt"
      >
        {GALERIA.map((src, i) => {
          const dist    = i - active;
          const isCenter  = dist === 0;
          const isAdjacent = Math.abs(dist) === 1;
          const isVisible  = Math.abs(dist) <= 1;

          return (
            <motion.div
              key={src}
              drag={isCenter ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={isCenter ? handleDragEnd : undefined}
              onClick={isAdjacent ? () => setActive(i) : undefined}
              whileDrag={{ cursor: 'grabbing' }}
              animate={{
                x: dist * STEP,
                scale: isCenter ? 1 : 0.8,
                opacity: isVisible ? (isCenter ? 1 : 0.42) : 0,
                filter: isCenter ? 'brightness(1)' : 'brightness(0.72)',
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 290, damping: 30 }
              }
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                zIndex: isCenter ? 10 : 4,
                cursor: isCenter ? 'grab' : isAdjacent ? 'pointer' : 'default',
                borderRadius: 18,
                overflow: 'hidden',
                pointerEvents: isVisible ? 'auto' : 'none',
                // Marco con profundidad — sombra suave + borde rosado
                boxShadow: isCenter
                  ? '0 8px 36px rgba(90,60,50,0.26), 0 2px 8px rgba(90,60,50,0.12), 0 0 0 1px rgba(232,180,192,0.30)'
                  : '0 4px 14px rgba(90,60,50,0.13), 0 0 0 1px rgba(232,180,192,0.14)',
              }}
            >
              <Image
                src={src}
                alt={`Trabajo JoArt ${i + 1}`}
                width={CARD_W}
                height={CARD_H}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Dots de navegación */}
      <div
        role="tablist"
        aria-label="Navegar galería"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 22 }}
      >
        {GALERIA.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Foto ${i + 1}`}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 22 : 8,
              height: 8,
              minWidth: 44,  // área táctil ≥44px
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'block',
                width: i === active ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? '#A07860' : 'rgba(160,120,96,0.28)',
                transition: reduced ? 'none' : 'all 0.25s ease',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ConfianzaGaleriaSection() {
  return (
    <section style={{ padding: '72px 0 80px' }}>
      {/* Fila de 3 íconos */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          padding: '0 18px',
          maxWidth: 390,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {ICONOS.map(({ src, titulo, texto }) => (
          <div
            key={titulo}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Image
              src={src}
              alt={titulo}
              width={124}
              height={124}
              style={{ objectFit: 'contain', marginBottom: 10 }}
            />
            <p
              className="font-playfair"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#7A5040',
                margin: '0 0 5px',
                lineHeight: 1.25,
              }}
            >
              {titulo}
            </p>
            <p
              className="font-poppins"
              style={{
                fontSize: 13,
                color: '#8B6A6A',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {texto}
            </p>
          </div>
        ))}
      </div>

      {/* Galería coverflow — respira pero no separa */}
      <div style={{ marginTop: 52 }}>
        <Carrusel />
      </div>
    </section>
  );
}
