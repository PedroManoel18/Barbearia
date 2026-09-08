import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useScroll } from "framer-motion";
import * as THREE from "three";

// Constantes
const BG_SCALE   = 1.2;
const BG_OPACITY = 0.12;
const ROTATION_Y = 0.3;
const ROTATION_Z = -Math.PI / 2;

function ScissorsScene({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/scissors.glb");
  const { actions, mixer } = useAnimations(animations, groupRef);

  useEffect(() => {
    // Opacidade sutil nos materiais
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = BG_OPACITY;
        mat.needsUpdate = true;
      }
    });

    const action = actions["Animation"];
    if (action) {
      action.play();
      action.paused = true;
      action.time = 0;
    }
  }, [actions, scene]);

  useFrame(() => {
    const action = actions["Animation"];
    if (!action || !mixer || !groupRef.current) return;

    const halfDuration = action.getClip().duration / 2;
    action.time = scrollRef.current * halfDuration;
    mixer.update(0);
  });

  return (
    <group
      ref={groupRef}
      scale={BG_SCALE}
      position={[0, 0, 0]}
      rotation={[0, ROTATION_Y, ROTATION_Z]}
    >
      <primitive object={scene} />
    </group>
  );
}

export default function ScissorsBackground() {
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />
        <pointLight position={[-4, -2, 3]} intensity={0.5} color="#2B7B8B" />
        <React.Suspense fallback={null}>
          <ScissorsScene scrollRef={scrollRef} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/scissors.glb");
