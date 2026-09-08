import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useScroll, useTransform, animate } from "framer-motion";
import * as THREE from "three";
import { BLADE_MAX_ANGLE, INTRO_FLY_IN_DUR, INTRO_CUT_DUR, PHASE2_DUR } from "./useScissorsAnim";

export default function ScissorsModel({ phase }: { phase: 1 | 2 | 3 }) {
  const { nodes, materials, scene } = useGLTF("/scissors.glb");
  const groupRef = useRef<THREE.Group>(null);
  
  // Try to find the blades by name (BladeA_2, BladeB_5 from analysis, or BladeTop, BladeBottom from prompt)
  const bladeTop = nodes.BladeA_2 || nodes.BladeTop || Object.values(nodes).find(n => n.name.toLowerCase().includes('bladea'));
  const bladeBottom = nodes.BladeB_5 || nodes.BladeBottom || Object.values(nodes).find(n => n.name.toLowerCase().includes('bladeb'));

  const { scrollYProgress } = useScroll();
  const openAmount = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -8]); // Adjust for 3D units, prompt said -80 but in 3D we use smaller units

  // Local state for phase 1 animations to override scroll
  const [introRotation, setIntroRotation] = useState(0);
  const [introPosition, setIntroPosition] = useState(new THREE.Vector3(0, 10, 0));
  const [introScale, setIntroScale] = useState(1);
  const [introOpacity, setIntroOpacity] = useState(1);
  
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; // basic mobile check in 3D units

  useEffect(() => {
    if (phase === 1) {
      // 1. Fly in
      animate(10, 0, {
        duration: INTRO_FLY_IN_DUR,
        type: "spring",
        stiffness: 100,
        damping: 12,
        onUpdate: (v) => setIntroPosition(new THREE.Vector3(0, v, 0))
      });

      // 2. Cut open then shut
      setTimeout(() => {
        animate(0, BLADE_MAX_ANGLE, {
          duration: INTRO_CUT_DUR / 2,
          ease: "easeOut",
          onUpdate: (v) => setIntroRotation(v),
          onComplete: () => {
            animate(BLADE_MAX_ANGLE, 0, {
              duration: INTRO_CUT_DUR / 2,
              ease: "easeIn",
              onUpdate: (v) => setIntroRotation(v)
            });
          }
        });
      }, INTRO_FLY_IN_DUR * 1000);
    } else if (phase === 2) {
      // Phase 2: Transition to background
      const targetScale = isMobile ? 0.6 : 0.45;
      const targetX = isMobile ? 0 : viewport.width * 0.3;
      const targetY = isMobile ? -viewport.height * 0.3 : -viewport.height * 0.2;

      animate(1, targetScale, {
        duration: PHASE2_DUR,
        ease: "easeInOut",
        onUpdate: (v) => setIntroScale(v)
      });

      animate(0, targetX, {
        duration: PHASE2_DUR,
        ease: "easeInOut",
        onUpdate: (v) => setIntroPosition(prev => new THREE.Vector3(v, prev.y, prev.z))
      });

      animate(introPosition.y, targetY, {
        duration: PHASE2_DUR,
        ease: "easeInOut",
        onUpdate: (v) => setIntroPosition(prev => new THREE.Vector3(prev.x, v, prev.z))
      });
      
      // We can implement opacity by traversing materials, but it's expensive.
      // Easiest is to set transparent = true and opacity.
      animate(1, 0.18, {
        duration: PHASE2_DUR,
        ease: "easeInOut",
        onUpdate: (v) => {
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.transparent = true;
              child.material.opacity = v;
              child.material.needsUpdate = true;
            }
          });
        }
      });
    }
  }, [phase, isMobile, viewport.width, viewport.height]);

  useFrame(() => {
    if (groupRef.current) {
      // Position and Scale
      groupRef.current.position.copy(introPosition);
      groupRef.current.scale.setScalar(introScale);

      // Phase 3 parallax override
      if (phase === 3) {
        groupRef.current.position.y = introPosition.y + parallaxY.get();
      }
    }

    if (bladeTop && bladeBottom) {
      if (phase === 1) {
        bladeTop.rotation.z = introRotation;
        bladeBottom.rotation.z = -introRotation;
      } else if (phase === 3 || phase === 2) {
        bladeTop.rotation.z = openAmount.get() * BLADE_MAX_ANGLE;
        bladeBottom.rotation.z = -openAmount.get() * BLADE_MAX_ANGLE;
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/scissors.glb");
