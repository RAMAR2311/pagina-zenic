import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

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
