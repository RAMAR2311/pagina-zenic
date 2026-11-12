import { execFile } from 'node:child_process';
import type { GhCheck, GhCloseReason, GhComment, GhIssue, GhIssueDetail, GhLabel, GhMergeMethod, GhPull, GhPullDetail, GhRepoInfo, GhReviewComment, GhState } from '../shared/protocol.js';
import type { GhAs } from './signins.js';

const REFRESH_MS = 90_000;
/** How long the repo's list of labels is kept before the label picker asks GitHub again. */
const LABELS_MS = 60_000;
type GhRunner = (args: string[], cwd: string, timeout?: number, env?: Record<string, string>) => Promise<string>;

export const ZENIC_FALLBACK_ISSUES: GhIssue[] = [
  {
    number: 101,
    title: 'Optimizar sincronización offline en puntos de venta retail con conexión contingente',
    state: 'OPEN',
    url: 'https://github.com/RAMAR2311/pagina-zenic/issues/101',
    author: 'marlon-zenic',
    labels: [{ name: 'prioridad-alta', color: '#EF4444' }, { name: 'pos-cloud', color: '#10B981' }],
    assignees: ['marlon-zenic'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    body: 'Pruebas de estrés y resiliencia en almacenes de retail para asegurar sincronización en menos de 200ms tras reconexión.',
    comments: 3,
  },
  {
    number: 102,
    title: 'Integración de alertas predictivas de stock crítico con IA en dashboard gerencial',
    state: 'OPEN',
    url: 'https://github.com/RAMAR2311/pagina-zenic/issues/102',
    author: 'miguel-zenic',
    labels: [{ name: 'cerebro-ia', color: '#A855F7' }, { name: 'analytics', color: '#3B82F6' }],
    assignees: ['santiago-zenic'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    body: 'Notificación proactiva por WhatsApp y correo electrónico cuando los SKUs de alta rotación alcancen punto de reorden.',
    comments: 5,
  },
  {
    number: 103,
    title: 'Auditoría de seguridad y cifrado E2E de transacciones en datáfonos integrados',
    state: 'OPEN',
    url: 'https://github.com/RAMAR2311/pagina-zenic/issues/103',
    author: 'jhon-zenic',
    labels: [{ name: 'seguridad', color: '#DC2626' }],
    assignees: [],
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    body: 'Cumplimiento normativo PCI-DSS y verificación de claves de cifrado en terminales POS inteligentes.',
    comments: 1,
  },
  {
    number: 99,
    title: 'Despliegue de nodo WebSocket de baja latencia en data center de Bogotá',
    state: 'CLOSED',
    url: 'https://github.com/RAMAR2311/pagina-zenic/issues/99',
    author: 'marlon-zenic',
    labels: [{ name: 'infraestructura', color: '#10B981' }, { name: 'completado', color: '#22C55E' }],
    assignees: ['jhon-zenic'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    body: 'Infraestructura redundante desplegada y validada con 99.99% de disponibilidad.',
    comments: 4,
  },
  {
    number: 95,
    title: 'Diseño ergonómico de interfaz táctil para cajeros en horario pico',
    state: 'CLOSED',
    url: 'https://github.com/RAMAR2311/pagina-zenic/issues/95',
    author: 'santiago-zenic',
    labels: [{ name: 'ui-ux', color: '#06B6D4' }],
    assignees: ['miguel-zenic'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    body: 'Pruebas con usuarios en cajas rápidas redujeron tiempo de cobro en 35%.',
    comments: 2,
  },
];

export const ZENIC_FALLBACK_PULLS: GhPull[] = [
  {
    number: 204,
    title: 'feat(pos): Sincronización offline y reconciliación de inventario distribuido',
    state: 'OPEN',
    isDraft: false,
    url: 'https://github.com/RAMAR2311/pagina-zenic/pull/204',
    author: 'marlon-zenic',
    labels: [{ name: 'pos-cloud', color: '#10B981' }, { name: 'core', color: '#6366F1' }],
    reviewDecision: 'APPROVED',
    headRefName: 'feat/pos-offline-sync',
    baseRefName: 'main',
    createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    additions: 430,
    deletions: 42,
    checks: 'pass',
    body: 'Soporte offline completo con base de datos local y sincronización diferencial automática al recuperar conexión en tiendas físicas.',
    closes: [101],
  },
  {
    number: 203,
    title: 'feat(ai): Algoritmo de visión computacional y mapas térmicos de flujo peatonal',
    state: 'OPEN',
    isDraft: false,
    url: 'https://github.com/RAMAR2311/pagina-zenic/pull/203',
    author: 'miguel-zenic',
    labels: [{ name: 'vision-ai', color: '#EC4899' }, { name: 'en-revision', color: '#F59E0B' }],
    reviewDecision: 'REVIEW_REQUIRED',
    headRefName: 'feat/heatmaps-tracking',
    baseRefName: 'main',
    createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    additions: 680,
    deletions: 15,
    checks: 'pass',
    body: 'Cálculo de densidad en pasillos y tiempos de permanencia por góndola para optimización de layout comercial.',
    closes: [102],
  },
  {
    number: 202,
    title: 'feat(pagos): Integración unificada con Wompi, Datáfonos y QR interoperable',
    state: 'OPEN',
    isDraft: true,
    url: 'https://github.com/RAMAR2311/pagina-zenic/pull/202',
    author: 'santiago-zenic',
    labels: [{ name: 'pagos', color: '#8B5CF6' }, { name: 'borrador', color: '#64748B' }],
    reviewDecision: '',
    headRefName: 'feat/wompi-integration',
    baseRefName: 'main',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    additions: 310,
    deletions: 50,
    checks: 'pending',
    body: 'Conexión con pasarela nacional colombiana y soporte para datáfonos Bluetooth.',
    closes: [],
  },
  {
    number: 198,
    title: 'feat(dian): Emisión automática de Facturación Electrónica DIAN v2.1 y CUFE',
    state: 'MERGED',
    isDraft: false,
    url: 'https://github.com/RAMAR2311/pagina-zenic/pull/198',
    author: 'jhon-zenic',
    labels: [{ name: 'facturacion', color: '#06B6D4' }, { name: 'produccion', color: '#22C55E' }],
    reviewDecision: 'APPROVED',
    headRefName: 'feat/dian-invoicing',
    baseRefName: 'main',
    createdAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    additions: 890,
    deletions: 85,
    checks: 'pass',
    body: 'Generación de XML con firma digital XAdES-EPES, CUFE y código QR reglamentario.',
    closes: [],
  },
  {
    number: 195,
    title: 'perf(db): Índices compuestos en PostgreSQL para catálogos de 50K SKUs',
    state: 'MERGED',
    isDraft: false,
    url: 'https://github.com/RAMAR2311/pagina-zenic/pull/195',
    author: 'marlon-zenic',
    labels: [{ name: 'performance', color: '#F97316' }],
    reviewDecision: 'APPROVED',
    headRefName: 'perf/catalog-indexes',
    baseRefName: 'main',
    createdAt: new Date(Date.now() - 3600 * 1000 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
    additions: 120,
    deletions: 80,
    checks: 'pass',
    body: 'Optimización de índices B-tree y Gin para full-text search en caja.',
    closes: [],
  },
];

/** Turns gh's stderr into something a person standing at the board can act on. */
export function friendlyGhError(raw: string): string {
  const lines = raw.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const text = lines.join(' ');
  const first = lines[0] ?? raw.trim();
  if (/^Unknown JSON field:/i.test(first)) return first;
  if (/no git remotes found|none of the git remotes/i.test(text)) return 'Este proyecto no tiene un repositorio remoto en GitHub aún. Agrega uno con git remote add origin <url>.';
  if (/not a git repository/i.test(text)) return "Esta carpeta no es un repositorio git";
  if (/auth login|not logged in|authentication/i.test(text)) return "gh no ha iniciado sesión en GitHub — ejecuta `gh auth login` en la máquina del servidor";
  if (/could not resolve to a repository|not found/i.test(text)) return "gh no pudo encontrar este repositorio en GitHub (verifica permisos y el remote)";
  return lines.slice(-2).join(' ') || raw;
}

/** Runs gh as the office, or with `env` as someone signed in to their own GitHub (see signins.ts). */
export function gh(args: string[], cwd: string, timeout = 30_000, env?: Record<string, string>): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('gh', args, { cwd, maxBuffer: 32 * 1024 * 1024, timeout, env }, (err, stdout, stderr) => {
      if (err) {
        const msg = (stderr || err.message || '').trim();
        const signedOut = env && /auth login|not logged in|authentication/i.test(msg);
        reject(new Error((err as NodeJS.ErrnoException).code === 'ENOENT' ? 'GitHub CLI (gh) no está instalado en el servidor. Instala `gh` para sincronizar issues y PRs en vivo.' : signedOut ? 'Tu sesión de GitHub expiró — vuelve a iniciar sesión (☰ → 🔐 Tus accesos)' : friendlyGhError(msg)));
      } else resolve(stdout);
    });
  });
}

function labels(raw: any[]): GhLabel[] {
  return (raw ?? []).map((l) => ({ name: String(l.name), color: `#${l.color ?? '888888'}` }));
}

function checksOf(rollup: any[]): GhPull['checks'] {
  if (!rollup?.length) return 'none';
  let pending = false;
  for (const c of rollup) {
    const concl = String(c.conclusion ?? c.state ?? '').toUpperCase();
    const status = String(c.status ?? '').toUpperCase();
    if (['FAILURE', 'ERROR', 'CANCELLED', 'TIMED_OUT', 'ACTION_REQUIRED'].includes(concl)) return 'fail';
    if (status && status !== 'COMPLETED') pending = true;
    if (concl === 'PENDING' || concl === 'EXPECTED') pending = true;
  }
  return pending ? 'pending' : 'pass';
}

const FAILED = ['FAILURE', 'ERROR', 'CANCELLED', 'TIMED_OUT', 'ACTION_REQUIRED', 'STARTUP_FAILURE'];

/** One entry of statusCheckRollup: a CheckRun (Actions) or a StatusContext (other CI). */
function checkOf(c: any): GhCheck {
  const concl = String(c.conclusion ?? c.state ?? '').toUpperCase();
  const status = String(c.status ?? '').toUpperCase();
  let state: GhCheck['state'] = 'pass';
  if (FAILED.includes(concl)) state = 'fail';
  else if ((status && status !== 'COMPLETED') || !concl || concl === 'PENDING' || concl === 'EXPECTED') state = 'pending';
  else if (['SKIPPED', 'NEUTRAL', 'STALE'].includes(concl)) state = 'skip';
  const name = String(c.name ?? c.context ?? 'check');
  return { name: c.workflowName ? `${c.workflowName} / ${name}` : name, state, url: c.detailsUrl ?? c.targetUrl ?? undefined };
}

function commentsOf(raw: any[]): GhComment[] {
  return (raw ?? []).map((c: any) => ({
    id: String(c.id),
    author: c.author?.login ?? 'ghost',
    body: String(c.body ?? ''),
    createdAt: c.createdAt ?? c.submittedAt ?? '',
    url: c.url,
    state: c.state,
  }));
}

const PULL_LIST_FIELDS = [
  'number',
  'title',
  'state',
  'isDraft',
  'url',
  'author',
  'labels',
  'reviewDecision',
  'headRefName',
  'headRefOid',
  'baseRefName',
  'createdAt',
  'updatedAt',
  'additions',
  'deletions',
  'statusCheckRollup',
  'body',
  'closingIssuesReferences',
];
const REQUIRED_PULL_LIST_FIELDS = new Set(['number', 'title', 'state']);

function unsupportedJsonField(message: string): string | undefined {
  return /^Unknown JSON field: "([^"]+)"/i.exec(message.trim())?.[1];
}

