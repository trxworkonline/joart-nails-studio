'use client';

import dynamic from 'next/dynamic';

const ParticleScene = dynamic(() => import('./ParticleScene'), { ssr: false });

export default function ParticleBackground({ density }: { density?: 'normal' | 'subtle' }) {
  return <ParticleScene density={density} />;
}
