const TESTIMONIOS = [
  "hermosas",
  "las quiero",
  "fue un gran servicio y espacio",
  "Esas son las mías",
  "La mejor ❤️❤️❤️❤️❤️",
  "La mejor del mundo mundial <3",
  "Hermosaaaas !! Que seca !!",
] as const;

function TestimonioCard({ texto }: { texto: string }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 'max-content',
        maxWidth: 260,
        borderRadius: 20,
        padding: 20,
        background: '#F5E8DC',
        border: '1px solid rgba(232,180,192,0.3)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          fontSize: 28,
          lineHeight: 1,
          color: '#7A5040',
          marginBottom: 8,
        }}
      >
        &ldquo;
      </span>
      <p
        className="font-poppins"
        style={{
          fontSize: 15,
          color: '#5C3D3D',
          margin: '0 0 10px 0',
          lineHeight: 1.4,
        }}
      >
        {texto}
      </p>
      <p
        className="font-poppins"
        style={{
          fontSize: 11,
          color: '#B89090',
          margin: 0,
        }}
      >
        — Comentario real de Instagram
      </p>
    </div>
  );
}

export default function TestimoniosSection() {
  const dobleLista = [...TESTIMONIOS, ...TESTIMONIOS];

  return (
    <section style={{ padding: '64px 0', overflow: 'hidden' }}>
      <h2
        className="font-playfair"
        style={{
          fontSize: 'clamp(28px, 7vw, 34px)',
          color: '#5C3D3D',
          textAlign: 'center',
          margin: '0 0 40px 0',
        }}
      >
        Cariño que nos llegó
      </h2>

      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      >
        <div
          className="testimonios-track"
          style={{
            display: 'flex',
            gap: 16,
            width: 'max-content',
          }}
        >
          {dobleLista.map((texto, i) => (
            <TestimonioCard key={i} texto={texto} />
          ))}
        </div>
      </div>

      <p
        className="font-playfair"
        style={{
          fontSize: 18,
          fontStyle: 'italic',
          color: '#7A5040',
          textAlign: 'center',
          margin: '40px 24px 0 24px',
        }}
      >
        Te esperamos para sumar tu historia
      </p>
    </section>
  );
}