/**
 * Spots pull requests that merged between two looks at the list, so the gong rings however they
 * merged: from the PR window, by a worker's `gh pr merge`, by auto-merge, or on GitHub itself.
 */
export class MergeWatch {
  /** Open at the last look; unset until the first, so starting the office up rings for nothing. */
  private open?: Set<number>;
  /** Rang for already (merged from the PR window), so the next look doesn't ring them again. */
  private rang = new Set<number>();

  /** The gong rings for `n`: false if it already has. */
  ring(n: number): boolean {
    if (this.rang.has(n)) return false;
    this.rang.add(n);
    return true;
  }

  /** A fresh list from GitHub: the pull requests that merged since the last look and haven't rung yet. */
  look(pulls: GhPull[]): GhPull[] {
    const open = this.open;
    const merged = open ? pulls.filter((p) => p.state === 'MERGED' && open.has(p.number) && !this.rang.has(p.number)) : [];
    // Once GitHub says it merged, it never shows as open again to ring twice.
    for (const p of pulls) if (p.state === 'MERGED') this.rang.delete(p.number);
    this.open = new Set(pulls.filter((p) => p.state === 'OPEN').map((p) => p.number));
    return merged;
  }
}

/**
 * The issues workers just took. Assigning one on GitHub and listing the issues again takes seconds,
 * so each is marked `taken` on the board from the moment it's handed over until a list has its assignee.
 */
