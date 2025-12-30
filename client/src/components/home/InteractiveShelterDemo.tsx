import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls, useCursor, Html, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wind, Shovel, Trees, Home as HomeIcon, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';

// --- Assets ---
const MODEL_URL = '/models/shelter.glb';

// --- Sub-components ---

function Shelter({ position }: any) {
  const { scene } = useGLTF(MODEL_URL);
  
  // Clone scene to avoid mutation issues if used multiple times (though here it's once)
  const clone = React.useMemo(() => scene.clone(), [scene]);

  // Adjust material to look like concrete
  useEffect(() => {
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Make it look concrete-y if it doesn't already
        if (child.material) {
           child.material.roughness = 0.8;
           child.material.color = new THREE.Color('#8c8c8c');
        }
      }
    });
  }, [clone]);

  return (
    <group position={position}>
      <primitive object={clone} scale={2} rotation={[0, Math.PI / 4, 0]} />
    </group>
  );
}

function DebrisItem({ children, startPos, delay = 0 }: any) {
  const ref = useRef<THREE.Group>(null);
  const [impact, setImpact] = useState(false);
  // Randomize target offset slightly so items hit different parts of shelter
  const targetOffset = React.useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 1.5, 0, (Math.random() - 0.5) * 1.5), []);
  
  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.getElapsedTime();
    if (time < delay) return;

    // Move towards shelter at [2, 0.5, 0] + offset
    const baseTarget = new THREE.Vector3(2, 0.5, 0);
    const target = baseTarget.clone().add(targetOffset);
    
    const dir = target.clone().sub(ref.current.position).normalize();
    const dist = ref.current.position.distanceTo(target);

    if (dist > 1.5 && !impact) {
      ref.current.position.add(dir.multiplyScalar(0.25)); // Increased speed for impact
      ref.current.rotation.x += 0.1;
      ref.current.rotation.y += 0.1;
    } else {
      // Hit! Bounce off randomly
      if (!impact) setImpact(true);
      ref.current.position.y += 0.2;
      ref.current.position.x += (Math.random() - 0.5) * 0.4;
      ref.current.position.z += (Math.random() - 0.5) * 0.4;
      ref.current.rotation.z += 0.4;
      
      // Reset if too far or after some time to loop
      if (ref.current.position.y > 15) {
         ref.current.position.copy(startPos);
         setImpact(false);
      }
    }
  });

  return <group ref={ref} position={startPos}>{children}</group>;
}

function Debris({ isTornado }: { isTornado: boolean }) {
  if (!isTornado) return null;

  return (
    <group>
      {/* Flying Car hitting shelter */}
      <DebrisItem startPos={new THREE.Vector3(-10, 5, 5)}>
        <group scale={0.8}>
          <mesh castShadow>
            <boxGeometry args={[1, 0.5, 2]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.8, 0.4, 1]} />
            <meshStandardMaterial color="#880000" />
          </mesh>
        </group>
      </DebrisItem>
      
      {/* Flying Tree */}
      <DebrisItem startPos={new THREE.Vector3(-8, 8, -5)} delay={1}>
        <group scale={0.6}>
          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.5, 2, 8]} />
            <meshStandardMaterial color="#2e7d32" />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
        </group>
      </DebrisItem>

      {/* Flying Wood Planks - Multiple from different angles */}
      {[...Array(8)].map((_, i) => (
        <DebrisItem key={i} startPos={new THREE.Vector3((Math.random() - 0.5) * 20 - 10, 4 + i, (Math.random() - 0.5) * 20)} delay={i * 0.3}>
           <mesh castShadow>
              <boxGeometry args={[0.2, 0.1, 2]} />
              <meshStandardMaterial color="#d7ccc8" />
           </mesh>
        </DebrisItem>
      ))}
    </group>
  );
}

function RVTrailer({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2.5, 2, 5]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.55, 0.2, 5.1]} />
        <meshStandardMaterial color="#E69138" />
      </mesh>
      {/* Windows */}
      <mesh position={[1.3, 1.2, 0]}>
        <boxGeometry args={[0.1, 0.8, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Wheels */}
      <mesh position={[1, 0, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-1, 0, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1, 0, -1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-1, 0, -1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function EnvironmentScene({ type, isTornado }: { type: 'backyard' | 'campsite', isTornado: boolean }) {
  const { scene } = useThree();
  const windLines = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (isTornado && windLines.current) {
        windLines.current.children.forEach((line, i) => {
            line.position.x -= 0.8; // Faster wind
            if (line.position.x < -30) line.position.x = 30;
        });
    }
    
    if (isTornado) {
      scene.background = new THREE.Color('#1a1a1a');
      scene.fog = new THREE.Fog('#1a1a1a', 5, 20);
    } else {
      scene.background = new THREE.Color(type === 'backyard' ? '#87CEEB' : '#2d4040');
      scene.fog = null;
    }
  });

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={type === 'backyard' ? "#4caf50" : "#5d4037"} />
      </mesh>

      {/* Scene Specifics */}
      {type === 'campsite' ? (
        <group>
           {/* Row of Trailers closely packed */}
           <RVTrailer position={[-3, -1.2, -4]} rotation={[0, 0.2, 0]} />
           <RVTrailer position={[-7, -1.2, -4]} rotation={[0, 0.1, 0]} />
           <RVTrailer position={[-3, -1.2, 4]} rotation={[0, -0.2, 0]} />
           <RVTrailer position={[-7, -1.2, 4]} rotation={[0, -0.1, 0]} />
           <RVTrailer position={[-11, -1.2, 0]} rotation={[0, 0, 0]} />
           
           {/* Some trees in between */}
           <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[-5, 0, 0]}>
             <mesh castShadow receiveShadow>
               <coneGeometry args={[0.8, 3, 8]} />
               <meshStandardMaterial color="#2e7d32" />
             </mesh>
           </Float>
        </group>
      ) : (
        // Backyard Fence
        <group>
           {[...Array(10)].map((_, i) => (
             <mesh key={i} position={[-8, -1, i * 2 - 8]} castShadow>
               <boxGeometry args={[0.2, 2, 1.8]} />
               <meshStandardMaterial color="#8d6e63" />
             </mesh>
           ))}
        </group>
      )}

      {/* Tornado Effect & Debris */}
      {isTornado && (
         <group>
            <group position={[-15, 0, -10]}>
                <mesh position={[0, 5, 0]}>
                   <coneGeometry args={[5, 14, 16, 1, true]} />
                   <meshStandardMaterial color="#222" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
                 <mesh position={[0, 5, 0]} rotation={[0, 1, 0]}>
                   <coneGeometry args={[4, 14, 16, 1, true]} />
                   <meshStandardMaterial color="#111" transparent opacity={0.5} side={THREE.DoubleSide} wireframe />
                </mesh>
            </group>
            
            <Debris isTornado={isTornado} />
            
            {/* Wind Lines */}
            <group ref={windLines}>
                {[...Array(40)].map((_, i) => (
                    <mesh key={i} position={[Math.random() * 60 - 30, Math.random() * 10, Math.random() * 30 - 15]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.02, 0.02, 3]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
                    </mesh>
                ))}
            </group>
         </group>
      )}
    </>
  );
}

