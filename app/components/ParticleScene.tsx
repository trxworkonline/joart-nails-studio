'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PALETTE = [0xF7D9E0, 0xE8B4C0, 0xFFFFFF];
const AMPLITUDE = 0.4; // ~3-5% del rango de la escena (-10..10)

export default function ParticleScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frameId = 0;
    let resizeRaf = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let handleResize: (() => void) | null = null;
    let handleVisibility: (() => void) | null = null;

    try {
      const count = window.innerWidth < 768 ? 120 : 300;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100,
      );
      camera.position.z = 10;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const origins = new Float32Array(count * 3);
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      // Drift autónomo: fase y período propios por eje, sin reaccionar a mouse/scroll
      const phasesX = new Float32Array(count);
      const phasesY = new Float32Array(count);
      const periodsX = new Float32Array(count);
      const periodsY = new Float32Array(count);
      const colorObj = new THREE.Color();

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 10;
        origins.set([x, y, z], idx);
        positions.set([x, y, z], idx);

        colorObj.set(PALETTE[i % PALETTE.length]);
        colorObj.toArray(colors, idx);

        phasesX[i] = Math.random() * Math.PI * 2;
        phasesY[i] = Math.random() * Math.PI * 2;
        periodsX[i] = 11 + (Math.random() * 6 - 3); // 8-14s
        periodsY[i] = 11 + (Math.random() * 6 - 3);
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const clock = new THREE.Clock();
      let hidden = false;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (hidden || !renderer || !geometry) return;

        if (!prefersReducedMotion) {
          const elapsed = clock.getElapsedTime();
          const posAttr = geometry.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const angleX = elapsed * ((2 * Math.PI) / periodsX[i]) + phasesX[i];
            const angleY = elapsed * ((2 * Math.PI) / periodsY[i]) + phasesY[i];
            posAttr.array[idx] = origins[idx] + Math.sin(angleX) * AMPLITUDE;
            posAttr.array[idx + 1] = origins[idx + 1] + Math.sin(angleY) * AMPLITUDE;
          }
          posAttr.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };
      animate();

      handleVisibility = () => {
        hidden = document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibility);

      handleResize = () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0;
          if (!container || !renderer) return;
          const { clientWidth, clientHeight } = container;
          renderer.setSize(clientWidth, clientHeight);
          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
        });
      };
      window.addEventListener('resize', handleResize);
    } catch (err) {
      console.error('[ParticleScene] Error al inicializar Three.js:', err);
    }

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(resizeRaf);
      if (handleVisibility) document.removeEventListener('visibilitychange', handleVisibility);
      if (handleResize) window.removeEventListener('resize', handleResize);
      geometry?.dispose();
      material?.dispose();
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