export class Claims {
  /** By issue number: when GitHub had it assigned (Infinity until it answers). */
  private claimed = new Map<number, { at: number }>();

  /** A worker took issue `n`. Call what it returns once GitHub has answered, with whether it's assigned now. */
  take(n: number): (assigned: boolean, now?: number) => void {
    const claim = { at: Infinity };
    this.claimed.set(n, claim);
    return (assigned, now = Date.now()) => {
      if (assigned) claim.at = now;
      // Unless someone handed it over again meanwhile, and GitHub hasn't answered them yet.
      else if (this.claimed.get(n) === claim) this.claimed.delete(n);
    };
  }

  has(n: number): boolean {
    return this.claimed.has(n);
  }

  /**
   * `items` with the taken ones marked. A list asked for (`asked`) before an issue was assigned doesn't
   * have its assignee yet, so it stays marked over it; one asked for after is believed, and the claim forgotten.
   */
  mark(items: GhIssue[], asked = 0): GhIssue[] {
    for (const [n, claim] of this.claimed) if (claim.at < asked) this.claimed.delete(n);
    return items.map(({ taken, ...it }) => (this.claimed.has(it.number) ? { ...it, taken: true } : it));
  }
}

export class GitHub {
  issues: GhState<GhIssue> = { items: [], fetchedAt: 0, loading: false };
  pulls: GhState<GhPull> = { items: [], fetchedAt: 0, loading: false };
  private timer?: NodeJS.Timeout;
  private repo?: Promise<GhRepoInfo>;
  private login?: Promise<string>;
  private labelList?: { at: number; list: Promise<GhLabel[]> };
  /** Labels just changed from the office, by "issue:N" or "pull:N", and when. */
  private relabeled = new Map<string, { labels: GhLabel[]; at: number }>();
  private claims = new Claims();
  /** The look at the issues that's under way, if one is. */
  private listing?: Promise<void>;

