// components/Cosmos.tsx
"use client";

// The continuous canvas. Three drifting orbs, a faint grid, sparse particles,
// and an ink-trail that follows the cursor. Persists across all routes via
// the root layout — feels like one camera panning between rooms, not separate pages.
//
// Respects prefers-reduced-motion: no particles, no cursor ink, no drift.

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 40;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  o: number;
};

export default function Cosmos() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inkRef = useRef<HTMLDivElement | null>(null);

  // Particles
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = !document.hidden;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    fit();

    const ps: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -0.05 - Math.random() * 0.10,
      r: 0.6 + Math.random() * 1.1,
      o: 0.18 + Math.random() * 0.32,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      fit();
    };

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Cursor ink — lazy follower (skipped on touch and reduced-motion).
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch =
      typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;
    if (reduce || isTouch) return;

    const ink = inkRef.current;
    if (!ink) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      ink.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className="cosmos" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grid-overlay" />
        <canvas ref={canvasRef} className="particles" />
      </div>
      <div ref={inkRef} className="cursor-ink" aria-hidden="true" />
    </>
  );
}
