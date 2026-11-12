/**
 * Private Executive Glass Suites for Directors:
 * - Jhon Aparicio: Finanzas & Administración
 * - Miguel Rodríguez: Tecnología & Arquitectura IA
 * - Santiago Peraza: Marketing & Operaciones Retail
 * (Complementing Marlon Ramírez's CEO Loft Suite upstairs)
 */
import * as THREE from 'three';
import { mesh, roundedBox, toon } from '../toon';
import type { Collider } from '../types';
import type { Fixture } from './fixture';
import { box, glassPane } from './materials';
import { floorPlant, plant } from './props';

/** Architectural high-resolution executive wall directory plaque (mounted beside the door at eye-level) */
function createExecutiveDoorPlaque(opts: {
  name: string;
  role: string;
  icon: string;
  accent: string;
}): THREE.Group {
  const g = new THREE.Group();
  const width = 0.88;
  const height = 0.46;
  const depth = 0.024;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Background: 100% solid deep obsidian navy (zero alpha, zero dithering/difuminado)
  ctx.fillStyle = '#0B111E';
  ctx.fillRect(0, 0, 1024, 512);

  // Solid outer accent frame
  ctx.strokeStyle = opts.accent;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 1010, 498);

  // Solid inner architectural pinstripe
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 976, 464);

  // Header category banner (solid accent)
  ctx.fillStyle = opts.accent;
  ctx.font = '800 28px Nunito, Montserrat, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZENIC · DIRECCIÓN EJECUTIVA', 512, 75);

  // Thin solid dividing line
  ctx.strokeStyle = opts.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(260, 115);
  ctx.lineTo(764, 115);
  ctx.stroke();

  // Name (Main) - 100% solid crisp white
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 68px Nunito, Montserrat, system-ui, sans-serif';
  ctx.fillText(`${opts.icon}  ${opts.name.toUpperCase()}`, 512, 225);

  // Role subtitle - solid crisp slate
  ctx.fillStyle = '#94A3B8';
  ctx.font = '700 36px Nunito, Montserrat, system-ui, sans-serif';
  ctx.fillText(opts.role, 512, 340);

  // Status indicator - solid emerald
  ctx.fillStyle = '#10B981';
  ctx.font = '700 24px Nunito, monospace';
  ctx.fillText('● DESPACHO PRIVADO · EN LÍNEA', 512, 430);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  // Positioned slightly in front of backing to completely eliminate Z-fighting
  face.position.set(0, 0, 0.005);
  g.add(face);

  // Acrylic backing block
  const acrylicMat = toon('#0f172a');
  const backing = mesh(box(width + 0.03, height + 0.03, depth), acrylicMat, 0, 0, -depth / 2);
  g.add(backing);

  // 4 Corner Brass/Gold Standoff Bolts
  const boltMat = toon('#ffd166');
  const boltR = 0.022;
  const boltL = 0.045;
  const dx = width / 2 - 0.055;
  const dy = height / 2 - 0.055;
  for (const sx of [-dx, dx]) {
    for (const sy of [-dy, dy]) {
      const b = mesh(new THREE.CylinderGeometry(boltR, boltR, boltL, 12).rotateX(Math.PI / 2), boltMat, sx, sy, 0.012);
      g.add(b);
    }
  }

  return g;
}