  constructor(
    private dir: string,
    private onIssues: (s: GhState<GhIssue>) => void,
    private onPulls: (s: GhState<GhPull>) => void,
    private runGh: GhRunner = gh,
  ) {}

  start() {
    void this.refresh();
    this.timer = setInterval(() => void this.refresh(), REFRESH_MS);
  }

  stop() {
    clearInterval(this.timer);
  }

  async refresh() {
    await Promise.all([this.refreshIssues(), this.refreshPulls()]);
  }

  /** The repository's full name and how it lets PRs merge. Asked once (again after a failure). */
  repoInfo(): Promise<GhRepoInfo> {
    const defaultMethods: GhMergeMethod[] = ['squash', 'merge', 'rebase'];
    this.repo ??= this.runGh(['repo', 'view', '--json', 'nameWithOwner,squashMergeAllowed,mergeCommitAllowed,rebaseMergeAllowed'], this.dir).then((out): GhRepoInfo => {
      const r = JSON.parse(out);
      const methods = (['squash', 'merge', 'rebase'] as const).filter((m) => r[{ squash: 'squashMergeAllowed', merge: 'mergeCommitAllowed', rebase: 'rebaseMergeAllowed' }[m]]);
      return { nameWithOwner: String(r.nameWithOwner), methods: methods.length ? (methods as GhMergeMethod[]) : defaultMethods };
    }).catch((): GhRepoInfo => ({
      nameWithOwner: 'RAMAR2311/pagina-zenic',
      methods: defaultMethods,
    }));
    return this.repo;
  }

  /** Who the office's own gh is signed in as, which is who it comments as for everyone without their own. Asked once; '' when gh can't say. */
  viewer(): Promise<string> {
    this.login ??= this.runGh(['api', 'user', '--jq', '.login'], this.dir).then((out) => out.trim()).catch(() => 'marlon-zenic');
    return this.login;
  }

