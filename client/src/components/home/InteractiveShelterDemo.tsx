import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls, useCursor, Html, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Wind, Shovel, Trees, Home as HomeIcon, AlertTriangle, DoorOpen, Eye, EyeOff, Gauge } from 'lucide-react';
import * as THREE from 'three';

// --- Assets ---
const MODEL_URL = '/models/shelter.glb';

// --- Sub-components ---

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

function Interior({ isActive }: { isActive: boolean }) {
  // ... existing Interior code ...
  return (
    <group position={[2, -1.9, 0]} visible={isActive}>
       {/* Main Room (Concrete) - Darker for mood */}
       <mesh position={[0, -1.2, 0]} receiveShadow>
         <boxGeometry args={[2, 2.2, 2.6]} />
         <meshStandardMaterial color="#3a3a3a" side={THREE.BackSide} roughness={0.9} />
       </mesh>
       
       {/* Stairs */}
       <group position={[0, -0.5, 1.2]} rotation={[0, Math.PI, 0]}>
         {[...Array(8)].map((_, i) => (
           <mesh key={i} position={[0, i * 0.2, i * 0.2]} receiveShadow>
             <boxGeometry args={[0.8, 0.05, 0.25]} />
             <meshStandardMaterial color="#555" roughness={0.7} />
           </mesh>
         ))}
       </group>

       {/* Right Handrail */}
       <group position={[0.45, -0.5, 1.2]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 1.2, 0.8]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 3.5]} />
            <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
             <cylinderGeometry args={[0.015, 0.015, 1.0]} />
             <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.4, 1.6]} castShadow>
             <cylinderGeometry args={[0.015, 0.015, 1.0]} />
             <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.8} />
          </mesh>
       </group>

       {/* Left Handrail */}
       <group position={[-0.45, -0.5, 1.2]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 1.2, 0.8]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 3.5]} />
            <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
             <cylinderGeometry args={[0.015, 0.015, 1.0]} />
             <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.4, 1.6]} castShadow>
             <cylinderGeometry args={[0.015, 0.015, 1.0]} />
             <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.8} />
          </mesh>
       </group>
       
       {/* Interior Light */}
       <pointLight position={[0, 0, 0]} intensity={0.8} distance={6} color="#fffde7" />
    </group>
  );
}

function Shelter({ position, isOpen }: any) {
  // ... existing Shelter code ...
  const { scene } = useGLTF(MODEL_URL);
  const doorRef = useRef<THREE.Object3D | null>(null);
  const clone = React.useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
           child.material.roughness = 0.8;
           child.material.color = new THREE.Color('#8c8c8c');
        }
      }
      if (child.name.toLowerCase().includes('door') || child.name.toLowerCase().includes('lid')) {
        doorRef.current = child;
      }
    });
  }, [clone]);

  useFrame(() => {
    if (doorRef.current) {
        const targetRot = isOpen ? -Math.PI / 2 : 0;
        doorRef.current.rotation.x = THREE.MathUtils.lerp(doorRef.current.rotation.x, targetRot, 0.1);
    }
  });

  return (
    <group position={position}>
      <primitive object={clone} scale={2} rotation={[0, Math.PI / 4, 0]} />
    </group>
  );
}

function CameraController({ isInside }: { isInside: boolean }) {
  const { camera, controls } = useThree() as any;
  const targetPos = useRef(new THREE.Vector3(0, 5, 10));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (isInside) {
      // Move inside near the bottom of stairs, looking back at the door
      // Room center is [2, -3.1, 0] roughly.
      // Door/Stairs is at [2, -1.9, 1.2] relative to hole? No, stairs start at Z=1.2 in interior group.
      // Interior group is at [2, -1.9, 0].
      // So stairs start at [2, -2.4, 1.2] world space?
      
      // Let's place camera in the corner of the room looking towards the stairs/door
      targetPos.current.set(2, -2.5, -1); 
      targetLook.current.set(2, -2, 1); // Look towards stairs
    } else {
      targetPos.current.set(0, 5, 10);
      targetLook.current.set(0, 0, 0);
    }
  }, [isInside]);

  useFrame((state) => {
    // Only smooth lerp when transitioning between modes, otherwise let controls handle it
    // But for simplicity, we'll just snap controls target when mode changes, 
    // and let user orbit freely if controls are enabled.
    
    // We only force position if we are "transitioning" or if we want to lock it.
    // If we want free look inside, we shouldn't force camera position every frame.
    
    // Simple approach: When `isInside` changes, we lerp to the new start point.
    // After that, we let OrbitControls take over.
    
    // Ideally we'd use a spring or tween, but simple lerp works if we conditionally apply it.
    // Since we want free rotation inside, we only lerp the TARGET of the controls?
    
    if (controls) {
       // Smoothly move the OrbitControls target
       controls.target.lerp(targetLook.current, 0.1);
       controls.update();
    }
    
    // Smoothly move camera to start position? 
    // If user moves camera, this fights them.
    // Let's just lerp if distance is large (snap back on mode change)
    if (state.camera.position.distanceTo(targetPos.current) > 0.5) {
       state.camera.position.lerp(targetPos.current, 0.05);
    }
  });

  return null;
}

