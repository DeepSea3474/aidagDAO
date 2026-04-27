import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
  Float,
  Edges,
  Sparkles,
  Stars,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// A single hexagonal crystal block
const HexCrystal = ({
  position,
  scale = 1,
  flashIntensity = 0,
  coreColor = '#00f0ff',
  edgeColor = '#0055ff',
}: {
  position: [number, number, number];
  scale?: number;
  flashIntensity?: number;
  coreColor?: string;
  edgeColor?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // CylinderGeometry with 6 radial segments creates a hexagon
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 2, 6), []);

  useFrame((state) => {
    if (materialRef.current) {
      // Modulate transmission/roughness slightly for "live" feel
      const t = state.clock.elapsedTime;
      materialRef.current.thickness = 1 + Math.sin(t * 2) * 0.2;
    }
  });

  const animatedScale = scale + flashIntensity * 0.2;

  return (
    <group position={position} scale={[animatedScale, animatedScale, animatedScale]}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial
          ref={materialRef}
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={0.5}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 400]}
          color={new THREE.Color(coreColor).lerp(new THREE.Color('#ffffff'), flashIntensity * 0.5)}
          attenuationDistance={2}
          attenuationColor={coreColor}
        />
        <Edges
          linewidth={2}
          threshold={15}
          color={new THREE.Color(edgeColor).lerp(new THREE.Color('#ffffff'), flashIntensity)}
        />
      </mesh>
      {/* Inner glowing core that pulses with flash */}
      <mesh geometry={geometry} scale={0.4}>
        <meshBasicMaterial
          color={new THREE.Color(coreColor).lerp(new THREE.Color('#ffffff'), flashIntensity)}
          transparent
          opacity={0.5 + flashIntensity * 0.5}
        />
      </mesh>
    </group>
  );
};

// Represents a connection between two nodes
const ConnectionEdge = ({ start, end, intensity }: { start: THREE.Vector3; end: THREE.Vector3; intensity: number }) => {
  const points = useMemo(() => [start, end], [start, end]);
  const curve = useMemo(() => new THREE.LineCurve3(start, end), [start, end]);
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.05, 8, false), [curve]);

  return (
    <mesh geometry={tubeGeom}>
      <meshBasicMaterial
        color={new THREE.Color('#00f0ff').lerp(new THREE.Color('#ffffff'), intensity)}
        transparent
        opacity={0.3 + intensity * 0.7}
      />
    </mesh>
  );
};

