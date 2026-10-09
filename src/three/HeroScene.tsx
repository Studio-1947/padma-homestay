import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "../lib/theme";

const SKY_HDR = "/hdri/qwantani_sunrise_2k.hdr";
// "Snowy Mountain - Terrain" by artfromheath (CC BY 4.0), compressed from assets-src/. Credited in the footer.
const TERRAIN_MODEL = "/models/snowy-mountain.glb";

/** World width of the terrain tile. The camera stands inside it, in the central valley. */
const TERRAIN_WIDTH = 120;
/** Where the camera stands on the tile, as a fraction of its width (u) and depth (v). */
const STAND = { u: 0.3, v: 0.56 };
/** Camera height above the highest ground it passes over. */
const EYE_HEIGHT = 4;
const CAMERA_START = new THREE.Vector3(0, 1.2, 10);

type Mood = {
  fog: string;
  sun: string;
  sunIntensity: number;
  environment: number;
};

const MOODS: Record<Theme, Mood> = {
  light: { fog: "#edf0ee", sun: "#ffe9cf", sunIntensity: 1.9, environment: 0.75 },
  dark: { fog: "#0d1513", sun: "#9db4ff", sunIntensity: 0.45, environment: 0.1 },
};

function Terrain() {
  const { scene } = useGLTF(TERRAIN_MODEL);

  // Measure an untransformed copy so the result does not depend on where the model is mounted.
  const placement = useMemo(() => {
    const probe = scene.clone(true);
    probe.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(probe);
    const size = box.getSize(new THREE.Vector3());
    const scale = TERRAIN_WIDTH / size.x;
    const standX = box.min.x + size.x * STAND.u;
    const standZ = box.min.z + size.z * STAND.v;

    // Find the highest ground under the camera's whole path (pointer drift sideways, scroll travel forward).
    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    const origin = new THREE.Vector3();
    let ground = box.min.y;
    for (let ix = -2; ix <= 2; ix++) {
      for (let iz = 0; iz <= 5; iz++) {
        origin.set(standX + (ix * 1.5) / scale, box.max.y + 1, standZ - (iz * 1.2) / scale);
        raycaster.set(origin, down);
        const hit = raycaster.intersectObject(probe, true)[0];
        if (hit) ground = Math.max(ground, hit.point.y);
      }
    }

    return {
      scale,
      position: [
        CAMERA_START.x - standX * scale,
        CAMERA_START.y - EYE_HEIGHT - ground * scale,
        CAMERA_START.z - standZ * scale,
      ] as [number, number, number],
    };
  }, [scene]);

  return (
    <group position={placement.position} scale={placement.scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(TERRAIN_MODEL);

/** Moves the camera with the pointer and the first screen of scroll, so near and far slopes slide against each other. */
function CameraRig({ enabled }: { enabled: boolean }) {
  const camera = useThree((state) => state.camera);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useMemo(() => new THREE.Vector3(0, 4.5, -30), []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  useFrame((_, delta) => {
    if (enabled) {
      const scroll = THREE.MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1);
      const ease = 1 - Math.exp(-delta * 3);
      camera.position.x += (CAMERA_START.x + pointer.current.x * 1.1 - camera.position.x) * ease;
      camera.position.y += (CAMERA_START.y - pointer.current.y * 0.4 + scroll * 3 - camera.position.y) * ease;
      camera.position.z += (CAMERA_START.z - scroll * 4 - camera.position.z) * ease;
    }
    camera.lookAt(target);
  });

  return null;
}

type HeroSceneProps = {
  theme: Theme;
  /** False while the hero is scrolled out of view, so the GPU can rest. */
  active: boolean;
  reducedMotion: boolean;
};

export default function HeroScene({ theme, active, reducedMotion }: HeroSceneProps) {
  const mood = MOODS[theme];
  const animate = !reducedMotion;
  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 40, near: 0.1, far: 260, position: CAMERA_START.toArray() }}
    >
      <fog attach="fog" args={[mood.fog, 30, 150]} />
      <directionalLight color={mood.sun} intensity={mood.sunIntensity} position={[-30, 22, 10]} />

      <Suspense fallback={<ambientLight intensity={0.8} />}>
        <Environment files={SKY_HDR} environmentIntensity={mood.environment} />
      </Suspense>

      <Suspense fallback={null}>
        <Terrain />
      </Suspense>

      {theme === "dark" && <Stars radius={120} depth={40} count={1400} factor={4} fade speed={animate ? 0.6 : 0} />}

      <Sparkles
        count={70}
        scale={[26, 9, 14]}
        position={[0, 3, -2]}
        size={2.4}
        speed={animate ? 0.25 : 0}
        opacity={theme === "dark" ? 0.7 : 0.55}
        color="#ffffff"
      />

      <CameraRig enabled={animate} />
    </Canvas>
  );
}
