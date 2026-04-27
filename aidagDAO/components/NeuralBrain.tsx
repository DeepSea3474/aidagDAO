'use client';
import { useEffect, useRef, useState } from 'react';
import { soulwareAI, EngineState, Cell, CellID } from '../lib/soulware-core';

// ─── Fixed cell positions (polar layout around core) ─────────────────────────
const CELL_LAYOUT: Record<CellID, { angle: number; dist: number }> = {
  core_brain:      { angle: 0,     dist: 0    },
  dao_cell:        { angle: 0,     dist: 0.32 },
  liquidity_cell:  { angle: 45,    dist: 0.32 },
  security_cell:   { angle: 90,    dist: 0.32 },
  governance_cell: { angle: 135,   dist: 0.32 },
  lsc_builder:     { angle: 180,   dist: 0.32 },
  bridge_cell:     { angle: 225,   dist: 0.32 },
  agent_spawner:   { angle: 270,   dist: 0.32 },
};

const STATE_COLOR: Record<string, string> = {
  ACTIVE:     '#10b981',
  BUILDING:   '#f59e0b',
  PENDING:    '#6366f1',
  SYNCING:    '#06b6d4',
  AUDITING:   '#8b5cf6',
  PROCESSING: '#3b82f6',
  IDLE:       '#4b5563',
  VOTING:     '#f97316',
};

interface Signal {
  fromId: CellID;
  toId: CellID;
  t: number;
  speed: number;
  color: string;
  label: string;
}