// The Lattice DAG
const LatticeSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // State for blocks
  const [blocks, setBlocks] = useState<{ id: number; pos: THREE.Vector3; scale: number; flash: number }[]>([]);
  const [connections, setConnections] = useState<{ source: number; target: number }[]>([]);
  const [heartbeat, setHeartbeat] = useState(0);

  // Generate initial lattice structure
  useEffect(() => {
    const initialBlocks = [];
    const initialConnections = [];
    let idCounter = 0;

    // Hexagonal grid spacing
    const radius = 1.2;
    const height = 2.5;
    const xOffset = radius * Math.sqrt(3);
    const zOffset = radius * 1.5;

    // Create a small initial cluster
    for (let q = -1; q <= 1; q++) {
      for (let r = -1; r <= 1; r++) {
        if (Math.abs(q + r) <= 1) {
          const x = xOffset * (q + r / 2);
          const z = zOffset * r;
          const y = (Math.random() - 0.5) * height;
          initialBlocks.push({
            id: idCounter++,
            pos: new THREE.Vector3(x, y, z),
            scale: 1,
            flash: 0,
          });
        }
      }
    }

    // Connect some blocks
    for (let i = 0; i < initialBlocks.length; i++) {
      for (let j = i + 1; j < initialBlocks.length; j++) {
        if (initialBlocks[i].pos.distanceTo(initialBlocks[j].pos) < radius * 2.5) {
          if (Math.random() > 0.3) {
            initialConnections.push({ source: initialBlocks[i].id, target: initialBlocks[j].id });
          }
        }
      }
    }

    setBlocks(initialBlocks);
    setConnections(initialConnections);
  }, []);

  // Heartbeat pulse logic
  const pulseRef = useRef(0);
  const nextBlockId = useRef(100);

  useFrame((state, delta) => {
    pulseRef.current += delta;

    // Trigger heartbeat roughly every 3 seconds
    if (pulseRef.current >= 3) {
      pulseRef.current = 0;
      setHeartbeat(1); // Set heartbeat intensity to max

      // Add a new block on the periphery
      setBlocks((prev) => {
        if (prev.length === 0) return prev;
        const newBlocks = [...prev];
        
        // Find a random existing block to attach to
        const parent = newBlocks[Math.floor(Math.random() * newBlocks.length)];
        
        // Generate random position around parent
        const angle = Math.random() * Math.PI * 2;
        const distance = 2.5;
        const newPos = new THREE.Vector3(
          parent.pos.x + Math.cos(angle) * distance,
          parent.pos.y + (Math.random() - 0.5) * 2,
          parent.pos.z + Math.sin(angle) * distance
        );

        const newId = nextBlockId.current++;
        
        newBlocks.push({
          id: newId,
          pos: newPos,
          scale: 0, // Starts at 0, grows to 1
          flash: 1, // Flashes on birth
        });

        // Add connection
        setConnections((c) => [...c, { source: parent.id, target: newId }]);

        // Limit total blocks for performance
        if (newBlocks.length > 30) {
          const removedId = newBlocks[0].id;
          newBlocks.shift();
          setConnections((c) => c.filter((conn) => conn.source !== removedId && conn.target !== removedId));
        }

        return newBlocks;
      });
    }

    // Decay heartbeat and flashes
    setHeartbeat((prev) => Math.max(0, prev - delta * 2));
    
    setBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        // Grow scale if < 1
        scale: b.scale < 1 ? Math.min(1, b.scale + delta * 2) : 1,
        // Decay flash
        flash: Math.max(0, b.flash - delta * 1.5),
        // Add random ambient flashes driven by heartbeat
        ...(heartbeat > 0.5 && Math.random() > 0.9 ? { flash: 1 } : {}),
      }))
    );

    // Slowly rotate the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Draw connections */}
        {connections.map((conn, idx) => {
          const sourceNode = blocks.find((b) => b.id === conn.source);
          const targetNode = blocks.find((b) => b.id === conn.target);
          if (!sourceNode || !targetNode) return null;
          
          // Connection intensity based on nodes' flash
          const intensity = Math.max(sourceNode.flash, targetNode.flash);

          return (
            <ConnectionEdge
              key={`conn-${idx}`}
              start={sourceNode.pos}
              end={targetNode.pos}
              intensity={intensity}
            />
          );
        })}

        {/* Draw blocks */}
        {blocks.map((block) => (
          <HexCrystal
            key={block.id}
            position={[block.pos.x, block.pos.y, block.pos.z]}
            scale={block.scale}
            flashIntensity={block.flash}
            coreColor="#0ea5e9" // Cyan
            edgeColor="#fbbf24" // Amber tint for edges
          />
        ))}
      </Float>
    </group>
  );
};

// Scene composition
const Scene = () => {
  return (
    <>
      <color attach="background" args={['#04050b']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#0ea5e9" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#fbbf24" />
      <pointLight position={[0, 0, 0]} intensity={5} color="#ffffff" distance={10} />

      <Environment preset="night" />
      
      {/* Background elements */}
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.5} color="#0ea5e9" />

      <LatticeSystem />

      {/* Post-processing for cinematic glow */}
      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          intensity={2}
          radius={0.8}
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5} 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// HUD Overlay
const HUD = () => {
  const [blockNum, setBlockNum] = useState(47823941);
  const [pulse, setPulse] = useState(false);

  // Sync HUD with 3s heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNum((prev) => prev + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-12 font-mono text-xs sm:text-sm tracking-widest text-cyan-500/80">
      {/* Top Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-amber-400 ${pulse ? 'scale-150 opacity-100 shadow-[0_0_10px_#fbbf24]' : 'scale-100 opacity-50'} transition-all duration-200`} />
          <span className="text-amber-400/90 font-bold">LSC DAG</span>
        </div>
        <div className="h-px w-8 bg-cyan-500/30 hidden sm:block" />
        <span>NETWORK: LIVE</span>
      </div>

      {/* Bottom HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-cyan-500/20 pt-4">
        <div className="flex flex-col gap-1">
          <span className="text-cyan-400/60">GENESIS DAG · BSC SYNC</span>
          <span className="text-lg sm:text-xl text-cyan-300 font-medium">BLOCK #{blockNum.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col gap-1 sm:text-right">
          <span className="text-cyan-400/60">HEARTBEAT</span>
          <span className="text-lg sm:text-xl text-amber-400 font-medium">20 BPM</span>
        </div>

        <div className="flex flex-col gap-1 sm:text-right">
          <span className="text-cyan-400/60">AIDAG/LSC BRIDGE</span>
          <span className="text-lg sm:text-xl text-cyan-300/50 font-medium line-through">STANDBY (Q1 2027)</span>
        </div>
      </div>
    </div>
  );
};

export function CrystalLattice() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#04050b] overflow-hidden">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <Scene />
      </Canvas>
      <HUD />
    </div>
  );
}
