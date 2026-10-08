import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Traditional order: blue (sky), white (air), red (fire), green (water), yellow (earth).
const FLAG_COLORS = ["#2f6fb5", "#f2f0ea", "#c8443c", "#3f8f5a", "#e0b33a"];
const FLAG_COUNT = 10;
const FLAG_WIDTH = 0.62;
const FLAG_HEIGHT = 0.82;

function Flags({ animate }: { animate: boolean }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.6, 1.5, 0),
        new THREE.Vector3(-2, 0.75, 0.15),
        new THREE.Vector3(1, 0.55, 0.1),
        new THREE.Vector3(4.6, 1.2, 0),
      ]),
    [],
  );

  const rope = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.012, 6, false), [curve]);

  const flags = useMemo(
    () =>
      Array.from({ length: FLAG_COUNT }, (_, i) => {
        const t = 0.06 + (i / (FLAG_COUNT - 1)) * 0.88;
        const geometry = new THREE.PlaneGeometry(FLAG_WIDTH, FLAG_HEIGHT, 6, 7);
        geometry.translate(0, -FLAG_HEIGHT / 2, 0); // hang from the top edge
        const tangent = curve.getTangent(t);
        return {
          geometry,
          rest: (geometry.attributes.position.array as Float32Array).slice(),
          position: curve.getPoint(t),
          tilt: Math.atan2(tangent.y, tangent.x),
          color: FLAG_COLORS[i % FLAG_COLORS.length],
          phase: i * 0.9,
        };
      }),
    [curve],
  );

  useEffect(
    () => () => {
      rope.dispose();
      flags.forEach((flag) => flag.geometry.dispose());
    },
    [rope, flags],
  );

  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!animate) return;
    clock.current += delta;
    const time = clock.current;
    for (const flag of flags) {
      const position = flag.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < position.count; i++) {
        const x = flag.rest[i * 3];
        const y = flag.rest[i * 3 + 1];
        const hang = -y / FLAG_HEIGHT; // 0 at the rope, 1 at the free edge
        const wave =
          Math.sin(x * 4 + time * 3.2 + flag.phase) * 0.1 + Math.sin(time * 1.6 + flag.phase * 1.7) * 0.14;
        position.setZ(i, wave * hang);
      }
      position.needsUpdate = true;
      flag.geometry.computeVertexNormals();
    }
  });

  return (
    <group position-y={-0.35}>
      <mesh geometry={rope}>
        <meshBasicMaterial color="#6b6257" />
      </mesh>
      {flags.map((flag, i) => (
        <mesh key={i} geometry={flag.geometry} position={flag.position} rotation-z={flag.tilt}>
          <meshLambertMaterial color={flag.color} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

type PrayerFlagsProps = {
  active: boolean;
  reducedMotion: boolean;
};

export default function PrayerFlags({ active, reducedMotion }: PrayerFlagsProps) {
  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";
  return (
    <Canvas frameloop={frameloop} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} camera={{ fov: 34, position: [0, 0.3, 7.4] }}>
      <ambientLight intensity={1.5} />
      <directionalLight intensity={1.8} position={[3, 5, 6]} />
      <Flags animate={!reducedMotion} />
    </Canvas>
  );
}
