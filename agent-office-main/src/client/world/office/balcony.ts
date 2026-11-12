import * as THREE from 'three';
import { ASHTRAY, BALCONY, EXIT_STAIRS, SLAB, STREET_Y } from '../../../shared/layout';
import { bulb, type NightParts } from '../outside';
import { mergeByMaterial, mesh, roundedBox, textPlane, toon, toonUnique } from '../toon';
import type { Collider, Interactable } from '../types';
import type { Fixture } from './fixture';
import { PALETTE, box, floorTexture, glassPane } from './materials';
import { floorPlant, plant } from './props';
import { seatable } from './seats';
import { coffeeMug } from '../character';

// Outside the office's walls: the smoking balcony off the south wall, the posts under the bottom
// floor's, and the steps from the exit door down to the street.

/** A sagging string of party bulbs from `a` to `b`, in `bulbs` (one per color); they light up at night. */
function stringLights(a: THREE.Vector3, b: THREE.Vector3, sag: number, bulbs: [string, THREE.Material][], night: NightParts): THREE.Group {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y -= sag * 2;
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  const g = new THREE.Group();
  g.add(mesh(new THREE.TubeGeometry(curve, 24, 0.012, 4), toon(PALETTE.ink), 0, 0, 0, false));
  const n = Math.max(2, Math.round(curve.getLength() / 0.5));
  for (let i = 1; i < n; i++) {
    const p = curve.getPoint(i / n);
    const [color, mat] = bulbs[i % bulbs.length];
    g.add(mesh(new THREE.SphereGeometry(0.055, 8, 6), mat, p.x, p.y - 0.06, p.z, false));
    night.halos.push({ at: new THREE.Vector3(p.x, p.y - 0.06, p.z), size: 0.55, color });
  }
  return mergeByMaterial(g);
}

/**
 * The smoking balcony off the south wall, over the garage entrance: a deck with a glass railing on
 * its three open sides, string lights, a bench under the window, a bistro table, plants and the
 * ashtray, where you take a smoke break.
 */