/** Executive Workstation: Complete, logically oriented PC Workstation (Torre, Pantalla, Teclado, Mouse y Placa) */
function createExecutiveDeskWorkstation(opts: {
  name: string;
  role: string;
  icon: string;
  theme: 'admin' | 'tech' | 'retail';
  accent: string;
}): THREE.Group {
  const g = new THREE.Group();

  // 1. 🖥️ Executive Ultrawide Curved Monitor on Heavy Articulated Stand
  const monGroup = new THREE.Group();
  const chromeMat = toon('#cbd5e1');
  const darkMonMat = toon('#0b0f19');

  // Heavy metal desk mount stand
  monGroup.add(mesh(roundedBox(0.26, 0.016, 0.18, 0.01), toon('#334155'), 0, 0.788, -0.18));
  monGroup.add(mesh(box(0.04, 0.32, 0.04), chromeMat, 0, 0.94, -0.18));
  monGroup.add(mesh(box(0.06, 0.05, 0.05), toon('#1e293b'), 0, 1.07, -0.17));

  // Monitor chassis (34" ultrawide aspect ratio)
  monGroup.add(mesh(roundedBox(0.88, 0.38, 0.024, 0.015), darkMonMat, 0, 1.07, -0.14));

  // Back of monitor (faces the visitor approaching from -z)
  // Sleek illuminated Zenic logo badge & ambient back-glow
  const backLogo = mesh(box(0.18, 0.045, 0.005), toon(opts.accent), 0, 1.07, -0.153);
  monGroup.add(backLogo);
  const backGlow = mesh(box(0.65, 0.01, 0.005), toon(opts.accent), 0, 1.18, -0.153);
  monGroup.add(backGlow);

  // Front of monitor (faces the director in the chair at +z): High-resolution active software display
  const scCanvas = document.createElement('canvas');
  scCanvas.width = 512;
  scCanvas.height = 220;
  const sctx = scCanvas.getContext('2d')!;
  sctx.fillStyle = '#090d16';
  sctx.fillRect(0, 0, 512, 220);

  if (opts.theme === 'admin') {
    sctx.fillStyle = '#00F0FF';
    sctx.font = '800 20px monospace';
    sctx.fillText('ZENIC ERP // FINANCIAL DASHBOARD', 20, 32);
    sctx.fillStyle = '#10B981';
    sctx.fillText('▲ EBITDA +28.4%   FLUJO: $482.5M COP', 20, 68);
    [40, 75, 55, 90, 110, 85, 130, 150].forEach((v, idx) => {
      sctx.fillStyle = '#00E5FF';
      sctx.fillRect(30 + idx * 56, 200 - v, 42, v);
    });
  } else if (opts.theme === 'tech') {
    sctx.fillStyle = '#C084FC';
    sctx.font = '800 20px monospace';
    sctx.fillText('NEURAL ARCHITECTURE // ZENIC AI', 20, 32);
    sctx.fillStyle = '#38BDF8';
    sctx.fillText('● NODES: 64/64 ACTIVE   LATENCY: 1.8ms', 20, 68);
    sctx.fillStyle = '#A855F7';
    sctx.fillText('> vision_model.optimize(quantization="int8")', 20, 110);
    sctx.fillText('> tensor_engine.deploy(pos_fleet=True)', 20, 140);
    sctx.fillStyle = '#10B981';
    sctx.fillText('✓ ALL SERVICES NOMINAL [200 OK]', 20, 175);
  } else {
    sctx.fillStyle = '#34D399';
    sctx.font = '800 20px monospace';
    sctx.fillText('RETAIL TELEMETRY // STORES LIVE', 20, 32);
    sctx.fillStyle = '#F59E0B';
    sctx.fillText('● 12 TIENDAS CONECTADAS · POS ACTIVE', 20, 68);
    sctx.fillStyle = '#10B981';
    sctx.fillText('VENTAS HOY: $84,920,000 COP (+14%)', 20, 110);
    sctx.fillStyle = '#38BDF8';
    sctx.fillText('PASARELA WOMPI & DATA: 100% UP', 20, 145);
  }

  const scTex = new THREE.CanvasTexture(scCanvas);
  scTex.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshBasicMaterial({ map: scTex });
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.35), screenMat);
  screenMesh.position.set(0, 1.07, -0.127);
  monGroup.add(screenMesh);
  g.add(monGroup);

  // 2. 🖲️ Desktop Blotter, Mechanical Keyboard & Wireless Mouse (in front of Director)
  const blotter = mesh(roundedBox(0.92, 0.01, 0.44, 0.02), toon('#182030'), 0, 0.785, 0.14);
  g.add(blotter);

  // Mechanical Keyboard body & keycaps
  const kbBody = mesh(box(0.44, 0.016, 0.15), toon('#334155'), -0.06, 0.796, 0.16);
  g.add(kbBody);
  const kbKeys = mesh(box(0.42, 0.008, 0.13), toon('#0b0f19'), -0.06, 0.806, 0.16);
  g.add(kbKeys);

  // Wireless Mouse
  const mouse = mesh(roundedBox(0.07, 0.022, 0.11, 0.01), toon('#475569'), 0.28, 0.798, 0.16);
  g.add(mouse);

  // 3. 🖥️ Executive Studio Tower PC (Mid-Tower on right side of desk)
  const tower = new THREE.Group();
  const towerX = 0.82;
  const towerY = 0.96;
  const towerZ = -0.08;

  // Main chassis
  tower.add(mesh(roundedBox(0.18, 0.36, 0.36, 0.015), toon('#090d16'), towerX, towerY, towerZ));
  // Front panel
  tower.add(mesh(box(0.17, 0.34, 0.01), toon('#1e293b'), towerX, towerY, towerZ - 0.185));
  // Front glowing LED accent bar
  tower.add(mesh(box(0.006, 0.26, 0.005), toon(opts.accent), towerX, towerY, towerZ - 0.19));
  // Top power switch
  tower.add(mesh(box(0.03, 0.01, 0.03), toon('#cbd5e1'), towerX, towerY + 0.182, towerZ - 0.12));
  // Tempered glass side panel with subtle interior RGB glow
  const glassPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.32, 0.32),
    new THREE.MeshBasicMaterial({ color: opts.accent, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  glassPanel.position.set(towerX - 0.091, towerY, towerZ);
  glassPanel.rotation.y = Math.PI / 2;
  tower.add(glassPanel);
  g.add(tower);

  // 4. 🏷️ Solid Executive Desk Nameplate (Placed neatly on front-right corner, angled toward visitor)
  const plateW = 0.44;
  const plateH = 0.09;
  const plateD = 0.08;
  const plateX = 0.65;
  const plateZ = -0.34;

  const nameplateGroup = new THREE.Group();
  const woodMat = toon('#2d1b00');
  const wedge = mesh(box(plateW, plateH, plateD), woodMat, 0, plateH / 2, 0);
  nameplateGroup.add(wedge);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#CA8A04';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 504, 120);

  ctx.fillStyle = '#451A03';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 36px Nunito, Montserrat, system-ui, sans-serif';
  ctx.fillText(`${opts.icon} ${opts.name.toUpperCase()}`, 256, 45);

  ctx.font = '700 22px Nunito, Montserrat, system-ui, sans-serif';
  ctx.fillText(opts.role, 256, 88);

  const nameTex = new THREE.CanvasTexture(canvas);
  nameTex.colorSpace = THREE.SRGBColorSpace;
  nameTex.minFilter = THREE.LinearFilter;
  nameTex.magFilter = THREE.LinearFilter;
  nameTex.generateMipmaps = false;

  const faceMat = new THREE.MeshBasicMaterial({ map: nameTex });
  const nameMesh = new THREE.Mesh(new THREE.PlaneGeometry(plateW - 0.015, plateH - 0.015), faceMat);
  nameMesh.position.set(0, plateH / 2, -plateD / 2 - 0.005);
  nameMesh.rotation.y = Math.PI; // Faces the visitor approaching from -z
  nameplateGroup.add(nameMesh);

  nameplateGroup.position.set(plateX, 0.78, plateZ);
  nameplateGroup.rotation.y = -0.18; // Subtly angled toward visitor
  g.add(nameplateGroup);

  // 5. 💡 Designer Desk Lamp on back-left corner
  const lamp = new THREE.Group();
  lamp.add(mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 16), toon('#475569'), 0, 0.79, 0));
  lamp.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 8), toon('#cbd5e1'), 0, 0.98, 0));
  const shade = mesh(new THREE.ConeGeometry(0.11, 0.14, 16), toon(opts.accent), 0, 1.18, 0.04);
  shade.rotation.x = 0.35;
  lamp.add(shade);
  lamp.position.set(-0.78, 0, -0.28);
  g.add(lamp);

  return g;
}

