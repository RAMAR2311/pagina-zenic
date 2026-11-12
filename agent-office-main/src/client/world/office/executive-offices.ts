/**
 * Private Executive Glass Suites for Directors:
 * - Jhon Aparicio: Finanzas & Administración
 * - Miguel Rodríguez: Tecnología & Arquitectura IA
 * - Santiago Peraza: Marketing & Operaciones Retail
 * (Complementing Marlon Ramírez's CEO Loft Suite upstairs)
 */
import * as THREE from 'three';
import { mesh, roundedBox, textPlane, toon } from '../toon';
import type { Collider } from '../types';
import type { Fixture } from './fixture';
import { box, glassPane } from './materials';
import { floorPlant, plant } from './props';

export const executiveOffices: Fixture = (site) => {
  const group = new THREE.Group();
  const H = 2.5; // Suite ceiling height
  const T = 0.08; // Wall thickness
  const frameMat = toon('#ffffff');
  const trimMat = toon('#334155');
  const frostedGlass = new THREE.MeshBasicMaterial({
    color: '#e0f2fe',
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const bar = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    group.add(mesh(box(w, h, d), frameMat, x, y, z, false));
  };

  /** Builds an elegant glass wall section with white aluminum frame and frosted modesty strip */
  const glassWall = (axis: 'x' | 'z', x0: number, x1: number, at: number, collides = true) => {
    const len = Math.abs(x1 - x0);
    const mid = (x0 + x1) / 2;
    const n = Math.max(1, Math.round(len / 1.5));

    for (let i = 0; i < n; i++) {
      const g = glassPane(len / n, H);
      const u = Math.min(x0, x1) + (i + 0.5) * (len / n);
      if (axis === 'x') {
        g.position.set(u, H / 2, at);
      } else {
        g.position.set(at, H / 2, u);
        g.rotation.y = Math.PI / 2;
      }
      group.add(g);
    }

    // Frosted privacy strip at waist level (1.05m high)
    const bandH = 0.55;
    const band = new THREE.Mesh(
      axis === 'x' ? new THREE.PlaneGeometry(len, bandH) : new THREE.PlaneGeometry(len, bandH),
      frostedGlass
    );
    if (axis === 'x') {
      band.position.set(mid, 1.05, at);
    } else {
      band.position.set(at, 1.05, mid);
      band.rotation.y = Math.PI / 2;
    }
    group.add(band);

    // Frame top and bottom runners
    if (axis === 'x') {
      bar(len, 0.08, T + 0.04, mid, 0.04, at);
      bar(len, 0.08, T + 0.04, mid, H - 0.04, at);
      for (let i = 0; i <= n; i++) {
        const u = Math.min(x0, x1) + i * (len / n);
        bar(0.06, H, T + 0.02, u, H / 2, at);
      }
      if (collides) {
        site.colliders.push({ minX: Math.min(x0, x1), maxX: Math.max(x0, x1), minZ: at - T, maxZ: at + T, top: H });
      }
    } else {
      bar(T + 0.04, 0.08, len, at, 0.04, mid);
      bar(T + 0.04, 0.08, len, at, H - 0.04, mid);
      for (let i = 0; i <= n; i++) {
        const u = Math.min(x0, x1) + i * (len / n);
        bar(T + 0.02, H, 0.06, at, H / 2, u);
      }
      if (collides) {
        site.colliders.push({ minX: at - T, maxX: at + T, minZ: Math.min(x0, x1), maxZ: Math.max(x0, x1), top: H });
      }
    }
  };

  /** Builds an entire Director Executive Suite */
  const buildSuite = (opts: {
    title: string;
    sub: string;
    icon: string;
    accentColor: string;
    bgBadge: string;
    cx: number;
    cz: number;
    doorSide: 'south' | 'north';
    decorType: 'admin' | 'tech' | 'retail';
  }) => {
    const { cx, cz, doorSide, title, sub, icon, accentColor, bgBadge, decorType } = opts;
    const halfW = 2.9;
    const halfD = 2.2;
    const xLeft = cx - halfW;
    const xRight = cx + halfW;
    const zBack = doorSide === 'south' ? cz - halfD : cz + halfD;
    const zFront = doorSide === 'south' ? cz + halfD : cz - halfD;

    // Side walls (East & West)
    glassWall('z', Math.min(zBack, zFront), Math.max(zBack, zFront), xLeft);
    glassWall('z', Math.min(zBack, zFront), Math.max(zBack, zFront), xRight);

    // Front Wall with Doorway
    const doorW = 1.6;
    const doorX0 = cx - doorW / 2;
    const doorX1 = cx + doorW / 2;
    glassWall('x', xLeft, doorX0, zFront);
    glassWall('x', doorX1, xRight, zFront);

    // Doorway Header Lintel
    const lintelY = 2.15;
    bar(doorW, 0.08, T + 0.04, cx, lintelY, zFront);
    bar(doorW, H - lintelY, T + 0.02, cx, (H + lintelY) / 2, zFront);

    // 🏷️ Prominent Executive Signboard over the entrance (Double-sided)
    const signOuter = textPlane(`${icon} ${title}`, {
      bg: bgBadge,
      color: '#FFFFFF',
      size: 58,
      border: accentColor,
    });
    signOuter.scale.multiplyScalar(0.78);
    signOuter.position.set(cx, lintelY + 0.16, zFront + (doorSide === 'south' ? 0.06 : -0.06));
    if (doorSide === 'north') signOuter.rotation.y = Math.PI;
    group.add(signOuter);

    const signInner = textPlane(`${icon} ${sub}`, {
      bg: '#FFFFFF',
      color: '#0F172A',
      size: 52,
      border: accentColor,
    });
    signInner.scale.multiplyScalar(0.68);
    signInner.position.set(cx, lintelY + 0.16, zFront + (doorSide === 'south' ? -0.06 : 0.06));
    if (doorSide === 'south') signInner.rotation.y = Math.PI;
    group.add(signInner);

    // 🪴 Executive Botanical Plant in corner
    const plantCornerX = xLeft + 0.45;
    const plantCornerZ = zBack + (doorSide === 'south' ? 0.45 : -0.45);
    const p = plant(floorPlant(decorType === 'admin' ? 1 : decorType === 'tech' ? 2 : 3), 0.9);
    p.position.set(plantCornerX, 0, plantCornerZ);
    group.add(p);

    // 🗄️ Distinctive Executive Furniture / Decor
    if (decorType === 'admin') {
      // 💼 Jhon: Executive Financial Credenza & File Archive
      const credenza = new THREE.Group();
      const credBody = mesh(box(1.8, 0.8, 0.4), toon('#1e293b'), 0, 0.4, 0);
      credenza.add(credBody);
      const credTop = mesh(box(1.84, 0.04, 0.44), toon('#00e5ff'), 0, 0.82, 0);
      credenza.add(credTop);
      // Hardcover financial ledgers
      const colors = ['#00e5ff', '#3b82f6', '#10b981', '#f59e0b'];
      colors.forEach((col, i) => {
        const book = mesh(box(0.06, 0.22, 0.28), toon(col), -0.6 + i * 0.1, 0.95, 0);
        credenza.add(book);
      });
      credenza.position.set(cx + 1.4, 0, zBack + 0.4);
      group.add(credenza);
      site.colliders.push({ minX: cx + 0.4, maxX: cx + 2.4, minZ: zBack + 0.15, maxZ: zBack + 0.65, top: 0.85 });

    } else if (decorType === 'tech') {
      // ⚡ Miguel: Server Rack with pulsing status LEDs
      const rack = new THREE.Group();
      const rackBody = mesh(box(0.65, 1.8, 0.55), toon('#0f172a'), 0, 0.9, 0);
      rack.add(rackBody);
      // Server blades and glowing LEDs
      for (let l = 0; l < 6; l++) {
        const blade = mesh(box(0.55, 0.08, 0.02), toon('#334155'), 0, 0.4 + l * 0.22, 0.28);
        rack.add(blade);
        const led1 = mesh(box(0.03, 0.03, 0.02), toon(l % 2 === 0 ? '#00f0ff' : '#a855f7'), -0.18, 0.4 + l * 0.22, 0.29);
        const led2 = mesh(box(0.03, 0.03, 0.02), toon('#10b981'), -0.12, 0.4 + l * 0.22, 0.29);
        rack.add(led1);
        rack.add(led2);
      }
      rack.position.set(cx + 1.8, 0, zBack + 0.5);
      group.add(rack);
      site.colliders.push({ minX: cx + 1.4, maxX: cx + 2.2, minZ: zBack + 0.2, maxZ: zBack + 0.8, top: 1.8 });

    } else if (decorType === 'retail') {
      // 🎯 Santiago: Retail Demo Display Unit & Marketing Stand
      const stand = new THREE.Group();
      const base = mesh(box(1.4, 0.75, 0.45), toon('#064e3b'), 0, 0.375, 0);
      stand.add(base);
      const top = mesh(box(1.44, 0.04, 0.48), toon('#10b981'), 0, 0.77, 0);
      stand.add(top);
      // POS Terminal unit on display
      const pos = mesh(box(0.25, 0.16, 0.28), toon('#00f0ff'), -0.3, 0.87, 0);
      stand.add(pos);
      const dataphone = mesh(box(0.12, 0.08, 0.18), toon('#f59e0b'), 0.2, 0.83, 0);
      stand.add(dataphone);
      stand.position.set(cx + 1.4, 0, zBack - 0.4);
      group.add(stand);
      site.colliders.push({ minX: cx + 0.6, maxX: cx + 2.2, minZ: zBack - 0.65, maxZ: zBack - 0.15, top: 0.8 });
    }
  };

  // 1. 💼 Despacho Jhon (Administración & Finanzas) - Suite Noroccidente
  buildSuite({
    title: 'Despacho Jhon · Finanzas & Admin',
    sub: 'Jhon Aparicio · Dir. Administrativo',
    icon: '💼',
    accentColor: '#00E5FF',
    bgBadge: '#0369A1',
    cx: -10.5,
    cz: -4.0,
    doorSide: 'south',
    decorType: 'admin',
  });

  // 2. ⚡ Despacho Miguel (Tecnología & Arquitectura IA) - Suite Norcentral
  buildSuite({
    title: 'Despacho Miguel · CTO & IA Lab',
    sub: 'Miguel Rodríguez · Dir. de Tecnología',
    icon: '⚡',
    accentColor: '#C084FC',
    bgBadge: '#581C87',
    cx: -1.5,
    cz: -4.0,
    doorSide: 'south',
    decorType: 'tech',
  });

  // 3. 🎯 Despacho Santiago (Marketing & Operaciones Retail) - Suite Suroccidente
  buildSuite({
    title: 'Despacho Santiago · Marketing & Retail',
    sub: 'Santiago Peraza · Dir. de Marketing',
    icon: '🎯',
    accentColor: '#10B981',
    bgBadge: '#065F46',
    cx: -10.5,
    cz: 4.0,
    doorSide: 'north',
    decorType: 'retail',
  });

  site.group.add(group);
  return {};
};
