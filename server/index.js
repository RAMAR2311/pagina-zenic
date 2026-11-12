import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { loadZenicCerebroKnowledge, buildClaudeSystemPrompt, queryLocalCerebro } from './cerebroKnowledge.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const PORT = process.env.PORT || 4000
const UPLOAD_DIR = path.join(__dirname, 'uploads')
const DB_PATH = path.join(__dirname, 'data.db')

// Ensure uploads folder exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// ── Database ──
const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    section TEXT PRIMARY KEY,
    data    TEXT NOT NULL,
    updated_at INTEGER
  )
`)

const getAllStmt = db.prepare('SELECT section, data FROM content')
const getOneStmt = db.prepare('SELECT data FROM content WHERE section = ?')
const upsertStmt = db.prepare(`
  INSERT INTO content (section, data, updated_at) VALUES (@section, @data, @updated_at)
  ON CONFLICT(section) DO UPDATE SET data = @data, updated_at = @updated_at
`)

// ── App ──
const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

// Serve uploaded images
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }))

// ── Content API ──

// Get all sections as { section: data, ... }
app.get('/api/content', (req, res) => {
  const rows = getAllStmt.all()
  const out = {}
  for (const row of rows) {
    try { out[row.section] = JSON.parse(row.data) } catch { /* skip corrupt */ }
  }
  res.json(out)
})

// Get a single section
app.get('/api/content/:section', (req, res) => {
  const row = getOneStmt.get(req.params.section)
  if (!row) return res.status(404).json({ error: 'not found' })
  try { res.json(JSON.parse(row.data)) }
  catch { res.status(500).json({ error: 'corrupt data' }) }
})

// Save / update a section (body is the array or object for that section)
app.put('/api/content/:section', (req, res) => {
  const { section } = req.params
  const data = req.body
  if (data === undefined) return res.status(400).json({ error: 'missing body' })
  upsertStmt.run({ section, data: JSON.stringify(data), updated_at: Date.now() })
  res.json({ ok: true, section })
})

// ── Image upload ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, safe)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  },
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

// ── Cerebro IA & Claude API ──

// Obtener estado e índice de la base de conocimiento zenic-cerebro/
app.get('/api/cerebro/knowledge', (req, res) => {
  try {
    const docs = loadZenicCerebroKnowledge()
    const totalBytes = docs.reduce((acc, d) => acc + (d.size || 0), 0)
    res.json({
      status: 'ready',
      count: docs.length,
      totalBytes,
      files: docs.map(d => ({ path: d.path, name: d.name, size: d.size })),
      hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Endpoint de Chat con Claude alimentado por la carpeta zenic-cerebro/
app.post('/api/cerebro/chat', async (req, res) => {
  const { messages = [], apiKey: clientApiKey } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const docs = loadZenicCerebroKnowledge()
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || ''

  const apiKey = (clientApiKey || process.env.ANTHROPIC_API_KEY || '').trim()

  // Si hay API key disponible, intentamos consultar directamente la API oficial de Claude (Anthropic)
  if (apiKey) {
    try {
      const systemPrompt = buildClaudeSystemPrompt(docs)

      // Filtrar mensajes para Claude (formato { role, content })
      const claudeMessages = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: systemPrompt,
          messages: claudeMessages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = errorData.error?.message || `Anthropic API status ${response.status}`
        console.warn(`[Cerebro] Claude API falló: ${errorMsg}. Usando motor local de respaldo.`)
        
        // Fallback al motor local estricto
        const local = queryLocalCerebro(lastUserMessage, docs)
        return res.json({
          role: 'assistant',
          content: local.content,
          sources: local.sources,
          model: 'zenic-cerebro-engine (fallback)',
          isClaudeApi: false,
          warning: `Nota: Claude API devolvió (${errorMsg}). Mostrando respuesta desde la base de conocimiento local zenic-cerebro/.`,
        })
      }

      const data = await response.json()
      const text = data.content?.[0]?.text || 'Sin respuesta generada.'

      return res.json({
        role: 'assistant',
        content: text,
        model: data.model || 'claude-3-5-sonnet-20241022',
        isClaudeApi: true,
        usage: data.usage,
      })
    } catch (err) {
      console.error('[Cerebro] Error al invocar Claude API:', err.message)
      // Fallback
      const local = queryLocalCerebro(lastUserMessage, docs)
      return res.json({
        role: 'assistant',
        content: local.content,
        sources: local.sources,
        model: 'zenic-cerebro-engine (fallback)',
        isClaudeApi: false,
        warning: `Error de conexión con Claude API (${err.message}). Respondiendo con el motor local estricto de zenic-cerebro/.`,
      })
    }
  }

  // Si no se proporcionó API key, responde con el motor local estricto de zenic-cerebro/
  const local = queryLocalCerebro(lastUserMessage, docs)
  return res.json({
    role: 'assistant',
    content: local.content,
    sources: local.sources,
    model: 'zenic-cerebro-engine',
    isClaudeApi: false,
    note: 'Respuesta generada directamente desde los 28 archivos Markdown de zenic-cerebro/. Para activar Claude 3.5 Sonnet en vivo, configura tu Anthropic API Key en el botón ⚙️.',
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(400).json({ error: err.message || 'error' })
})

// ── Serve built frontend (production) if dist exists ──
const DIST = path.join(ROOT, 'dist')
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  // SPA fallback (Express 5: avoid '*' string route)
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
    res.sendFile(path.join(DIST, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`✅ ZENIC backend escuchando en http://localhost:${PORT}`)
  console.log(`   • API:      http://localhost:${PORT}/api/content`)
  console.log(`   • Uploads:  http://localhost:${PORT}/uploads`)
  console.log(`   • DB:       ${DB_PATH}`)
})