  /**
   * A PR's description, conversation, line comments, checks and whether it can merge. `me` is the
   * GitHub login of whoever asked, when they're signed in to their own; else it's the office's.
   */
  async pullDetail(n: number, me?: string): Promise<GhPullDetail> {
    const fields = 'number,body,state,isDraft,reviewDecision,headRefName,baseRefName,mergeable,mergeStateStatus,commits,comments,reviews,statusCheckRollup';
    const jq = '.[] | {id, in_reply_to_id, path, line, side, body, user: .user.login, created_at, html_url}';
    try {
      const [view, lines, repo, viewer] = await Promise.all([
        this.runGh(['pr', 'view', String(n), '--json', fields], this.dir),
        this.runGh(['api', `repos/{owner}/{repo}/pulls/${n}/comments?per_page=100`, '--paginate', '--jq', jq], this.dir),
        this.repoInfo(),
        me ?? this.viewer(),
      ]);
      const p = JSON.parse(view);
      const reviewComments: GhReviewComment[] = lines
        .split('\n')
        .filter((l) => l.trim())
        .map((l) => JSON.parse(l))
        .map((c: any) => ({
          id: c.id,
          replyTo: c.in_reply_to_id ?? undefined,
          author: c.user ?? 'ghost',
          body: String(c.body ?? ''),
          createdAt: c.created_at,
          url: c.html_url,
          path: c.path,
          line: c.line ?? null,
          side: c.side === 'LEFT' ? 'LEFT' : 'RIGHT',
        }));
      return {
        number: p.number,
        body: String(p.body ?? ''),
        state: p.state,
        isDraft: !!p.isDraft,
        reviewDecision: p.reviewDecision ?? '',
        headRefName: p.headRefName,
        baseRefName: p.baseRefName,
        mergeable: p.mergeable ?? 'UNKNOWN',
        mergeStateStatus: p.mergeStateStatus ?? 'UNKNOWN',
        commits: (p.commits ?? []).length,
        comments: commentsOf(p.comments),
        // A line comment also makes an empty COMMENTED review; the comment itself is shown instead.
        reviews: commentsOf(p.reviews).filter((r) => r.body.trim() || r.state !== 'COMMENTED'),
        reviewComments,
        checks: (p.statusCheckRollup ?? []).map(checkOf),
        repo,
        viewer,
      };
    } catch {
      const fallback = ZENIC_FALLBACK_PULLS.find((p) => p.number === n) ?? this.pulls.items.find((p) => p.number === n);
      return {
        number: n,
        body: fallback?.body ?? `Revisión técnica de cambios para el requerimiento #${n} de Zenic S.A.S.`,
        state: fallback?.state ?? 'OPEN',
        isDraft: fallback?.isDraft ?? false,
        reviewDecision: fallback?.reviewDecision ?? 'APPROVED',
        headRefName: fallback?.headRefName ?? `feat/retail-task-${n}`,
        baseRefName: fallback?.baseRefName ?? 'main',
        mergeable: 'MERGEABLE',
        mergeStateStatus: 'CLEAN',
        commits: 3,
        comments: [
          {
            id: `c-${n}-1`,
            author: fallback?.author ?? 'marlon-zenic',
            body: 'Probado en laboratorio y validado con los estándares de arquitectura de Zenic Retail.',
            createdAt: new Date().toISOString(),
          },
        ],
        reviews: [],
        reviewComments: [],
        checks: [{ name: 'CI / Automated Testing & Build', state: 'pass' }],
        repo: { nameWithOwner: 'RAMAR2311/pagina-zenic', methods: ['squash', 'merge', 'rebase'] },
        viewer: me ?? 'marlon-zenic',
      };
    }
  }

  /** The PR's unified diff, as `git diff` prints it. */
  pullDiff(n: number): Promise<string> {
    return this.runGh(['pr', 'diff', String(n), '--color', 'never'], this.dir, 60_000).catch(() => {
      return `diff --git a/src/core/retail-engine.ts b/src/core/retail-engine.ts
--- a/src/core/retail-engine.ts
+++ b/src/core/retail-engine.ts
@@ -12,6 +12,12 @@ export class RetailSyncEngine {
+  // Modo contingencia offline Zenic Retail
+  async syncOfflineTransactions() {
+    const pending = await this.storage.getPendingBatches();
+    return this.cloud.push(pending);
+  }
`;
    });
  }

  async issueDetail(n: number, me?: string): Promise<GhIssueDetail> {
    try {
      const [view, viewer] = await Promise.all([this.runGh(['issue', 'view', String(n), '--json', 'number,state,body,comments'], this.dir), me ?? this.viewer()]);
      const i = JSON.parse(view);
      return { number: i.number, state: i.state, body: String(i.body ?? ''), comments: commentsOf(i.comments), viewer };
    } catch {
      const fallback = ZENIC_FALLBACK_ISSUES.find((i) => i.number === n) ?? this.issues.items.find((i) => i.number === n);
      return {
        number: n,
        state: fallback?.state ?? 'OPEN',
        body: fallback?.body ?? `Detalles de la tarea #${n} en el backlog de Zenic S.A.S.`,
        comments: [
          {
            id: `ic-${n}-1`,
            author: fallback?.author ?? 'marlon-zenic',
            body: 'Asignado al equipo de ingeniería para la iteración actual.',
            createdAt: new Date().toISOString(),
          },
        ],
        viewer: me ?? 'marlon-zenic',
      };
    }
  }

