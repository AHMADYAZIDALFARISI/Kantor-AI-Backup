import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {box, cyl, sph, merge} from './furniture-builders-a.js';
export function buildKitchen(w,d,c){
const parts=[];
parts.push([box(w,0.9,d,0,0.45,0),c.main]);
parts.push([box(w+0.1,0.06,d+0.1,0,0.93,0),c.dark]);
for(const x of [-w/3,0,w/3]){
parts.push([box(w/3-0.06,0.6,0.02,x,0.45,d/2+0.005),c.accent]);
}
parts.push([box(Math.min(0.5,w*0.3),0.02,Math.min(0.4,d*0.6),w*0.2,0.965,0),c.dark]);
return merge(parts);
}

export function buildGym(w,d,c){
const parts=[];
parts.push([box(0.7,0.12,1.6,0,0.1,0),c.dark]);
parts.push([box(0.5,0.02,1.3,0,0.17,0),c.accent]);
parts.push([box(0.08,1.1,0.08,-0.28,0.6,-0.7),c.dark]);
parts.push([box(0.08,1.1,0.08,0.28,0.6,-0.7),c.dark]);
parts.push([box(0.5,0.06,0.08,0,1.15,-0.7),c.dark]);
parts.push([box(0.4,0.25,0.06,0,1.05,-0.72),c.main]);
return merge(parts);
}export function buildTech(w,d,c){const p=[[box(0.7,1.6,0.7,0,0.8,0),c.dark]];for(let i=0;i<5;i++)p.push([box(0.5,0.04,0.02,0,0.3+i*0.25,0.36),c.accent,true]);p.push([box(0.2,0.04,0.2,0,1.63,0),c.accent,true]);return merge(p);}
export function buildDecor(w,d,c){return merge([[cyl(0.16,0.2,0.05,0,0.025,0),c.dark],[cyl(0.03,0.03,1.5,0,0.8,0),c.dark],[cyl(0.22,0.3,0.35,0,1.65,0),c.main],[sph(0.08,0,1.55,0),c.accent,true]]);}export function buildStudio(w,d,c){
return merge([
[box(0.06,1.2,0.06,0.25,0.6,0),c.dark],
[box(0.06,1.2,0.06,-0.25,0.6,0),c.dark],
[box(0.06,1.2,0.06,0,0.6,0.25),c.dark],
[box(0.06,1.2,0.06,0,0.6,-0.25),c.dark],
[box(0.4,0.25,0.5,0,1.3,0),c.dark],
[cyl(0.1,0.12,0.2,0,1.3,0.3),c.dark],
[sph(0.04,0.15,1.42,0.2),c.accent,true]
]);
}

export function buildReception(w,d,c){
return merge([
[box(w,1.0,d,0,0.5,0),c.main],
[box(w+0.15,0.07,d+0.15,0,1.03,0),c.dark],
[box(w*0.5,0.3,0.03,0,0.6,d/2+0.02),c.accent,true]
]);
}

export function buildMail(w,d,c){
const parts=[[box(w,1.1,d,0,0.55,0),c.main]];
for(const x of [-w/3,0,w/3]){
for(const y of [0.45,0.8]){
parts.push([box(w/3-0.08,0.22,0.05,x,y,d/2-0.01),c.dark]);
}
}
parts.push([box(w*0.6,0.18,0.05,0,1.25,0),c.accent]);
return merge(parts);
}