// Kompres GLB di public/assets: dedup + weld + quantize + meshopt (EXT_meshopt_compression).
// Pemakaian: node tools/optimize-assets.mjs office3d/public/assets
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, quantize, meshopt, prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || 'office3d/public/assets';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
let before = 0, after = 0;
for (const dir of ['characters', 'furniture']) {
  for (const f of fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.glb'))) {
    const p = path.join(root, dir, f);
    const b0 = fs.statSync(p).size;
    const doc = await io.read(p);
    if (doc.getRoot().listExtensionsUsed().some(e => e.extensionName === 'EXT_meshopt_compression')) { before += b0; after += b0; continue; }
    // karakter: jangan quantize atribut skin terlalu agresif
    await doc.transform(dedup(), prune(), weld(), quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeColor: 8, quantizeWeight: 8 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
    await io.write(p, doc);
    const b1 = fs.statSync(p).size;
    before += b0; after += b1;
  }
}
console.log(`GLB: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