export function buildBalcony(group: THREE.Group, colliders: Collider[], interactables: Interactable[], night: NightParts) {
  const { minX, maxX, minZ, maxZ } = BALCONY;
  const w = maxX - minX;
  const d = maxZ - minZ;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  // Everything that doesn't move and isn't textured goes in here, merged at the end.
  const parts = new THREE.Group();
  parts.add(mesh(box(w, SLAB - 0.01, d), toon(PALETTE.wallTrim), cx, -SLAB / 2 - 0.005, cz));
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshToonMaterial({ map: floorTexture(w, d), color: '#d6a574', gradientMap: (toon('#fff') as THREE.MeshToonMaterial).gradientMap }));
  deck.rotation.x = -Math.PI / 2;
  deck.position.set(cx, 0.002, cz);
  deck.receiveShadow = true;
  group.add(deck);
  colliders.push({ minX, maxX, minZ, maxZ, bottom: -SLAB, top: 0 });

  // The railing: posts, a wooden top rail and glass between, on the three open sides.
  const railH = 1.05;
  const ink = toon(PALETTE.deskLeg);
  const wood = toon(PALETTE.wood);
  const inset = 0.06;
  const sides: [number, number, number, number][] = [
    [minX + inset, maxZ - inset, maxX - inset, maxZ - inset],
    [minX + inset, minZ, minX + inset, maxZ - inset],
    [maxX - inset, minZ, maxX - inset, maxZ - inset],
  ];
  for (const [x0, z0, x1, z1] of sides) {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const alongX = z0 === z1;
    const n = Math.ceil(len / 1.6);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      parts.add(mesh(box(0.06, railH, 0.06), ink, x0 + (x1 - x0) * t, railH / 2, z0 + (z1 - z0) * t, false));
    }
    const rail = mesh(alongX ? box(len + 0.1, 0.07, 0.12) : box(0.12, 0.07, len + 0.1), wood, (x0 + x1) / 2, railH + 0.02, (z0 + z1) / 2);
    parts.add(rail);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const pane = glassPane(len / n - 0.1, railH - 0.2);
      pane.position.set(x0 + (x1 - x0) * t, (railH - 0.2) / 2 + 0.08, z0 + (z1 - z0) * t);
      pane.rotation.y = alongX ? 0 : Math.PI / 2;
      parts.add(pane);
    }
    colliders.push({ minX: Math.min(x0, x1) - 0.05, maxX: Math.max(x0, x1) + 0.05, minZ: Math.min(z0, z1) - 0.05, maxZ: Math.max(z0, z1) + 0.05, bottom: -SLAB, top: 99 });
  }

  // Lamp poles on the outer corners, with string lights to them from the wall and between them.
  const poleH = 2.7;
  const sw = new THREE.Vector3(minX + inset, poleH, maxZ - inset);
  const se = new THREE.Vector3(maxX - inset, poleH, maxZ - inset);
  for (const p of [sw, se]) parts.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, poleH - railH, 6), ink, p.x, (poleH + railH) / 2, p.z, false));
  const bulbs = ['#ffd166', '#ff8fa3', '#8ecae6', '#caffbf'].map((c): [string, THREE.Material] => [c, bulb(night, c, 0.4)]);
  parts.add(stringLights(sw, se, 0.35, bulbs, night));
  parts.add(stringLights(sw, new THREE.Vector3(-6.5, 3.5, minZ + 0.02), 0.3, bulbs, night));
  parts.add(stringLights(new THREE.Vector3(-6.5, 3.5, minZ + 0.02), se, 0.35, bulbs, night));
  // At night they light the deck, the table and whoever's out there.
  for (const x of [cx - 3.2, cx + 3.2]) night.lamps.push({ x, y: 2.4, z: cz, reach: 5.5, color: '#ffc9a6', power: 2.4 });

  // A bench under the window, a bistro table with two stools, and plants.
  const bench = new THREE.Group();
  bench.add(mesh(roundedBox(2, 0.08, 0.46, 0.05), wood, 0, 0.45, 0));
  bench.add(mesh(box(2, 0.32, 0.06), wood, 0, 0.78, -0.2));
  for (const sx of [-0.85, 0.85]) bench.add(mesh(box(0.06, 0.45, 0.4), ink, sx, 0.22, 0));
  bench.position.set(-9, 0, minZ + 0.3);
  // Somewhere to sit, so not merged with the rest: its own meshes carry what E is about when you look at it.
  group.add(bench);
  colliders.push({ minX: -10, maxX: -8, minZ, maxZ: minZ + 0.55, top: 0.49 });
  seatable(bench, 'bench', 1.6, interactables);
  const tx = 0.2;
  const tz = cz + 0.2;
  const table = new THREE.Group();
  table.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 20), toon('#fffaf3'), 0, 0.74, 0));
  table.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), ink, 0, 0.37, 0));
  table.add(mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.04, 16), ink, 0, 0.02, 0));
  table.add(mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.12, 10), toon('#ef476f'), 0.15, 0.82, 0.05));
  table.position.set(tx, 0, tz);
  parts.add(table);
  colliders.push({ minX: tx - 0.4, maxX: tx + 0.4, minZ: tz - 0.4, maxZ: tz + 0.4, top: 0.77 });
  for (const sx of [-1, 1]) {
    const x = tx + sx * 0.8;
    const stool = new THREE.Group();
    stool.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), toon(sx < 0 ? '#5bc0eb' : '#ff8a5b'), 0, 0.46, 0));
    stool.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.44, 6), ink, 0, 0.22, 0));
    stool.add(mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.03, 12), ink, 0, 0.015, 0));
    stool.position.set(x, 0, tz);
    group.add(stool);
    colliders.push({ minX: x - 0.2, maxX: x + 0.2, minZ: tz - 0.2, maxZ: tz + 0.2, top: 0.49 });
    seatable(stool, sx < 0 ? 'stool-1' : 'stool-2', 0.9, interactables);
  }
  for (const [i, [px, pz, sc]] of [
    [maxX - 0.55, minZ + 0.5, 1.1],
    [minX + 0.55, maxZ - 0.55, 0.9],
  ].entries()) {
    // Starting past the monstera, which spreads too wide for a spot this near the rail.
    const p = plant(floorPlant(i + 1), sc);
    p.position.set(px, 0, pz);
    parts.add(p);
    const r = 0.3 * sc;
    colliders.push({ minX: px - r, maxX: px + r, minZ: pz - r, maxZ: pz + r, top: 0.5 * sc });
  }

  group.add(mergeByMaterial(parts));

  // The ashtray: a standing bin with a sand-filled bowl and a couple of butts in it.
  const tray = new THREE.Group();
  const steel = toon('#8d99ae');
  tray.add(mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 16), steel, 0, 0.025, 0));
  tray.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 10), steel, 0, 0.45, 0));
  tray.add(mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.14, 16), steel, 0, 0.9, 0));
  tray.add(mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), toon('#e9d8a6'), 0, 0.965, 0, false));
  for (const [bx, bz, a] of [
    [0.06, 0.02, 0.4],
    [-0.05, -0.06, 2.1],
    [-0.02, 0.08, 1.2],
  ]) {
    const butt = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.07, 6).rotateZ(Math.PI / 2), toon(a > 1 ? '#fffaf3' : '#e9a03b'), bx, 0.98, bz, false);
    butt.rotation.y = a;
    tray.add(butt);
  }

  // Smoldering lit cigarette resting on the ashtray rim with glowing ember
  const litCig = new THREE.Group();
  litCig.add(mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.085, 8).rotateZ(Math.PI / 2), toon('#fffaf3'), 0, 0, 0, false));
  litCig.add(mesh(new THREE.CylinderGeometry(0.0115, 0.0115, 0.032, 8).rotateZ(Math.PI / 2), toon('#e9a03b'), -0.04, 0, 0, false));
  const litEmber = toonUnique('#ff3b00');
  litEmber.emissive = new THREE.Color('#ff3b00');
  litEmber.emissiveIntensity = 0.8;
  litCig.add(mesh(new THREE.CylinderGeometry(0.0115, 0.0115, 0.012, 8).rotateZ(Math.PI / 2), litEmber, 0.045, 0, 0, false));
  // Wisps of smoke rising from the ember
  const smokePuff = mesh(new THREE.CylinderGeometry(0.008, 0.05, 0.25, 8), toon('#e9ecef', { transparent: true, opacity: 0.35 }), 0.05, 0.14, 0, false);
  litCig.add(smokePuff);
  litCig.position.set(0.08, 0.99, -0.03);
  litCig.rotation.y = -0.5;
  litCig.rotation.z = -0.08;
  tray.add(litCig);

  tray.position.set(ASHTRAY.x, 0, ASHTRAY.z);
  group.add(tray);
  colliders.push({ minX: ASHTRAY.x - 0.2, maxX: ASHTRAY.x + 0.2, minZ: ASHTRAY.z - 0.2, maxZ: ASHTRAY.z + 0.2, top: 1 });
  const it: Interactable = { kind: 'smoke', label: '🚬 Cenicero y Cigarrillos', x: ASHTRAY.x, z: ASHTRAY.z, radius: 2.0 };
  interactables.push(it);
  tray.userData.interact = it;

  // Cigarettes table next to ashtray: a patio side table with a full pack of cigarettes and lighter
  const smokeTable = new THREE.Group();
  const tableMetal = toon('#343a40');
  const brass = toon('#d4af37');
  smokeTable.add(mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.03, 16), tableMetal, 0, 0.015, 0));
  smokeTable.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 8), tableMetal, 0, 0.38, 0));
  smokeTable.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20), tableMetal, 0, 0.75, 0));
  smokeTable.add(mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.01, 20), brass, 0, 0.76, 0));

  // Cigarette Pack (Cajetilla de Cigarrillos con tapa abierta y cigarrillos visibles)
  const pack = new THREE.Group();
  const packWhite = toon('#ffffff');
  const packRed = toon('#d90429');
  const packGold = toon('#ffd166');
  const pw = 0.065;
  const ph = 0.095;
  const pd = 0.03;
  pack.add(mesh(box(pw, ph * 0.7, pd), packWhite, 0, ph * 0.35, 0));
  pack.add(mesh(box(pw * 0.85, ph * 0.35, 0.005), packRed, 0, ph * 0.35, pd / 2 + 0.003));
  pack.add(mesh(box(pw - 0.008, 0.02, pd - 0.008), packGold, 0, ph * 0.71, 0));
  const lid = new THREE.Group();
  lid.add(mesh(box(pw + 0.002, ph * 0.3, pd + 0.002), packRed, 0, ph * 0.15, 0));
  lid.position.set(0, ph * 0.7, -pd / 2);
  lid.rotation.x = -Math.PI * 0.35;
  pack.add(lid);
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const isExtended = row === 0 && col === 0;
      const cyH = isExtended ? 0.045 : 0.025;
      const filter = mesh(new THREE.CylinderGeometry(0.006, 0.006, cyH, 8), toon('#e9a03b'), col * 0.018, ph * 0.7 + cyH / 2, row * 0.008, false);
      pack.add(filter);
    }
  }
  pack.position.set(-0.06, 0.765, 0.02);
  pack.rotation.y = 0.35;
  smokeTable.add(pack);

  // Loose cigarettes on the side table
  const looseCig1 = new THREE.Group();
  looseCig1.add(mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.08, 8).rotateZ(Math.PI / 2), toon('#fffaf3'), 0, 0.007, 0, false));
  looseCig1.add(mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.03, 8).rotateZ(Math.PI / 2), toon('#e9a03b'), -0.038, 0.007, 0, false));
  looseCig1.position.set(0.06, 0.765, -0.05);
  looseCig1.rotation.y = 0.8;
  smokeTable.add(looseCig1);

  const looseCig2 = new THREE.Group();
  looseCig2.add(mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.08, 8).rotateZ(Math.PI / 2), toon('#fffaf3'), 0, 0.007, 0, false));
  looseCig2.add(mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.03, 8).rotateZ(Math.PI / 2), toon('#e9a03b'), -0.038, 0.007, 0, false));
  looseCig2.position.set(0.08, 0.765, 0.04);
  looseCig2.rotation.y = -0.4;
  smokeTable.add(looseCig2);

  // Metallic lighter (Zippo style)
  const lighter = new THREE.Group();
  lighter.add(mesh(box(0.025, 0.038, 0.012), brass, 0, 0.019, 0));
  const lCap = mesh(box(0.026, 0.018, 0.013), toon('#adb5bd'), -0.014, 0.042, 0);
  lCap.rotation.z = 0.55;
  lighter.add(lCap);
  lighter.add(mesh(box(0.016, 0.014, 0.01), toon('#dee2e6'), 0, 0.042, 0));
  lighter.position.set(0.02, 0.765, 0.1);
  lighter.rotation.y = 0.5;
  smokeTable.add(lighter);

  smokeTable.position.set(ASHTRAY.x + 0.65, 0, ASHTRAY.z);
  smokeTable.userData.interact = it;
  group.add(smokeTable);
  colliders.push({ minX: ASHTRAY.x + 0.45, maxX: ASHTRAY.x + 0.85, minZ: ASHTRAY.z - 0.22, maxZ: ASHTRAY.z + 0.22, top: 0.82 });

  // ---------------------------------------------------------
  // Outdoor Coffee Machine & Barista Station (Café en la Terraza)
  // ---------------------------------------------------------
  const coffeeX = -1.2;
  const coffeeZ = minZ + 0.45;
  const coffeeStation = new THREE.Group();
  const barW = 1.3;
  const barD = 0.55;
  const barH = 0.95;
  const iron = toon('#1f2421');
  const counterWood = toon('#582f0e');
  const counterTop = toon('#212529');

  // Bar counter base and wooden slat front
  coffeeStation.add(mesh(roundedBox(barW, barH - 0.05, barD - 0.04, 0.03), counterWood, 0, (barH - 0.05) / 2, 0));
  for (let s = -0.55; s <= 0.55; s += 0.11) {
    coffeeStation.add(mesh(box(0.035, barH - 0.08, 0.015), toon('#3d2314'), s, (barH - 0.05) / 2, barD / 2 - 0.01));
  }
  coffeeStation.add(mesh(roundedBox(barW + 0.08, 0.05, barD + 0.08, 0.02), counterTop, 0, barH - 0.025, 0));
  for (const sx of [-barW / 2, barW / 2]) {
    for (const sz of [-barD / 2, barD / 2]) {
      coffeeStation.add(mesh(box(0.04, barH, 0.04), iron, sx, barH / 2, sz));
    }
  }

  // Espresso Coffee Machine
  const cm = new THREE.Group();
  const machineW = 0.52;
  const machineH = 0.42;
  const machineD = 0.38;
  const chrome = toon('#dee2e6');
  const bodyRed = toon('#9d0208');
  const bodyDark = toon('#1b1b1b');

  cm.add(mesh(roundedBox(machineW, machineH, machineD, 0.04), bodyRed, 0, machineH / 2, 0));
  cm.add(mesh(box(machineW - 0.06, machineH * 0.35, 0.02), chrome, 0, machineH * 0.72, machineD / 2 + 0.01));
  for (const gx of [-0.14, 0.14]) {
    cm.add(mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.015, 16).rotateX(Math.PI / 2), toon('#f8f9fa'), gx, machineH * 0.72, machineD / 2 + 0.025, false));
    cm.add(mesh(box(0.004, 0.03, 0.005), toon('#d90429'), gx, machineH * 0.72, machineD / 2 + 0.032));
  }
  for (const px of [-0.11, 0.11]) {
    cm.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16), chrome, px, machineH * 0.48, machineD / 2 + 0.03, false));
    cm.add(mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.04, 8), chrome, px, machineH * 0.43, machineD / 2 + 0.03, false));
    const handle = mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.13, 8).rotateX(Math.PI / 2), bodyDark, px, machineH * 0.48, machineD / 2 + 0.1, false);
    cm.add(handle);
  }
  cm.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8).rotateZ(0.35), chrome, 0.22, machineH * 0.5, machineD / 2 + 0.04, false));
  cm.add(mesh(roundedBox(machineW - 0.04, 0.04, 0.2, 0.01), chrome, 0, 0.02, machineD / 2 + 0.06));
  cm.add(mesh(box(machineW - 0.06, 0.015, machineD - 0.06), chrome, 0, machineH + 0.01, 0));
  const mug1 = coffeeMug(0.7);
  mug1.position.set(-0.12, machineH + 0.02, -0.04);
  cm.add(mug1);
  const mug2 = coffeeMug(0.7);
  mug2.position.set(0.12, machineH + 0.02, 0.04);
  cm.add(mug2);
  const activeMug = coffeeMug(0.75);
  activeMug.position.set(-0.11, 0.045, machineD / 2 + 0.03);
  cm.add(activeMug);
  const greenLed = toonUnique('#38b000');
  greenLed.emissive = new THREE.Color('#38b000');
  greenLed.emissiveIntensity = 0.8;
  cm.add(mesh(new THREE.SphereGeometry(0.016, 8, 8), greenLed, 0, machineH * 0.72, machineD / 2 + 0.025, false));

  cm.position.set(0, barH, 0);
  coffeeStation.add(cm);

  const coffeeSign = textPlane('☕ Café Zenic', { bg: '#2b2d42', color: '#ffb703', size: 52, border: '#ffb703' });
  coffeeSign.scale.multiplyScalar(0.55);
  coffeeSign.position.set(0, barH + machineH + 0.28, 0);
  coffeeStation.add(coffeeSign);

  coffeeStation.position.set(coffeeX, 0, coffeeZ);
  group.add(coffeeStation);

  night.lamps.push({ x: coffeeX, y: 2.3, z: coffeeZ + 0.3, reach: 4.5, color: '#ffe6a7', power: 2.2 });
  colliders.push({ minX: coffeeX - barW / 2 - 0.05, maxX: coffeeX + barW / 2 + 0.05, minZ: coffeeZ - barD / 2 - 0.05, maxZ: coffeeZ + barD / 2 + 0.1, top: barH + machineH });

  const coffeeIt: Interactable = {
    kind: 'coffee',
    label: '☕ Máquina de Café (Terraza)',
    x: coffeeX,
    z: coffeeZ + 0.4,
    radius: 1.8,
  };
  interactables.push(coffeeIt);
  coffeeStation.userData.interact = coffeeIt;
  cm.userData.interact = coffeeIt;

  const sign = textPlane('🚬 Zona de descanso', { bg: '#2b2d42', color: '#fffaf3', size: 56, border: '#fffaf3' });
  sign.scale.multiplyScalar(0.8);
  sign.position.set(-6.5, 2.2, minZ + 0.02);
  group.add(sign);
}