export const executiveOffices: Fixture = (site) => {
  const group = new THREE.Group();
  const H = 2.5; // Suite ceiling height
  const T = 0.08; // Wall thickness
  const frameMat = toon('#ffffff');
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
    name: string;
    role: string;
    icon: string;
    accentColor: string;
    cx: number;
    cz: number;
    deskZ: number;
    deskRotY: number;
    doorSide: 'south' | 'north';
    decorType: 'admin' | 'tech' | 'retail';
  }) => {
    const { cx, cz, deskZ, deskRotY, doorSide, name, role, icon, accentColor, decorType } = opts;
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

    // Back Wall with Glass & Frosted Privacy Strip (Closes the executive suite in the back!)
    glassWall('x', xLeft, xRight, zBack);

    // Doorway Header Lintel (clean transom glass over door, no ugly ribbons)
    const lintelY = 2.15;
    bar(doorW, 0.08, T + 0.04, cx, lintelY, zFront);
    const transom = glassPane(doorW, H - lintelY);
    transom.position.set(cx, (H + lintelY) / 2, zFront);
    group.add(transom);

    // 🏷️ Elegant Architectural Plaque MOUNTED BESIDE THE DOOR AT EYE LEVEL (1.52m)
    // Left on one side of the entrance so the doorway is completely clear and the office makes logical sense
    const plaqueSideX = cx + doorW / 2 + 0.54;
    const plaque = createExecutiveDoorPlaque({
      name,
      role,
      icon,
      accent: accentColor,
    });
    plaque.position.set(plaqueSideX, 1.52, zFront + (doorSide === 'south' ? 0.045 : -0.045));
    if (doorSide === 'north') plaque.rotation.y = Math.PI;
    group.add(plaque);

    // 💻 Workstation & Engraved Desk Nameplate on Director's Desk
    const workstation = createExecutiveDeskWorkstation({
      name,
      role,
      icon,
      theme: decorType,
      accent: accentColor,
    });
    workstation.position.set(cx, 0, deskZ);
    workstation.rotation.y = deskRotY;
    group.add(workstation);

    // 🪴 Executive Botanical Plant in back corner
    const plantCornerX = xLeft + 0.45;
    const plantCornerZ = zBack + (doorSide === 'south' ? 0.45 : -0.45);
    const p = plant(floorPlant(decorType === 'admin' ? 1 : decorType === 'tech' ? 2 : 3), 0.95);
    p.position.set(plantCornerX, 0, plantCornerZ);
    group.add(p);

    // 🗄️ Distinctive Executive Furniture / Decor (Organized along back wall/corner)
    if (decorType === 'admin') {
      // 💼 Jhon: Executive Financial Credenza & File Archive against back wall
      const credenza = new THREE.Group();
      const credBody = mesh(box(1.8, 0.8, 0.4), toon('#1e293b'), 0, 0.4, 0);
      credenza.add(credBody);
      const credTop = mesh(box(1.84, 0.04, 0.44), toon('#00e5ff'), 0, 0.82, 0);
      credenza.add(credTop);
      const colors = ['#00e5ff', '#3b82f6', '#10b981', '#f59e0b'];
      colors.forEach((col, i) => {
        const book = mesh(box(0.06, 0.22, 0.28), toon(col), -0.6 + i * 0.1, 0.95, 0);
        credenza.add(book);
      });
      credenza.position.set(cx + 1.2, 0, zBack + 0.35);
      group.add(credenza);
      site.colliders.push({ minX: cx + 0.3, maxX: cx + 2.1, minZ: zBack + 0.12, maxZ: zBack + 0.58, top: 0.85 });

    } else if (decorType === 'tech') {
      // ⚡ Miguel: Server Rack in back corner with pulsing status LEDs
      const rack = new THREE.Group();
      const rackBody = mesh(box(0.65, 1.8, 0.55), toon('#0f172a'), 0, 0.9, 0);
      rack.add(rackBody);
      for (let l = 0; l < 6; l++) {
        const blade = mesh(box(0.55, 0.08, 0.02), toon('#334155'), 0, 0.4 + l * 0.22, 0.28);
        rack.add(blade);
        const led1 = mesh(box(0.03, 0.03, 0.02), toon(l % 2 === 0 ? '#00f0ff' : '#a855f7'), -0.18, 0.4 + l * 0.22, 0.29);
        const led2 = mesh(box(0.03, 0.03, 0.02), toon('#10b981'), -0.12, 0.4 + l * 0.22, 0.29);
        rack.add(led1);
        rack.add(led2);
      }
      rack.position.set(xRight - 0.55, 0, zBack + 0.45);
      group.add(rack);
      site.colliders.push({ minX: xRight - 0.9, maxX: xRight - 0.2, minZ: zBack + 0.15, maxZ: zBack + 0.75, top: 1.8 });

    } else if (decorType === 'retail') {
      // 🎯 Santiago: Retail Demo Display Unit in back corner
      const stand = new THREE.Group();
      const base = mesh(box(1.4, 0.75, 0.45), toon('#064e3b'), 0, 0.375, 0);
      stand.add(base);
      const top = mesh(box(1.44, 0.04, 0.48), toon('#10b981'), 0, 0.77, 0);
      stand.add(top);
      const pos = mesh(box(0.25, 0.16, 0.28), toon('#00f0ff'), -0.3, 0.87, 0);
      stand.add(pos);
      const dataphone = mesh(box(0.12, 0.08, 0.18), toon('#f59e0b'), 0.2, 0.83, 0);
      stand.add(dataphone);
      stand.position.set(xRight - 0.8, 0, zBack - 0.4);
      group.add(stand);
      site.colliders.push({ minX: xRight - 1.55, maxX: xRight - 0.05, minZ: zBack - 0.65, maxZ: zBack - 0.15, top: 0.8 });
    }
  };

  // 1. 💼 Despacho Jhon (Administración & Finanzas) - Suite Noroccidente
  buildSuite({
    name: 'Jhon Aparicio',
    role: 'Dirección Administrativa & Finanzas',
    icon: '💼',
    accentColor: '#00E5FF',
    cx: -10.5,
    cz: -4.0,
    deskZ: -4.0,
    deskRotY: Math.PI,
    doorSide: 'south',
    decorType: 'admin',
  });

  // 2. ⚡ Despacho Miguel (Tecnología & Arquitectura IA) - Suite Norcentral
  buildSuite({
    name: 'Miguel Rodríguez',
    role: 'Dirección de Tecnología & Arquitectura IA',
    icon: '⚡',
    accentColor: '#C084FC',
    cx: -1.5,
    cz: -4.0,
    deskZ: -4.0,
    deskRotY: Math.PI,
    doorSide: 'south',
    decorType: 'tech',
  });

  // 3. 🎯 Despacho Santiago (Marketing & Operaciones Retail) - Suite Suroccidente
  buildSuite({
    name: 'Santiago Peraza',
    role: 'Dirección de Marketing & Operaciones Retail',
    icon: '🎯',
    accentColor: '#10B981',
    cx: -10.5,
    cz: 4.0,
    deskZ: 4.0,
    deskRotY: 0,
    doorSide: 'north',
    decorType: 'retail',
  });

  site.group.add(group);
  return {};
};
