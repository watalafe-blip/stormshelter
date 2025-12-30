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

function Shelter({ position, isDragging, onDragStart, onDragEnd, isBuried, onSnapToHole }: any) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

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

  useFrame((state) => {
    if (!ref.current) return;
    
    // Drag logic (simplified plane drag)
    if (isDragging) {
      const raycaster = state.raycaster;
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);
      if (target) {
        // Limit drag area
        ref.current.position.x = Math.max(-4, Math.min(4, target.x));
        ref.current.position.z = Math.max(-4, Math.min(4, target.z));
        
        // Check distance to hole (hole is at [2, -0.5, 0])
        const dist = ref.current.position.distanceTo(new THREE.Vector3(2, 0, 0));
        if (dist < 1.5) {
           onSnapToHole();
        }
      }
    } else if (isBuried) {
       // Lerp to hole position
       ref.current.position.lerp(new THREE.Vector3(2, -1.2, 0), 0.1);
    } else {
       // Return to start or stay put? Let's just stay put for now or animate slightly
    }
  });

  return (
    <group 
      ref={ref} 
      position={position} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!isBuried) onDragStart();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
      scale={isBuried ? 1 : 1.1} // Pop effect
    >
      <primitive object={clone} scale={2} rotation={[0, Math.PI / 4, 0]} />
    </group>
  );
}

function Hole({ isFilled, onFill }: any) {
  const { scale } = useSpring({ scale: isFilled ? 1 : 0, config: { tension: 170, friction: 26 } });

  return (
    <group position={[2, -1.9, 0]}>
      {/* The Hole Visual - Square */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial color="#1a1a1a" depthWrite={false} />
      </mesh>
      
      {/* Dirt Pile / Backfill Visual - Square */}
      <animated.group scale={scale}>
         <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.8, 3.8]} />
           <meshStandardMaterial color="#5d4037" roughness={1} />
         </mesh>
         {/* Grass on top */}
         <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.7, 3.7]} />
           <meshStandardMaterial color="#4caf50" roughness={1} />
         </mesh>
      </animated.group>
    </group>
  );
}

function Debris({ isTornado }: { isTornado: boolean }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current || !isTornado) return;
    
    group.current.children.forEach((child, i) => {
      // Orbit logic
      const time = state.clock.getElapsedTime();
      const radius = 5 + Math.sin(time * 0.5 + i) * 2;
      const angle = time * (1 + i * 0.1) + i * (Math.PI * 2 / 5);
      
      child.position.x = Math.cos(angle) * radius;
      child.position.z = Math.sin(angle) * radius;
      child.position.y = 2 + Math.sin(time * 2 + i) * 1.5;
      
      child.rotation.x += 0.05;
      child.rotation.y += 0.05;
    });
  });

  if (!isTornado) return null;

  return (
    <group ref={group}>
      {/* Flying Car */}
      <group>
        <mesh castShadow>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.8, 0.4, 1]} />
          <meshStandardMaterial color="#880000" />
        </mesh>
      </group>
      
      {/* Flying Tree */}
      <group>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.5, 2, 8]} />
          <meshStandardMaterial color="#2e7d32" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
      </group>

      {/* Flying Wood Planks */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} castShadow>
          <boxGeometry args={[0.2, 0.1, 2]} />
          <meshStandardMaterial color="#d7ccc8" />
        </mesh>
      ))}
      
      {/* Random Metal Sheets */}
      {[...Array(2)].map((_, i) => (
        <mesh key={`m-${i}`} castShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#b0bec5" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function RVTrailer() {
  return (
    <group position={[-4, -1.2, -3]} rotation={[0, 0.5, 0]}>
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
            line.position.x -= 0.5;
            if (line.position.x < -20) line.position.x = 20;
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
        <>
           <RVTrailer />
           <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[-6, 0, 4]}>
             <mesh castShadow receiveShadow>
               <coneGeometry args={[1, 4, 8]} />
               <meshStandardMaterial color="#2e7d32" />
             </mesh>
           </Float>
        </>
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
            <group position={[-10, 0, -10]}>
                <mesh position={[0, 5, 0]}>
                   <coneGeometry args={[4, 12, 16, 1, true]} />
                   <meshStandardMaterial color="#333" transparent opacity={0.8} side={THREE.DoubleSide} wireframe />
                </mesh>
            </group>
            
            <Debris isTornado={isTornado} />
            
            {/* Wind Lines */}
            <group ref={windLines}>
                {[...Array(20)].map((_, i) => (
                    <mesh key={i} position={[Math.random() * 40 - 20, Math.random() * 10, Math.random() * 20 - 10]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.02, 0.02, 2]} />
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                    </mesh>
                ))}
            </group>
         </group>
      )}
    </>
  );
}

// --- Main Component ---

export default function InteractiveShelterDemo() {
  const [sceneType, setSceneType] = useState<'backyard' | 'campsite'>('backyard');
  const [isTornado, setIsTornado] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuried, setIsBuried] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleSnapToHole = () => {
    setIsDragging(false);
    setIsBuried(true);
  };

  const handleBackfill = () => {
    if (isBuried) {
      setIsFilled(true);
    }
  };

  const reset = () => {
    setIsBuried(false);
    setIsFilled(false);
    setIsTornado(false);
  };

  return (
    <section className="py-20 bg-stone-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-4xl font-bold text-[#3E2723] mb-4">Experience the Protection</h2>
        <p className="text-lg text-stone-600">Drag the shelter into the hole to install it. Switch modes to see it in action!</p>
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
           {!isBuried && (
             <div className="bg-black/70 text-white px-6 py-3 rounded-full font-bold animate-bounce pointer-events-none">
               👇 Drag the shelter to the hole!
             </div>
           )}
           
           {isBuried && !isFilled && (
             <Button 
               size="lg" 
               className="bg-[#E69138] hover:bg-[#D4842F] text-[#3E2723] font-bold shadow-xl scale-110"
               onClick={handleBackfill}
             >
               <Shovel className="mr-2" /> Backfill Dirt
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
            position={isBuried ? [2, -1.2, 0] : [-2, -1.5, 0]} 
            isDragging={isDragging}
            isBuried={isBuried}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onSnapToHole={handleSnapToHole}
          />

          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2} 
            enabled={!isDragging} // Disable camera rotation while dragging
          />
        </Canvas>
      </div>
    </section>
  );
}
