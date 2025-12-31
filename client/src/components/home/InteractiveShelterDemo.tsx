import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Wind, Shovel, Trees, Home as HomeIcon, AlertTriangle, DoorOpen, Eye, EyeOff, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';
import * as THREE from 'three';

const MODEL_URL = '/models/shelter.glb';

// ============================================
// UNIT HELPERS FOR VIRTUAL TOUR
// ============================================

const ft = (v: number) => v * 0.3048;
const inch = (v: number) => v * 0.0254;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothstep01(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function getSphericalFromCamera(cameraPos: THREE.Vector3, target: THREE.Vector3) {
  const v = new THREE.Vector3().subVectors(cameraPos, target);
  const spherical = new THREE.Spherical();
  spherical.setFromVector3(v);
  spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.001, Math.PI - 0.001);
  return spherical;
}

function cameraFromSpherical(target: THREE.Vector3, spherical: THREE.Spherical) {
  const v = new THREE.Vector3().setFromSpherical(spherical);
  return new THREE.Vector3().addVectors(target, v);
}

// ============================================
// VIRTUAL TOUR COMPONENTS (Improved Interior View)
// ============================================

const DIM_FT = {
  width: 4.5,
  length: 8.0,
  height: 6.5,
};

const HATCH_IN = { width: 32, height: 48, thickness: 2.0 };
const MAN_BACK_FT = 1.5;

function VirtualTourMan() {
  const jacketMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1f1f1f", roughness: 0.9 }), []);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2f4b7c", roughness: 0.9 }), []);
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#cfa37b", roughness: 0.85 }), []);
  const shoeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0f0f0f", roughness: 0.95 }), []);

  return (
    <group>
      <mesh material={jacketMat} position={[0, 1.18, 0]}><capsuleGeometry args={[0.23, 0.85, 8, 18]} /></mesh>
      <mesh material={pantsMat} position={[0, 0.78, 0]}><capsuleGeometry args={[0.20, 0.45, 8, 18]} /></mesh>
      <mesh material={skinMat} position={[0, 1.63, 0]}><capsuleGeometry args={[0.065, 0.12, 6, 14]} /></mesh>
      <mesh material={skinMat} position={[0, 1.83, 0]}><sphereGeometry args={[0.16, 22, 22]} /></mesh>
      <mesh material={jacketMat} position={[-0.32, 1.22, 0]} rotation={[0, 0, 0.08]}><capsuleGeometry args={[0.07, 0.62, 8, 16]} /></mesh>
      <mesh material={jacketMat} position={[0.32, 1.22, 0]} rotation={[0, 0, -0.08]}><capsuleGeometry args={[0.07, 0.62, 8, 16]} /></mesh>
      <mesh material={skinMat} position={[-0.34, 0.86, 0.03]}><sphereGeometry args={[0.06, 16, 16]} /></mesh>
      <mesh material={skinMat} position={[0.34, 0.86, 0.03]}><sphereGeometry args={[0.06, 16, 16]} /></mesh>
      <mesh material={pantsMat} position={[-0.11, 0.40, 0]}><capsuleGeometry args={[0.085, 0.72, 8, 16]} /></mesh>
      <mesh material={pantsMat} position={[0.11, 0.40, 0]}><capsuleGeometry args={[0.085, 0.72, 8, 16]} /></mesh>
      <mesh material={shoeMat} position={[-0.11, 0.04, 0.06]}><boxGeometry args={[0.14, 0.08, 0.28]} /></mesh>
      <mesh material={shoeMat} position={[0.11, 0.04, 0.06]}><boxGeometry args={[0.14, 0.08, 0.28]} /></mesh>
    </group>
  );
}

