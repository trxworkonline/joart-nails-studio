'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CTAFinalSection() {
  const waHref = `https://wa.me/56988210335?text=${encodeURIComponent('Hola, vengo de tu web y me gustaría agendar una cita 💅')}`;
  const igHref = 'https://instagram.com/joart.cl';

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        maxWidth: 390,
        margin: '0 auto',
        padding: '96px 24px 64px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {/* Columna texto — flex:1, toma el espacio restante */}
      <div style={{ flex: 1 }}>
        <h2
          className="font-playfair"
          style={{ color: '#A07860', fontSize: 'clamp(24px, 7.5vw, 30px)', lineHeight: 1.15, margin: 0 }}
        >
          Sigue el<br />proceso
        </h2>
        <p className="font-poppins" style={{ color: '#8B6A6A', fontSize: 14, marginTop: 8 }}>
          Míranos en Instagram<br />o escríbenos ya.
        </p>
      </div>

      {/* Columna botellas — ancho fijo por contenido, ancla al borde derecho */}
      <div style={{ position: 'relative', width: 115, height: 150, flex: '0 0 auto' }}>
        {/* WhatsApp — atrás, más chica, desplazada arriba-izquierda */}
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          whileTap={{ scale: 0.93 }}
          style={{ position: 'absolute', left: 0, bottom: 10, width: 60, height: 132, zIndex: 1, display: 'block' }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '70%',
              left: '50%',
              width: 90,
              height: 90,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(160,120,96,0.55) 0%, rgba(160,120,96,0.3) 40%, rgba(160,120,96,0) 72%)',
              filter: 'blur(10px)',
              zIndex: 0,
            }}
          />
          <Image
            src="/assets/footer/esmalte-whatsapp.png"
            alt="Escríbenos por WhatsApp"
            width={60}
            height={132}
            style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </motion.a>

        {/* Instagram — al frente, tamaño completo, anclada al borde derecho */}
        <motion.a
          href={igHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Síguenos en Instagram"
          whileTap={{ scale: 0.93 }}
          style={{ position: 'absolute', right: 0, bottom: 0, width: 66, height: 150, zIndex: 2, display: 'block' }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '70%',
              left: '50%',
              width: 100,
              height: 100,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(232,180,192,0.95) 0%, rgba(232,180,192,0.55) 40%, rgba(232,180,192,0) 72%)',
              filter: 'blur(10px)',
              zIndex: 0,
            }}
          />
          <Image
            src="/assets/footer/esmalte-instagram.png"
            alt="Síguenos en Instagram"
            width={66}
            height={150}
            style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </motion.a>
      </div>
    </motion.section>
  );
}
