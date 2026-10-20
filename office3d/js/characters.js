import * as THREE from 'three';

function mat(color) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.7, flatShading: true });
}

function mesh(geo, material, y = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.y = y;
  m.castShadow = true;
  return m;
}

export function createFigure(palette) {
  palette = palette || [];
  const skin = palette[0] || '#e8b98a';
  const shirt = palette[1] || '#4a90d9';
  const pants = palette[2] || '#334155';
  const hair = palette[3] || '#2d2a26';
  const mSkin = mat(skin), mShirt = mat(shirt), mPants = mat(pants), mHair = mat(hair);

  const group = new THREE.Group();

  const legGeo = new THREE.BoxGeometry(0.13, 0.42, 0.15);
  const legL = new THREE.Group();
  legL.position.set(-0.09, 0.42, 0);
  legL.add(mesh(legGeo, mPants, -0.21));
  const legR = new THREE.Group();
  legR.position.set(0.09, 0.42, 0);
  legR.add(mesh(legGeo, mPants, -0.21));

  const bodyG = new THREE.Group();
  bodyG.position.set(0, 0.42, 0);
  bodyG.add(mesh(new THREE.CapsuleGeometry(0.17, 0.32, 4, 8), mShirt, 0.28));

  const armGeo = new THREE.BoxGeometry(0.1, 0.38, 0.12);
  const handGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const makeArm = (x) => {
    const a = new THREE.Group();
    a.position.set(x, 0.95, 0);
    a.add(mesh(armGeo, mShirt, -0.19));
    a.add(mesh(handGeo, mSkin, -0.4));
    return a;
  };
  const armL = makeArm(-0.26);
  const armR = makeArm(0.26);

  const headG = new THREE.Group();
  headG.position.set(0, 1.02, 0);
  headG.add(mesh(new THREE.SphereGeometry(0.155, 12, 10), mSkin));
  const h = mesh(new THREE.SphereGeometry(0.16, 12, 8, 0, Math.PI * 2, 0, 1.25), mHair, 0.03);
  h.scale.set(1, 0.85, 1);
  headG.add(h);

  group.add(legL, legR, bodyG, armL, armR, headG);

  return { group, legL, legR, armL, armR, headG, bodyG, anim: 'idle', phase: Math.random() * 6 };
}

function idle(f, time, speed) {
  const s = Math.sin(time * speed + f.phase);
  f.bodyG.position.y = 0.42 + s * 0.015;
  f.armL.rotation.x = s * 0.05;
  f.armR.rotation.x = s * 0.05;
  f.legL.rotation.x = 0;
  f.legR.rotation.x = 0;
}

export function updateFigure(f, dt, time) {
  f.headG.rotation.x = 0;
  f.bodyG.rotation.x = 0;
  switch (f.anim) {
    case 'walk': {
      const swing = Math.sin(time * 9 + f.phase);
      f.legL.rotation.x = swing * 0.6;
      f.legR.rotation.x = -swing * 0.6;
      f.armL.rotation.x = -swing * 0.45;
      f.armR.rotation.x = swing * 0.45;
      f.bodyG.position.y = 0.42 + Math.abs(Math.cos(time * 9 + f.phase)) * 0.03;
      f.headG.rotation.y = Math.sin(time * 1.5 + f.phase) * 0.1;
      break;
    }
    case 'work': {
      idle(f, time, 2);
      const r = -0.9 + Math.sin(time * 7 + f.phase) * 0.12;
      f.armL.rotation.x = r;
      f.armR.rotation.x = r;
      f.headG.rotation.x = 0.15;
      f.headG.rotation.y = 0;
      break;
    }
    case 'talk':
      idle(f, time, 2);
      f.headG.rotation.y = Math.sin(time * 3 + f.phase) * 0.4;
      f.armR.rotation.x = -0.5 + Math.sin(time * 5) * 0.3;
      break;
    case 'rest':
      idle(f, time, 1);
      f.headG.rotation.y = 0;
      break;
    case 'idle':
    default:
      idle(f, time, 2);
      f.headG.rotation.y = 0;
      break;
  }
}

export function buildCharacters(scene, data) {
  const figs = [];
  const agents = (data && data.map && data.map.agents) || [];
  for (const s of (data && data.staff) || []) {
    const spawn = agents.find(a => a.id === s.id) || { spawn: [512, 368] };
    const fig = createFigure(s.palette || []);
    const sp = spawn.spawn || [512, 368];
    fig.group.position.set(sp[0] / 16, 0, sp[1] / 16);
    fig.id = s.id;
    fig.group.userData.pick = { type: 'character', id: s.id, name: s.name, title: s.title, room: s.room };
    fig.group.traverse(o => { o.userData.pickRoot = fig.group; });
    scene.add(fig.group);
    figs.push(fig);
  }
  return figs;
}