function VirtualTourShelter({ hatchClosed, ghostWalls }: { hatchClosed: boolean; ghostWalls: boolean }) {
  const W = ft(DIM_FT.width);
  const L = ft(DIM_FT.length);
  const H = ft(DIM_FT.height);

  const concrete = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#cdcdcd", roughness: 0.98, metalness: 0.0, side: THREE.DoubleSide,
      transparent: ghostWalls, opacity: ghostWalls ? 0.28 : 1.0, depthWrite: !ghostWalls,
    }),
    [ghostWalls]
  );

  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9a9a9a", roughness: 0.35, metalness: 0.5, side: THREE.DoubleSide }), []);
  const darkSteel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#4f4f4f", roughness: 0.5, metalness: 0.45, side: THREE.DoubleSide }), []);
  const ledMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f7f7f7", emissive: new THREE.Color("#ffffff"), emissiveIntensity: 4.0, roughness: 0.2, metalness: 0.0 }), []);
  const outsideMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#efefef", side: THREE.DoubleSide }), []);

  const wallAngle = 0.18;
  const openingZ = -L / 2;
  const landingZ = L / 2 - ft(1.25);
  const stairTopZ = openingZ + ft(1.2);
  const runTotal = landingZ - stairTopZ;
  const stepCount = 9;
  const stepRise = (H - ft(1.2)) / stepCount;
  const stepRun = runTotal / stepCount;
  const stairStartY = ft(0.25);
  const stairStartZ = landingZ - ft(2.2);
  const hatchW = inch(HATCH_IN.width);
  const hatchH = inch(HATCH_IN.height);
  const hatchT = inch(HATCH_IN.thickness);
  const hatchY = H - ft(0.25);
  const ledY = H - ft(0.55);

  return (
    <group>
      <mesh material={concrete} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[W + ft(2.0), L + ft(2.0)]} /></mesh>
      <mesh material={concrete} position={[0, H / 2, L / 2]} rotation={[0, Math.PI, 0]}><planeGeometry args={[W + ft(2.0), H]} /></mesh>
      <mesh material={concrete} position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2 + wallAngle, 0]}><planeGeometry args={[L + ft(2.0), H]} /></mesh>
      <mesh material={concrete} position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2 - wallAngle, 0]}><planeGeometry args={[L + ft(2.0), H]} /></mesh>
      <mesh material={concrete} position={[0, H - ft(0.15), openingZ - ft(0.05)]}><boxGeometry args={[W + ft(1.0), ft(0.25), ft(0.25)]} /></mesh>

      {!hatchClosed && (
        <mesh material={outsideMat} position={[0, H - ft(0.4), openingZ - ft(2.0)]}><planeGeometry args={[W + ft(12), H + ft(12)]} /></mesh>
      )}

      <mesh material={darkSteel} position={[0, ft(0.12), landingZ + ft(0.25)]}><boxGeometry args={[W - ft(1.0), ft(0.18), ft(3.2)]} /></mesh>

      <group>
        {Array.from({ length: stepCount }).map((_, i) => (
          <mesh key={i} material={darkSteel} position={[0, stairStartY + i * stepRise, stairStartZ - i * stepRun]}>
            <boxGeometry args={[W - ft(1.05), ft(0.18), stepRun * 0.95]} />
          </mesh>
        ))}
      </group>

      <group position={[0, ledY, ft(0.2)]}>
        <mesh material={darkSteel} position={[0, 0, 0]}><cylinderGeometry args={[ft(0.55), ft(0.55), ft(0.06), 40]} /></mesh>
        <mesh material={ledMat} position={[0, -ft(0.04), 0]}><cylinderGeometry args={[ft(0.50), ft(0.50), ft(0.04), 40]} /></mesh>
      </group>

      {!hatchClosed ? (
        <group position={[0, hatchY, openingZ - ft(0.2)]}>
          <group position={[-(hatchW / 2 + ft(0.6)), ft(0.2), -ft(0.8)]} rotation={[0.0, 0.75, -0.12]}>
            <mesh material={steel}><boxGeometry args={[hatchW, hatchT, hatchH]} /></mesh>
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh key={`leafL-${i}`} material={darkSteel} position={[0, -hatchH / 2 + (i + 1) * (hatchH / 4), hatchT / 2 + ft(0.03)]}>
                <boxGeometry args={[hatchW * 0.88, ft(0.06), ft(0.06)]} />
              </mesh>
            ))}
          </group>
          <group position={[hatchW / 2 + ft(0.6), ft(0.2), -ft(0.8)]} rotation={[0.0, -0.75, 0.12]}>
            <mesh material={steel}><boxGeometry args={[hatchW, hatchT, hatchH]} /></mesh>
            {Array.from({ length: 3 }).map((_, i) => (
              <mesh key={`leafR-${i}`} material={darkSteel} position={[0, -hatchH / 2 + (i + 1) * (hatchH / 4), hatchT / 2 + ft(0.03)]}>
                <boxGeometry args={[hatchW * 0.88, ft(0.06), ft(0.06)]} />
              </mesh>
            ))}
          </group>
        </group>
      ) : (
        <group position={[0, hatchY, openingZ - ft(0.05)]}>
          <mesh material={steel}><boxGeometry args={[hatchW, hatchH, hatchT]} /></mesh>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`ribH-${i}`} material={darkSteel} position={[0, -hatchH / 2 + (i + 1) * (hatchH / 5), hatchT / 2 + ft(0.03)]}>
              <boxGeometry args={[hatchW * 0.92, ft(0.06), ft(0.06)]} />
            </mesh>
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`ribV-${i}`} material={darkSteel} position={[-hatchW / 2 + (i + 1) * (hatchW / 4), 0, hatchT / 2 + ft(0.03)]}>
              <boxGeometry args={[ft(0.06), hatchH * 0.92, ft(0.06)]} />
            </mesh>
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`hinge-${i}`} material={darkSteel} position={[-hatchW / 2 - ft(0.04), -hatchH / 2 + (i + 1) * (hatchH / 4), 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[ft(0.04), ft(0.04), ft(0.14), 18]} />
            </mesh>
          ))}
          <mesh material={darkSteel} position={[hatchW / 2 - ft(0.10), 0, hatchT / 2 + ft(0.05)]}><boxGeometry args={[ft(0.06), hatchH * 0.78, ft(0.04)]} /></mesh>
          <mesh material={darkSteel} position={[hatchW / 2 - ft(0.22), 0, hatchT / 2 + ft(0.05)]}><boxGeometry args={[ft(0.06), hatchH * 0.78, ft(0.04)]} /></mesh>
        </group>
      )}

      <group position={[0, 0, landingZ + ft(0.10) + ft(MAN_BACK_FT)]} rotation={[0, Math.PI, 0]} scale={((H - inch(2)) / 2.02)}>
        <VirtualTourMan />
      </group>
    </group>
  );
}