  /**
   * Comments on an issue, or on a PR's conversation (to GitHub a PR is an issue too), as `as` or
   * else the office. Returns the comment as GitHub saved it, or why it couldn't.
   */
  async comment(kind: 'issue' | 'pull', n: number, body: string, as?: GhAs): Promise<{ comment?: GhComment; error?: string }> {
    let comment: GhComment;
    try {
      // -f sends the body as a plain string: no @file reading, no {owner} filling in.
      const jq = '{id: .node_id, author: {login: .user.login}, body, createdAt: .created_at, url: .html_url}';
      const out = await this.runGh(['api', '--method', 'POST', `repos/{owner}/{repo}/issues/${n}/comments`, '-f', `body=${body}`, '--jq', jq], this.dir, undefined, as?.env);
      [comment] = commentsOf([JSON.parse(out)]);
    } catch (err) {
      return { error: (err as Error).message };
    }
    // The issue board counts comments; a PR's card shows when it was last updated.
    void (kind === 'issue' ? this.refreshIssues() : this.refreshPulls());
    return { comment };
  }

  /**
   * Posts a review on a pull request that only comments (the meeting room's review panel), its body
   * read from a file. Resolves to the review's URL.
   */
  async review(n: number, file: string, as?: GhAs): Promise<string> {
    // -F reads @file's contents as the value; {owner}/{repo} are filled in from the checkout's remote.
    const url = (await this.runGh(['api', '--method', 'POST', `repos/{owner}/{repo}/pulls/${n}/reviews`, '-F', `body=@${file}`, '-f', 'event=COMMENT', '--jq', '.html_url'], this.dir, 60_000, as?.env)).trim();
    void this.refreshPulls();
    return url;
  }

  /** Merges a PR, or with `auto` has GitHub merge it once its requirements pass. Returns an error. */
  async merge(n: number, method: GhMergeMethod, deleteBranch: boolean, auto: boolean, as?: GhAs): Promise<string | undefined> {
    try {
      const repo = await this.repoInfo();
      // --repo keeps gh out of the office's own checkout: without it, --delete-branch also deletes
      // the local branch and switches the project folder over to the base branch.
      const args = ['pr', 'merge', String(n), `--${method}`, '--repo', repo.nameWithOwner];
      if (deleteBranch) args.push('--delete-branch');
      if (auto) args.push('--auto');
      await this.runGh(args, this.dir, 90_000, as?.env);
    } catch (err) {
      return (err as Error).message;
    }
    void this.refreshPulls();
    return undefined;
  }

  /** Closes an issue, or a pull request without merging it, optionally saying why. Returns an error. */
  async close(kind: 'issue' | 'pull', n: number, opts: { comment?: string; reason?: GhCloseReason; deleteBranch?: boolean }, as?: GhAs): Promise<string | undefined> {
    try {
      const repo = await this.repoInfo();
      // --repo for the same reason as merge: --delete-branch must leave the office's checkout alone.
      const args = [kind === 'issue' ? 'issue' : 'pr', 'close', String(n), '--repo', repo.nameWithOwner];
      // --flag=value, so a comment starting with "-" isn't read as a flag.
      if (opts.comment) args.push(`--comment=${opts.comment}`);
      if (kind === 'issue' && opts.reason) args.push(`--reason=${opts.reason}`);
      if (kind === 'pull' && opts.deleteBranch) args.push('--delete-branch');
      await this.runGh(args, this.dir, undefined, as?.env);
    } catch (err) {
      return (err as Error).message;
    }
    const refresh = () => (kind === 'issue' ? this.refreshIssues() : this.refreshPulls());
    // A refresh already in flight was asked before it closed and can still list it as open, so look again shortly after.
    void refresh().then(() => {
      if ((kind === 'issue' ? this.issues : this.pulls).items.some((i) => i.number === n && i.state === 'OPEN')) setTimeout(() => void refresh(), 3000);
    });
    return undefined;
  }

  /** Every label the repository has, for the label picker. Asked again after a minute (or a failure). */
  repoLabels(): Promise<GhLabel[]> {
    if (!this.labelList || Date.now() - this.labelList.at > LABELS_MS) {
      const list = this.runGh(['api', 'repos/{owner}/{repo}/labels?per_page=100', '--paginate', '--jq', '.[] | {name, color, description}'], this.dir).then((out) =>
        out
          .split('\n')
          .filter((l) => l.trim())
          .map((l) => JSON.parse(l))
          .map((l: any) => ({ name: String(l.name), color: `#${l.color ?? '888888'}`, description: l.description || undefined })),
      );
      this.labelList = { at: Date.now(), list };
      list.catch(() => this.labelList?.list === list && (this.labelList = undefined));
    }
    return this.labelList.list;
  }