/** The smoking balcony, out the glass doors on the south wall. */
export const balcony: Fixture = (site) => {
  buildBalcony(site.group, site.colliders, site.interactables, site.get('night'));
  return {};
};

/** The bottom floor's balcony stands on posts down to the street, at its outer corners (the ones above it hang off their walls). */
export function buildBalconyPosts(group: THREE.Group, colliders: Collider[]) {
  const { minX, maxX, maxZ } = BALCONY;
  const postH = -SLAB - STREET_Y;
  for (const x of [minX + 0.25, maxX - 0.25]) {
    group.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, postH, 12), toon('#e6e8ee'), x, STREET_Y + postH / 2, maxZ - 0.25));
    colliders.push({ minX: x - 0.14, maxX: x + 0.14, minZ: maxZ - 0.39, maxZ: maxZ - 0.11, bottom: STREET_Y, top: -SLAB });
  }
}

/**
 * Outside the exit: a concrete landing level with the office floor, and steps running south
 * along the west wall down to the street, with a railing on the open side.
 */
export function buildExitStairs(group: THREE.Group, colliders: Collider[]) {
  const { minX, maxX, landingZ0, landingZ1, steps, run } = EXIT_STAIRS;
  const width = maxX - minX;
  const rise = -STREET_Y / steps;
  const treads = steps - 1;
  const L = landingZ1 - landingZ0;
  // Side profile: x runs south from the landing's north end, y is height.
  const profile = new THREE.Shape();
  profile.moveTo(0, STREET_Y);
  profile.lineTo(0, 0);
  profile.lineTo(L, 0);
  for (let i = 1; i <= treads; i++) {
    profile.lineTo(L + (i - 1) * run, -i * rise);
    profile.lineTo(L + i * run, -i * rise);
  }
  profile.lineTo(L + treads * run, STREET_Y);
  profile.closePath();
  const block = mesh(new THREE.ExtrudeGeometry(profile, { depth: width, bevelEnabled: false }), toon('#d3d6dd'), maxX, 0, landingZ0);
  block.rotation.y = -Math.PI / 2;
  group.add(block);
  const tread = toon('#b9bdc6');
  const cx = (minX + maxX) / 2;
  group.add(mesh(box(width, 0.04, L), tread, cx, -0.015, landingZ0 + L / 2, false));
  colliders.push({ minX, maxX, minZ: landingZ0, maxZ: landingZ1, bottom: STREET_Y, top: 0 });
  for (let i = 1; i <= treads; i++) {
    const z0 = landingZ1 + (i - 1) * run;
    group.add(mesh(box(width, 0.04, run + 0.02), tread, cx, -i * rise - 0.015, z0 + run / 2, false));
    colliders.push({ minX, maxX, minZ: z0, maxZ: z0 + run, bottom: STREET_Y, top: -i * rise });
  }

  // The railing: round the landing's open sides, then down the stairs.
  const ink = toon(PALETTE.deskLeg);
  const railX = minX + 0.06;
  const railH = 1.0;
  const post = (x: number, y: number, z: number) => group.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, railH, 6), ink, x, y + railH / 2, z, false));
  const rail = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
    const len = Math.hypot(x1 - x0, y1 - y0, z1 - z0);
    const r = mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 6), ink, (x0 + x1) / 2, (y0 + y1) / 2 + railH, (z0 + z1) / 2, false);
    r.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x1 - x0, y1 - y0, z1 - z0).normalize());
    group.add(r);
  };
  const nz = landingZ0 + 0.06;
  post(maxX - 0.05, 0, nz);
  post(railX, 0, nz);
  post(railX, 0, landingZ1);
  rail(maxX - 0.05, 0, nz, railX, 0, nz);
  rail(railX, 0, nz, railX, 0, landingZ1);
  const bottomZ = landingZ1 + (treads - 0.5) * run;
  for (let i = 2; i <= treads; i += 3) post(railX, -i * rise, landingZ1 + (i - 0.5) * run);
  post(railX, -treads * rise, bottomZ);
  rail(railX, 0, landingZ1, railX, -treads * rise, bottomZ);
  colliders.push({ minX: minX - 0.05, maxX: minX + 0.1, minZ: landingZ0, maxZ: bottomZ, bottom: STREET_Y, top: 99 });
  colliders.push({ minX, maxX, minZ: landingZ0 - 0.05, maxZ: landingZ0 + 0.1, bottom: STREET_Y, top: 99 });
}
