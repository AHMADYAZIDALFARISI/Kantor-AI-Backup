import * as THREE from 'three';

export function createInteraction(opts) {
  const { renderer, camera, scene, figs, furniturePickMeshes, store } = opts;
  const dom = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const downPos = { x: 0, y: 0 };
  let hoverPending = false;
  let lastMove = null;
  let hovered = null;

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 0.75, 40),
    new THREE.MeshBasicMaterial({ color: 0x4a90d9, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.visible = false;
  scene.add(ring);

  const targets = () => [...figs.map(f => f.group), ...furniturePickMeshes];

  function setPointer(e) {
    const r = dom.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }

  function findPick(obj) {
    let o = obj.userData.pickRoot || obj;
    while (o) {
      if (o.userData && o.userData.pick) return o;
      o = o.parent;
    }
    return null;
  }

  function raycast() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(targets(), true);
    for (const h of hits) {
      const root = findPick(h.object);
      if (root) return { root, point: h.point };
    }
    return null;
  }

  function forMats(root, fn) {
    root.traverse(o => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => m && m.emissive && fn(m));
    });
  }

  function highlight(root) {
    forMats(root, m => {
      if (m.userData._e === undefined) m.userData._e = m.emissive.getHex();
      m.emissive.setHex(0x2a2a2a);
    });
  }

  function unhighlight(root) {
    forMats(root, m => {
      if (m.userData._e !== undefined) m.emissive.setHex(m.userData._e);
    });
  }

  function setHovered(root) {
    if (root === hovered) return;
    if (hovered) unhighlight(hovered);
    hovered = root;
    if (hovered) highlight(hovered);
    dom.style.cursor = hovered ? 'pointer' : '';
  }

  function select(pick, point) {
    const p = new THREE.Vector3();
    const root = [...figs.map(f => f.group), ...furniturePickMeshes].find(o => o.userData.pick === pick);
    if (root) root.getWorldPosition(p);
    else if (point) p.copy(point);
    ring.position.set(p.x, 0.02, p.z);
    ring.visible = true;
    store.state.selected = pick;
    store.emit();
    if (opts.onSelect) opts.onSelect(pick);
  }

  function deselect() {
    ring.visible = false;
    store.state.selected = null;
    store.emit();
    opts.onSelect && opts.onSelect(null);
  }

  function getSelected() { return store.state.selected; }

  function handleClick(e) {
    setPointer(e);
    const hit = raycast();
    if (hit) select(hit.root.userData.pick, hit.point);
    else deselect();
  }

  dom.addEventListener('pointerdown', e => {
    downPos.x = e.clientX;
    downPos.y = e.clientY;
  });
  dom.addEventListener('pointerup', e => {
    const dx = e.clientX - downPos.x, dy = e.clientY - downPos.y;
    if (Math.hypot(dx, dy) < 6) handleClick(e);
  });
  dom.addEventListener('pointermove', e => {
    lastMove = e;
    hoverPending = true;
  });
  dom.addEventListener('pointerleave', () => {
    lastMove = null;
    setHovered(null);
  });

  function update(dt, time) {
    if (hoverPending && lastMove) {
      hoverPending = false;
      setPointer(lastMove);
      const hit = raycast();
      setHovered(hit ? hit.root : null);
    }
    if (ring.visible) {
      const s = 1 + Math.sin(time * 4) * 0.08;
      ring.scale.set(s, 1, s);
    }
  }

  return { update, select, deselect, getSelected };
}