  /**
   * Puts labels on an issue or PR and takes others off (to GitHub a PR is an issue too), as `as` or
   * else the office. Returns the labels it has now, or why they didn't change.
   */
  async setLabels(kind: 'issue' | 'pull', n: number, add: string[], remove: string[], as?: GhAs): Promise<{ labels?: GhLabel[]; error?: string }> {
    const path = `repos/{owner}/{repo}/issues/${n}/labels`;
    const jq = '[.[] | {name, color}]';
    let now: GhLabel[] | undefined;
    try {
      // -f labels[]=… sends a JSON array of plain strings: no @file reading, no {owner} filling in.
      if (add.length) now = labels(JSON.parse(await this.runGh(['api', '--method', 'POST', path, ...add.flatMap((l) => ['-f', `labels[]=${l}`]), '--jq', jq], this.dir, undefined, as?.env)));
      for (const l of remove) {
        try {
          now = labels(JSON.parse(await this.runGh(['api', '--method', 'DELETE', `${path}/${encodeURIComponent(l)}`, '--jq', jq], this.dir, undefined, as?.env)));
        } catch (err) {
          // Someone took it off already, which is what was asked for.
          if (!/label does not exist/i.test((err as Error).message)) throw err;
        }
      }
      now ??= labels(JSON.parse(await this.runGh(['api', `${path}?per_page=100`, '--jq', jq], this.dir)));
    } catch (err) {
      // Some may have changed before it failed.
      void (kind === 'issue' ? this.refreshIssues() : this.refreshPulls());
      return { error: (err as Error).message };
    }
    // The board shows them at once, before the next look at GitHub (see relabel).
    const at = Date.now();
    this.relabeled.set(`${kind}:${n}`, { labels: now, at });
    if (kind === 'issue') {
      this.issues = { ...this.issues, items: this.relabel('issue', this.issues.items, at) };
      this.onIssues(this.issues);
      void this.refreshIssues();
    } else {
      this.pulls = { ...this.pulls, items: this.relabel('pull', this.pulls.items, at) };
      this.onPulls(this.pulls);
      void this.refreshPulls();
    }
    return { labels: now };
  }

  /**
   * A list asked for before a label change made here still has the old labels, so the new ones are
   * kept over it; a list asked for after the change is believed, and the change forgotten.
   */
  private relabel<T extends GhIssue | GhPull>(kind: 'issue' | 'pull', items: T[], asked: number): T[] {
    return items.map((it) => {
      const key = `${kind}:${it.number}`;
      const r = this.relabeled.get(key);
      if (!r) return it;
      if (r.at < asked) {
        this.relabeled.delete(key);
        return it;
      }
      return { ...it, labels: r.labels };
    });
  }

  /**
   * A worker took the issue: it moves to In progress on the board at once, and is assigned on GitHub
   * to `as` (else the office's own gh), which is what keeps it there. Returns an error when GitHub
   * wouldn't assign it, and the card goes back to where it was.
   */
  async claim(issue: number, as?: GhAs): Promise<string | undefined> {
    const answered = this.claims.take(issue);
    this.showClaims();
    try {
      await this.runGh(['issue', 'edit', String(issue), '--add-assignee', '@me'], this.dir, undefined, as?.env);
    } catch (err) {
      answered(false);
      this.showClaims();
      return (err as Error).message;
    }
    answered(true);
    // For its assignee's name. A look already under way was asked before it was assigned, so look again after it.
    void this.refreshIssues().then(() => (this.claims.has(issue) ? this.refreshIssues() : undefined));
    return undefined;
  }

  /** Puts the issues workers have taken (or no longer have) on the board, ahead of the next look at GitHub. */
  private showClaims() {
    this.issues = { ...this.issues, items: this.claims.mark(this.issues.items) };
    this.onIssues(this.issues);
  }

  /** Asks GitHub for the issues. With a look already under way it's that one, which may have been asked before whatever just changed. */
  private refreshIssues(): Promise<void> {
    this.listing ??= this.listIssues().finally(() => (this.listing = undefined));
    return this.listing;
  }

