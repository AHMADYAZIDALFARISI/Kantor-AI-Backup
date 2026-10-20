import * as THREE from 'three';
import { loadData } from './data.js';
import { buildWorld, fitCameraToRoom } from './world3d.js';
import { buildFurniture } from './furniture.js';
import { buildCharacters, updateFigure } from './characters.js';
import { createStore, createSimulation } from './simulation.js';
import { createInteraction } from './interaction.js';
import { createDrawer } from './ui-drawer.js';
import { createDashboard } from './ui-dash.js';
import { createSkillsBrowser } from './ui-skills.js';

const hex = h => typeof h === 'string' ? parseInt(h.replace('#', ''), 16) : (h ?? 0x888888);

async function boot() {
  try {
    const data = await loadData();
    let palRaw = {};
    try { palRaw = await (await fetch('data/room-palette.json')).json(); } catch (e) {}
    const paletteMap = {};
    for (const r of (data.map.rooms || [])) {
      const p = palRaw[r.id] || {};
      paletteMap[r.id] = { floor: hex(p.floor), wall: hex(p.wall), accent: hex(p.accent) };
    }

    const container = document.getElementById('app');
    const world = buildWorld(data, paletteMap, container);
    const furn = buildFurniture(world.scene, data, paletteMap);
    const figs = buildCharacters(world.scene, data);
    const store = createStore(data);
    const sim = createSimulation(data, figs, store);
    const interaction = createInteraction({
      renderer: world.renderer,
      camera: world.camera,
      controls: world.controls,
      scene: world.scene,
      figs,
      furniturePickMeshes: furn.pickMeshes || [],
      rooms: world.rooms,
      store
    });
    createDrawer({ store, data, onClose: () => interaction.deselect() });
    createDashboard({
      store,
      data,
      figs,
      rooms: world.rooms,
      camera: world.camera,
      controls: world.controls,
      fitCameraToRoom,
      interaction,
      furniturePickMeshes: furn.pickMeshes || []
    });
    createSkillsBrowser({ data });

    const clock = new THREE.Clock();
    (function tick() {
      requestAnimationFrame(tick);
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;
      try { sim.update(dt, t); } catch (e) {}
      for (const f of figs) {
        try { updateFigure(f, dt, t); } catch (e) {}
      }
      try { interaction.update(dt, t); } catch (e) {}
    })();

    document.getElementById('loading').style.display = 'none';
    window.__office = { figs, interaction, store, world, data, sim };
  } catch (err) {
    document.getElementById('loading').textContent = 'Gagal memuat: ' + err.message;
    console.error(err);
  }
}

boot();
