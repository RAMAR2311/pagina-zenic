import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CEREBRO_DIR = path.resolve(__dirname, '..', 'zenic-cerebro')

/**
 * Lee recursivamente todos los archivos .md de zenic-cerebro/
 */
export function loadZenicCerebroKnowledge() {
  const documents = []

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath).replace(/\\/g, '/')
        try {
          const content = fs.readFileSync(fullPath, 'utf8')
          documents.push({
            path: relativePath,
            name: entry.name,
            content,
            size: content.length,
          })
        } catch (err) {
          console.error(`Error leyendo archivo ${fullPath}:`, err.message)
        }
      }
    }
  }

  scanDir(CEREBRO_DIR)
  return documents
}

/**
 * Construye el prompt de sistema para Claude con todos los documentos
 */
export function buildClaudeSystemPrompt(documents) {
  const docsText = documents
    .map(doc => `=== ARCHIVO: ${doc.path} ===\n${doc.content}\n`)
    .join('\n\n')

  return `Eres el Cerebro oficial de ZENIC S.A.S., empresa colombiana de tecnología para comercio.
Tu misión es responder preguntas sobre Zenic, sus fundadores, su POS con inteligencia artificial, sus módulos y sus clientes.

REGLAS FUNDAMENTALES (CLAUDE.md):
1. Escribe en español, con un tono cercano, directo y centrado en el "comercio real" colombiano.
2. Usa ÚNICAMENTE los datos contenidos en la base de conocimiento oficial adjunta abajo. NUNCA inventes información que no esté aquí.
3. Si un dato, precio, cifra, cliente, integración o capacidad técnica no está documentado o está marcado como [POR COMPLETAR], responde explícitamente que la información no está disponible o que está por definirse por el equipo.
4. Si preguntan por precios, no inventes valores ni mensualidades; aclara que los precios oficiales están pendientes de publicación y sugiere agendar una demostración / auditoría de negocio de 15 minutos por Google Meet o Microsoft Teams sin compromiso comercial.
5. Los únicos clientes oficiales comprobables son: Barbería Manhattan, Digital Market, Tekfix y Bendito Encanto. No menciones otros.
6. El equipo tiene 4 cabezas: Marlon Ramírez (CEO y Fundador), Jhon Aparicio (Director Administrativo), Miguel Rodriguez (Director de Tecnología) y Santiago Peraza (Director de Marketing y Ventas).
7. Módulos diferenciales clave: Maneos (préstamos entre locales vecinos con alertas), Aprobación remota (descuentos aprobados desde el celular del dueño), IMEI y trazabilidad (historial por equipo para tiendas de celulares), y Telemetría retail (visión artificial con sensores).

BASE DE CONOCIMIENTO OFICIAL DE ZENIC S.A.S. (zenic-cerebro/):
--------------------------------------------------------------
${docsText}
--------------------------------------------------------------
Recuerda: Si la respuesta no está en el texto anterior, responde con total honestidad indicando que no está documentado en zenic-cerebro.`
}

/**
 * Motor local inteligente de respaldo si no hay clave de API configurada
 */
