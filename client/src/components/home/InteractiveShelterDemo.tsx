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

function Bench({ position = [0, 0, 0], rotation = [0, 0, 0], windIntensity }: any) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
     if (!ref.current) return;
     // Shake
     if (windIntensity >= 2 && windIntensity < 4) {
        ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 15) * 0.05 * (windIntensity - 1);
     }
     // Fly away
     if (windIntensity >= 4) {
        ref.current.position.y += 0.1;
        ref.current.position.x += 0.2;
        ref.current.rotation.z += 0.1;
        ref.current.rotation.x += 0.05;
     } else {
        // Reset
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.1);
        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0], 0.1);
        ref.current.rotation.copy(new THREE.Euler(...rotation));
     }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
       <mesh position={[0, 0.25, 0]} castShadow>
         <boxGeometry args={[1.5, 0.1, 0.5]} />
         <meshStandardMaterial color="#8d6e63" />
       </mesh>
       <mesh position={[0, 0.75, -0.25]} rotation={[0.2, 0, 0]} castShadow>
         <boxGeometry args={[1.5, 0.5, 0.1]} />
         <meshStandardMaterial color="#8d6e63" />
       </mesh>
       {/* Legs */}
       <mesh position={[-0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#4e342e" />
       </mesh>
       <mesh position={[0.6, 0.2, 0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#4e342e" />
       </mesh>
       <mesh position={[-0.6, 0.2, -0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#4e342e" />
       </mesh>
       <mesh position={[0.6, 0.2, -0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#4e342e" />
       </mesh>
    </group>
  );
}

function Shed({ position = [0, 0, 0], rotation = [0, 0, 0], windIntensity }: any) {
    const ref = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (!ref.current) return;
        if (windIntensity >= 3 && windIntensity < 5) {
             ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.02 * (windIntensity - 2);
        }
        if (windIntensity >= 5) {
             ref.current.position.y += 0.15;
             ref.current.position.x += 0.25;
             ref.current.rotation.z += 0.05;
             ref.current.rotation.y += 0.05;
        } else {
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.1);
            ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0], 0.1);
            if (windIntensity < 3) ref.current.rotation.z = 0;
        }
    });

    return (
        <group ref={ref} position={position} rotation={rotation}>
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#795548" />
            </mesh>
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI/4, 0]}>
                <coneGeometry args={[2, 1, 4]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
            <mesh position={[0, 0.9, 1.01]}>
                <planeGeometry args={[0.8, 1.6]} />
                <meshStandardMaterial color="#5d4037" />
            </mesh>
        </group>
    );
}

function Person({ lookingUp = false }: { lookingUp?: boolean }) {
  return (
    <group>
       {/* Legs */}
       <mesh position={[-0.12, 0.4, 0]} castShadow>
         <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
         <meshStandardMaterial color="#1e3a5f" roughness={0.9} />
       </mesh>
       <mesh position={[0.12, 0.4, 0]} castShadow>
         <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
         <meshStandardMaterial color="#1e3a5f" roughness={0.9} />
       </mesh>
       
       {/* Torso */}
       <mesh position={[0, 1.0, 0]} castShadow>
         <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
         <meshStandardMaterial color="#4a5568" roughness={0.8} />
       </mesh>
       
       {/* Arms */}
       <mesh position={[-0.3, 0.95, 0]} rotation={[0, 0, 0.2]} castShadow>
         <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
         <meshStandardMaterial color="#4a5568" roughness={0.8} />
       </mesh>
       <mesh position={[0.3, 0.95, 0]} rotation={[0, 0, -0.2]} castShadow>
         <capsuleGeometry args={[0.07, 0.5, 4, 8]} />
         <meshStandardMaterial color="#4a5568" roughness={0.8} />
       </mesh>

       {/* Head - tilted up if lookingUp */}
       <group position={[0, 1.45, 0]} rotation={[lookingUp ? -0.4 : 0, 0, 0]}>
         <mesh castShadow>
           <sphereGeometry args={[0.15, 16, 16]} />
           <meshStandardMaterial color="#d4a574" roughness={0.7} />
         </mesh>
         {/* Hair */}
         <mesh position={[0, 0.05, -0.02]}>
           <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
           <meshStandardMaterial color="#2d1810" roughness={1} />
         </mesh>
       </group>
    </group>
  )
}

