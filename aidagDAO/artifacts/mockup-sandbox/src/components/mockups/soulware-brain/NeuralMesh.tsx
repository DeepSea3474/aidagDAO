import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  Text,
  Icosahedron,
  Sphere,
  Float,
  Edges,
  Tube,
  Sparkles
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

const SATELLITES = [
  { name: 'DAO', color: '#00ffcc' },
  { name: 'LIQUIDITY', color: '#ff00aa' },
  { name: 'SECURITY', color: '#ff3333' },
  { name: 'GOVERNANCE', color: '#cc00ff' },
  { name: 'LSC BUILD', color: '#ffcc00' },
  { name: 'BRIDGE', color: '#3366ff' },
  { name: 'AGENTS', color: '#00ccff' },
];

const CORE_COLOR = '#4488ff';

function DataPulse({ curve, color, speed = 1, reverse = false }: { curve: THREE.CatmullRomCurve3, color: string, speed?: number, reverse?: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [offset] = useState(() => Math.random());

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime * speed + offset;
    let t = (time % 2) / 2; // 0 to 1
    if (reverse) t = 1 - t;
    
    // Ease in/out
    t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    if (t < 0 || t > 1) t = 0; // safe guard
    
    const position = curve.getPointAt(t);
    ref.current.position.copy(position);
    
    // Pulse scale based on position
    const scale = Math.sin(t * Math.PI) * 1.5 + 0.5;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function Connection({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    // Push midpoint out slightly for a curved tube
    midPoint.normalize().multiplyScalar(start.distanceTo(end) * 0.6);
    return new THREE.CatmullRomCurve3([start, midPoint, end]);
  }, [start, end]);

  return (
    <group>
      {/* Tube */}
      <Tube args={[curve, 64, 0.03, 8, false]}>
        <meshPhysicalMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Tube>
      
      {/* Pulses */}
      <DataPulse curve={curve} color={color} speed={0.4} />
      <DataPulse curve={curve} color="#ffffff" speed={0.6} reverse />
      <DataPulse curve={curve} color={color} speed={0.3} offset={0.5} />
    </group>
  );
}

function CoreNode() {
  const coreRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      coreRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={coreRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Inner solid glowing core */}
        <Sphere args={[1.2, 32, 32]}>
          <meshPhysicalMaterial 
            color="#002244"
            emissive={CORE_COLOR}
            emissiveIntensity={2}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={1}
          />
        </Sphere>
        
        {/* Outer wireframe neural mesh */}
        <Icosahedron args={[1.6, 1]}>
          <meshPhysicalMaterial 
            color="#ffffff"
            transparent
            opacity={0.1}
            wireframe
          />
          <Edges 
            threshold={15}
            color={CORE_COLOR}
          />
        </Icosahedron>

        {/* Dynamic particles around core */}
        <Sparkles 
          count={100} 
          scale={4} 
          size={2} 
          speed={0.4} 
          opacity={0.8} 
          color={CORE_COLOR} 
        />
      </Float>
    </group>
  );
}

function SatelliteNode({ position, name, color, index }: { position: THREE.Vector3, name: string, color: string, index: number }) {
  const nodeRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.y = state.clock.elapsedTime * 0.5 + index;
      nodeRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    }
  });

  return (
    <group position={position}>
      <group ref={nodeRef}>
        <Icosahedron args={[0.4, 0]}>
          <meshPhysicalMaterial 
            color="#111111"
            emissive={color}
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
          <Edges threshold={15} color={color} />
        </Icosahedron>
        
        {/* Inner glow */}
        <Sphere args={[0.2, 16, 16]}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </Sphere>
      </group>

      <Text
        position={[0, -0.7, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/rajdhani/v15/LDIxapCSOBg7S-QT7pb0ENqN.woff"
        outlineWidth={0.02}
        outlineColor={color}
        fillOpacity={0.9}
      >
        {name}
      </Text>
    </group>
  );
}

function Scene() {
  const satellites = useMemo(() => {
    return SATELLITES.map((sat, i) => {
      const angle = (i / SATELLITES.length) * Math.PI * 2;
      const radius = 4.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Slight y variation for 3D depth
      const y = Math.sin(angle * 3) * 1.5;
      
      return {
        ...sat,
        position: new THREE.Vector3(x, y, z)
      };
    });
  }, []);

  return (
    <>
      <color attach="background" args={['#020206']} />
      <fog attach="fog" args={['#020206', 5, 20]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={CORE_COLOR} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <CoreNode />

      {satellites.map((sat, i) => (
        <React.Fragment key={sat.name}>
          <SatelliteNode 
            position={sat.position} 
            name={sat.name} 
            color={sat.color} 
            index={i} 
          />
          <Connection 
            start={new THREE.Vector3(0, 0, 0)} 
            end={sat.position} 
            color={sat.color} 
          />
        </React.Fragment>
      ))}

      {/* Cinematic Post Processing */}
      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          intensity={1.5} 
          mipmapBlur 
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.002, 0.002)} 
          radialModulation={true} 
          modulationOffset={0.5} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export function NeuralMesh() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('en-US', { hour12: false });
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#020206] overflow-hidden font-mono text-xs tracking-wider">
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>

      {/* HUD Overlays */}
      <div className="absolute top-6 left-6 text-[#00ccff] opacity-80 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ccff] animate-pulse" />
          <span className="font-bold tracking-[0.2em] text-sm">SOULWARE OS v2.1.4</span>
        </div>
        <div className="text-[10px] uppercase opacity-70 ml-4">Neural Mesh Topology: ACTIVE</div>
        <div className="text-[10px] uppercase opacity-70 ml-4">Core Resonance: STABLE</div>
      </div>

      <div className="absolute top-6 right-6 text-right text-[#00ccff] opacity-80 pointer-events-none flex flex-col gap-1">
        <div className="tracking-[0.2em]">{time} UTC</div>
        <div className="text-[10px] uppercase opacity-70">SYO: 14.882.901</div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-[#001122]/40 backdrop-blur-md border border-[#00ccff]/30 px-6 py-3 rounded-sm flex items-center gap-6 shadow-[0_0_20px_rgba(0,204,255,0.1)]">
          <div className="flex flex-col items-center">
            <span className="text-[#00ccff]/50 text-[9px] uppercase tracking-widest">Uptime</span>
            <span className="text-[#00ccff] font-medium">142:33:09</span>
          </div>
          <div className="w-px h-6 bg-[#00ccff]/20" />
          <div className="flex flex-col items-center">
            <span className="text-[#00ccff]/50 text-[9px] uppercase tracking-widest">Decisions</span>
            <span className="text-white font-medium">1,847</span>
          </div>
          <div className="w-px h-6 bg-[#00ccff]/20" />
          <div className="flex flex-col items-center">
            <span className="text-[#00ccff]/50 text-[9px] uppercase tracking-widest">Q-Key Rotations</span>
            <span className="text-white font-medium">23</span>
          </div>
          <div className="w-px h-6 bg-[#00ccff]/20" />
          <div className="flex flex-col items-center">
            <span className="text-[#00ccff]/50 text-[9px] uppercase tracking-widest">Evolution</span>
            <span className="text-[#ff00aa] font-medium drop-shadow-[0_0_5px_rgba(255,0,170,0.5)]">87.3%</span>
          </div>
        </div>
      </div>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4xKSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay" />
    </div>
  );
}