export function queryLocalCerebro(query, documents) {
  const q = query.toLowerCase()
  
  // Buscar archivos más relevantes
  const scored = documents.map(doc => {
    let score = 0
    const contentLower = doc.content.toLowerCase()
    const pathLower = doc.path.toLowerCase()
    
    // Palabras clave de la consulta
    const words = q.split(/\s+/).filter(w => w.length > 2)
    for (const w of words) {
      if (pathLower.includes(w)) score += 5
      const matches = contentLower.split(w).length - 1
      score += Math.min(matches, 6)
    }
    return { doc, score }
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)

  const topDocs = scored.slice(0, 3).map(s => s.doc)

  // Respuestas temáticas basadas 100% en los archivos de zenic-cerebro
  if (q.includes('precio') || q.includes('costo') || q.includes('cuanto vale') || q.includes('tarifa') || q.includes('plan')) {
    return {
      content: `Según la política oficial documentada en **\`zenic-cerebro/ventas/precios.md\`**, los precios oficiales se encuentran actualmente marcados como **[POR COMPLETAR]** por la dirección de Zenic para no inventar tarifas.

Para cotizar una solución personalizada, el equipo ofrece la **Auditoría de Negocio de 15 Minutos** (por Google Meet o Teams) sin costo ni compromiso comercial.`,
      sources: ['zenic-cerebro/ventas/precios.md', 'zenic-cerebro/ventas/auditoria-de-negocio.md'],
      isLocal: true,
    }
  }

  if (q.includes('maneo') || q.includes('vecino') || q.includes('prestamo')) {
    return {
      content: `El módulo de **Maneos** (\`zenic-cerebro/producto/modulo-maneos.md\`) está diseñado para el comercio real:

* **¿Qué es?** Resuelve el problema de cuando un local no tiene una talla o referencia y se la pide prestada a un negocio vecino.
* **Solución Zenic:** Registra digitalmente el préstamo en el POS al instante, descuenta de forma transitoria y genera alertas automáticas de devolución o cobro para evitar pérdidas y malentendidos.`,
      sources: ['zenic-cerebro/producto/modulo-maneos.md'],
      isLocal: true,
    }
  }

  if (q.includes('aprobacion') || q.includes('remota') || q.includes('descuento') || q.includes('celular') || q.includes('movil')) {
    return {
      content: `El módulo de **Aprobación Remota** (\`zenic-cerebro/producto/aprobacion-remota.md\`):

1. **Solicitud en POS:** El vendedor pide una rebaja o precio especial desde la pantalla de cobro.
2. **Notificación al móvil:** Llega de inmediato al celular del dueño.
3. **Autorización con un toque:** El dueño aprueba o rechaza a distancia sin necesidad de estar físicamente en el local.
4. **Log auditable:** Queda un registro completo con hora, solicitante y decisión.`,
      sources: ['zenic-cerebro/producto/aprobacion-remota.md'],
      isLocal: true,
    }
  }

  if (q.includes('imei') || q.includes('celular') || q.includes('garantia') || q.includes('bateria') || q.includes('tecnologia')) {
    return {
      content: `El módulo de **IMEI y Trazabilidad** (\`zenic-cerebro/producto/imei-trazabilidad.md\`):

* Imprime el IMEI único directamente en la factura entregada al comprador.
* Guarda el historial completo de cada dispositivo (proveedor, estado estético, porcentaje de batería).
* Monitorea la garantía y emite alertas preventivas antes de su vencimiento.`,
      sources: ['zenic-cerebro/producto/imei-trazabilidad.md'],
      isLocal: true,
    }
  }

  if (q.includes('equipo') || q.includes('fundador') || q.includes('ceo') || q.includes('marlon') || q.includes('quienes') || q.includes('directiv')) {
    return {
      content: `Según **\`zenic-cerebro/empresa/equipo.md\`**, el equipo de Zenic S.A.S. cuenta con cuatro cabezas directivas:

1. **Marlon Ramírez** – CEO y Fundador (Estrategia y visión ejecutiva).
2. **Jhon Aparicio** – Director Administrativo (Operaciones internas y control financiero).
3. **Miguel Rodriguez** – Director de Tecnología (Arquitectura de software y módulos de IA).
4. **Santiago Peraza** – Director de Marketing y Ventas (Posicionamiento comercial y relación con comercios).`,
      sources: ['zenic-cerebro/empresa/equipo.md', 'zenic-cerebro/empresa/quienes-somos.md'],
      isLocal: true,
    }
  }

  if (q.includes('cliente') || q.includes('caso') || q.includes('manhattan') || q.includes('tekfix') || q.includes('bendito')) {
    return {
      content: `Según **\`zenic-cerebro/clientes/casos-de-exito.md\`**, los clientes visibles autorizados en el sitio web de Zenic son:

* **Barbería Manhattan** (Cuidado personal y barbería).
* **Digital Market** (Comercio y tecnología).
* **Tekfix** (Servicio técnico y celulares).
* **Bendito Encanto** (Boutique de moda y calzado).`,
      sources: ['zenic-cerebro/clientes/casos-de-exito.md'],
      isLocal: true,
    }
  }

  if (q.includes('internet') || q.includes('cae') || q.includes('offline') || q.includes('senal')) {
    return {
      content: `Respecto a caídas de conexión a internet, según **\`zenic-cerebro/clientes/objeciones.md\`** y **\`pendientes.md\`**, los detalles técnicos específicos del modo offline y sincronización están registrados como **[POR COMPLETAR]** por el equipo de ingeniería para validar el protocolo exacto.`,
      sources: ['zenic-cerebro/clientes/objeciones.md', 'zenic-cerebro/pendientes.md'],
      isLocal: true,
    }
  }

  // Respuesta general basada en los documentos encontrados
  if (topDocs.length > 0) {
    const summary = topDocs.map(d => `* **${d.path}**: ${d.content.split('\n')[2] || d.content.slice(0, 140)}...`).join('\n')
    return {
      content: `He consultado la base de conocimiento en **zenic-cerebro/**. Encontré información en los siguientes archivos:\n\n${summary}\n\n*Nota: Para consultas conversacionales profundas, puedes conectar tu API Key de Claude en el botón de ajustes (⚙️).*`,
      sources: topDocs.map(d => d.path),
      isLocal: true,
    }
  }

  return {
    content: `No encontré esa información en los 28 documentos de **zenic-cerebro/**. Siguiendo la regla estricta de \`CLAUDE.md\`, no invento información no documentada. Puedes agendar la auditoría de negocio de 15 minutos en zenic.com.co para consultar directamente con el equipo.`,
    sources: ['zenic-cerebro/CLAUDE.md'],
    isLocal: true,
  }
}
