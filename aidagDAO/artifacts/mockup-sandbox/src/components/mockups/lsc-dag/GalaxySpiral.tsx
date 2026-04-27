import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Instance, Instances } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const PULSE_INTERVAL = 3; // seconds

function BlockInstance({ position, scale, color, index, radius }: any) {
  const ref = useRef<any>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      const phase = (time % PULSE_INTERVAL) / PULSE_INTERVAL;
      
      // Calculate distance of shockwave
      const shockwaveRadius = phase * 30;
      
      // If shockwave passes this block, make it pulse
      const distToShockwave = Math.abs(radius - shockwaveRadius);
      let pulseMultiplier = 1;
      
      if (distToShockwave < 2) {
        pulseMultiplier = 1 + (2 - distToShockwave) * 0.5;
      }
      
      // Add tiny float
      const yOffset = Math.sin(time * 2 + index) * 0.1;
      ref.current.position.y = position[1] + yOffset;
      
      // Scale pulse
      const currentScale = scale[0] * pulseMultiplier;
      ref.current.scale.set(currentScale, currentScale, currentScale);
    }
  });
  
  return <Instance ref={ref} position={position} scale={scale} color={color} />;
}

function Scene() {
  const coreRef = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const numBlocks = 600;
  const blocks = useMemo(() => {
    const data = [];
    const goldenRatio = 1.61803398875;
    for (let i = 0; i < numBlocks; i++) {
      const t = i / numBlocks;
      const angle = i * Math.PI * 2 * goldenRatio;
      const radius = 1.5 + Math.pow(t, 0.6) * 20;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Add scatter
      const scatter = 0.8 * (1 - t);
      const y = (Math.random() - 0.5) * scatter * 2;
      
      const scale = 0.08 + Math.random() * 0.12;
      
      // Color gradient from core to edge
      const color = new THREE.Color();
      // Outer blocks glow brighter (cyan/blue), inner blocks are older (darker blue/purple)
      const isNew = t > 0.85;
      if (isNew) {
        color.setHSL(0.55 + Math.random() * 0.1, 0.9, 0.7); // Bright Cyan
      } else {
        color.setHSL(0.65 + Math.random() * 0.1, 0.8, 0.3 + t * 0.3); // Deep Blue/Purple
      }
      
      // Intensify color for bloom
      color.multiplyScalar(isNew ? 3 : 1);
      
      data.push({
        position: [x, y, z],
        scale: [scale, scale, scale],
        color: color,
        index: i,
        radius
      });
    }
    return data;
  }, [numBlocks]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const phase = (time % PULSE_INTERVAL) / PULSE_INTERVAL; // 0 to 1
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
    }
    
    // Core Pulse
    if (coreRef.current && coreLightRef.current) {
      // Fast attack, slow decay
      const pulseIntensity = Math.exp(-phase * 10);
      const scale = 1 + pulseIntensity * 0.8;
      coreRef.current.scale.set(scale, scale, scale);
      
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3 + pulseIntensity * 10;
      
      coreLightRef.current.intensity = 10 + pulseIntensity * 30;
    }
    
    // Shockwave
    if (shockwaveRef.current) {
      const shockwaveRadius = phase * 30; // expands outward
      shockwaveRef.current.scale.set(shockwaveRadius, shockwaveRadius, shockwaveRadius);
      
      const mat = shockwaveRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = (1 - phase) * 0.5; // fades out
      mat.visible = phase < 0.9;
    }
  });

  return (
    <>
      <color attach="background" args={['#020308']} />
      
      <Stars radius={100} depth={50} count={4000} factor={3} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.1} />
      
      <group ref={groupRef}>
        {/* Central Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#00ffff" emissive="#00aaff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <pointLight ref={coreLightRef} color="#00ffff" intensity={10} distance={40} />
        
        {/* Shockwave Ring */}
        <mesh ref={shockwaveRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Nebula plane faint */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshBasicMaterial color="#001133" transparent opacity={0.2} depthWrite={false} />
        </mesh>

        {/* Blocks (Instances for performance) */}
        <Instances range={numBlocks}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial toneMapped={false} />
          {blocks.map((props, i) => (
            <BlockInstance key={i} {...props} />
          ))}
        </Instances>
      </group>

      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

export function GalaxySpiral() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#020308] text-white font-mono overflow-hidden">
      <Canvas camera={{ position: [0, 8, 22], fov: 45 }}>
        <Scene />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>

      <div className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none tracking-widest">
        <div className="text-xs md:text-sm text-cyan-400 mb-3 flex items-center gap-3 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
          GENESIS DAG · BSC BLOCK #47823941 · 20 BPM
        </div>
        <div className="text-[10px] md:text-xs text-cyan-200/70 border border-cyan-900/50 bg-cyan-950/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(8,145,178,0.2)]">
          AIDAG/LSC BRIDGE: STANDBY (Q1 2027)
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none text-[10px] tracking-widest max-w-[250px] text-cyan-500/60 font-medium">
        <div className="border-l border-cyan-800 pl-4 py-1 flex flex-col gap-1.5">
          <div className="text-cyan-400/80">LOGARITHMIC GALAXY DISTRIBUTION</div>
          <div>NODE INTEGRITY: 99.9%</div>
          <div>FORGING LATENCY: ~14ms</div>
          <div>ACTIVE NODES: 8,492</div>
        </div>
      </div>
    </div>
  );
}
