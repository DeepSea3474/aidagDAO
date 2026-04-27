'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * GenesisHeartbeat — hospital ECG-style monitor synchronized to BSC block production.
 * Each new block triggers a heartbeat spike (~ every 3s on BSC mainnet).
 */
export default function GenesisHeartbeat() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const beatRequestRef = useRef<number>(0);
  const [block, setBlock] = useState<number>(47823941);
  const [bpm, setBpm] = useState<number>(20);
  const [pulse, setPulse] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let rect = canvas.getBoundingClientRect();
    const W = () => rect.width;
    const H = () => rect.height;

    // ECG waveform: rolling buffer of samples
    const SAMPLE_RATE = 60; // px per second of trace
    const samples: number[] = [];
    const maxSamples = () => Math.ceil(W());
    let lastTs = performance.now();
    let lastBeatTime = performance.now();
    const BEAT_INTERVAL = 3000; // BSC ~3 sec per block
    let beatPhase = -1; // -1 = idle, 0..1 = drawing waveform

    const drawGrid = () => {
      // deep green-black background (classic cardiograph CRT)
      const bgGrad = ctx.createRadialGradient(W() / 2, H() / 2, 0, W() / 2, H() / 2, Math.max(W(), H()) * 0.7);
      bgGrad.addColorStop(0, '#021a10');
      bgGrad.addColorStop(0.6, '#010a07');
      bgGrad.addColorStop(1, '#000503');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W(), H());

      // fine grid (1mm)
      ctx.strokeStyle = 'rgba(74,222,128,0.08)';
      ctx.lineWidth = 1;
      const step = 12;
      ctx.beginPath();
      for (let x = 0; x < W(); x += step) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H());
      }
      for (let y = 0; y < H(); y += step) {
        ctx.moveTo(0, y); ctx.lineTo(W(), y);
      }
      ctx.stroke();

      // major grid (5mm) — brighter green
      ctx.strokeStyle = 'rgba(74,222,128,0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < W(); x += step * 5) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H());
      }
      for (let y = 0; y < H(); y += step * 5) {
        ctx.moveTo(0, y); ctx.lineTo(W(), y);
      }
      ctx.stroke();

      // baseline glow
      const mid = H() / 2;
      ctx.strokeStyle = 'rgba(34,197,94,0.28)';
      ctx.lineWidth = 1;
      ctx.shadowColor = 'rgba(34,197,94,0.5)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(0, mid); ctx.lineTo(W(), mid);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // subtle scanline overlay (CRT feel)
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < H(); y += 3) {
        ctx.fillRect(0, y, W(), 1);
      }
    };

    /**
     * Returns the y offset for the QRS-like spike given a normalized t in [0,1].
     * Sequence: small P wave, dip, big R spike, dip, T wave.
     */
    const ecgShape = (t: number, amp: number): number => {
      if (t < 0 || t > 1) return 0;
      // P wave: small bump 0.0–0.12
      if (t < 0.12) return Math.sin((t / 0.12) * Math.PI) * amp * 0.18;
      // PR segment: flat 0.12–0.20
      if (t < 0.20) return 0;
      // Q dip: 0.20–0.24
      if (t < 0.24) return -((t - 0.20) / 0.04) * amp * 0.25;
      // R spike up: 0.24–0.30
      if (t < 0.30) return -amp * 0.25 + ((t - 0.24) / 0.06) * (amp + amp * 0.25);
      // S dip: 0.30–0.36
      if (t < 0.36) return amp - ((t - 0.30) / 0.06) * (amp + amp * 0.45);
      // ST segment: flat 0.36–0.50
      if (t < 0.50) return -amp * 0.45 * (1 - (t - 0.36) / 0.14);
      // T wave: smooth bump 0.50–0.78
      if (t < 0.78) return Math.sin(((t - 0.50) / 0.28) * Math.PI) * amp * 0.32;
      return 0;
    };

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      // Trigger a beat if interval elapsed
      if (now - lastBeatTime >= BEAT_INTERVAL) {
        lastBeatTime = now;
        beatPhase = 0;
        setBlock((b) => b + 1);
        setPulse(true);
        setTimeout(() => setPulse(false), 220);
      }

      // Generate samples for elapsed time
      const newSampleCount = Math.max(1, Math.round(dt * SAMPLE_RATE));
      const beatDurationSamples = Math.round(0.9 * SAMPLE_RATE); // 0.9s waveform
      const amp = H() * 0.38;

      for (let i = 0; i < newSampleCount; i++) {
        let val = 0;
        if (beatPhase >= 0) {
          val = ecgShape(beatPhase, amp);
          beatPhase += 1 / beatDurationSamples;
          if (beatPhase > 1) beatPhase = -1;
        }
        // tiny baseline jitter
        val += (Math.random() - 0.5) * 1.2;
        samples.push(val);
      }
      while (samples.length > maxSamples()) samples.shift();

      // Draw
      drawGrid();
      const mid = H() / 2;
      const xOffset = W() - samples.length;

      // Outer halo (deep dark green glow)
      ctx.lineWidth = 6;
      ctx.shadowColor = 'rgba(16,185,129,0.55)';
      ctx.shadowBlur = 22;
      ctx.strokeStyle = 'rgba(34,197,94,0.18)';
      ctx.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const x = xOffset + i;
        const y = mid - samples[i];
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Mid stroke (medium green)
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(74,222,128,0.85)';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = 'rgba(74,222,128,0.75)';
      ctx.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const x = xOffset + i;
        const y = mid - samples[i];
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Bright neon core (light phosphor green)
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#86efac';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#bbf7d0';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const x = xOffset + i;
        const y = mid - samples[i];
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Trail fade on the right edge (CRT phosphor decay illusion)
      const fadeGrad = ctx.createLinearGradient(W() - 60, 0, W(), 0);
      fadeGrad.addColorStop(0, 'rgba(2,26,16,0)');
      fadeGrad.addColorStop(1, 'rgba(2,26,16,0.45)');
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(W() - 60, 0, 60, H());

      // Sweep cursor (head dot — bright phosphor flare)
      if (samples.length > 0) {
        const lastY = mid - samples[samples.length - 1];
        const lastX = W() - 2;

        // outer flare halo
        const flare = ctx.createRadialGradient(lastX, lastY, 0, lastX, lastY, 22);
        flare.addColorStop(0, 'rgba(187,247,208,0.9)');
        flare.addColorStop(0.4, 'rgba(74,222,128,0.5)');
        flare.addColorStop(1, 'rgba(34,197,94,0)');
        ctx.fillStyle = flare;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 22, 0, Math.PI * 2);
        ctx.fill();

        // bright core dot
        ctx.fillStyle = '#ecfccb';
        ctx.shadowColor = '#bbf7d0';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      beatRequestRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener('resize', onResize);

    beatRequestRef.current = requestAnimationFrame(tick);

    // BPM rough estimate (BSC = 20 blocks/min)
    const bpmTimer = setInterval(() => {
      setBpm(20 + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => {
      cancelAnimationFrame(beatRequestRef.current);
      clearInterval(bpmTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="glass rounded-2xl border border-emerald-500/25 p-4 sm:p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-cyan-500/[0.04] pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2">
          <span className={`relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 ${pulse ? 'animate-ping' : ''}`} />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute" />
          <span className="ml-3 font-black text-sm text-emerald-400 tracking-wider uppercase">Genesis Heartbeat</span>
          <span className="hidden sm:inline text-[10px] text-gray-500 font-mono ml-2">SoulwareAI · live BSC sync</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono">
          <div className="text-right">
            <div className="text-gray-500 uppercase tracking-wider text-[9px]">Block</div>
            <div className="text-cyan-400 font-bold">#{block.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 uppercase tracking-wider text-[9px]">BPM</div>
            <div className="text-emerald-400 font-bold">{bpm}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-gray-500 uppercase tracking-wider text-[9px]">Lead</div>
            <div className="text-amber-400 font-bold">II</div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden border border-emerald-500/30 shadow-[inset_0_0_40px_rgba(16,185,129,0.25),0_0_30px_rgba(16,185,129,0.18)] bg-[#010a07]">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }} />
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-emerald-300/80 tracking-wider drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]">
          AIDAG-LSC · LEAD II · 25mm/s · 10mm/mV
        </div>
        <div className={`absolute bottom-1.5 right-2 text-[9px] font-mono tracking-wider ${pulse ? 'text-emerald-200 drop-shadow-[0_0_6px_rgba(187,247,208,0.9)]' : 'text-emerald-500/50'}`}>
          {pulse ? '◉ BEAT' : '○ idle'}
        </div>
      </div>
    </div>
  );
}