interface Pose {
  camPos: [number, number, number];
  lookAt: [number, number, number];
}

interface ControlsApi {
  nudgeYaw: (delta: number) => void;
  nudgeZoom: (factor: number) => void;
}

function VirtualTourControls({ pose, orbitYawRangeRad = Math.PI * 2, target, apiRef }: { pose: Pose | null; orbitYawRangeRad?: number; target: [number, number, number]; apiRef: React.MutableRefObject<ControlsApi | null> }) {
  const { camera, gl } = useThree();
  const targetRef = useRef(new THREE.Vector3(target[0], target[1], target[2]));
  const sphericalRef = useRef(new THREE.Spherical(3.6, 1.2, 0.0));
  const desiredRef = useRef(new THREE.Spherical(3.6, 1.2, 0.0));
  const baseThetaRef = useRef<number | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const lastSingleRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef({ active: false, dist: 0, baseRadius: 0 });
  const tweenRef = useRef<any>(null);

  useEffect(() => {
    const s = getSphericalFromCamera(camera.position, targetRef.current);
    sphericalRef.current.copy(s);
    desiredRef.current.copy(s);
    if (baseThetaRef.current == null) baseThetaRef.current = s.theta;
  }, [camera]);

  useEffect(() => {
    if (!pose) return;
    tweenRef.current = {
      t: 0, duration: 0.9,
      fromCam: camera.position.clone(),
      fromTgt: targetRef.current.clone(),
      toCam: new THREE.Vector3(pose.camPos[0], pose.camPos[1], pose.camPos[2]),
      toTgt: new THREE.Vector3(pose.lookAt[0], pose.lookAt[1], pose.lookAt[2]),
    };
  }, [pose, camera]);

  useEffect(() => {
    const el = gl.domElement;
    if (!el) return;
    const ROTATE_SPEED = 0.004;
    const MIN_DIST = 0.9;
    const MAX_DIST = 18;

    const getTwo = () => {
      const vals = Array.from(pointersRef.current.values());
      return vals.length >= 2 ? [vals[0], vals[1]] : null;
    };
    const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    function interruptFlight() {
      tweenRef.current = null;
      const s = getSphericalFromCamera(camera.position, targetRef.current);
      sphericalRef.current.copy(s);
      desiredRef.current.copy(s);
      if (baseThetaRef.current == null) baseThetaRef.current = s.theta;
    }

    function clampYaw() {
      const base = baseThetaRef.current ?? desiredRef.current.theta;
      const half = orbitYawRangeRad / 2;
      desiredRef.current.theta = THREE.MathUtils.clamp(desiredRef.current.theta, base - half, base + half);
    }

    function onPointerDown(e: PointerEvent) {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      lastSingleRef.current = { x: e.clientX, y: e.clientY };
      if (pointersRef.current.size >= 2) {
        const two = getTwo();
        if (two) pinchRef.current = { active: true, dist: dist2(two[0], two[1]), baseRadius: desiredRef.current.radius };
      } else {
        pinchRef.current.active = false;
      }
      interruptFlight();
    }

    function onPointerMove(e: PointerEvent) {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size >= 2) {
        const two = getTwo();
        if (!two) return;
        if (!pinchRef.current.active) {
          pinchRef.current = { active: true, dist: dist2(two[0], two[1]), baseRadius: desiredRef.current.radius };
        }
        const newDist = dist2(two[0], two[1]);
        const ratio = pinchRef.current.dist > 0 ? pinchRef.current.dist / newDist : 1;
        desiredRef.current.radius = THREE.MathUtils.clamp(pinchRef.current.baseRadius * ratio, MIN_DIST, MAX_DIST);
        return;
      }
      const dx = e.clientX - lastSingleRef.current.x;
      const dy = e.clientY - lastSingleRef.current.y;
      lastSingleRef.current = { x: e.clientX, y: e.clientY };
      desiredRef.current.theta -= dx * ROTATE_SPEED;
      desiredRef.current.phi -= dy * ROTATE_SPEED;
      desiredRef.current.phi = THREE.MathUtils.clamp(desiredRef.current.phi, 0.25, Math.PI - 0.25);
      clampYaw();
    }

    function onPointerUp(e: PointerEvent) {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current.active = false;
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      interruptFlight();
      desiredRef.current.radius = THREE.MathUtils.clamp(desiredRef.current.radius * (1 + e.deltaY * 0.001), MIN_DIST, MAX_DIST);
    }

    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [gl, camera, orbitYawRangeRad]);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      nudgeYaw: (deltaTheta: number) => {
        tweenRef.current = null;
        desiredRef.current.theta += deltaTheta;
        const base = baseThetaRef.current ?? desiredRef.current.theta;
        const half = orbitYawRangeRad / 2;
        desiredRef.current.theta = THREE.MathUtils.clamp(desiredRef.current.theta, base - half, base + half);
      },
      nudgeZoom: (factor: number) => {
        tweenRef.current = null;
        desiredRef.current.radius = THREE.MathUtils.clamp(desiredRef.current.radius * factor, 0.9, 18);
      },
    };
    return () => { if (apiRef) apiRef.current = null; };
  }, [apiRef, orbitYawRangeRad]);

  useFrame((_, delta) => {
    const tw = tweenRef.current;
    if (tw) {
      tw.t += delta;
      const k = smoothstep01(tw.t / tw.duration);
      camera.position.lerpVectors(tw.fromCam, tw.toCam, k);
      targetRef.current.lerpVectors(tw.fromTgt, tw.toTgt, k);
      camera.lookAt(targetRef.current);
      if (k >= 1) {
        tweenRef.current = null;
        const s = getSphericalFromCamera(camera.position, targetRef.current);
        sphericalRef.current.copy(s);
        desiredRef.current.copy(s);
        if (baseThetaRef.current == null) baseThetaRef.current = s.theta;
      }
      return;
    }
    const s = sphericalRef.current;
    const d = desiredRef.current;
    const damp = 1 - Math.pow(0.001, delta);
    s.radius = THREE.MathUtils.lerp(s.radius, d.radius, damp);
    s.theta = THREE.MathUtils.lerp(s.theta, d.theta, damp);
    s.phi = THREE.MathUtils.lerp(s.phi, d.phi, damp);
    camera.position.copy(cameraFromSpherical(targetRef.current, s));
    camera.lookAt(targetRef.current);
  });

  return null;
}