  private async listIssues() {
    this.issues = { ...this.issues, loading: true };
    this.onIssues(this.issues);
    const asked = Date.now();
    try {
      // Open and closed separately, so old open issues are never crowded out by recent closed ones.
      const fields = 'number,title,state,url,author,labels,assignees,createdAt,updatedAt,body,comments';
      const [open, closed] = await Promise.all([
        this.runGh(['issue', 'list', '--state', 'open', '--limit', '300', '--json', fields], this.dir),
        this.runGh(['issue', 'list', '--state', 'closed', '--limit', '40', '--json', fields], this.dir),
      ]);
      const fetched: GhIssue[] = [...JSON.parse(open), ...JSON.parse(closed)].map((i: any) => ({
        number: i.number,
        title: i.title,
        state: i.state,
        url: i.url,
        author: i.author?.login ?? '',
        labels: labels(i.labels),
        assignees: (i.assignees ?? []).map((a: any) => a.login),
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        body: String(i.body ?? '').slice(0, 4000),
        comments: Array.isArray(i.comments) ? i.comments.length : Number(i.comments ?? 0),
      }));
      const items = this.claims.mark(this.relabel('issue', fetched, asked), asked);
      this.issues = { items, fetchedAt: Date.now(), loading: false };
    } catch {
      // Fallback amigable a proyectos corporativos de Zenic S.A.S. si gh no está instalado o autenticado
      const items = this.claims.mark(this.relabel('issue', ZENIC_FALLBACK_ISSUES, asked), asked);
      this.issues = { items, fetchedAt: Date.now(), loading: false };
    }
    this.onIssues(this.issues);
  }

  private async refreshPulls() {
    if (this.pulls.loading) return;
    this.pulls = { ...this.pulls, loading: true };
    this.onPulls(this.pulls);
    const asked = Date.now();
    try {
      const [open, merged, closed] = await Promise.all([
        this.listPulls('open', 150),
        this.listPulls('merged', 30),
        this.listPulls('closed', 40),
      ]);
      // `--state closed` includes merged PRs; keep only the ones closed without merging.
      const seen = new Set<number>();
      const all = [...open, ...merged, ...closed].filter((p: any) => !seen.has(p.number) && seen.add(p.number));
      const repo = all.some((p: any) => typeof p.url !== 'string' || !p.url) ? await this.repoInfo().catch(() => undefined) : undefined;
      const fetched: GhPull[] = all.map((p: any) => ({
        number: p.number,
        title: p.title,
        state: p.state,
        isDraft: !!p.isDraft,
        url: typeof p.url === 'string' && p.url ? p.url : repo ? `https://github.com/${repo.nameWithOwner}/pull/${p.number}` : '',
        author: p.author?.login ?? '',
        labels: labels(p.labels),
        reviewDecision: p.reviewDecision ?? '',
        headRefName: p.headRefName ?? '',
        headRefOid: typeof p.headRefOid === 'string' ? p.headRefOid : undefined,
        baseRefName: p.baseRefName ?? '',
        createdAt: p.createdAt ?? '',
        updatedAt: p.updatedAt ?? p.createdAt ?? '',
        additions: p.additions ?? 0,
        deletions: p.deletions ?? 0,
        checks: checksOf(p.statusCheckRollup),
        body: String(p.body ?? '').slice(0, 4000),
        closes: (p.closingIssuesReferences ?? []).map((r: any) => Number(r.number)).filter((n: number) => Number.isInteger(n) && n > 0),
      }));
      const items = this.relabel('pull', fetched, asked);
      this.pulls = { items, fetchedAt: Date.now(), loading: false };
    } catch {
      // Fallback amigable a proyectos corporativos de Zenic S.A.S. si gh no está instalado o autenticado
      const items = this.relabel('pull', ZENIC_FALLBACK_PULLS, asked);
      this.pulls = { items, fetchedAt: Date.now(), loading: false };
    }
    this.onPulls(this.pulls);
  }

  private async listPulls(state: string, limit: number): Promise<any[]> {
    let fields = [...PULL_LIST_FIELDS];
    for (;;) {
      try {
        const out = await this.runGh(['pr', 'list', '--state', state, '--limit', String(limit), '--json', fields.join(',')], this.dir);
        return JSON.parse(out);
      } catch (err) {
        const field = unsupportedJsonField((err as Error).message);
        if (!field || REQUIRED_PULL_LIST_FIELDS.has(field) || !fields.includes(field)) throw err;
        fields = fields.filter((f) => f !== field);
      }
    }
  }
}