function Interior({ isActive }: { isActive: boolean }) {
  const concreteColor = "#888888";
  const concreteColorDark = "#666666";
  const floorColor = "#555555";
  
  if (!isActive) return null;
  
  return (
    <group position={[2, -2.5, 0]}>
       
       {/* FLOOR - main room */}
       <mesh position={[0, 0, 0]} receiveShadow>
         <boxGeometry args={[2.5, 0.1, 3]} />
         <meshStandardMaterial color={floorColor} roughness={0.95} />
       </mesh>

       {/* LEFT WALL */}
       <mesh position={[-1.2, 1, 0]} receiveShadow>
         <boxGeometry args={[0.1, 2, 3]} />
         <meshStandardMaterial color={concreteColor} roughness={0.85} />
       </mesh>
       
       {/* RIGHT WALL */}
       <mesh position={[1.2, 1, 0]} receiveShadow>
         <boxGeometry args={[0.1, 2, 3]} />
         <meshStandardMaterial color={concreteColor} roughness={0.85} />
       </mesh>
       
       {/* BACK WALL */}
       <mesh position={[0, 1, 1.45]} receiveShadow>
         <boxGeometry args={[2.5, 2, 0.1]} />
         <meshStandardMaterial color={concreteColorDark} roughness={0.9} />
       </mesh>
       
       {/* FRONT WALL - partial, below stair opening */}
       <mesh position={[0, 0.4, -1.45]} receiveShadow>
         <boxGeometry args={[2.5, 0.8, 0.1]} />
         <meshStandardMaterial color={concreteColor} roughness={0.9} />
       </mesh>

       {/* STAIRWELL - going up and forward */}
       <group position={[0, 0, -1.5]}>
         {/* Stair treads */}
         {[...Array(7)].map((_, i) => (
           <mesh key={i} position={[0, 0.1 + i * 0.35, -i * 0.4]} receiveShadow castShadow>
             <boxGeometry args={[1, 0.1, 0.4]} />
             <meshStandardMaterial color={concreteColorDark} roughness={0.9} />
           </mesh>
         ))}
         
         {/* Left stairwell wall */}
         <mesh position={[-0.55, 1.3, -1.2]} receiveShadow>
           <boxGeometry args={[0.1, 2.5, 2.8]} />
           <meshStandardMaterial color={concreteColor} roughness={0.85} />
         </mesh>
         
         {/* Right stairwell wall */}
         <mesh position={[0.55, 1.3, -1.2]} receiveShadow>
           <boxGeometry args={[0.1, 2.5, 2.8]} />
           <meshStandardMaterial color={concreteColor} roughness={0.85} />
         </mesh>
         
         {/* Handrails */}
         <mesh position={[-0.4, 1.2, -1]} rotation={[-0.7, 0, 0]} castShadow>
           <cylinderGeometry args={[0.03, 0.03, 3]} />
           <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
         </mesh>
         <mesh position={[0.4, 1.2, -1]} rotation={[-0.7, 0, 0]} castShadow>
           <cylinderGeometry args={[0.03, 0.03, 3]} />
           <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
         </mesh>
       </group>

       {/* DOOR opening at top - light from outside */}
       <mesh position={[0, 2.6, -4]} rotation={[-0.5, 0, 0]}>
         <planeGeometry args={[1, 1.2]} />
         <meshBasicMaterial color="#87ceeb" />
       </mesh>

       {/* PERSON standing on floor, facing stairs */}
       <group position={[0, 0.05, 0.3]}>
         <Person lookingUp={true} />
       </group>

       {/* BENCH on side */}
       <group position={[0.7, 0.05, 0.8]}>
         <mesh position={[0, 0.2, 0]} castShadow>
           <boxGeometry args={[0.4, 0.05, 0.8]} />
           <meshStandardMaterial color="#666" roughness={0.9} />
         </mesh>
         <mesh position={[0.15, 0.1, 0.3]}>
           <boxGeometry args={[0.08, 0.2, 0.08]} />
           <meshStandardMaterial color="#555" />
         </mesh>
         <mesh position={[-0.15, 0.1, 0.3]}>
           <boxGeometry args={[0.08, 0.2, 0.08]} />
           <meshStandardMaterial color="#555" />
         </mesh>
         <mesh position={[0.15, 0.1, -0.3]}>
           <boxGeometry args={[0.08, 0.2, 0.08]} />
           <meshStandardMaterial color="#555" />
         </mesh>
         <mesh position={[-0.15, 0.1, -0.3]}>
           <boxGeometry args={[0.08, 0.2, 0.08]} />
           <meshStandardMaterial color="#555" />
         </mesh>
       </group>

       {/* Interior lighting */}
       <pointLight position={[0, 1.5, 0]} intensity={1} distance={5} color="#fff8e7" />
       <pointLight position={[0, 2.5, -3]} intensity={1.5} distance={4} color="#87ceeb" />
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
      // Bird's eye view - camera positioned to see inside the shelter
      // Interior is at [2, -2.5, 0]
      targetPos.current.set(2, 2, 4);       // Above and behind
      targetLook.current.set(2, -1.5, -1);  // Looking at the interior
    } else {
      targetPos.current.set(0, 5, 10);
      targetLook.current.set(0, 0, 0);
    }
  }, [isInside]);

  useFrame((state) => {
    if (controls) {
       controls.target.lerp(targetLook.current, 0.08);
       controls.update();
    }
    
    if (state.camera.position.distanceTo(targetPos.current) > 0.3) {
       state.camera.position.lerp(targetPos.current, 0.04);
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
        // Backyard Fence & Items
        <group>
           {/* Fence */}
           {windIntensity < 3 && [...Array(10)].map((_, i) => (
             <mesh key={i} position={[-8, -1, i * 2 - 8]} castShadow>
               <boxGeometry args={[0.2, 2, 1.8]} />
               <meshStandardMaterial color="#8d6e63" />
             </mesh>
           ))}
           
           {/* Backyard Items that fly away */}
           <Shed position={[-5, -1, -5]} rotation={[0, -0.5, 0]} windIntensity={windIntensity} />
           <Bench position={[-2, -1.5, 3]} rotation={[0, 1, 0]} windIntensity={windIntensity} />
           
           {/* Backyard Tree */}
           {windIntensity < 4 && (
             <group position={[-6, 0, 5]}>
                <mesh position={[0, 2, 0]}>
                   <coneGeometry args={[1.5, 4, 8]} />
                   <meshStandardMaterial color="#2e7d32" />
                </mesh>
                <mesh position={[0, 0, 0]}>
                   <cylinderGeometry args={[0.3, 0.4, 1.5]} />
                   <meshStandardMaterial color="#5d4037" />
                </mesh>
             </group>
           )}
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
            minDistance={1}
            maxDistance={25}
            minPolarAngle={0.2} 
            maxPolarAngle={Math.PI / 1.5} 
            enablePan={false}
            enabled={true}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </section>
  );
}
