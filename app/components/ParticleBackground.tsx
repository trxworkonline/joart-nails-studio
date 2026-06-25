'use client';

import dynamic from 'next/dynamic';

const ParticleScene = dynamic(() => import('./ParticleScene'), { ssr: false });

export default function ParticleBackground() {
  return <ParticleScene />;
}
