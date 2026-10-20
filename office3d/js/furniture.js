import * as THREE from 'three';
import { buildDesk, buildChair, buildTable, buildSofa, buildShelf, buildPlant, buildBoard, buildScreen, merge, makeMaterials } from './furniture-builders-a.js';
import { buildKitchen, buildGym, buildTech, buildDecor, buildStudio, buildReception, buildMail } from './furniture-builders-b.js';

const BUILDERS = {
  desk: buildDesk, chair: buildChair, table: buildTable, sofa: buildSofa,
  shelf: buildShelf, plant: buildPlant, board: buildBoard, screen: buildScreen,
  kitchen: buildKitchen, gym: buildGym, tech: buildTech, decor: buildDecor,
  studio: buildStudio, reception: buildReception, mail: buildMail
};

export function buildFurniture(scene, data, paletteMap) {
  const placements = data?.map?.furniture || [];
  const typeMap = data?.builders?.type_to_builder || {};
  const group = new THREE.Group();
  group.name = 'furniture';
  const pickMeshes = [];

  placements.forEach((p, idx) => {
    if (p.wall === true) return;
    const builderKey = typeMap[p.name];
    if (!builderKey || !BUILDERS[builderKey]) return;

    const fw = Math.max(0.5, (p.w || 16) / 16);
    const fd = Math.max(0.5, (p.h || 16) / 16);
    const cx = (p.x + (p.w || 16) / 2) / 16;
    const cz = (p.y + (p.h || 16) / 2) / 16;

    const pal = (paletteMap && paletteMap[p.room]) || {};
    const c = { main: 0x9a8265, accent: pal.accent ?? 0x4a90d9, dark: 0x2e3440 };

    const geometry = BUILDERS[builderKey](fw, fd, c);
    if (!geometry) return;

    const mesh = new THREE.Mesh(geometry, makeMaterials(c.accent));
    mesh.position.set(cx, 0, cz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.pick = { type: 'furniture', id: p.name + '_' + idx, name: p.name, room: p.room, builder: builderKey };
    group.add(mesh);
    pickMeshes.push(mesh);
  });

  group.userData.pickMeshes = pickMeshes;
  scene.add(group);
  return { group, pickMeshes };
}