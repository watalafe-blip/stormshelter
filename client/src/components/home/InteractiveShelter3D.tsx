import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import { Scan } from 'lucide-react';

function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-white font-bold text-lg">{progress.toFixed(0)}%</Html>;
}

function ConcreteShelter({ doorOpen }: { doorOpen: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);

  // Animate door opening/closing
  useFrame(() => {
    if (doorRef.current) {
      const targetRotation = doorOpen ? Math.PI / 2 : 0;
      doorRef.current.rotation.z += (targetRotation - doorRef.current.rotation.z) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Concrete Body - 80" wide x 77" deep x 85" tall (scaled down) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 4.2, 3.8]} />
        <meshStandardMaterial 
          color="#7a7a7a" 
          roughness={0.85} 
          metalness={0.05}
          map={new THREE.CanvasTexture(createConcreteTexture())}
        />
      </mesh>

      {/* Sloped Roof */}
      <mesh position={[0, 2.3, 1]} rotation={[Math.PI / 8, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.4, 4.5]} />
        <meshStandardMaterial 
          color="#6a6a6a" 
          roughness={0.85}
          map={new THREE.CanvasTexture(createConcreteTexture())}
        />
      </mesh>

      {/* Interior Floor */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.2, 3.5]} />
        <meshStandardMaterial color="#888888" roughness={0.8} />
      </mesh>

      {/* Door Frame */}
      <mesh position={[1.8, 0.8, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Steel Door - Animated */}
      <group ref={doorRef} position={[2, 0.5, -0.1]} rotation={[0, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 1.3, 0.08]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Door Handle */}
        <mesh position={[0.3, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
      </group>

      {/* Window (appears as light) */}
      <mesh position={[2, 0.8, -1.85]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.05]} />
        <meshStandardMaterial color="#4da6ff" emissive="#4da6ff" emissiveIntensity={0.3} />
      </mesh>

      {/* Stairs - Steel construction */}
      {/* Stair steps */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`stair-${i}`} position={[-1.2 + i * 0.35, -1.5 + i * 0.4, 0]} castShadow>
          <boxGeometry args={[0.35, 0.15, 0.6]} />
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Handrail vertical post */}
      <mesh position={[-1.5, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Handrail horizontal */}
      <mesh position={[-0.2, 0.5, 0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.2]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Roof Vent - Spherical dome */}
      <mesh position={[0.5, 2.5, -1.5]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#888888" roughness={0.7} />
      </mesh>

      {/* Vent vertical pipe */}
      <mesh position={[0.5, 1.8, -1.5]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.7]} />
        <meshStandardMaterial color="#999999" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Simple Person Figure (stick figure style but 3D) */}
      {/* Head */}
      <mesh position={[-0.3, 1.2, 0.2]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f4a460" roughness={0.6} />
      </mesh>

      {/* Body */}
      <mesh position={[-0.3, 0.4, 0.2]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.2]} />
        <meshStandardMaterial color="#1e40af" roughness={0.5} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.6, 0.7, 0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.6]} />
        <meshStandardMaterial color="#f4a460" roughness={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -0.4, 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.6} />
      </mesh>

      {/* Interior Light */}
      {doorOpen && (
        <>
          <pointLight position={[0, 0.5, 0]} intensity={1.5} color="#ffffff" distance={4} />
          <ambientLight intensity={0.6} color="#ffffff" />
        </>
      )}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.15, 0]} receiveShadow>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial color="#4a3728" roughness={0.95} />
    </mesh>
  );
}

function SoilCutaway() {
  return (
    <group>
      {/* Left soil block */}
      <mesh position={[-4, -2, 0]} receiveShadow>
        <boxGeometry args={[3, 4, 15]} />
        <meshStandardMaterial color="#5c4033" roughness={0.95} />
      </mesh>
      {/* Right soil block */}
      <mesh position={[4, -2, 0]} receiveShadow>
        <boxGeometry args={[3, 4, 15]} />
        <meshStandardMaterial color="#5c4033" roughness={0.95} />
      </mesh>
      {/* Grass layer left */}
      <mesh position={[-4, 0.2, 0]} receiveShadow>
        <boxGeometry args={[3, 0.3, 15]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
      {/* Grass layer right */}
      <mesh position={[4, 0.2, 0]} receiveShadow>
        <boxGeometry args={[3, 0.3, 15]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
    </group>
  );
}

function createConcreteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base grey
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(0, 0, 256, 256);

  // Add texture dots
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  return canvas;
}

export default function InteractiveShelter3D() {
  const [doorOpen, setDoorOpen] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 to-stone-100 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#3E2723] mb-4">
            Interactive Shelter Tour
          </h2>
          <p className="text-lg text-muted-foreground">
            Click the door to look inside. Use your mouse to rotate, scroll to zoom.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto aspect-square bg-stone-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-stone-300">
          <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback={<Loader />}>
              <PerspectiveCamera makeDefault position={[5, 3, 6]} fov={50} />
              <OrbitControls 
                minPolarAngle={0.2}
                maxPolarAngle={Math.PI * 0.8}
                enableZoom={true}
                minDistance={3}
                maxDistance={18}
                autoRotate={false}
              />

              <ambientLight intensity={0.6} />
              <directionalLight 
                position={[8, 8, 8]} 
                intensity={1.2} 
                castShadow 
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-5, 5, 5]} intensity={0.4} />

              <Environment preset="studio" />

              <Ground />
              <SoilCutaway />
              <ConcreteShelter doorOpen={doorOpen} />

              {/* Click handler */}
              <Html position={[2, 0.5, -0.1]} scale={0.5} distanceFactor={1.5}>
                <button
                  onClick={() => setDoorOpen(!doorOpen)}
                  className="bg-[#FFD700] hover:bg-[#FBC02D] text-[#3E2723] font-bold px-4 py-2 rounded-lg shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <Scan size={16} />
                  {doorOpen ? 'Close' : 'Open'} Door
                </button>
              </Html>
            </Suspense>
          </Canvas>
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-xl border-2 border-[#3E2723]/10 shadow-lg">
          <h3 className="text-2xl font-bold text-[#3E2723] mb-4 flex items-center gap-2">
            <Scan className="text-[#FFD700]" /> What You're Looking At
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-[#FFD700] font-bold">•</span>
              <span><strong>Steel Door:</strong> 12-gauge steel with 3-point locking mechanism</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FFD700] font-bold">•</span>
              <span><strong>Steel Stairs:</strong> Full handrail system for safe entry/exit</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FFD700] font-bold">•</span>
              <span><strong>Concrete Shell:</strong> 6,000 PSI with reinforced #4 steel rebar cage</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#FFD700] font-bold">•</span>
              <span><strong>Roof Vent:</strong> Provides emergency ventilation</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}