function VirtualTourScene({ setPose, hatchClosed, ghostWalls }: { setPose: (p: Pose) => void; hatchClosed: boolean; ghostWalls: boolean }) {
  const H = ft(DIM_FT.height);
  const L = ft(DIM_FT.length);
  const openingZ = -L / 2;
  const hatchY = H - ft(0.25);
  const ambient = 0.95;
  const hemi = 0.9;

  return (
    <>
      <color attach="background" args={["#151515"]} />
      <ambientLight intensity={ambient} />
      <hemisphereLight intensity={hemi} />
      <pointLight position={[0, ft(6.15), ft(0.2)]} intensity={9.5} distance={40} />
      <pointLight position={[0, ft(5.6), ft(0.2)]} intensity={3.5} distance={22} />
      {!hatchClosed && (
        <spotLight position={[0, ft(9.0), -ft(9.0)]} angle={0.8} penumbra={0.75} intensity={10} distance={50} />
      )}
      <Suspense fallback={null}>
        <VirtualTourShelter hatchClosed={hatchClosed} ghostWalls={ghostWalls} />
      </Suspense>
    </>
  );
}

// ============================================
// EXTERIOR SCENE COMPONENTS
// ============================================

function DebrisItem({ children, startPos, delay = 0 }: any) {
  const ref = useRef<THREE.Group>(null);
  const [impact, setImpact] = useState(false);
  const targetOffset = React.useMemo(() => new THREE.Vector3((Math.random() - 0.5) * 1.5, 0, (Math.random() - 0.5) * 1.5), []);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    if (time < delay) return;
    const baseTarget = new THREE.Vector3(2, 0.5, 0);
    const target = baseTarget.clone().add(targetOffset);
    const dir = target.clone().sub(ref.current.position).normalize();
    const dist = ref.current.position.distanceTo(target);
    if (dist > 1.5 && !impact) {
      ref.current.position.add(dir.multiplyScalar(0.25));
      ref.current.rotation.x += 0.1;
      ref.current.rotation.y += 0.1;
    } else {
      if (!impact) setImpact(true);
      ref.current.position.y += 0.2;
      ref.current.position.x += (Math.random() - 0.5) * 0.4;
      ref.current.position.z += (Math.random() - 0.5) * 0.4;
      ref.current.rotation.z += 0.4;
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
     if (windIntensity >= 2 && windIntensity < 4) {
        ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 15) * 0.05 * (windIntensity - 1);
     }
     if (windIntensity >= 4) {
        ref.current.position.y += 0.1;
        ref.current.position.x += 0.2;
        ref.current.rotation.z += 0.1;
        ref.current.rotation.x += 0.05;
     } else {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.1);
        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0], 0.1);
        ref.current.rotation.copy(new THREE.Euler(...rotation));
     }
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
       <mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[1.5, 0.1, 0.5]} /><meshStandardMaterial color="#8d6e63" /></mesh>
       <mesh position={[0, 0.75, -0.25]} rotation={[0.2, 0, 0]} castShadow><boxGeometry args={[1.5, 0.5, 0.1]} /><meshStandardMaterial color="#8d6e63" /></mesh>
       <mesh position={[-0.6, 0.2, 0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#4e342e" /></mesh>
       <mesh position={[0.6, 0.2, 0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#4e342e" /></mesh>
       <mesh position={[-0.6, 0.2, -0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#4e342e" /></mesh>
       <mesh position={[0.6, 0.2, -0.2]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#4e342e" /></mesh>
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
            <mesh position={[0, 1, 0]} castShadow><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="#795548" /></mesh>
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI/4, 0]}><coneGeometry args={[2, 1, 4]} /><meshStandardMaterial color="#3e2723" /></mesh>
            <mesh position={[0, 0.9, 1.01]}><planeGeometry args={[0.8, 1.6]} /><meshStandardMaterial color="#5d4037" /></mesh>
        </group>
    );
}

function Shelter({ position, isOpen }: any) {
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

function Debris({ isTornado, windIntensity }: { isTornado: boolean, windIntensity: number }) {
  if (!isTornado && windIntensity < 1) return null;
  const showLeaves = windIntensity >= 1;
  const showSmall = windIntensity >= 2;
  const showLarge = windIntensity >= 4;
  return (
    <group>
      {showLeaves && [...Array(20)].map((_, i) => (
         <DebrisItem key={`leaf-${i}`} startPos={new THREE.Vector3((Math.random()-0.5)*20, Math.random()*10, (Math.random()-0.5)*20)} delay={Math.random()}>
            <mesh><planeGeometry args={[0.1, 0.1]} /><meshBasicMaterial color="#4caf50" side={THREE.DoubleSide} /></mesh>
         </DebrisItem>
      ))}
      {showSmall && <DebrisItem startPos={new THREE.Vector3(-12, 4, 0)} delay={0.5}>
           <mesh castShadow><boxGeometry args={[0.2, 0.1, 2]} /><meshStandardMaterial color="#d7ccc8" /></mesh>
      </DebrisItem>}
      {showLarge && (
        <>
          <DebrisItem startPos={new THREE.Vector3(-10, 5, 5)}>
            <group scale={0.8}><mesh castShadow><boxGeometry args={[1, 0.5, 2]} /><meshStandardMaterial color="red" /></mesh></group>
          </DebrisItem>
          <DebrisItem startPos={new THREE.Vector3(-8, 8, -5)} delay={1}>
             <group scale={0.6}><mesh position={[0, 0.5, 0]}><coneGeometry args={[0.5, 2, 8]} /><meshStandardMaterial color="#2e7d32" /></mesh></group>
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
     if (windIntensity >= 2 && windIntensity < 4) {
        ref.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 10) * 0.02 * windIntensity;
     }
     if (windIntensity >= 4) {
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, Math.PI / 2, 0.05);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 2, 0.01);
     } else {
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], 0.1);
     }
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh position={[0, 1, 0]} castShadow><boxGeometry args={[2.5, 2, 5]} /><meshStandardMaterial color="#f5f5f5" /></mesh>
      <mesh position={[0, 1, 0]}><boxGeometry args={[2.55, 0.2, 5.1]} /><meshStandardMaterial color="#E69138" /></mesh>
      <mesh position={[1.3, 1.2, 0]}><boxGeometry args={[0.1, 0.8, 2]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[1, 0, 1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.4, 0.4, 0.5, 16]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[-1, 0, 1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.4, 0.4, 0.5, 16]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[1, 0, -1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.4, 0.4, 0.5, 16]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[-1, 0, -1]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.4, 0.4, 0.5, 16]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
    </group>
  );
}

function EnvironmentScene({ type, isTornado, windIntensity, xRayMode }: any) {
  const { scene } = useThree();
  const windLines = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (windLines.current) {
        windLines.current.visible = windIntensity > 0 || isTornado;
        windLines.current.children.forEach((line) => {
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <primitive object={groundMaterial} attach="material" />
      </mesh>
      {type === 'campsite' ? (
        <group>
           <RVTrailer position={[-3, -1.2, -4]} rotation={[0, 0.2, 0]} windIntensity={windIntensity} />
           <RVTrailer position={[-7, -1.2, -4]} rotation={[0, 0.1, 0]} windIntensity={windIntensity} />
           <RVTrailer position={[-3, -1.2, 4]} rotation={[0, -0.2, 0]} windIntensity={windIntensity} />
           {windIntensity < 5 && (
             <Float speed={windIntensity > 0 ? 5 : 2} rotationIntensity={windIntensity * 0.2} floatIntensity={0.5} position={[-5, 0, 0]}>
               <mesh castShadow receiveShadow><coneGeometry args={[0.8, 3, 8]} /><meshStandardMaterial color="#2e7d32" /></mesh>
             </Float>
           )}
        </group>
      ) : (
        <group>
           {windIntensity < 3 && [...Array(10)].map((_, i) => (
             <mesh key={i} position={[-8, -1, i * 2 - 8]} castShadow><boxGeometry args={[0.2, 2, 1.8]} /><meshStandardMaterial color="#8d6e63" /></mesh>
           ))}
           <Shed position={[-5, -1, -5]} rotation={[0, -0.5, 0]} windIntensity={windIntensity} />
           <Bench position={[-2, -1.5, 3]} rotation={[0, 1, 0]} windIntensity={windIntensity} />
           {windIntensity < 4 && (
             <group position={[-6, 0, 5]}>
                <mesh position={[0, 2, 0]}><coneGeometry args={[1.5, 4, 8]} /><meshStandardMaterial color="#2e7d32" /></mesh>
                <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.3, 0.4, 1.5]} /><meshStandardMaterial color="#5d4037" /></mesh>
             </group>
           )}
        </group>
      )}
      {(isTornado || windIntensity > 0) && (
         <group>
            {isTornado && <group position={[-15, 0, -10]}>
                <mesh position={[0, 5, 0]}><coneGeometry args={[5, 14, 16, 1, true]} /><meshStandardMaterial color="#222" transparent opacity={0.6} side={THREE.DoubleSide} /></mesh>
            </group>}
            <Debris isTornado={isTornado} windIntensity={windIntensity} />
            <group ref={windLines}>
                {[...Array(40)].map((_, i) => (
                    <mesh key={i} position={[Math.random() * 60 - 30, Math.random() * 10, Math.random() * 30 - 15]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.02, 0.02, 3]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
                    </mesh>
                ))}
            </group>
         </group>
      )}
    </>
  );
}

function Hole({ isFilled, xRayMode }: any) {
  const { scale } = useSpring({ scale: isFilled ? 1 : 0, config: { tension: 170, friction: 26 } });
  const sideMaterial = xRayMode
    ? new THREE.MeshStandardMaterial({ color: "#1a1a1a", transparent: true, opacity: 0.2, wireframe: true })
    : new THREE.MeshStandardMaterial({ color: "#1a1a1a" });

  return (
    <group position={[2, -1.9, 0]}>
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[2, 3]} /><meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-1, -0.25, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[3, 0.5]} /><primitive object={sideMaterial} attach="material" />
        </mesh>
        <mesh position={[1, -0.25, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[3, 0.5]} /><primitive object={sideMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.25, -1.5]} rotation={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2, 0.5]} /><primitive object={sideMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.25, 1.5]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[2, 0.5]} /><primitive object={sideMaterial} attach="material" />
        </mesh>
      </group>
      <animated.group scale={scale}>
         <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.5, 3.5]} /><meshStandardMaterial color="#5d4037" roughness={1} transparent={xRayMode} opacity={xRayMode ? 0.3 : 1} />
         </mesh>
         <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
           <planeGeometry args={[2.4, 3.4]} /><meshStandardMaterial color="#4caf50" roughness={1} transparent={xRayMode} opacity={xRayMode ? 0.3 : 1} />
         </mesh>
      </animated.group>
    </group>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function InteractiveShelterDemo() {
  const [sceneType, setSceneType] = useState<'backyard' | 'campsite'>('backyard');
  const [isTornado, setIsTornado] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [windIntensity, setWindIntensity] = useState(0);
  const [xRayMode, setXRayMode] = useState(false);
  const [tourPose, setTourPose] = useState<Pose | null>(null);
  const [hatchClosed, setHatchClosed] = useState(false);
  const [ghostWalls, setGhostWalls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsApiRef = useRef<ControlsApi | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (containerRef.current) setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    };
  }, []);

  const handleBackfill = () => setIsFilled(true);

  const reset = () => {
    setIsFilled(false);
    setIsTornado(false);
    setIsInside(false);
    setWindIntensity(0);
    setXRayMode(false);
    setTourPose(null);
    setHatchClosed(false);
    setGhostWalls(true);
  };

  const startCam: [number, number, number] = [0, ft(3.2), ft(5.5)];
  const startLook: [number, number, number] = [0, ft(4.0), -ft(1.0)];

  const enterInterior = () => {
    setIsInside(true);
    setTourPose({ camPos: startCam, lookAt: startLook });
  };

  const exitInterior = () => {
    setIsInside(false);
    setTourPose(null);
  };

  const YAW_STEP = THREE.MathUtils.degToRad(12);
  const startHold = (dir: number) => {
    stopHold();
    controlsApiRef.current?.nudgeYaw(dir * YAW_STEP);
    holdTimerRef.current = setInterval(() => {
      controlsApiRef.current?.nudgeYaw(dir * YAW_STEP * 0.5);
    }, 45);
  };
  const stopHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <section className="py-20 bg-stone-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-4xl font-bold text-[#3E2723] mb-4">Experience the Protection</h2>
        <p className="text-lg text-stone-600">See how our shelters withstand extreme conditions. Activate the tornado simulation below!</p>
      </div>

      <div ref={containerRef} className="relative w-full h-[600px] bg-stone-200 rounded-3xl overflow-hidden border-4 border-[#3E2723]/10 shadow-2xl max-w-6xl mx-auto">
        
        {!isInside && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
             <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg space-y-3 w-64">
                <h3 className="font-bold text-[#3E2723] border-b pb-2">Scene Settings</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={sceneType === 'backyard' ? 'default' : 'outline'} size="sm" onClick={() => setSceneType('backyard')} className={sceneType === 'backyard' ? "bg-[#4caf50] hover:bg-[#388e3c]" : ""}>
                    <HomeIcon size={14} className="mr-1" /> Backyard
                  </Button>
                  <Button variant={sceneType === 'campsite' ? 'default' : 'outline'} size="sm" onClick={() => setSceneType('campsite')} className={sceneType === 'campsite' ? "bg-[#795548] hover:bg-[#5d4037]" : ""}>
                    <Trees size={14} className="mr-1" /> Campsite
                  </Button>
                </div>
                <div className="space-y-2 pt-2 border-t">
                   <div className="flex justify-between text-sm font-medium">
                      <span className="flex items-center gap-1"><Gauge size={14}/> Wind Intensity</span>
                      <span className="text-[#E69138]">EF-{windIntensity}</span>
                   </div>
                   <Slider defaultValue={[0]} max={5} step={1} value={[windIntensity]} onValueChange={(vals) => setWindIntensity(vals[0])} className="py-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                   <Button variant={isTornado ? "destructive" : "outline"} size="sm" onClick={() => setIsTornado(!isTornado)}>
                      {isTornado ? <><Wind size={14} className="mr-1 animate-pulse" /> Active</> : <><Wind size={14} className="mr-1" /> Tornado</>}
                   </Button>
                   <Button variant={xRayMode ? "secondary" : "outline"} size="sm" onClick={() => setXRayMode(!xRayMode)} className={xRayMode ? "bg-blue-100 border-blue-300" : ""}>
                      {xRayMode ? <><Eye size={14} className="mr-1" /> X-Ray On</> : <><EyeOff size={14} className="mr-1" /> X-Ray Off</>}
                   </Button>
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={enterInterior}>
                  <DoorOpen className="mr-2" /> View Inside
                </Button>
             </div>
          </div>
        )}

        {isInside && (
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 items-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 pointer-events-auto">
              Drag to look • Scroll to zoom • Turn around (±180°)
            </div>
            <div className="flex gap-1 pointer-events-auto">
              <button 
                className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer"
                onMouseDown={() => startHold(-1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={(e) => { e.preventDefault(); startHold(-1); }}
                onTouchEnd={stopHold}
              >
                <ChevronLeft size={16} className="inline" /> Turn
              </button>
              <button 
                className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer"
                onMouseDown={() => startHold(1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={(e) => { e.preventDefault(); startHold(1); }}
                onTouchEnd={stopHold}
              >
                Turn <ChevronRight size={16} className="inline" />
              </button>
            </div>
            <button className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer pointer-events-auto" onClick={() => setTourPose({ camPos: startCam, lookAt: startLook })}>
              Reset
            </button>
            <button className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer pointer-events-auto" onClick={() => setTourPose({ camPos: [0, ft(5.2), -ft(1.0)], lookAt: [0, ft(6.0), -ft(4.0)] })}>
              Hatch
            </button>
            <button className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer pointer-events-auto" onClick={() => setTourPose({ camPos: [-ft(4.0), ft(3.2), ft(1.5)], lookAt: [0, ft(3.2), -ft(0.8)] })}>
              Stairs
            </button>
            <button className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer pointer-events-auto" onClick={() => setTourPose({ camPos: [0, ft(3.0), ft(6.5)], lookAt: [0, ft(3.0), ft(3.0)] })}>
              Back
            </button>
            <button className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer pointer-events-auto" onClick={() => setHatchClosed(!hatchClosed)}>
              {hatchClosed ? "Open Hatch" : "Close Hatch"}
            </button>
            <button className="bg-black/60 backdrop-blur px-3 py-2 rounded-xl text-white text-sm border border-white/20 hover:bg-black/80 cursor-pointer pointer-events-auto" onClick={() => setGhostWalls(!ghostWalls)}>
              {ghostWalls ? "Walls: Transparent" : "Walls: Solid"}
            </button>
            <Button variant="outline" size="sm" className="bg-white text-[#3E2723] pointer-events-auto" onClick={exitInterior}>
              <DoorOpen className="mr-2" /> Exit Shelter
            </Button>
          </div>
        )}

        {!isInside && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
             {!isFilled && (
               <Button size="lg" className="bg-[#E69138] hover:bg-[#D4842F] text-[#3E2723] font-bold shadow-xl scale-110" onClick={handleBackfill}>
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
        )}

        {isInside && ready && containerRef.current ? (
          <Canvas
            camera={{ position: startCam, fov: 62, near: 0.05, far: 200 }}
            gl={{ antialias: true }}
            eventSource={containerRef.current}
            eventPrefix="client"
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.35;
              if ("outputColorSpace" in gl && THREE.SRGBColorSpace) (gl as any).outputColorSpace = THREE.SRGBColorSpace;
            }}
          >
            <VirtualTourControls pose={tourPose} orbitYawRangeRad={Math.PI * 2} target={[0, ft(4.0), ft(1.0)]} apiRef={controlsApiRef} />
            <VirtualTourScene setPose={setTourPose} hatchClosed={hatchClosed} ghostWalls={ghostWalls} />
          </Canvas>
        ) : !isInside ? (
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
            <Environment preset={isTornado || windIntensity > 3 ? "night" : "park"} />
            <ambientLight intensity={isTornado || windIntensity > 3 ? 0.2 : 0.8} />
            <directionalLight position={[5, 10, 5]} intensity={isTornado || windIntensity > 3 ? 0.5 : 1.5} castShadow shadow-mapSize={[1024, 1024]} />
            <EnvironmentScene type={sceneType} isTornado={isTornado} windIntensity={windIntensity} xRayMode={xRayMode} />
            <Hole isFilled={isFilled} xRayMode={xRayMode} />
            <Shelter position={[2, -1.9, 0]} isOpen={false} />
            <OrbitControls enableZoom={true} minDistance={3} maxDistance={25} minPolarAngle={0.2} maxPolarAngle={Math.PI / 1.5} enablePan={false} />
          </Canvas>
        ) : null}
      </div>
    </section>
  );
}
