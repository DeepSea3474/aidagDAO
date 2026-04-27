'use client';
import { useEffect, useRef } from 'react';
import { dagEngine, DAGVertex, DAGState } from '../lib/dag-engine';

const TYPE_COLOR: Record<string, string> = {
  GENESIS:        '#f59e0b',
  TX:             '#06b6d4',
  SMART_CONTRACT: '#8b5cf6',
  DAO_VOTE:       '#10b981',
  BRIDGE:         '#f97316',
  VALIDATOR:      '#3b82f6',
};

interface CanvasVertex {
  hash: string;
  shortHash: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  confirmed: boolean;
  type: string;
  radius: number;
  alpha: number;
  pulse: number;
  layer: number;
}

export default function DAGNetwork({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const cvRef = useRef<Map<string, CanvasVertex>>(new Map());
  const stateRef = useRef<DAGState | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Subscribe to real DAG engine
    const unsub = dagEngine.subscribe((state) => {
      stateRef.current = state;
      layoutVertices(state, canvas.offsetWidth, canvas.offsetHeight);
    });

    function layoutVertices(state: DAGState, W: number, H: number) {
      const { vertices } = state;
      if (!vertices.length) return;

      const maxH = Math.max(1, ...vertices.map(v => v.height));
      const minH = Math.min(...vertices.map(v => v.height));
      const range = maxH - minH || 1;

      // Group vertices by height
      const byHeight = new Map<number, DAGVertex[]>();
      vertices.forEach(v => {
        if (!byHeight.has(v.height)) byHeight.set(v.height, []);
        byHeight.get(v.height)!.push(v);
      });

      const cv = cvRef.current;

      vertices.forEach(v => {
        const group = byHeight.get(v.height) || [v];
        const idx = group.indexOf(v);
        const count = group.length;

        const targetX = ((v.height - minH) / range) * (W * 0.85) + W * 0.075;
        const targetY = count === 1
          ? H / 2
          : H * 0.12 + (idx / (count - 1)) * H * 0.76;

        if (cv.has(v.hash)) {
          const existing = cv.get(v.hash)!;
          existing.targetX = targetX;
          existing.targetY = targetY;
          existing.confirmed = v.confirmed;
        } else {
          cv.set(v.hash, {
            hash: v.hash,
            shortHash: v.shortHash,
            x: targetX + (W * 0.15),
            y: targetY,
            targetX,
            targetY,
            color: TYPE_COLOR[v.type] ?? '#06b6d4',
            confirmed: v.confirmed,
            type: v.type,
            radius: v.type === 'GENESIS' ? 10 : v.confirmed ? 6 : 4,
            alpha: 0,
            pulse: Math.random() * Math.PI * 2,
            layer: v.height,
          });
        }
      });

      // Prune canvas vertices not in current state
      const hashes = new Set(vertices.map(v => v.hash));
      cv.forEach((_, h) => { if (!hashes.has(h)) cv.delete(h); });
    }

    function draw() {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const state = stateRef.current;
      const cv = cvRef.current;
      const tick = tickRef.current++;

      // Animate canvas vertices
      cv.forEach(v => {
        v.x += (v.targetX - v.x) * 0.08;
        v.y += (v.targetY - v.y) * 0.08;
        v.alpha = Math.min(1, v.alpha + 0.04);
        v.pulse += 0.04;
      });

      // Draw edges (directed, from parent → child)
      if (state) {
        const vertexMap = new Map(state.vertices.map(v => [v.hash, v]));
        state.vertices.forEach(v => {
          const toCV = cv.get(v.hash);
          if (!toCV) return;
          v.parents.forEach(ph => {
            const fromCV = cv.get(ph);
            if (!fromCV) return;

            const alpha = Math.min(fromCV.alpha, toCV.alpha) * (v.confirmed ? 0.5 : 0.25);
            const color = fromCV.confirmed ? '6,182,212' : '245,158,11';

            // Edge line
            ctx.beginPath();
            ctx.moveTo(fromCV.x, fromCV.y);
            ctx.lineTo(toCV.x, toCV.y);
            ctx.strokeStyle = `rgba(${color},${alpha * 0.6})`;
            ctx.lineWidth = v.confirmed ? 1 : 0.7;
            ctx.stroke();

            // Animated particle on unconfirmed edges
            if (!v.confirmed) {
              const t = ((tick * 0.02) % 1);
              const px = fromCV.x + (toCV.x - fromCV.x) * t;
              const py = fromCV.y + (toCV.y - fromCV.y) * t;
              const g = ctx.createRadialGradient(px, py, 0, px, py, 5);
              g.addColorStop(0, `rgba(6,182,212,0.9)`);
              g.addColorStop(1, `rgba(6,182,212,0)`);
              ctx.beginPath();
              ctx.arc(px, py, 4, 0, Math.PI * 2);
              ctx.fillStyle = g;
              ctx.fill();
            }

            // Arrow head at destination
            const angle = Math.atan2(toCV.y - fromCV.y, toCV.x - fromCV.x);
            const ar = toCV.radius + 3;
            const ax = toCV.x - Math.cos(angle) * ar;
            const ay = toCV.y - Math.sin(angle) * ar;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax - 6 * Math.cos(angle - 0.4), ay - 6 * Math.sin(angle - 0.4));
            ctx.lineTo(ax - 6 * Math.cos(angle + 0.4), ay - 6 * Math.sin(angle + 0.4));
            ctx.closePath();
            ctx.fillStyle = `rgba(${color},${alpha})`;
            ctx.fill();
          });
        });
      }

      // Draw vertices
      cv.forEach(v => {
        const pulse = Math.sin(v.pulse) * 0.25 + 0.75;
        const r = v.radius * (v.type === 'GENESIS' ? pulse : 1);
        const alpha = v.alpha;

        // Safe hex → rgba conversion
        const hexToRgba = (hex: string, a: number) => {
          const r2 = parseInt(hex.slice(1, 3), 16);
          const g2 = parseInt(hex.slice(3, 5), 16);
          const b2 = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r2},${g2},${b2},${a})`;
        };

        const glow = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, r * 4);
        glow.addColorStop(0, hexToRgba(v.color, alpha * 0.4));
        glow.addColorStop(1, hexToRgba(v.color, 0));
        ctx.beginPath();
        ctx.arc(v.x, v.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node body
        ctx.beginPath();
        ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
        ctx.fillStyle = v.confirmed ? hexToRgba(v.color, alpha * 0.95) : `rgba(245,158,11,${alpha * 0.7})`;
        ctx.fill();

        // Ring for unconfirmed (tip)
        if (!v.confirmed) {
          ctx.beginPath();
          ctx.arc(v.x, v.y, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245,158,11,${alpha * 0.5 * pulse})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Hash label on tips and genesis
        if ((v.type === 'GENESIS' || !v.confirmed) && r > 4) {
          ctx.font = `500 8px 'JetBrains Mono', monospace`;
          ctx.fillStyle = hexToRgba(v.color, alpha * 0.8);
          ctx.fillText(v.shortHash, v.x + r + 4, v.y + 3);
        }

        // Type badge on genesis
        if (v.type === 'GENESIS') {
          ctx.font = `700 9px sans-serif`;
          ctx.fillStyle = `rgba(245,158,11,${alpha})`;
          ctx.fillText('GENESIS', v.x - 20, v.y - r - 6);
        }
      });

      // ── HUD overlay ──
      const dagH = state?.dagHeight ?? 0;
      const tips = state?.tips.length ?? 0;
      const conf = state?.confirmedCount ?? 0;
      const total = state?.totalVertices ?? 0;
      const simTPS = state ? Math.round((total / Math.max(1, (Date.now() - new Date('2026-04-17').getTime()) / 1000)) * 97412) : 0;

      ctx.font = '600 10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(6,182,212,0.55)';
      const lines = [
        `DAG HEIGHT: ${dagH.toLocaleString()}  VERTICES: ${total}  TIPS: ${tips}  CONFIRMED: ${conf}`,
        `ALGO: GHOST v2  SIG: CRYSTALS-Dilithium-5  HASH: BLAKE3-256  TPS SIM: ${simTPS.toLocaleString()}`,
      ];
      lines.forEach((l, i) => ctx.fillText(l, 12, H - 26 + i * 14));

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
      unsub();
    };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} style={{ display: 'block' }} />;
}
