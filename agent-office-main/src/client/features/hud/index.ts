/**
 * The HUD: a few buttons on the top bar, everything else in the ☰ menu (Tab), with H for the controls
 * and F to hang a picture; the project in the corner (click it for the floors); Settings, and your
 * character.
 */
import { ROOF } from '../../../shared/rooftop';
import type { Ctx } from '../../core/context';
import type { CoreState } from '../../core/ctx';
import { builtFloors } from '../../core/floors';
import type { Parts } from '../../core/parts';
import { waitingInOrder, waitingLabel } from '../../nextup';
import { saveSettings, store } from '../../state';
import { openAccounts } from '../../ui/accounts';
import { openBoard } from '../../ui/boards';
import { openCharacter } from '../../ui/character';
import { $ } from '../../ui/dom';
import { toggleFloorMenu } from '../../ui/floormenu';
import { openHelp } from '../../ui/hud';
import { mountHud } from '../../ui/menu';
import { openServices } from '../../ui/services';
import { openSettings, type SettingsPane } from '../../ui/settings';
import { needsSigningIn, openSignIns } from '../../ui/signins';
import { openTeam } from '../../ui/team';
import { openUpgrade } from '../../ui/upgrade';
import { openWhiteboard } from '../whiteboard/ui';
import { describeSky } from '../../world/sky';

export type HudParts = Pick<Parts, 'worlds' | 'place' | 'travel' | 'you' | 'actions' | 'waiting' | 'meeting' | 'bookshelf' | 'hanging' | 'talk' | 'notifier'>;

