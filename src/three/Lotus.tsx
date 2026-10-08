import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Ring = { count: number; tilt: number; scale: number; offset: number };

// Inner petals stand nearly upright, outer petals lie open.
const RINGS: Ring[] = [
  { count: 6, tilt: 0.3, scale: 0.55, offset: 0 },
  { count: 8, tilt: 0.75, scale: 0.8, offset: 0.4 },
  { count: 10, tilt: 1.2, scale: 1, offset: 0.2 },
];

function createPetalGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, 14, 12);
  geometry.scale(0.36, 1, 0.07);
  geometry.translate(0, 1, 0); // pivot at the base of the petal

  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(position.count * 3);
  const root = new THREE.Color("#fff1f5");
  const tip = new THREE.Color("#d4467a");
  const color = new THREE.Color();

  for (let i = 0; i < position.count; i++) {
    const t = position.getY(i) / 2;
    // Cup the petal inward and pinch the tip.
    position.setZ(i, position.getZ(i) - 0.45 * t * t);
    position.setX(i, position.getX(i) * (1 - 0.25 * t * t));
    color.copy(root).lerp(tip, Math.pow(t, 1.4));
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type LotusProps = {
  /** When false the flower renders fully open and still. */
  animate: boolean;
};

/** A procedural lotus that blooms once on load, then turns slowly. */
export function Lotus({ animate }: LotusProps) {
  const group = useRef<THREE.Group>(null);
  const petals = useRef<(THREE.Mesh | null)[]>([]);
  const bloom = useRef(animate ? 0 : 1);
  const geometry = useMemo(createPetalGeometry, []);

  const layout = useMemo(
    () =>
      RINGS.flatMap((ring) =>
        Array.from({ length: ring.count }, (_, i) => ({
          angle: (i / ring.count) * Math.PI * 2 + ring.offset,
          tilt: ring.tilt,
          scale: ring.scale,
        })),
      ),
    [],
  );

  useFrame((_, delta) => {
    if (!animate) return;
    if (group.current) group.current.rotation.y += delta * 0.12;
    if (bloom.current < 1) {
      bloom.current = Math.min(1, bloom.current + delta / 2.6);
      const open = 0.2 + 0.8 * easeOutCubic(bloom.current);
      petals.current.forEach((petal, i) => {
        if (petal) petal.rotation.x = layout[i].tilt * open;
      });
    }
  });

  return (
    <group ref={group}>
      {layout.map((petal, i) => (
        <group key={i} rotation-y={petal.angle}>
          <mesh
            ref={(mesh) => {
              petals.current[i] = mesh;
            }}
            geometry={geometry}
            scale={petal.scale}
            rotation-x={petal.tilt * (animate ? 0.2 : 1)}
          >
            <meshStandardMaterial
              vertexColors
              roughness={0.5}
              emissive="#a8345c"
              emissiveIntensity={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      <mesh position-y={0.16}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color="#e9b949" roughness={0.6} emissive="#e9b949" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}
