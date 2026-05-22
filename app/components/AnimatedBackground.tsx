// app/components/AnimatedBackground.tsx – subtle 3D particle grid background
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";

// generate a simple grid of points
function ParticleGrid() {
  const points = useMemo(() => {
    const positions: number[] = [];
    const count = 30; // 30x30 grid
    const spacing = 1.5;
    for (let xi = -count; xi <= count; xi++) {
      for (let zi = -count; zi <= count; zi++) {
        positions.push(xi * spacing, 0, zi * spacing);
      }
    }
    return new Float32Array(positions);
  }, []);

  return (
    <Points positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#0066ff" // electric blue
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </Points>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <ParticleGrid />
        {/* optional slight orbit for subtle motion */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
