import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EDE3DC',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,180,192,0.55) 0%, rgba(232,180,192,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -140,
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,120,96,0.35) 0%, rgba(160,120,96,0) 70%)',
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: '#A07860',
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          Joart Nails Studio
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            fontFamily: 'sans-serif',
            color: '#7A5040',
            textAlign: 'center',
          }}
        >
          Studio de nails premium en Ñuñoa
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            fontFamily: 'sans-serif',
            color: '#5C3D3D',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          Reserva por WhatsApp
        </div>
      </div>
    ),
    { ...size }
  );
}