/** Listens for clicks on the HUD and the project, registers what the HUD follows (see mountHud), and binds Tab, H and F. */
export function installHud(ctx: Ctx, core: CoreState, parts: HudParts) {
  const { net, voice, settings, player, sound } = ctx;
  const { inOffice } = parts.worlds;
  const { travel, waiting, actions, hanging, talk } = parts;

  // Buttons must not keep focus, or Space (jump) would click them again.
  $('hud').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('button');
    if (btn) setTimeout(() => btn.blur(), 0);
  });
  // The project in the corner is the floor you're on; click it for the list of floors to go to.
  $('project').addEventListener('click', () => {
    if (!store.floor) return travel.showElevator();
    toggleFloorMenu($('project'), { go: travel.switchFloor, indoors: () => (!inOffice() && !core.upTop) || parts.place.indoors(), elevator: travel.showElevator, roof: inOffice() ? () => travel.ride(ROOF) : null });
  });

  // ---- The HUD: a few buttons on the top bar, everything else in the ☰ menu ----------------------------
  const waitingNow = () => waitingInOrder(store.workers.values());
  const noMedia = () => (window.isSecureContext ? undefined : 'Voz y pantalla compartida requieren HTTPS o localhost — usa un proxy TLS o túnel');
  const hud = mountHud(
    [
      { id: 'issues', icon: '📌', label: 'Tareas / Issues', section: 'Open', count: () => store.issues.items.filter((i) => i.state === 'OPEN').length, run: () => openBoard('issues', net, actions.boardActions()) },
      { id: 'pulls', icon: '🔀', label: 'Pull requests', section: 'Open', count: () => store.pulls.items.filter((p) => p.state === 'OPEN').length, run: () => openBoard('pulls', net, actions.boardActions()) },
      { id: 'queue', icon: '📋', label: 'Cola de tareas', section: 'Open', count: () => store.queue.tasks.filter((t) => t.status !== 'done').length, title: () => 'Tareas pendientes por asignar a un agente', run: waiting.showQueue },
      { id: 'services', icon: '🌐', label: 'Servicios', section: 'Open', count: () => store.services.items.length, title: () => 'Servidores web iniciados por los agentes', run: () => openServices() },
      { id: 'whiteboard', icon: '📝', label: 'Pizarrón digital', section: 'Open', title: () => 'Dibujar juntos en vivo', run: () => openWhiteboard(net) },
      // Up on the top bar while a meeting is on: what's being worked through in the meeting room.
      {
        id: 'meeting',
        icon: '🤝',
        label: 'Sala de juntas',
        section: 'Open',
        status: () => store.meeting.current?.status === 'running',
        chip: () => 'En reunión',
        title: () => 'Convocar reunión: los agentes resuelven preguntas o tareas en equipo',
        run: () => parts.meeting.showMeeting(),
      },
      { id: 'search', icon: '🔎', label: 'Buscar', section: 'Open', key: '/', title: () => 'Buscar en el chat y terminales', run: waiting.showSearch },
      // The office has its bookshelf for them; a map of its own may not.
      { id: 'docs', icon: '📚', label: 'Documentación', section: 'Open', shown: () => !inOffice(), title: () => 'Leer la documentación del proyecto', run: parts.bookshelf.showBookshelf },
      { id: 'elevator', icon: '🛗', label: () => (inOffice() ? 'Ascensor' : 'Pisos'), section: 'Open', count: () => store.floors.reduce((n, f) => n + (f.id === store.floor ? 0 : f.waiting), 0), title: () => (inOffice() ? 'Ir a otro proyecto / piso' : 'Ir a otro proyecto o agregar uno'), run: travel.showElevator },
      { id: 'roof', icon: '🍸', label: 'Terraza Bar', section: 'Open', shown: () => !core.upTop && inOffice() && builtFloors().length > 0, title: () => 'Subir en ascensor a la terraza: DJ, bar y vista panorámica', run: () => travel.ride(ROOF) },
      // In voice, V is push to talk, so leaving is only from here.
      { id: 'voice', icon: '🎙️', label: () => (voice.inVoice ? 'Salir de voz' : 'Unirse a voz'), section: 'Together', key: () => (voice.inVoice ? undefined : 'V'), on: () => voice.inVoice, blocked: noMedia, run: () => void talk.toggleVoice() },
      // While you're in voice, the top bar keeps the mute button handy. Muted is the usual with push to talk, so it doesn't stand out then.
      {
        id: 'mute',
        icon: () => (voice.muted ? '🔇' : '🎙️'),
        label: () => (voice.muted ? 'Activar voz' : 'Silenciar'),
        section: 'Together',
        key: 'M',
        shown: () => voice.inVoice,
        status: () => voice.inVoice,
        on: () => voice.inVoice,
        tone: () => (voice.muted && !settings.pushToTalk ? 'danger' : undefined),
        title: () => (voice.muted ? 'Silenciado: mantén V para hablar, o M para activar' : 'Silenciar (M) · mantén V para hablar'),
        run: () => voice.toggleMute(),
      },
      { id: 'share', icon: '🖥️', label: () => (voice.sharing ? 'Dejar de compartir' : 'Compartir pantalla'), section: 'Together', on: () => voice.sharing, status: () => voice.sharing, chip: () => 'Compartiendo', blocked: noMedia, run: () => void talk.toggleShare() },
      { id: 'decor', icon: '🖼️', label: () => (hanging.hanger.active ? 'Cancelar colgado' : 'Colgar un cuadro'), section: 'Together', key: 'F', shown: () => inOffice(), on: () => hanging.hanger.active, status: () => hanging.hanger.active, run: () => (hanging.hanger.active ? hanging.hanger.cancel() : hanging.startHanging()) },
      { id: 'team', icon: '👥', label: 'Invitar equipo', section: 'Together', shown: () => store.invites, run: () => openTeam(net) },
      { id: 'accounts', icon: '🔑', label: 'Cuentas', section: 'Together', shown: () => store.me.admin, title: () => 'Invitar personas, ver cuentas activas y permisos', run: () => openAccounts(net) },
      { id: 'signins', icon: '🔐', label: 'Tus accesos', section: 'Together', shown: () => !!store.me.account, tone: () => (needsSigningIn() ? 'danger' : undefined), status: needsSigningIn, chip: () => 'Conectar Claude', title: () => 'Plan Claude y cuenta GitHub configurada para tus agentes', run: () => openSignIns(net) },
      { id: 'settings', icon: '⚙️', label: 'Configuración', section: 'Office', run: showSettings },
      { id: 'help', icon: '❓', label: 'Controles', section: 'Office', key: 'H', run: openHelp },
      { id: 'lite', icon: '📱', label: 'Vista 2D Lite', section: 'Office', title: () => 'Agentes, terminales y tableros sin 3D: ideal para móvil o conexión lenta', run: () => location.assign('/lite') },
      {
        id: 'upgrade',
        icon: '⬆️',
        label: () => (store.upgrade.phase === 'building' ? 'Actualizando…' : store.upgrade.latest ? 'Actualizar oficina' : 'Actualizar versión'),
        section: 'Office',
        shown: () => store.upgrade.available,
        // A new version, or one being built, gets a place on the top bar until it's in.
        status: () => !!store.upgrade.latest || store.upgrade.phase === 'building',
        chip: () => (store.upgrade.phase === 'building' ? 'Actualizando…' : 'Actualizar'),
        tone: () => (store.upgrade.latest && store.upgrade.phase !== 'building' ? 'primary' : undefined),
        title: () => (store.upgrade.latest ? `Nueva versión: ${store.upgrade.latest.subject}` : 'Actualizar la oficina'),
        run: () => openUpgrade(net),
      },
      // Up on the top bar while workers wait on someone (N does the same), next to the Workers button.
      {
        id: 'waiting',
        icon: () => (waitingNow().some((w) => w.status === 'needs_input') ? '🙋' : '✅'),
        label: 'Siguiente agente',
        section: 'Open',
        key: 'N',
        shown: () => waitingNow().length > 0,
        status: () => waitingNow().length > 0,
        chip: () => waitingLabel(waitingNow()).replace(/^(🙋|✅) /, ''),
        on: () => waitingNow().every((w) => w.status === 'done'),
        tone: () => (waitingNow().some((w) => w.status === 'needs_input') ? 'danger' : undefined),
        title: () => 'Ir al siguiente agente que espera atención (N)',
        run: waiting.goToNextWaiting,
      },
    ],
    settings,
    () => saveSettings(settings),
  );
  ctx.keys.bind({
    code: 'Tab',
    preventDefault: true,
    run: () => {
      hud.toggleMenu();
    },
  });
  ctx.keys.bind({
    code: 'KeyH',
    run: () => {
      openHelp();
    },
  });
  ctx.keys.bind({
    code: 'KeyF',
    run: () => {
      hanging.startHanging();
    },
  });
  function showSettings(pane?: SettingsPane) {
    openSettings(
      net,
      settings,
      (s) => {
        // Switching to push to talk mutes you now; back to an open mic turns it on.
        const talkChanged = s.pushToTalk !== settings.pushToTalk;
        Object.assign(settings, s);
        saveSettings(settings);
        if (talkChanged) {
          voice.setMuted(settings.pushToTalk);
          hud.refresh();
        }
        player.setView(settings.view);
        sound.setVolume(settings.volume, settings.muted);
        sound.setMusicVolume(settings.music, settings.musicMuted);
      },
      editProfile,
      sound,
      parts.notifier,
      signOut,
      store.sky ? { now: describeSky(store.sky, store.officeNow()), live: !!store.sky.city } : undefined,
      pane,
    );
  }

  async function signOut() {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {});
    location.href = '/login';
  }

  function editProfile() {
    openCharacter(false, (p) => {
      parts.you.showMyProfile(p);
      net.send({ t: 'profile', name: p.name, color: p.color, look: p.look });
    });
  }

  return { hud, showSettings, editProfile };
}
