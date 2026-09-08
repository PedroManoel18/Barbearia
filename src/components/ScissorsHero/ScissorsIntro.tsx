import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Constantes de timing e movimento
const WAIT_BEFORE_CUT = 0.15;  // pausa inicial rápida
const CUT_DURATION    = 2.9;   // tempo suave e calmo de travessia
const START_X         = -8.5;  // fora da tela à esquerda
const END_X           = 8.5;   // fora da tela à direita
const CUTS_COUNT      = 2;     // reduzido para 2 cortes (muito mais pausado e suave ao abrir/fechar)
const OVERLAY_DUR_MS  = 850;   // duração da abertura final das cortinas

interface Props {
  onComplete: () => void;
}

export default function ScissorsIntro({ onComplete }: Props) {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const topCurtainRef    = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);

  const [cutDone, setCutDone]           = useState(false);
  const [canvasHidden, setCanvasHidden] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Setup Three.js ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // ── Reflexos de Estúdio Realistas para Metais ─────────────────────────
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const studioEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = studioEnv;

    // ── Luzes de Estúdio + Rim Light com tom Teal da marca ─────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    // Luz principal branca (brilho metálico no gume das lâminas)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    // Luz de contorno no tom Teal da logo (#2B7B8B)
    const tealRimLight = new THREE.PointLight(0x2B7B8B, 1.8, 18);
    tealRimLight.position.set(-2, -3, 4);
    scene.add(tealRimLight);

    // Luz de preenchimento suave
    const fillLight = new THREE.DirectionalLight(0x99bbcc, 0.5);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // ── Estado da animação ─────────────────────────────────────────────────
    let mixer: THREE.AnimationMixer | null = null;
    let action: THREE.AnimationAction | null = null;
    let modelRef: THREE.Group | null = null;
    let halfDuration = 1;
    let animId: number;
    let phase: 'loading' | 'waiting' | 'cutting' | 'done' = 'loading';
    let cutFired = false;
    const clock = new THREE.Clock(false);

    // Função de atualização da fenda da cortina acompanhando a lâmina
    function updateCurtain(cutXPercent: number) {
      if (!topCurtainRef.current || !bottomCurtainRef.current) return;
      const p = cutXPercent / 100;

      // Abertura progressiva na borda esquerda
      const topY0 = 50 - p * 49;
      const bottomY0 = 50 + p * 49;

      // Ponto intermediário suave da curva
      const midX = cutXPercent * 0.48;
      const topYMid = 50 - Math.pow(p, 1.25) * 33;
      const bottomYMid = 50 + Math.pow(p, 1.25) * 33;

      const topPoly = `polygon(0% 0%, 100% 0%, 100% 50%, ${cutXPercent.toFixed(2)}% 50%, ${midX.toFixed(2)}% ${topYMid.toFixed(2)}%, 0% ${topY0.toFixed(2)}%)`;
      const botPoly = `polygon(0% ${bottomY0.toFixed(2)}%, ${midX.toFixed(2)}% ${bottomYMid.toFixed(2)}%, ${cutXPercent.toFixed(2)}% 50%, 100% 50%, 100% 100%, 0% 100%)`;

      topCurtainRef.current.style.clipPath = topPoly;
      bottomCurtainRef.current.style.clipPath = botPoly;
    }

    // Inicializa cortina 100% fechada
    updateCurtain(0);

    // ── Carrega o modelo ───────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load('/scissors.glb', (gltf) => {
      const model = gltf.scene;
      modelRef = model;

      // Escala diminuída para 1.4 (mais elegante e delicada)
      model.scale.setScalar(1.4);
      // Inclinada levemente de lado em 3D (X: 0.5 para mostrar o perfil e relevo, Z para a linha de corte)
      model.rotation.set(1.5, 0.00, -Math.PI / 2 - 0.2);
      model.position.x = START_X;

      // ── Materiais Customizados: Identidade BarberShop Garage (Aço + Teal) ──
      // 1. Lâminas: Aço Cirúrgico Espelhado de Alto Brilho
      const steelBladeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xF5F7FA),
        metalness: 0.96,
        roughness: 0.12,
        envMapIntensity: 1.6,
      });

      // 2. Cabos: Aço Nobre Escovado
      const steelHandleMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xD8DFE7),
        metalness: 0.92,
        roughness: 0.22,
        envMapIntensity: 1.3,
      });

      // 3. Parafuso Central Pivot: Teal / Ciano Anodizado da Logo (#2B7B8B)
      const tealScrewMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2B7B8B'),
        metalness: 0.88,
        roughness: 0.16,
        envMapIntensity: 1.8,
      });

      // 4. Anéis de Dedo: Acabamento Premium Teal da Logo
      const tealRingMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2B7B8B'),
        metalness: 0.75,
        roughness: 0.25,
        envMapIntensity: 1.4,
      });

      // 5. Amortecedor: Borracha Preta Acetinada
      const rubberDamperMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x111111),
        metalness: 0.05,
        roughness: 0.85,
      });

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const parentName = child.parent?.name || '';
          const meshName = child.name;

          if (parentName.includes('Screw') || meshName.includes('Screw') || meshName === 'Object_16') {
            child.material = tealScrewMaterial;
          } else if (parentName.includes('Padding') || meshName.includes('Padding') || meshName === 'Object_8' || meshName === 'Object_14') {
            child.material = tealRingMaterial;
          } else if (parentName.includes('damper') || meshName.includes('damper') || meshName === 'Object_12') {
            child.material = rubberDamperMaterial;
          } else if (parentName.includes('Handle') || meshName.includes('Handle') || meshName === 'Object_6') {
            child.material = steelHandleMaterial;
          } else {
            // Lâminas (Object_4, Object_10)
            child.material = steelBladeMaterial;
          }
        }
      });

      scene.add(model);

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        action = mixer.clipAction(gltf.animations[0]);
        halfDuration = action.getClip().duration / 2;
        action.play();
        action.paused = true;
        action.time   = 0;
      }

      phase = 'waiting';
      clock.start();
    });

    // ── Loop de animação ───────────────────────────────────────────────────
    function animate() {
      animId = requestAnimationFrame(animate);

      if (phase !== 'done') {
        const elapsed = clock.getElapsedTime();

        if (phase === 'waiting') {
          if (elapsed >= WAIT_BEFORE_CUT) phase = 'cutting';
        }

        if (phase === 'cutting') {
          const t = (elapsed - WAIT_BEFORE_CUT) / CUT_DURATION;
          const progress = Math.min(Math.max(t, 0), 1);

          // Interpolação suave (ease-in-out suave para travessia cinematográfica)
          const smoothProgress = 0.5 * (1 - Math.cos(progress * Math.PI));

          // 1. Mover suavemente da esquerda pra direita
          if (modelRef) {
            modelRef.position.x = START_X + (END_X - START_X) * smoothProgress;
            modelRef.updateMatrixWorld(true);

            // Projeta a posição da lâmina para porcentagem da tela (0 a 100%)
            const bladeTip = new THREE.Vector3(0, 0.65, 0);
            bladeTip.applyMatrix4(modelRef.matrixWorld);
            bladeTip.project(camera);

            const screenX = ((bladeTip.x + 1) / 2) * 100;
            const clampedCutX = Math.max(0, Math.min(100, screenX));

            // Cortina acompanha o corte em tempo real
            updateCurtain(clampedCutX);

            // Dispara a abertura final assim que a lâmina alcança a borda direita (sem pausa ou travamento)
            if (screenX >= 98 && !cutFired) {
              cutFired = true;
              updateCurtain(100);
              setCutDone(true);
              setCanvasHidden(true);
            }
          }

          // 2. Animação harmônica contínua e desacelerada de abrir e fechar
          if (action && mixer) {
            const cycle = 0.5 * (1 - Math.cos(progress * Math.PI * 2 * CUTS_COUNT));
            action.time = cycle * halfDuration * 0.85;
            mixer.update(0);
          }

          // 3. Fim completo do trajeto
          if (progress >= 1) {
            phase = 'done';
          }
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────
  const curtainBaseStyle: React.CSSProperties = {
    position:   'fixed',
    top:         0,
    left:        0,
    width:      '100vw',
    height:     '100vh',
    background: '#1A1A1A',
    zIndex:      101,
    pointerEvents: cutDone ? 'none' : 'auto',
    transition: `transform ${OVERLAY_DUR_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'clip-path, transform',
    filter:     'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.45))',
  };

  return (
    <>
      {/* Metade superior da cortina que se divide e sobe */}
      <div
        ref={topCurtainRef}
        style={{
          ...curtainBaseStyle,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
          transform: cutDone ? 'translateY(-100%)' : 'translateY(0%)',
        }}
      />

      {/* Metade inferior da cortina que se divide e desce */}
      <div
        ref={bottomCurtainRef}
        style={{
          ...curtainBaseStyle,
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
          transform: cutDone ? 'translateY(100%)' : 'translateY(0%)',
        }}
        onTransitionEnd={() => { if (cutDone) onComplete(); }}
      />

      {/* Canvas Three.js da tesoura (acima da cortina) */}
      <canvas
        ref={canvasRef}
        style={{
          position:   'fixed',
          inset:       0,
          zIndex:      102,
          pointerEvents: 'none',
          transition:  canvasHidden ? `opacity ${OVERLAY_DUR_MS}ms ease-in-out` : 'none',
          opacity:     canvasHidden ? 0 : 1,
        }}
      />
    </>
  );
}