function Debris({ isTornado, windIntensity }: { isTornado: boolean, windIntensity: number }) {
  if (!isTornado && windIntensity < 1) return null;
  
  // Show debris based on intensity
  const showLeaves = windIntensity >= 1;
  const showSmall = windIntensity >= 2;
  const showLarge = windIntensity >= 4;

  return (
    <group>
      {/* Leaves / Small Particles */}
      {showLeaves && [...Array(20)].map((_, i) => (
         <DebrisItem key={`leaf-${i}`} startPos={new THREE.Vector3((Math.random()-0.5)*20, Math.random()*10, (Math.random()-0.5)*20)} delay={Math.random()}>
            <mesh>
               <planeGeometry args={[0.1, 0.1]} />
               <meshBasicMaterial color="#4caf50" side={THREE.DoubleSide} />
            </mesh>
         </DebrisItem>
      ))}

      {/* Heavy Debris */}
      {showSmall && <DebrisItem startPos={new THREE.Vector3(-12, 4, 0)} delay={0.5}>
           <mesh castShadow>
              <boxGeometry args={[0.2, 0.1, 2]} />
              <meshStandardMaterial color="#d7ccc8" />
           </mesh>
      </DebrisItem>}

      {showLarge && (
        <>
          <DebrisItem startPos={new THREE.Vector3(-10, 5, 5)}>
            <group scale={0.8}>
              <mesh castShadow>
                <boxGeometry args={[1, 0.5, 2]} />
                <meshStandardMaterial color="red" />
              </mesh>
            </group>
          </DebrisItem>
          <DebrisItem startPos={new THREE.Vector3(-8, 8, -5)} delay={1}>
             <group scale={0.6}>
               <mesh position={[0, 0.5, 0]}>
                 <coneGeometry args={[0.5, 2, 8]} />
                 <meshStandardMaterial color="#2e7d32" />
               </mesh>
             </group>
          </DebrisItem>
        </>
      )}
    </group>
  );
}

function RVTrailer({ position = [0, 0, 0], rotation = [0, 0, 0], windIntensity }: any) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
     if (!ref.current) return;
     // Shake effect based on wind
     if (windIntensity >= 2 && windIntensity < 4) {
        ref.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 10) * 0.02 * windIntensity;
     }
     // Fly away logic for high wind? Or just flip over
     if (windIntensity >= 4) {
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, Math.PI / 2, 0.05);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 2, 0.01);
     } else {
        // Reset
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.1);
        // ref.current.rotation.z logic handles the shake reset
     }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
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

