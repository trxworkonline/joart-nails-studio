'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export default function CTAFinalSection() {
  const waHref = `https://wa.me/56988210335?text=${encodeURIComponent('Hola, vengo de tu web y me gustaría agendar una cita 💅')}`;
  const igHref = 'https://instagram.com/joart.cl';
  const shouldReduceMotion = useReducedMotion();

  const floatTransition = {
    duration: 2.5,
    repeat: Infinity,
    ease: 'easeInOut',
  } as const;

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' }}
      style={{
        maxWidth: 390,
        margin: '0 auto',
        padding: '96px 24px 64px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div>
        <h2
          className="font-playfair"
          style={{ color: '#A07860', fontSize: 'clamp(28px, 7vw, 34px)', lineHeight: 1.15, margin: 0 }}
        >
          ¿Lista para tus nails?
        </h2>
        <p className="font-poppins" style={{ color: '#8B6A6A', fontSize: 15, marginTop: 10 }}>
          Cuéntanos qué diseño sueñas y te respondemos hoy.
        </p>
      </div>

      {/* Container ampliado 30px para acomodar la etiqueta bajo la botella WA */}
      <div style={{ position: 'relative', width: 162, height: 240, marginTop: 48 }}>

        {/* WhatsApp — flota para señalizar que es tappable */}
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          animate={shouldReduceMotion ? {} : { y: [0, -7, 0] }}
          transition={floatTransition}
          whileTap={{ scale: 0.93 }}
          style={{ position: 'absolute', left: 0, top: 11, width: 84, height: 185, zIndex: 1, display: 'block' }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '70%',
              left: '50%',
              width: 126,
              height: 126,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(160,120,96,0.65) 0%, rgba(160,120,96,0.35) 40%, rgba(160,120,96,0) 72%)',
              filter: 'blur(14px)',
              zIndex: 0,
            }}
          />
          <Image
            src="/assets/footer/esmalte-whatsapp.png"
            alt="Escríbenos por WhatsApp"
            width={84}
            height={185}
            style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </motion.a>

        {/* Etiqueta bajo la botella WA — pulsa en sync con el float */}
        <motion.p
          aria-hidden="true"
          className="font-poppins"
          animate={shouldReduceMotion ? {} : { opacity: [0.55, 1, 0.55] }}
          transition={floatTransition}
          style={{
            position: 'absolute',
            left: 0,
            top: 204,
            width: 84,
            textAlign: 'center',
            fontSize: 10,
            color: '#A07860',
            letterSpacing: '0.14em',
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          ESCRÍBENOS
        </motion.p>

        {/* Instagram — al frente, estática */}
        <motion.a
          href={igHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Síguenos en Instagram"
          whileTap={{ scale: 0.93 }}
          style={{ position: 'absolute', right: 0, top: 0, width: 93, height: 210, zIndex: 2, display: 'block' }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '70%',
              left: '50%',
              width: 140,
              height: 140,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(232,180,192,0.95) 0%, rgba(232,180,192,0.55) 40%, rgba(232,180,192,0) 72%)',
              filter: 'blur(14px)',
              zIndex: 0,
            }}
          />
          <Image
            src="/assets/footer/esmalte-instagram.png"
            alt="Síguenos en Instagram"
            width={93}
            height={210}
            style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </motion.a>
      </div>
    </motion.section>
  );
}
