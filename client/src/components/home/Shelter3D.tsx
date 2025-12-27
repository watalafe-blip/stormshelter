import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-white font-bold">{progress.toFixed(0)}% loaded</Html>;
}

function ShelterModel(props: any) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  // Animation for the door
  useFrame((state, delta) => {
    // Simple animation logic if needed
  });

  return (
    <group ref={group} {...props} dispose={null} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setOpen(!open)}
    >
      {/* Main Concrete Box Body */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color="#8d8d8d" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Sloped Top Section (Approximation) */}
      <mesh position={[0, 0.75, 1]} rotation={[Math.PI / 6, 0, 0]} castShadow receiveShadow>
         <boxGeometry args={[3, 0.5, 2.5]} />
         <meshStandardMaterial color="#9d9d9d" roughness={0.8} />
      </mesh>
      
      {/* Flat Top Section */}
      <mesh position={[0, 0.5, -1.2]} castShadow receiveShadow>
         <boxGeometry args={[3, 0.5, 1.8]} />
         <meshStandardMaterial color="#9d9d9d" roughness={0.8} />
      </mesh>

      {/* The Hatch / Door */}
      <group position={[0, 0.9, 1.2]} rotation={[Math.PI / 6 - (open ? Math.PI / 2 : 0), 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.6, 0.1, 0]} castShadow>
          <boxGeometry args={[0.1, 0.2, 0.5]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Ventilation Pipe */}
      <mesh position={[0.8, 0.8, -1.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 1.2, -1.5]} castShadow>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Internal "Space" Visualization (Visible when open) */}
       {open && (
         <pointLight position={[0, 0, 1]} intensity={2} color="orange" distance={3} />
       )}

      <Html position={[2, 1, 0]} className="pointer-events-none">
        <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'} bg-black/80 text-white p-2 rounded text-xs whitespace-nowrap`}>
           Click to {open ? 'Close' : 'Open'} Hatch
        </div>
      </Html>
    </group>
  );
}

export default function Shelter3D() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-stone-200 to-stone-300 relative rounded-xl overflow-hidden border border-stone-400/20 shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg max-w-xs">
         <h3 className="font-bold text-[#3E2723]">Interactive 3D Model</h3>
         <p className="text-sm text-muted-foreground">Drag to rotate. Scroll to zoom. Click the hatch to open/close.</p>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={50} />
          <OrbitControls 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
            enableZoom={true} 
            minDistance={3}
            maxDistance={15}
          />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Environment preset="city" />
          
          <ShelterModel position={[0, 0, 0]} />
          
          <ContactShadows position={[0, -1.51, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
          
          {/* Ground Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
             <planeGeometry args={[50, 50]} />
             <meshStandardMaterial color="#5d6657" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}