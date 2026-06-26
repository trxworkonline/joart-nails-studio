'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const WA_HREF = `https://wa.me/56988210335?text=${encodeURIComponent('Hola, vengo de tu web y me gustaría agendar una cita 💅')}`;
const SIZE = 64;
// Mostrar solo después de scrollear el 50% del hero
const SCROLL_THRESHOLD_VH = 0.5;
// Esperar 600ms sin scroll antes de reaparecer
const REAPPEAR_DELAY_MS = 600;

export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const threshold = window.innerHeight * SCROLL_THRESHOLD_VH;

    const handleScroll = () => {
      // Esconderse inmediatamente mientras el dedo se mueve
      setShow(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Reaparecer solo si el usuario pasó el hero y dejó de scrollear
      timeoutRef.current = setTimeout(() => {
        if (window.scrollY > threshold) setShow(true);
      }, REAPPEAR_DELAY_MS);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="floating-wa"
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar cita por WhatsApp"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          whileTap={{ scale: 0.88 }}
          style={{
            position: 'fixed',
            // Esquina inferior derecha, por encima del home indicator de iPhone
            bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
            right: 20,
            width: SIZE,
            height: SIZE,
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 200,
            display: 'block',
            // Sombra suave de marca para que el botón levante sobre cualquier fondo
            boxShadow: '0 4px 18px rgba(122,80,64,0.30)',
            cursor: 'pointer',
          }}
        >
          <Image
            src="/assets/whatssap-joart.png"
            alt="Agendar por WhatsApp"
            width={SIZE}
            height={SIZE}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