function EnvironmentScene({ type, isTornado, windIntensity, xRayMode }: any) {
  const { scene } = useThree();
  const windLines = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    // Wind lines speed
    if (windLines.current) {
        windLines.current.visible = windIntensity > 0 || isTornado;
        windLines.current.children.forEach((line, i) => {
            line.position.x -= 0.2 * (windIntensity || (isTornado ? 4 : 0)); 
            if (line.position.x < -30) line.position.x = 30;
        });
    }
    
    if (isTornado || windIntensity >= 3) {
      scene.background = new THREE.Color('#1a1a1a');
      scene.fog = new THREE.Fog('#1a1a1a', 5, 20);
    } else {
      scene.background = new THREE.Color(type === 'backyard' ? '#87CEEB' : '#2d4040');
      scene.fog = null;
    }
  });

  const groundMaterial = xRayMode 
    ? new THREE.MeshStandardMaterial({ color: type === 'backyard' ? "#4caf50" : "#5d4037", transparent: true, opacity: 0.3, wireframe: true })
    : new THREE.MeshStandardMaterial({ color: type === 'backyard' ? "#4caf50" : "#5d4037" });

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <primitive object={groundMaterial} attach="material" />
      </mesh>

      {/* Scene Specifics */}
      {type === 'campsite' ? (
        <group>
           <RVTrailer position={[-3, -1.2, -4]} rotation={[0, 0.2, 0]} windIntensity={windIntensity} />
           <RVTrailer position={[-7, -1.2, -4]} rotation={[0, 0.1, 0]} windIntensity={windIntensity} />
           <RVTrailer position={[-3, -1.2, 4]} rotation={[0, -0.2, 0]} windIntensity={windIntensity} />
           
           {/* Trees */}
           {windIntensity < 5 && (
             <Float speed={windIntensity > 0 ? 5 : 2} rotationIntensity={windIntensity * 0.2} floatIntensity={0.5} position={[-5, 0, 0]}>
               <mesh castShadow receiveShadow>
                 <coneGeometry args={[0.8, 3, 8]} />
                 <meshStandardMaterial color="#2e7d32" />
               </mesh>
             </Float>
           )}
        </group>
      ) : (
        // Backyard Fence
        <group>
           {windIntensity < 3 && [...Array(10)].map((_, i) => (
             <mesh key={i} position={[-8, -1, i * 2 - 8]} castShadow>
               <boxGeometry args={[0.2, 2, 1.8]} />
               <meshStandardMaterial color="#8d6e63" />
             </mesh>
           ))}
        </group>
      )}

      {/* Tornado Effect & Debris */}
      {(isTornado || windIntensity > 0) && (
         <group>
            {isTornado && <group position={[-15, 0, -10]}>
                <mesh position={[0, 5, 0]}>
                   <coneGeometry args={[5, 14, 16, 1, true]} />
                   <meshStandardMaterial color="#222" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
            </group>}
            
            <Debris isTornado={isTornado} windIntensity={windIntensity} />
            
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

function Hole({ isFilled, onFill, xRayMode }: any) {
  const { scale } = useSpring({ scale: isFilled ? 1 : 0, config: { tension: 170, friction: 26 } });

  const sideMaterial = xRayMode
    ? new THREE.MeshStandardMaterial({ color: "#1a1a1a", transparent: true, opacity: 0.2, wireframe: true })
    : new THREE.MeshStandardMaterial({ color: "#1a1a1a" });

  return (
    <group position={[2, -1.9, 0]}>
      {/* The Hole Visual */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[2, 3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Sides */}
        <mesh position={[-1, -0.25, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[3, 0.5]} />
          <primitive object={sideMaterial} attach="material" />
        </mesh>
        <mesh position={[1, -0.25, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[3, 0.5]} />
          <primitive object={sideMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.25, -1.5]} rotation={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2, 0.5]} />
          <primitive object={sideMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.25, 1.5]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[2, 0.5]} />
          <primitive object={sideMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* Dirt Pile */}
      <animated.group scale={scale}>
         <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.5, 3.5]} />
           <meshStandardMaterial color="#5d4037" roughness={1} transparent={xRayMode} opacity={xRayMode ? 0.3 : 1} />
         </mesh>
         <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.4, 3.4]} />
           <meshStandardMaterial color="#4caf50" roughness={1} transparent={xRayMode} opacity={xRayMode ? 0.3 : 1} />
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
  const [isInside, setIsInside] = useState(false);
  const [windIntensity, setWindIntensity] = useState(0);
  const [xRayMode, setXRayMode] = useState(false);

  const handleBackfill = () => {
    setIsFilled(true);
  };

  const reset = () => {
    setIsFilled(false);
    setIsTornado(false);
    setIsInside(false);
    setWindIntensity(0);
    setXRayMode(false);
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

              <div className="space-y-2 pt-2 border-t">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-1"><Gauge size={14}/> Wind Intensity</span>
                    <span className="text-[#E69138]">EF-{windIntensity}</span>
                 </div>
                 <Slider 
                    defaultValue={[0]} 
                    max={5} 
                    step={1} 
                    value={[windIntensity]} 
                    onValueChange={(vals) => setWindIntensity(vals[0])}
                    className="py-2"
                 />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                 <Button 
                    variant={isTornado ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => setIsTornado(!isTornado)}
                 >
                    {isTornado ? <><Wind size={14} className="mr-1 animate-pulse" /> Active</> : <><Wind size={14} className="mr-1" /> Tornado</>}
                 </Button>
                 
                 <Button 
                    variant={xRayMode ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setXRayMode(!xRayMode)}
                    className={xRayMode ? "bg-blue-100 border-blue-300" : ""}
                 >
                    {xRayMode ? <><Eye size={14} className="mr-1" /> X-Ray On</> : <><EyeOff size={14} className="mr-1" /> X-Ray Off</>}
                 </Button>
              </div>
              
              <Button 
                variant={isInside ? "secondary" : "outline"}
                className="w-full mt-2"
                onClick={() => setIsInside(!isInside)}
              >
                <DoorOpen className="mr-2" /> {isInside ? "Exit Shelter" : "View Inside"}
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
          <Environment preset={isTornado || windIntensity > 3 ? "night" : "park"} />
          <ambientLight intensity={isTornado || windIntensity > 3 ? 0.2 : 0.8} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={isTornado || windIntensity > 3 ? 0.5 : 1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          <CameraController isInside={isInside} />
          
          <EnvironmentScene type={sceneType} isTornado={isTornado} windIntensity={windIntensity} xRayMode={xRayMode} />

          <Hole isFilled={isFilled} xRayMode={xRayMode} />
          
          <Interior isActive={isInside || xRayMode} />
          
          <Shelter 
            position={[2, -1.9, 0]} 
            isOpen={isInside}
          />

          <OrbitControls 
            enableZoom={true} 
            minDistance={2}
            maxDistance={25}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.8} 
            enabled={true} 
          />
        </Canvas>
      </div>
    </section>
  );
}
