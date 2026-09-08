import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import IntroOverlay from "./IntroOverlay";
import HeroContent from "./HeroContent";
import ScissorsModel from "./ScissorsModel";
import { INTRO_FLY_IN_DUR, INTRO_CUT_DUR, OVERLAY_SLIDE_DUR, PHASE2_DUR } from "./useScissorsAnim";

interface ScissorsHeroProps {
  barbershopName?: string;
}

export default function ScissorsHero({ barbershopName = "BarberShop Garage" }: ScissorsHeroProps) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [showContent, setShowContent] = useState(false);

  const handleOverlayComplete = () => {
    setPhase(2);
    // After overlay finishes, the model starts Phase 2 background transition.
    // The content fades in with a 0.3s delay.
    setTimeout(() => {
      setShowContent(true);
    }, 300);

    // After Phase 2 duration, switch to phase 3 (scroll driven)
    setTimeout(() => {
      setPhase(3);
    }, PHASE2_DUR * 1000);
  };

  return (
    <div className="relative min-h-[150vh] bg-[var(--color-bg,#1A1A1A)]" style={{ '--color-bg': '#1A1A1A', '--color-gold': '#C8A96E', '--color-text': '#F5F0E8' } as any}>
      {phase === 1 && <IntroOverlay onComplete={handleOverlayComplete} />}

      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: phase === 1 ? 40 : 0,
        pointerEvents: phase === 1 ? "auto" : "none"
      }}>
        <Suspense fallback={null}>
          <Canvas dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <pointLight position={[-4, -2, 3]} intensity={0.6} color="#C8A96E" />
            <ScissorsModel phase={phase} />
          </Canvas>
        </Suspense>
      </div>

      <HeroContent show={showContent} barbershopName={barbershopName} />
      
      {/* Spacer to allow scrolling and testing phase 3 */}
      <div className="h-screen w-full flex items-center justify-center border-t border-[var(--color-gold)]">
        <p className="text-[var(--color-text)] opacity-50">Conteúdo do Site Continua Aqui...</p>
      </div>
    </div>
  );
}
