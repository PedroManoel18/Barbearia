import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import type { CSSProperties, RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useScroll } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Scissors } from "lucide-react";

// Constantes de Animação
const WAIT_BEFORE_CUT = 0.2; // Breve pausa inicial para carregamento
const CUT_DURATION = 2.8; // Travessia suave e cinematográfica
const START_X = -8.5; // Início fora da tela à esquerda
const END_X = 8.5; // Fim fora da tela à direita
const CUTS_COUNT = 2.2; // Quantidade harmônica de cortes na travessia

// Configurações do modo background
const BG_POS_X = 1.2;
const BG_ROT_Y = 0.35;
const BG_ROT_Z = -Math.PI / 2;

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface ScissorsModelSceneProps {
  phase: "intro" | "transition" | "background";
  onCutProgress: (cutX: number) => void;
  onCutComplete: () => void;
  scrollRef: RefObject<number>;
  materialsRef: React.MutableRefObject<THREE.MeshStandardMaterial[]>;
}

function ScissorsModelScene({
  phase,
  onCutProgress,
  onCutComplete,
  scrollRef,
  materialsRef,
}: ScissorsModelSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/scissors.glb");
  const { actions, mixer } = useAnimations(animations, groupRef);

  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const cutCompletedRef = useRef(false);
  const transitionStartRef = useRef<number | null>(null);

  // Inicialização de materiais cromados espelhados de alto brilho
  useEffect(() => {
    // 1. Lâminas: Aço Cirúrgico Cromado Espelhado
    const steelBlade = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 3.5,
      transparent: true,
      opacity: 1,
    });

    // 2. Cabos: Aço Nobre Polido e Escovado Chamativo
    const steelHandle = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf1f5f9),
      metalness: 0.95,
      roughness: 0.16,
      envMapIntensity: 2.8,
      transparent: true,
      opacity: 1,
    });

    // 3. Parafuso Central Pivot: Ouro 24k Polido de Destaque
    const goldScrew = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFD700"),
      metalness: 0.98,
      roughness: 0.1,
      envMapIntensity: 3.8,
      emissive: new THREE.Color("#3A2A00"),
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 1,
    });

    // 4. Anéis de Dedo: Titânio Anodizado Verde Neon (#00F59B)
    const neonRings = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#00F59B"),
      metalness: 0.88,
      roughness: 0.16,
      envMapIntensity: 2.5,
      transparent: true,
      opacity: 1,
    });

    // 5. Amortecedor: Borracha Acetinada
    const rubberDamper = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1e293b),
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 1,
    });

    materialsRef.current = [steelBlade, steelHandle, goldScrew, neonRings, rubberDamper];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const parentName = child.parent?.name || "";
        const meshName = child.name;

        if (parentName.includes("Screw") || meshName.includes("Screw") || meshName === "Object_16") {
          child.material = goldScrew;
        } else if (
          parentName.includes("Padding") ||
          meshName.includes("Padding") ||
          meshName === "Object_8" ||
          meshName === "Object_14"
        ) {
          child.material = neonRings;
        } else if (parentName.includes("damper") || meshName.includes("damper") || meshName === "Object_12") {
          child.material = rubberDamper;
        } else if (parentName.includes("Handle") || meshName.includes("Handle") || meshName === "Object_6") {
          child.material = steelHandle;
        } else {
          child.material = steelBlade;
        }
      }
    });

    const act = actions["Animation"];
    if (act) {
      act.reset().play();
      actionRef.current = act;
    }
  }, [actions, scene, materialsRef]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const act = actionRef.current;
    const elapsedTime = state.clock.getElapsedTime();

    // ── FASE 1: CORTE CINEMATOGRÁFICO DA TELA ──────────────────────────────
    if (phase === "intro") {
      group.scale.setScalar(1.4);
      group.rotation.set(1.5, 0.0, -Math.PI / 2 - 0.2);

      if (elapsedTime >= WAIT_BEFORE_CUT) {
        const t = (elapsedTime - WAIT_BEFORE_CUT) / CUT_DURATION;
        const progress = Math.min(Math.max(t, 0), 1);
        const smoothProgress = 0.5 * (1 - Math.cos(progress * Math.PI));

        // Posição X da tesoura deslizando da esquerda para a direita
        group.position.x = START_X + (END_X - START_X) * smoothProgress;
        group.position.y = 0;
        group.position.z = 0;
        group.updateMatrixWorld(true);

        // Projeção da ponta da lâmina na tela para sincronizar o clip-path
        const bladeTip = new THREE.Vector3(0, 0.65, 0);
        bladeTip.applyMatrix4(group.matrixWorld);
        bladeTip.project(state.camera);

        const screenX = ((bladeTip.x + 1) / 2) * 100;
        onCutProgress(Math.max(0, Math.min(100, screenX)));

        // Animação harmônica contínua de fechar e abrir as lâminas
        if (act && mixer) {
          const halfDuration = act.getClip().duration / 2;
          const cycle = 0.5 * (1 - Math.cos(progress * Math.PI * 2 * CUTS_COUNT));
          mixer.setTime(cycle * halfDuration * 0.85);
        }

        // Conclusão do corte quando a ponta atinge a margem direita
        if (screenX >= 97 && !cutCompletedRef.current) {
          cutCompletedRef.current = true;
          onCutComplete();
        }
      }
    }

    // ── FASE 2: TRANSIÇÃO SUAVE PARA O BACKGROUND ───────────────────────────
    else if (phase === "transition") {
      if (transitionStartRef.current === null) {
        transitionStartRef.current = elapsedTime;
      }

      const transDuration = 1.0;
      const transT = Math.min((elapsedTime - transitionStartRef.current) / transDuration, 1);
      const ease = 0.5 * (1 - Math.cos(transT * Math.PI)); // easeInOut

      // Interpolação de posição, rotação e escala
      group.position.x = THREE.MathUtils.lerp(END_X, BG_POS_X, ease);
      group.position.y = THREE.MathUtils.lerp(0, 0, ease);
      group.rotation.x = THREE.MathUtils.lerp(1.5, 0, ease);
      group.rotation.y = THREE.MathUtils.lerp(0.0, BG_ROT_Y, ease);
      group.rotation.z = THREE.MathUtils.lerp(-Math.PI / 2 - 0.2, BG_ROT_Z, ease);
      group.scale.setScalar(THREE.MathUtils.lerp(1.4, 1.35, ease));

      // Mantém a tesoura visível e reluzente no fundo com brilho metálico
      const targetOpacity = THREE.MathUtils.lerp(1.0, 0.55, ease);
      materialsRef.current.forEach((mat) => {
        mat.opacity = targetOpacity;
      });
    }

    // ── FASE 3: MODO BACKGROUND (RESPONSIVO AO SCROLL) ──────────────────────
    else if (phase === "background") {
      const scroll = scrollRef.current || 0;

      // Resposta ao scroll e flutuação antigravitacional contínua
      group.position.y = Math.sin(elapsedTime * 0.8) * 0.1 - scroll * 1.5;
      group.position.x = BG_POS_X + Math.cos(elapsedTime * 0.6) * 0.1;
      group.position.z = 0;
      group.rotation.y = BG_ROT_Y + scroll * 0.4;
      group.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05;
      group.rotation.z = BG_ROT_Z;
      group.scale.setScalar(1.35);

      if (act && mixer) {
        const halfDuration = act.getClip().duration / 2;
        mixer.setTime(scroll * halfDuration);
      }
    }
  });

  return (
    <group ref={groupRef} position={[START_X, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function StudioEnvironment() {
  const { gl } = useThree();
  const envTexture = useMemo(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const texture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();
    roomEnv.dispose();
    return texture;
  }, [gl]);

  return <primitive object={envTexture} attach="environment" />;
}

export function ScissorsExperience() {
  const [phase, setPhase] = useState<"intro" | "transition" | "background">("intro");
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(true);

  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  const [supported] = useState(() => isWebGLAvailable());
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  // Atualização matemática do corte na cortina em tempo real
  const handleCutProgress = (cutXPercent: number) => {
    if (!topCurtainRef.current || !bottomCurtainRef.current) return;
    const p = cutXPercent / 100;

    const topY0 = 50 - p * 49;
    const bottomY0 = 50 + p * 49;
    const midX = cutXPercent * 0.48;
    const topYMid = 50 - Math.pow(p, 1.25) * 33;
    const bottomYMid = 50 + Math.pow(p, 1.25) * 33;

    const topPoly = `polygon(0% 0%, 100% 0%, 100% 50%, ${cutXPercent.toFixed(2)}% 50%, ${midX.toFixed(2)}% ${topYMid.toFixed(2)}%, 0% ${topY0.toFixed(2)}%)`;
    const botPoly = `polygon(0% ${bottomY0.toFixed(2)}%, ${midX.toFixed(2)}% ${bottomYMid.toFixed(2)}%, ${cutXPercent.toFixed(2)}% 50%, 100% 50%, 100% 100%, 0% 100%)`;

    topCurtainRef.current.style.clipPath = topPoly;
    bottomCurtainRef.current.style.clipPath = botPoly;
  };

  // Conclusão do corte: abre a cortina e inicia a transição suave
  const handleCutComplete = () => {
    handleCutProgress(100);
    setCurtainsOpen(true);
    setShowSkipButton(false);
    setPhase("transition");

    setTimeout(() => {
      setPhase("background");
    }, 1100);
  };

  // Pular abertura manualmente caso o usuário clique
  const handleSkip = () => {
    handleCutProgress(100);
    setCurtainsOpen(true);
    setShowSkipButton(false);
    setPhase("background");

    materialsRef.current.forEach((mat) => {
      mat.opacity = 0.55;
    });
  };

  if (!supported) {
    return null;
  }

  const curtainBaseStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0F172A", // Tom escuro Streetwear elegante
    zIndex: phase === "background" ? -1 : 40,
    pointerEvents: curtainsOpen ? "none" : "auto",
    transition: "transform 850ms cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "clip-path, transform",
  };

  return (
    <>
      {/* ── CORTINAS QUE SE SEPARAM AO CORTE DA LÂMINA ──────────────────────── */}
      {/* Metade Superior */}
      <div
        ref={topCurtainRef}
        style={{
          ...curtainBaseStyle,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
          transform: curtainsOpen ? "translateY(-100%)" : "translateY(0%)",
        }}
      >
        {/* Insígnia central elegante */}
        {!curtainsOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-24 text-center select-none pointer-events-none">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">
              <Scissors className="size-4 animate-pulse" />
              <span>BarberShop Garage</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vintage Hype
            </h2>
            <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
              O Novo Clássico · Desde 2016
            </p>
          </div>
        )}
      </div>

      {/* Metade Inferior */}
      <div
        ref={bottomCurtainRef}
        style={{
          ...curtainBaseStyle,
          clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)",
          transform: curtainsOpen ? "translateY(100%)" : "translateY(0%)",
        }}
      />

      {/* Botão de Pular Abertura (sempre acessível para o usuário) */}
      {showSkipButton && !curtainsOpen && (
        <button
          onClick={handleSkip}
          className="fixed top-6 right-6 z-50 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white"
        >
          Pular abertura ✕
        </button>
      )}

      {/* ── CANVAS 3D ÚNICO DO REACT THREE FIBER ────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: phase === "background" ? 1 : 45,
          pointerEvents: "none",
        }}
      >
        <Canvas
          dpr={isMobile ? 1 : [1, 1.5]}
          camera={{ position: [0, 0, 7.5], fov: 42 }}
          gl={{ powerPreference: "high-performance", antialias: !isMobile }}
        >
          {/* Iluminação de Estúdio Potente para Realce Metálico e Cromado */}
          <ambientLight intensity={1.2} />
          {/* Luz principal intensa criando reflexos nítidos no gume das lâminas */}
          <directionalLight position={[6, 12, 6]} intensity={3.5} color="#FFFFFF" />
          {/* Luz de preenchimento prata/azul para realçar o chanfro das peças */}
          <directionalLight position={[-6, -4, 4]} intensity={2.0} color="#E0F2FE" />
          {/* Luz superior para destacar as lâminas afiadas */}
          <directionalLight position={[0, 8, 2]} intensity={2.5} color="#FFFFFF" />
          {/* Rim light neon esmeralda */}
          <pointLight position={[-3, -2, 5]} intensity={3.0} color="#00F59B" />
          {/* Rim light azul ciano elétrico de contorno */}
          <pointLight position={[4, 3, 5]} intensity={2.5} color="#38BDF8" />
          {/* Ambiente de Estúdio HDR para Reflexos Espelhados no Metal */}
          <StudioEnvironment />

          <Suspense fallback={null}>
            <ScissorsModelScene
              phase={phase}
              onCutProgress={handleCutProgress}
              onCutComplete={handleCutComplete}
              scrollRef={scrollRef}
              materialsRef={materialsRef}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

useGLTF.preload("/scissors.glb");
