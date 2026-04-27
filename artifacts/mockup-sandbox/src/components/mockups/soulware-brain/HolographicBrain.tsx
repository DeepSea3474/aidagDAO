import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Instance, Instances, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Scanline } from '@react-three/postprocessing';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';

const SATELLITES = [
  'DAO', 'LIQUIDITY', 'SECURITY', 'GOVERNANCE', 'LSC BUILD', 'BRIDGE', 'AGENTS'
];

function Core() {
  const coreRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
      coreRef.current.rotation.x += 0.002;
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={coreRef}>
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#00f0ff" 
          emissive="#00f0ff" 
          emissiveIntensity={2} 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial 
          color="#00a0ff" 
          emissive="#00a0ff" 
          emissiveIntensity={4} 
        />
      </mesh>
    </group>
  );
}

function Rings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const rings = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const radius = 3 + i * 0.8;
      const speed = (i % 2 === 0 ? 1 : -1) * (0.02 + Math.random() * 0.02);
      const text = Array.from({ length: 20 })
        .map(() => Math.random().toString(36).substring(2, 3).toUpperCase())
        .join('  ');
      return { radius, speed, text };
    });
  }, []);

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {rings.map((ring, i) => (
        <Ring key={i} radius={ring.radius} speed={ring.speed} text={ring.text} />
      ))}
    </group>
  );
}

function Ring({ radius, speed, text }: { radius: number, speed: number, text: string }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z += speed;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Distribute text around the ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Text
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
            fontSize={0.15}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.4}
          >
            {text.substring(0, 5)}
          </Text>
        );
      })}
    </group>
  );
}

function Satellites() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {SATELLITES.map((name, i) => {
        const angle = (i / SATELLITES.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Satellite key={name} name={name} position={[x, 0, z]} delay={i} />
        );
      })}
    </group>
  );
}

function Satellite({ name, position, delay }: { name: string, position: [number, number, number], delay: number }) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current && meshRef.current) {
      // Bob up and down
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2 + delay) * 0.5;
      // Always face camera horizontally (roughly)
      ref.current.rotation.y = -state.clock.elapsedTime * 0.1;
      
      const pulse = Math.max(0, Math.sin(state.clock.elapsedTime * 3 - delay));
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + pulse * 4;
    }
  });

  return (
    <group position={position} ref={ref}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 0.6, 0.1]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      {/* Pulse line to core */}
      <PulseLine start={[0,0,0]} end={[-position[0], -position[1], -position[2]]} delay={delay} />
    </group>
  );
}

function PulseLine({ start, end, delay }: { start: [number,number,number], end: [number,number,number], delay: number }) {
  const ref = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.LineBasicMaterial;
      const active = Math.sin(state.clock.elapsedTime * 2 - delay) > 0.8;
      material.opacity = active ? 0.8 : 0.1;
    }
  });

  return (
    <line ref={ref} geometry={lineGeometry}>
      <lineBasicMaterial color="#00f0ff" transparent opacity={0.1} />
    </line>
  );
}

function Particles() {
  const count = 500;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.5,
      factor: Math.random() * 100
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.position[0],
        particle.position[1] + Math.sin(t + particle.factor) * 2,
        particle.position[2]
      );
      dummy.scale.setScalar(Math.max(0.1, Math.sin(t * 2 + particle.factor)));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export function HolographicBrain() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#04050b] overflow-hidden font-mono">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
        <color attach="background" args={['#04050b']} />
        <ambientLight intensity={0.5} />
        
        <Core />
        <Rings />
        <Satellites />
        <Particles />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 2 - 0.5}
        />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.5} radius={0.8} />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.002, 0.002)}
          />
          <Noise opacity={0.05} />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={1.5} opacity={0.1} />
        </EffectComposer>
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-8 left-8 text-[#00f0ff] opacity-80 select-none pointer-events-none">
        <h1 className="text-2xl tracking-widest font-bold mb-2">SOULWARE AI CORE</h1>
        <div className="text-xs uppercase tracking-widest flex flex-col gap-1">
          <p>Status: <span className="text-green-400">ONLINE</span></p>
          <p>Nodes: 7 ACTIVE</p>
          <p>Sync: 99.98%</p>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center text-[#00f0ff] text-xs sm:text-sm tracking-[0.2em] opacity-80 select-none pointer-events-none">
        <div className="flex flex-wrap justify-center gap-4 px-8 py-3 border border-[#00f0ff]/20 bg-[#00f0ff]/5 backdrop-blur-sm rounded-sm">
          <span>SOULWARE UPTIME 142:33:09</span>
          <span className="hidden sm:inline">·</span>
          <span>DECISIONS 1,847</span>
          <span className="hidden sm:inline">·</span>
          <span>Q-KEY ROTATIONS 23</span>
          <span className="hidden sm:inline">·</span>
          <span>EVOLUTION 87.3</span>
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00f0ff]/40 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00f0ff]/40 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00f0ff]/40 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00f0ff]/40 pointer-events-none" />
    </div>
  );
}
