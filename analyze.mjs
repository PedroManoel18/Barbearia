import { NodeIO } from '@gltf-transform/core';

async function analyze() {
  const io = new NodeIO();
  const document = await io.read('./public/scissors.glb');
  const root = document.getRoot();

  console.log("=== ANÁLISE DETALHADA: BARBERS_SCISSORS.GLB ===");

  // Animação embutida - detalhar canais
  const animations = root.listAnimations();
  console.log(`\nAnimações embutidas: ${animations.length}`);
  animations.forEach((anim, i) => {
    console.log(` [${i}] Nome: "${anim.getName() || 'Sem nome'}"`);
    const channels = anim.listChannels();
    console.log(` Canais (${channels.length}):`);
    channels.forEach((ch) => {
      const target = ch.getTargetNode();
      const path = ch.getTargetPath();
      console.log(`   - Nó: "${target?.getName()}" | Propriedade animada: ${path}`);
    });
  });

  // Estrutura hierárquica com pivot/rotação
  console.log("\nHierarquia de Nós com Transformações:");
  const nodes = root.listNodes();
  nodes.forEach(node => {
    const name = node.getName() || 'Unnamed';
    const hasMesh = node.getMesh() ? 'SIM' : 'não';
    const t = node.getTranslation();
    const r = node.getRotation(); // quaternion [x,y,z,w]
    const s = node.getScale();
    const children = node.listChildren().map(c => c.getName()).join(', ');
    console.log(` Nó: "${name}"`);
    console.log(`   Mesh: ${hasMesh}`);
    console.log(`   Posição (xyz): [${t.map(v => v.toFixed(3)).join(', ')}]`);
    console.log(`   Rotação (quaternion xyzw): [${r.map(v => v.toFixed(3)).join(', ')}]`);
    console.log(`   Escala (xyz): [${s.map(v => v.toFixed(3)).join(', ')}]`);
    if (children) console.log(`   Filhos: ${children}`);
  });
}

analyze().catch(console.error);