function Hole({ isFilled, onFill }: any) {
  const { scale } = useSpring({ scale: isFilled ? 1 : 0, config: { tension: 170, friction: 26 } });

  return (
    <group position={[2, -1.9, 0]}>
      {/* The Hole Visual - Deeper appearance with box interior */}
      <group>
        {/* Bottom */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[2, 3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Sides to give depth illusion */}
        <mesh position={[-1, -0.25, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[3, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[1, -0.25, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[3, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, -0.25, -1.5]} rotation={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, -0.25, 1.5]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[2, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      
      {/* Dirt Pile / Backfill Visual - Matches Hole Size */}
      <animated.group scale={scale}>
         <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.5, 3.5]} />
           <meshStandardMaterial color="#5d4037" roughness={1} />
         </mesh>
         {/* Grass on top */}
         <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.4, 3.4]} />
           <meshStandardMaterial color="#4caf50" roughness={1} />
         </mesh>
      </animated.group>
    </group>
  );
}

// --- Main Component ---
export default function InteractiveShelterDemo() {
  const [sceneType, setSceneType] = useState<'backyard' | 'campsite'>('backyard');
  const [isTornado, setIsTornado] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleBackfill = () => {
    setIsFilled(true);
  };

  const reset = () => {
    setIsFilled(false);
    setIsTornado(false);
  };

  return (
    <section className="py-20 bg-stone-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-4xl font-bold text-[#3E2723] mb-4">Experience the Protection</h2>
        <p className="text-lg text-stone-600">See how our shelters withstand extreme conditions. Activate the tornado simulation below!</p>
      </div>

      <div className="relative w-full h-[600px] bg-stone-200 rounded-3xl overflow-hidden border-4 border-[#3E2723]/10 shadow-2xl max-w-6xl mx-auto">
        
        {/* UI Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
           <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg space-y-3 w-64">
              <h3 className="font-bold text-[#3E2723] border-b pb-2">Scene Settings</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={sceneType === 'backyard' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSceneType('backyard')}
                  className={sceneType === 'backyard' ? "bg-[#4caf50] hover:bg-[#388e3c]" : ""}
                >
                  <HomeIcon size={14} className="mr-1" /> Backyard
                </Button>
                <Button 
                  variant={sceneType === 'campsite' ? 'default' : 'outline'}
                  size="sm" 
                  onClick={() => setSceneType('campsite')}
                  className={sceneType === 'campsite' ? "bg-[#795548] hover:bg-[#5d4037]" : ""}
                >
                  <Trees size={14} className="mr-1" /> Campsite
                </Button>
              </div>

              <Button 
                variant={isTornado ? "destructive" : "outline"} 
                className="w-full"
                onClick={() => setIsTornado(!isTornado)}
              >
                {isTornado ? <><Wind className="mr-2 animate-pulse" /> Tornado Active!</> : <><Wind className="mr-2" /> Activate Tornado</>}
              </Button>
           </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
           {!isFilled && (
             <Button 
               size="lg" 
               className="bg-[#E69138] hover:bg-[#D4842F] text-[#3E2723] font-bold shadow-xl scale-110"
               onClick={handleBackfill}
             >
               <Shovel className="mr-2" /> Secure Shelter (Backfill)
             </Button>
           )}

           {isFilled && (
             <div className="flex gap-4">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <AlertTriangle size={18} /> Safe & Secure!
                </div>
                <Button variant="outline" className="bg-white text-[#3E2723]" onClick={reset}>Reset Demo</Button>
             </div>
           )}
        </div>

        {/* 3D Canvas */}
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
          <Environment preset={isTornado ? "night" : "park"} />
          <ambientLight intensity={isTornado ? 0.2 : 0.8} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={isTornado ? 0.5 : 1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          <EnvironmentScene type={sceneType} isTornado={isTornado} />

          <Hole isFilled={isFilled} />
          
          <Shelter 
            position={[2, -1.9, 0]} 
          />

          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2} 
          />
        </Canvas>
      </div>
    </section>
  );
}
