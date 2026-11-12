/**
 * The office TV: real-time interactive Smart TV featuring live Zenic Retail Cloud telemetry,
 * AI computer vision analytics, corporate broadcast, and WebRTC screen sharing.
 */
import * as THREE from 'three';
import type { Ctx } from '../../core/context';
import { hintTitle, key, onE } from '../../core/hint';
import { h, openModal, toast } from '../../ui/dom';

declare module '../../world/types' {
  interface InteractKinds {
    tv: true;
  }
}

export interface TvDeps {
  /** The screens shared on this floor, by who's sharing them (see features/voice). */
  shares(): [string, MediaStream][];
  /** Watches what's on the TV full screen, or shares your screen when nobody's sharing. */
  watch(): void;
  /** Toggles screen sharing directly (see features/voice). */
  toggleShare?(): Promise<void> | void;
}

export type TvChannel = 'dashboard' | 'vision' | 'corporate';

export function installTv(ctx: Ctx, deps: TvDeps) {
  // Video element for live WebRTC screen sharing
  const tvVideo = document.createElement('video');
  tvVideo.muted = true;
  tvVideo.playsInline = true;
  tvVideo.autoplay = true;
  const tvTexture = new THREE.VideoTexture(tvVideo);
  tvTexture.colorSpace = THREE.SRGBColorSpace;

  // High-resolution Canvas (1280x720) for interactive broadcast channels
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const g = canvas.getContext('2d')!;
  const tvCanvasTexture = new THREE.CanvasTexture(canvas);
  tvCanvasTexture.colorSpace = THREE.SRGBColorSpace;

  let currentChannel: TvChannel = 'dashboard';
  let tvStream: MediaStream | null = null;
  let animFrame = 0;

  function drawTvScreen() {
    animFrame++;
    g.clearRect(0, 0, 1280, 720);

    if (currentChannel === 'dashboard') {
      // 📊 Channel 1: Zenic Retail Cloud Telemetry
      const bg = g.createLinearGradient(0, 0, 1280, 720);
      bg.addColorStop(0, '#060d1a');
      bg.addColorStop(0.5, '#0b192c');
      bg.addColorStop(1, '#050a14');
      g.fillStyle = bg;
      g.fillRect(0, 0, 1280, 720);

      // Header bar
      g.fillStyle = 'rgba(15, 23, 42, 0.7)';
      g.fillRect(0, 0, 1280, 80);
      g.fillStyle = '#00F0FF';
      g.beginPath();
      g.arc(50, 40, 10 + Math.sin(animFrame * 0.08) * 2, 0, Math.PI * 2);
      g.fill();

      g.fillStyle = '#ffffff';
      g.font = '900 32px Nunito, system-ui, sans-serif';
      g.textAlign = 'left';
      g.fillText('ZENIC RETAIL CLOUD · TELEMETRÍA EN VIVO', 80, 48);

      const timeStr = new Date().toLocaleTimeString('es-CO');
      g.textAlign = 'right';
      g.font = '700 24px monospace';
      g.fillStyle = '#94A3B8';
      g.fillText(`BOGOTÁ: ${timeStr} · EN LÍNEA`, 1230, 48);

      // 4 Metric cards
      const cards = [
        { label: 'VENTAS POS HOY', val: '$54.890.200 COP', sub: '▲ +18.4% vs meta diaria', color: '#10B981' },
        { label: 'VISIÓN ARTIFICIAL IA', val: '1.942 Personas', sub: 'Afluencia alta en pasillos', color: '#8B5CF6' },
        { label: 'FACTURAS DIAN v2.1', val: '1.085 Emitidas', sub: '100% CUFE en tiempo real', color: '#06B6D4' },
        { label: 'NODOS EN LÍNEA', val: '24 / 24 Tiendas', sub: 'Latencia sync: 12ms', color: '#F59E0B' },
      ];

      cards.forEach((c, idx) => {
        const x = 50 + idx * 295;
        const y = 110;
        const w = 275;
        const h = 180;

        g.fillStyle = 'rgba(30, 41, 59, 0.6)';
        g.strokeStyle = c.color;
        g.lineWidth = 2;
        g.beginPath();
        g.roundRect(x, y, w, h, 14);
        g.fill();
        g.stroke();

        g.fillStyle = '#94A3B8';
        g.font = '700 16px Nunito, system-ui, sans-serif';
        g.textAlign = 'left';
        g.fillText(c.label, x + 20, y + 40);

        g.fillStyle = '#FFFFFF';
        g.font = '900 24px Nunito, system-ui, sans-serif';
        g.fillText(c.val, x + 20, y + 90);

        g.fillStyle = c.color;
        g.font = '700 15px Nunito, system-ui, sans-serif';
        g.fillText(c.sub, x + 20, y + 140);
      });

      // Chart area
      g.fillStyle = 'rgba(30, 41, 59, 0.4)';
      g.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      g.lineWidth = 1;
      g.beginPath();
      g.roundRect(50, 320, 750, 350, 16);
      g.fill();
      g.stroke();

      g.fillStyle = '#FFFFFF';
      g.font = '800 20px Nunito, system-ui, sans-serif';
      g.textAlign = 'left';
      g.fillText('📈 Curva de Transacciones por Hora (Puntos de Venta)', 80, 360);

      // Bars
      const hours = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];
      const heights = [90, 140, 230, 180, 210, 260, 240, 160];
      hours.forEach((hStr, i) => {
        const bx = 110 + i * 80;
        const bh = heights[i] + Math.sin(animFrame * 0.05 + i) * 6;
        const by = 620 - bh;

        const barGrad = g.createLinearGradient(0, by, 0, 620);
        barGrad.addColorStop(0, '#00F0FF');
        barGrad.addColorStop(1, '#6366F1');
        g.fillStyle = barGrad;
        g.beginPath();
        g.roundRect(bx, by, 45, bh, 6);
        g.fill();

        g.fillStyle = '#94A3B8';
        g.font = '600 15px Nunito';
        g.textAlign = 'center';
        g.fillText(hStr, bx + 22, 645);
      });

      // Activity Feed Box
      g.fillStyle = 'rgba(30, 41, 59, 0.4)';
      g.beginPath();
      g.roundRect(830, 320, 400, 350, 16);
      g.fill();
      g.stroke();

      g.fillStyle = '#FFFFFF';
      g.font = '800 20px Nunito, system-ui, sans-serif';
      g.textAlign = 'left';
      g.fillText('⚡ Feed de Operaciones en Vivo', 855, 360);

      const logs = [
        '● 12:35:10 - Venta $180,000 en Tienda Bogotá Centro',
        '● 12:34:52 - Factura Electrónica #4829 CUFE Validada',
        '● 12:34:18 - Conteo +6 clientes en Pasillo Tecnología',
        '● 12:33:40 - Nodo Medellín sincronizó 45 pedidos POS',
        '● 12:32:05 - Pasarela Wompi aprobó transacción $420,000',
        '● 12:31:12 - Alerta IA: Góndola Snacks con alta rotación',
      ];
      logs.forEach((log, idx) => {
        g.fillStyle = idx === 0 ? '#10B981' : '#CBD5E1';
        g.font = '600 15px monospace';
        g.fillText(log, 855, 410 + idx * 40);
      });

    } else if (currentChannel === 'vision') {
      // 👁️ Channel 2: Zenic Computer Vision
      g.fillStyle = '#050811';
      g.fillRect(0, 0, 1280, 720);

      // Radar circles
      const cx = 640;
      const cy = 360;
      g.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      g.lineWidth = 1.5;
      [80, 160, 240, 320].forEach((r) => {
        g.beginPath();
        g.arc(cx, cy, r, 0, Math.PI * 2);
        g.stroke();
      });

      // Sweeping radar line
      const angle = (animFrame * 0.03) % (Math.PI * 2);
      g.strokeStyle = '#00F0FF';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(angle) * 320, cy + Math.sin(angle) * 320);
      g.stroke();

      // Bounding boxes
      const boxes = [
        { x: 380, y: 220, w: 120, h: 200, label: 'Cliente #182 · Permanencia 3.2m', color: '#10B981' },
        { x: 740, y: 260, w: 110, h: 180, label: 'Cliente #183 · Caja Rápida POS', color: '#8B5CF6' },
        { x: 560, y: 410, w: 130, h: 190, label: 'Cliente #184 · Zona Gourmet', color: '#06B6D4' },
      ];
      boxes.forEach((b) => {
        g.strokeStyle = b.color;
        g.lineWidth = 2;
        g.strokeRect(b.x, b.y, b.w, b.h);
        g.fillStyle = b.color;
        g.fillRect(b.x, b.y - 25, b.w + 60, 22);
        g.fillStyle = '#FFFFFF';
        g.font = '700 13px Nunito';
        g.fillText(b.label, b.x + 6, b.y - 9);
      });

      g.fillStyle = '#FFFFFF';
      g.font = '900 30px Nunito';
      g.textAlign = 'center';
      g.fillText('ZENIC AI VISION · ANÁLISIS DE TRÁFICO Y COMPORTAMIENTO RETAIL', cx, 60);

    } else {
      // ✨ Channel 3: Corporate Zenic Lounge
      const bg = g.createRadialGradient(640, 360, 100, 640, 360, 700);
      bg.addColorStop(0, '#1e1b4b');
      bg.addColorStop(0.6, '#0f172a');
      bg.addColorStop(1, '#020617');
      g.fillStyle = bg;
      g.fillRect(0, 0, 1280, 720);

      g.fillStyle = '#FFFFFF';
      g.font = '900 68px Nunito, system-ui, sans-serif';
      g.textAlign = 'center';
      g.fillText('ZENIC S.A.S.', 640, 280);

      g.font = '700 28px Nunito, system-ui, sans-serif';
      g.fillStyle = '#00F0FF';
      g.fillText('METAVERSO CORPORATIVO RETAIL TECH · SALA EJECUTIVA', 640, 350);

      const now = new Date();
      g.font = '800 52px monospace';
      g.fillStyle = '#F8FAFC';
      g.fillText(now.toLocaleTimeString('es-CO'), 640, 460);

      g.font = '600 22px Nunito';
      g.fillStyle = '#94A3B8';
      g.fillText('Presiona [E] frente al TV para compartir pantalla o cambiar de canal', 640, 560);
    }

    tvCanvasTexture.needsUpdate = true;
  }

  // Draw initial frame
  drawTvScreen();

  const tvMat = ctx.office.tvScreen.material as THREE.MeshBasicMaterial;
  tvMat.color.set('#ffffff');
  tvMat.map = tvCanvasTexture;
  tvMat.toneMapped = false;

  // Keep canvas channels actively animating
  let tickCounter = 0;
  ctx.ticks.add('world', () => {
    tickCounter++;
    if (!tvStream && tickCounter % 6 === 0) {
      drawTvScreen();
    }
  });

  function show(stream: MediaStream | null) {
    if (stream !== tvStream) {
      tvStream = stream;
      tvVideo.srcObject = stream;
      if (stream) void tvVideo.play().catch(() => {});
      tvMat.map = stream ? tvTexture : tvCanvasTexture;
      tvMat.needsUpdate = true;
    }
  }

  function setChannel(ch: TvChannel) {
    currentChannel = ch;
    drawTvScreen();
    if (!tvStream) {
      tvMat.map = tvCanvasTexture;
      tvMat.needsUpdate = true;
    }
    toast(`📺 TV cambiado a: ${ch === 'dashboard' ? 'Telemetría Retail Cloud' : ch === 'vision' ? 'Visión Artificial IA' : 'Canal Corporativo Zenic'}`, 'info');
  }

  /** Opens the interactive TV Control Center Modal */
  function openTvControl() {
    const shares = deps.shares();
    const isSharing = shares.length > 0;

    const closeBtn = h('button.btn.close', { 'aria-label': 'Close' }, '✕');

    const statusBadge = h(
      'div',
      {
        style:
          'display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:700;' +
          (isSharing ? 'background:rgba(16,185,129,0.2);color:#10B981;' : 'background:rgba(0,240,255,0.15);color:#00F0FF;'),
      },
      h('span', { style: 'width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block;' }),
      isSharing ? 'Transmisión en Vivo Activa (Screen Share)' : `Transmitiendo: Canal ${currentChannel.toUpperCase()}`,
    );

    const channelButtons = [
      { id: 'dashboard', label: '📊 Telemetría Retail Cloud', desc: 'KPIs de ventas POS, facturación DIAN y tiendas en vivo' },
      { id: 'vision', label: '👁️ Analítica de Visión IA', desc: 'Detección peatonal, afluencia y mapa térmico en góndolas' },
      { id: 'corporate', label: '✨ Canal Corporativo Zenic', desc: 'Presentación oficial de la marca y reloj de sala' },
    ].map((ch) => {
      const active = currentChannel === ch.id && !isSharing;
      const btn = h(
        'button',
        {
          class: active ? 'btn primary' : 'btn',
          style: 'display:flex;flex-direction:column;align-items:flex-start;text-align:left;padding:12px 16px;width:100%;margin-bottom:8px;border-radius:10px;cursor:pointer;',
          onclick: () => {
            setChannel(ch.id as TvChannel);
            modal.close();
          },
        },
        h('span', { style: 'font-weight:800;font-size:15px;' }, ch.label),
        h('span', { style: 'font-size:12px;opacity:0.75;margin-top:2px;' }, ch.desc),
      );
      return btn;
    });

    const screenShareSection = h(
      'div',
      { style: 'margin-top:16px;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);' },
      h('h3', { style: 'font-size:16px;font-weight:800;margin:0 0 8px 0;' }, '📡 Compartir mi Pantalla en la Sala'),
      h('p', { style: 'font-size:13px;color:#94a3b8;margin:0 0 14px 0;' }, 'Proyecta tu ventana, navegador o escritorio directamente en la pantalla de la oficina 3D.'),
      h(
        'div',
        { style: 'display:flex;gap:10px;flex-wrap:wrap;' },
        h(
          'button.btn.primary',
          {
            type: 'button',
            style: 'padding:10px 18px;font-weight:700;',
            onclick: () => {
              modal.close();
              deps.watch();
            },
          },
          isSharing ? '🔍 Ver Pantalla Completa' : '🖥️ Iniciar Transmisión de Pantalla',
        ),
      ),
    );

    const el = h(
      'div.modal',
      { role: 'dialog', 'aria-label': 'Control del Smart TV', style: 'max-width:540px;width:90vw;padding:24px;background:#0d1117;color:#f8fafc;border-radius:16px;border:1px solid rgba(255,255,255,0.1);' },
      h(
        'header',
        { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;' },
        h('div', {}, h('h2', { style: 'margin:0;font-size:20px;font-weight:900;' }, '📺 Smart TV Lounge · Zenic'), statusBadge),
        closeBtn,
      ),
      h(
        'div',
        { style: 'margin-top:12px;' },
        h('label', { style: 'display:block;font-size:13px;font-weight:700;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;' }, 'Canales Interactivos de la Oficina:'),
        ...channelButtons,
        screenShareSection,
      ),
    );

    const modal = openModal(el, { doing: '📺 controlando el Smart TV Zenic' });
    closeBtn.addEventListener('click', () => modal.close());
  }

  ctx.interactions.define('tv', {
    reach: 10,
    hint: () => {
      const any = deps.shares().length > 0;
      return {
        k: `${any}|${currentChannel}`,
        parts: [
          hintTitle('📺 TV de la Sala Zenic'),
          key('E', any ? 'Ver transmisión en pantalla completa' : 'Abrir control del TV / Proyectar'),
        ],
      };
    },
    use: onE(() => openTvControl()),
  });

  return { show, setChannel, openTvControl };
}