export default function NeuralBrain({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const sigRef    = useRef<Signal[]>([]);
  const stateRef  = useRef<EngineState | null>(null);
  const prevDecRef = useRef<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const unsub = soulwareAI.subscribe(s => {
      stateRef.current = s;

      // Spawn a signal for the most recent decision
      if (s.decisions.length > 0) {
        const latest = s.decisions[0];
        if (latest.id !== prevDecRef.current) {
          prevDecRef.current = latest.id;
          if (latest.cellId !== 'core_brain') {
            sigRef.current.push({
              fromId: 'core_brain',
              toId:   latest.cellId,
              t:      0,
              speed:  0.012 + Math.random() * 0.008,
              color:  STATE_COLOR[s.cells.find(c => c.id === latest.cellId)?.state ?? 'ACTIVE'] ?? '#06b6d4',
              label:  latest.action.slice(0, 22),
            });
            // Return signal
            setTimeout(() => {
              sigRef.current.push({
                fromId: latest.cellId,
                toId:   'core_brain',
                t:      0,
                speed:  0.015,
                color:  '#10b981',
                label:  'ACK',
              });
            }, 1200);
          }
        }
      }
    });

    let tick = 0;

    function cellXY(id: CellID, W: number, H: number): [number, number] {
      const lay = CELL_LAYOUT[id];
      const rad = (lay.angle * Math.PI) / 180;
      const maxR = Math.min(W, H) * 0.42;
      return [
        W / 2 + Math.cos(rad) * maxR * lay.dist,
        H / 2 + Math.sin(rad) * maxR * lay.dist,
      ];
    }

    function hexToRgb(hex: string): [number, number, number] {
      const n = parseInt(hex.replace('#', ''), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function drawCell(cell: Cell, x: number, y: number) {
      const color = STATE_COLOR[cell.state] ?? '#4b5563';
      const [r, g, b] = hexToRgb(color);
      const isCore = cell.id === 'core_brain';
      const baseR  = isCore ? 22 : 13;
      const pulse  = isCore ? Math.sin(tick * 0.05) * 0.2 + 0.9 : 1;
      const cr     = baseR * pulse;

      // Outer glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, cr * 3.5);
      glow.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(x, y, cr * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();

      // Rotating ring (core only)
      if (isCore) {
        const rings = 3;
        for (let i = 1; i <= rings; i++) {
          const rAlpha = (0.12 / i) * (Math.sin(tick * 0.03 + i) * 0.3 + 0.7);
          ctx.beginPath();
          ctx.arc(x, y, cr + i * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${rAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        // Quantum key indicator
        const kAngle = (tick * 0.02) % (Math.PI * 2);
        const kx = x + Math.cos(kAngle) * (cr + 5);
        const ky = y + Math.sin(kAngle) * (cr + 5);
        ctx.beginPath(); ctx.arc(kx, ky, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,0.9)`; ctx.fill();
      }

      // Body
      const bodyG = ctx.createRadialGradient(x - cr * 0.3, y - cr * 0.3, 0, x, y, cr);
      bodyG.addColorStop(0, `rgba(${r},${g},${b},1)`);
      bodyG.addColorStop(1, `rgba(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)},0.9)`);
      ctx.beginPath(); ctx.arc(x, y, cr, 0, Math.PI * 2);
      ctx.fillStyle = bodyG; ctx.fill();

      // Border
      ctx.beginPath(); ctx.arc(x, y, cr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
      ctx.lineWidth = isCore ? 2 : 1.5;
      ctx.stroke();

      // Label
      const short: Record<CellID, string> = {
        core_brain:      'CORE BRAIN',
        dao_cell:        'DAO',
        liquidity_cell:  'LIQUIDITY',
        security_cell:   'SECURITY',
        governance_cell: 'GOVERNANCE',
        lsc_builder:     'LSC BUILD',
        bridge_cell:     'BRIDGE',
        agent_spawner:   'AGENTS',
      };

      ctx.font = `${isCore ? '700' : '600'} ${isCore ? 9 : 8}px JetBrains Mono, monospace`;
      ctx.fillStyle = isCore ? '#fff' : `rgba(${r},${g},${b},0.95)`;
      ctx.textAlign = 'center';
      ctx.fillText(short[cell.id], x, y + cr + 13);

      // State badge
      ctx.font = '500 7px JetBrains Mono, monospace';
      ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
      ctx.fillText(cell.state, x, y + cr + 22);

      // Decision count (core only)
      if (isCore) {
        ctx.font = '700 9px JetBrains Mono, monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('SoulwareAI', x, y + 3);
      }

      ctx.textAlign = 'left';
    }

    function draw() {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const s = stateRef.current;
      if (!s) { frameRef.current = requestAnimationFrame(draw); return; }

      const cellMap = new Map(s.cells.map(c => [c.id, c]));

      // Draw connection lines (core ↔ each cell)
      s.cells.forEach(c => {
        if (c.id === 'core_brain') return;
        const [cx, cy] = cellXY('core_brain', W, H);
        const [ex, ey] = cellXY(c.id, W, H);
        const color = STATE_COLOR[c.state] ?? '#4b5563';
        const [r, g, b] = hexToRgb(color);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.12)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw signals
      sigRef.current = sigRef.current.filter(sig => {
        sig.t += sig.speed;
        if (sig.t > 1) return false;

        const [fx, fy] = cellXY(sig.fromId, W, H);
        const [tx, ty] = cellXY(sig.toId, W, H);
        const px = fx + (tx - fx) * sig.t;
        const py = fy + (ty - fy) * sig.t;

        const [r, g, b] = hexToRgb(sig.color);

        // Trail
        const trailT = Math.max(0, sig.t - 0.12);
        const trailX = fx + (tx - fx) * trailT;
        const trailY = fy + (ty - fy) * trailT;
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Particle
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
        pg.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
        pg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = pg; ctx.fill();

        // Label near particle
        if (sig.t > 0.15 && sig.t < 0.85) {
          ctx.font = '600 8px JetBrains Mono, monospace';
          ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
          ctx.fillText(sig.label, px + 8, py - 4);
        }

        return true;
      });

      // Draw cells
      s.cells.forEach(c => {
        const [x, y] = cellXY(c.id, W, H);
        drawCell(c, x, y);
      });

      // HUD bottom
      const uptime  = Math.floor((Date.now() - new Date('2026-04-17').getTime()) / 1000);
      const hh = String(Math.floor(uptime / 3600)).padStart(2,'0');
      const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2,'0');
      const ss = String(uptime % 60).padStart(2,'0');
      ctx.font = '600 9px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(16,185,129,0.55)';
      ctx.fillText(
        `SOULWARE UPTIME: ${hh}:${mm}:${ss}  DECISIONS: ${s.totalDecisions}  Q-KEY ROTATIONS: ${s.quantumKeyRotations}  EVOLUTION: ${s.evolutionScore}`,
        12, H - 10
      );

      tick++;
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
