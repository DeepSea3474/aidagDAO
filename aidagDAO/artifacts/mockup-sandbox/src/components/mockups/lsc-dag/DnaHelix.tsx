import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// Constants
const BEAT_INTERVAL = 3.0; // 3 seconds per beat
const HELIX_RADIUS = 3;
const HELIX_HEIGHT = 30;
const NODE_COUNT = 60;
const Y_STEP = HELIX_HEIGHT / NODE_COUNT;
const ANGLE_STEP = Math.PI / 8;

const DnaHelixCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [beatPhase, setBeatPhase] = useState(0);
  
  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }).map((_, i) => {
      const y = -HELIX_HEIGHT / 2 + i * Y_STEP;
      const angle = i * ANGLE_STEP;
      
      const x1 = Math.cos(angle) * HELIX_RADIUS;
      const z1 = Math.sin(angle) * HELIX_RADIUS;
      
      const x2 = Math.cos(angle + Math.PI) * HELIX_RADIUS;
      const z2 = Math.sin(angle + Math.PI) * HELIX_RADIUS;
      
      return {
        id: i,
        y,
        angle,
        pos1: new THREE.Vector3(x1, y, z1),
        pos2: new THREE.Vector3(x2, y, z2),
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      
      // Heartbeat pulse wave
      const time = state.clock.elapsedTime;
      const beatProgress = (time % BEAT_INTERVAL) / BEAT_INTERVAL;
      setBeatPhase(beatProgress);
      
      // Slight vertical drift
      groupRef.current.position.y = Math.sin(time * 0.2) * 1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Backbones */}
      {/* Left Backbone */}
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3(nodes.map(n => n.pos1)), 
          100, 0.1, 8, false
        ]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Right Backbone */}
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3(nodes.map(n => n.pos2)), 
          100, 0.1, 8, false
        ]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Rungs (Blocks) */}
      {nodes.map((node, i) => {
        // Calculate pulse intensity based on y position and beat phase
        // The pulse travels UP the helix
        const normalizedY = i / NODE_COUNT;
        
        return (
          <Rung key={node.id} node={node} beatPhase={beatPhase} normalizedY={normalizedY} />
        );
      })}
    </group>
  );
};

const Rung = ({ node, beatPhase, normalizedY }: { node: any, beatPhase: number, normalizedY: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame(() => {
    if (materialRef.current && meshRef.current) {
      // Pulse calculation
      // Beat wave starts at 0 and goes to 1
      // We use a modular distance so the pulse loops seamlessly
      let distanceToPulse = normalizedY - beatPhase;
      if (distanceToPulse < -0.5) distanceToPulse += 1;
      if (distanceToPulse > 0.5) distanceToPulse -= 1;
      distanceToPulse = Math.abs(distanceToPulse);
      
      const pulseWidth = 0.15;
      
      let intensity = 0.5; // base intensity
      let scale = 1;
      
      if (distanceToPulse < pulseWidth) {
        // Gaussian-ish curve for pulse
        const pulseEffect = Math.exp(-(distanceToPulse * distanceToPulse) / (pulseWidth * pulseWidth * 0.2));
        intensity += pulseEffect * 6.0; // max emissive intensity
        scale += pulseEffect * 0.4;
      }
      
      materialRef.current.emissiveIntensity = intensity;
      
      // Lerp scale for smooth transition
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.2);
    }
  });

  // Rung geometry connecting the two backbones
  const length = HELIX_RADIUS * 2;
  const euler = new THREE.Euler(0, -node.angle, Math.PI / 2);

  return (
    <group position={[0, node.y, 0]} rotation={euler}>
      <mesh ref={meshRef}>
        <boxGeometry args={[length - 0.4, 0.3, 0.3]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#a855f7" 
          emissive="#a855f7"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Node end caps */}
      <mesh position={[length/2 - 0.2, 0, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[-length/2 + 0.2, 0, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
};

export function DnaHelix() {
  const [blockCount, setBlockCount] = useState(47823941);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockCount(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#04050b] overflow-hidden font-mono text-white">
      {/* HUD Readout */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-[pulse_3s_ease-in-out_infinite]"></div>
            <h1 className="text-xl font-bold tracking-widest text-blue-400">LSC GENESIS DAG</h1>
          </div>
          <p className="text-xs text-white/50 tracking-wider">LAYERED SOVEREIGN CHAIN VISUALIZATION</p>
        </div>
        
        <div className="flex gap-8 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-white/40">BSC BLOCK</span>
            <span className="text-white font-bold tracking-wider">#{blockCount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/40">HEARTBEAT</span>
            <span className="text-emerald-400 font-bold tracking-wider">20 BPM</span>
          </div>
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-white/40">AIDAG/LSC BRIDGE</span>
            <span className="text-orange-400 font-bold tracking-wider">STANDBY (Q1 2027)</span>
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute bottom-6 left-6 z-10 w-16 h-16 border-l-2 border-b-2 border-white/10 pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 z-10 w-16 h-16 border-r-2 border-b-2 border-white/10 pointer-events-none"></div>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 22], fov: 45 }}>
        <color attach="background" args={['#04050b']} />
        <fog attach="fog" args={['#04050b', 15, 40]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[0, -10, 0]} intensity={5} color="#ec4899" distance={30} />
        <spotLight position={[0, 10, 0]} intensity={5} color="#4f46e5" distance={30} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
          <DnaHelixCore />
        </Float>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={20} size={2} speed={0.4} color="#a855f7" opacity={0.2} />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.8} />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Overlay gradient at bottom for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04050b] to-transparent pointer-events-none"></div>
    </div>
  );
}
