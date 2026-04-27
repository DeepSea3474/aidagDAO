import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
  Text,
  Float,
  Stars,
  Trail,
  Sparkles
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise
} from "@react-three/postprocessing";
import * as THREE from "three";

// Satellite node data
const NODES = [
  { name: "DAO", color: "#00ffff", radius: 5, speed: 0.5, tilt: 0.2 },
  { name: "LIQUIDITY", color: "#ff00ff", radius: 6, speed: 0.4, tilt: -0.3 },
  { name: "SECURITY", color: "#00ff88", radius: 4.5, speed: 0.6, tilt: 0.5 },
  { name: "GOVERNANCE", color: "#4488ff", radius: 7, speed: 0.3, tilt: -0.1 },
  { name: "LSC BUILD", color: "#ffaa00", radius: 5.5, speed: 0.45, tilt: 0.6 },
  { name: "BRIDGE", color: "#00aaff", radius: 6.5, speed: 0.35, tilt: -0.4 },
  { name: "AGENTS", color: "#aa00ff", radius: 4.8, speed: 0.55, tilt: 0.1 },
];

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={0.8}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[0, 1400]}
          color="#ffffff"
          attenuationColor="#4488ff"
          attenuationDistance={1}
        />
      </mesh>
      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.6} />
      </mesh>
      <pointLight color="#00aaff" intensity={10} distance={15} />
    </Float>
  );
}

function Satellite({ data, index }: { data: typeof NODES[0], index: number }) {
  const ref = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const initialOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * data.speed + initialOffset;
      ref.current.position.x = Math.cos(t) * data.radius;
      ref.current.position.z = Math.sin(t) * data.radius;
      ref.current.position.y = Math.sin(t * 2) * data.tilt * 2;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.05;
      sphereRef.current.rotation.x += 0.02;
    }
  });

  return (
    <group ref={ref}>
      <Trail
        width={0.5}
        length={4}
        color={new THREE.Color(data.color)}
        attenuation={(t) => t * t}
      >
        <mesh ref={sphereRef}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshPhysicalMaterial
            color={data.color}
            emissive={data.color}
            emissiveIntensity={2}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Trail>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-QT7pb0FdGwaA.woff"
        material-transparent
        material-opacity={0.8}
      >
        {data.name}
      </Text>
      <pointLight color={data.color} intensity={2} distance={3} />
    </group>
  );
}

function ParticlePulses() {
  const particlesCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const r = 2 + Math.random() * 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for(let i=0; i<particlesCount; i++) {
        // move particles towards center (0,0,0)
        const x = positions[i*3];
        const y = positions[i*3+1];
        const z = positions[i*3+2];
        const d = Math.sqrt(x*x + y*y + z*z);
        if(d > 2.5) {
            positions[i*3] -= (x/d) * 0.02;
            positions[i*3+1] -= (y/d) * 0.02;
            positions[i*3+2] -= (z/d) * 0.02;
        } else {
            // respawn at edge
            const r = 8 + Math.random() * 2;
            const theta = Math.random() * 2 * Math.PI;
            const phi = (Math.random() - 0.5) * Math.PI;
            positions[i*3] = r * Math.cos(theta) * Math.cos(phi);
            positions[i*3+1] = r * Math.sin(phi);
            positions[i*3+2] = r * Math.sin(theta) * Math.cos(phi);
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#020205']} />
      <ambientLight intensity={0.2} />
      
      <Core />
      
      {NODES.map((node, i) => (
        <Satellite key={node.name} data={node} index={i} />
      ))}
      
      <ParticlePulses />
      <Sparkles count={300} scale={15} size={1} speed={0.4} opacity={0.2} color="#4488ff" />
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <Environment preset="night" />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
      
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.5} 
        enableZoom={false} 
        enablePan={false}
        enableDamping={true}
        maxPolarAngle={Math.PI / 2 + 0.2}
        minPolarAngle={Math.PI / 2 - 0.2}
      />
    </>
  );
}

export function QuantumCore() {
  const [time, setTime] = useState(142 * 3600 + 33 * 60 + 9);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(3, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#020205] overflow-hidden font-mono selection:bg-cyan-500/30">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <Scene />
      </Canvas>
      
      {/* HUD Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 pointer-events-none flex flex-col items-center justify-end bg-gradient-to-t from-black/80 to-transparent h-48">
        <div className="flex gap-6 items-center px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,170,255,0.1)] text-[11px] md:text-sm tracking-widest uppercase text-cyan-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
            SOULWARE UPTIME {formatTime(time)}
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div>DECISIONS 1,847</div>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div>Q-KEY ROTATIONS 23</div>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div>EVOLUTION 87.3</div>
        </div>
      </div>

      {/* Decorative scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20"></div>
    </div>
  );
}
