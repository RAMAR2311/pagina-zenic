import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'zenic_content_v1'

/**
 * Default content — single source of truth for editable site sections.
 * The admin panel edits these and persists overrides to localStorage.
 */
export const defaultContent = {
  // ── Nuestro Equipo (Nosotros) ──
  team: [
    {
      name: 'Marlon Ramírez',
      designation: 'CEO & Fundador',
      imageSrc: '/team/marlon.jpg',
      bio: 'Visionario detrás de ZENIC. Lidera la estrategia de crecimiento y la dirección ejecutiva de la compañía con foco en el mercado colombiano.',
      email: 'marlon@zenic.com.co',
      web: '#',
    },
    {
      name: 'Jhon Aparicio',
      designation: 'Director Administrativo',
      imageSrc: '/team/jhon.jpg',
      bio: 'Garantiza la solidez operativa y financiera de ZENIC. Gestiona los procesos internos y asegura la eficiencia en cada área.',
      email: 'jhon@zenic.com.co',
      web: '#',
    },
    {
      name: 'Miguel Rodriguez',
      designation: 'Director de Tecnología',
      imageSrc: '/team/miguel.png',
      bio: 'Arquitecto de las soluciones digitales de ZENIC. Supervisa el desarrollo del POS, los módulos de IA y toda la infraestructura tecnológica.',
      email: 'miguel@zenic.com.co',
      web: '#',
    },
    {
      name: 'Santiago Peraza',
      designation: 'Director de Marketing & Ventas',
      imageSrc: '/team/santiago.jpg',
      bio: 'Impulsa el posicionamiento de ZENIC. Diseña las estrategias comerciales que conectan la tecnología con el comercio real.',
      email: 'santiago@zenic.com.co',
      web: '#',
    },
  ],

  // ── Blog financiero ──
  blog: [
    {
      id: 'stock-temporada-alta',
      categoria: 'Gestión de Inventario',
      color: '#9C4DCC',
      emoji: '📦',
      titulo: 'Cómo evitar quedarte sin stock en temporada alta sin disparar tus costos',
      resumen: 'El balance entre no quedarse sin producto y no sobre-stockearse es el mayor dolor de cabeza del comercio. Te explicamos cómo la inteligencia de datos resuelve este problema.',
      autor: 'Equipo ZENIC',
      lectura: '5 min',
      fecha: 'Mayo 2025',
      contenido: `Cada temporada alta —diciembre, día de la madre, regreso a clases— deja la misma pregunta: ¿cuánto compro? Comprar de más congela tu dinero en mercancía que no rota. Comprar de menos te deja sin nada que vender justo cuando más clientes entran.

## El verdadero costo de quedarse sin stock
Quedarte sin un producto no solo es la venta que perdiste hoy. Es el cliente que se va a la competencia y, muchas veces, no vuelve. En comercio popular, donde la lealtad se construye producto a producto, una sola ruptura de stock puede costar meses de relación.

## El otro extremo: sobre-stock
Llenar la bodega "por si acaso" suena seguro, pero ese inventario inmóvil es plata quieta. Plata que no puedes usar para pagar proveedores, arriendo o nómina. Y si el producto pasa de moda o se vence, la pérdida es total.

## Cómo lo resuelve la inteligencia de datos
ZENIC analiza tu histórico de ventas y detecta los patrones que tú intuías pero no podías medir: qué se vende más cada mes, qué referencias se mueven juntas, cuánto tarda en agotarse cada producto. Con eso calcula un punto de reorden inteligente: te avisa cuándo y cuánto pedir, antes de que te quedes sin nada.

El resultado es un inventario que respira con tu negocio: ni vacío ni saturado. Compras lo justo, en el momento justo, y tu dinero sigue trabajando.`,
    },
    {
      id: 'del-cuaderno-a-la-nube',
      categoria: 'Digitalización',
      color: '#80DEEA',
      emoji: '⚡',
      titulo: 'Del cuaderno a la nube: la guía práctica para digitalizar tu negocio sin morir en el intento',
      resumen: 'Muchos comerciantes saben que necesitan tecnología pero no saben por dónde empezar. Este artículo es el primer paso real, sin tecnicismos.',
      autor: 'Equipo ZENIC',
      lectura: '7 min',
      fecha: 'Abril 2025',
      contenido: `El cuaderno funcionó por años. Pero a medida que tu negocio crece, ese mismo cuaderno empieza a costarte: ventas mal anotadas, inventario que nunca cuadra, y cero visibilidad de cómo va el mes hasta que ya es tarde.

## Paso 1: digitaliza las ventas, no todo de golpe
El error más común es querer digitalizar todo el primer día. Empieza por lo esencial: registra cada venta en un POS. Solo con eso ya tendrás reportes diarios automáticos y sabrás exactamente cuánto vendiste sin sumar a mano.

## Paso 2: ordena tu inventario
Una vez las ventas están digitales, el inventario se actualiza solo con cada transacción. Se acabó el conteo manual interminable de fin de mes.

## Paso 3: lee tus datos
Con un par de semanas de información, empiezas a ver tendencias: tus horas pico, tus productos estrella, tus días flojos. Decisiones que antes tomabas por intuición ahora las respaldas con números.

La digitalización no es un salto al vacío. Es un camino de pasos pequeños, y el primero es más simple de lo que crees.`,
    },
    {
      id: 'cartera-b2b',
      categoria: 'Cartera & Crédito',
      color: '#F59E0B',
      emoji: '📊',
      titulo: 'Cartera B2B: cómo cobrar sin dañar la relación con tus clientes mayoristas',
      resumen: 'Gestionar créditos con clientes frecuentes es delicado. Aquí las estrategias que usan los comerciantes más exitosos para mantener la cartera sana sin perder clientes.',
      autor: 'Equipo ZENIC',
      lectura: '6 min',
      fecha: 'Abril 2025',
      contenido: `Dar crédito a tus clientes mayoristas es una herramienta poderosa para vender más. Pero mal gestionada, se convierte en la principal razón por la que un negocio rentable se queda sin liquidez.

## El problema no es dar crédito, es no controlarlo
Muchos comerciantes saben "más o menos" cuánto les deben, pero no tienen el dato exacto por cliente, ni desde cuándo. Esa neblina es la que mata la cartera.

## Reglas claras desde el inicio
Define cupos de crédito por cliente y plazos concretos. Cuando las reglas están escritas y el cliente las conoce, cobrar deja de ser una conversación incómoda y pasa a ser un proceso normal.

## Recordatorios sin fricción
Con ZENIC, cada cliente B2B tiene su estado de cuenta en tiempo real. El sistema te muestra quién está por vencer y quién ya se pasó, para que cobres a tiempo y de forma amable, sin dañar la relación.

Cobrar bien no es ser duro. Es ser ordenado. Y el orden, a la larga, es lo que tus clientes respetan.`,
    },
    {
      id: 'aprobacion-remota',
      categoria: 'Tecnología',
      color: '#EC4899',
      emoji: '🔐',
      titulo: 'Aprobación remota: por qué el dueño del negocio ya no necesita estar presente para autorizar',
      resumen: 'La aprobación de descuentos y precios especiales en tiempo real desde el celular cambió la operación de muchos negocios. Así funciona.',
      autor: 'Equipo ZENIC',
      lectura: '4 min',
      fecha: 'Marzo 2025',
      contenido: `"Espérame que llamo al dueño." Esa frase, repetida diez veces al día, frena ventas y cansa clientes. La aprobación remota la elimina.

## El cuello de botella del dueño
En muchos negocios solo el dueño puede autorizar un descuento o un precio especial. Si no está, la venta se cae o el cliente espera. Y el dueño no puede estar en dos lados a la vez.

## Cómo funciona la aprobación remota
Cuando un vendedor necesita autorización, el sistema envía la solicitud al celular del dueño en el instante. Con un toque, este aprueba o rechaza, desde donde esté. La venta sigue su curso en segundos.

## Control sin presencia
El dueño gana algo invaluable: control total sin tener que estar físicamente en el local. Puede revisar cada solicitud, ver el contexto y decidir, manteniendo el negocio en movimiento aunque esté de viaje.

La tecnología no reemplaza el criterio del dueño. Lo lleva a donde haga falta, al instante.`,
    },
    {
      id: 'indicadores-cada-lunes',
      categoria: 'Inteligencia de Negocios',
      color: '#10B981',
      emoji: '🧠',
      titulo: 'Los 5 indicadores que todo comerciante debería revisar cada lunes',
      resumen: 'No necesitas un MBA para leer tus datos. Estos 5 números son suficientes para saber si tu negocio va bien, mal o necesita un cambio inmediato.',
      autor: 'Equipo ZENIC',
      lectura: '5 min',
      fecha: 'Marzo 2025',
      contenido: `No necesitas ser financiero para entender tu negocio. Necesitas mirar los números correctos, y mirarlos seguido. Estos cinco, cada lunes, te dan el pulso completo.

## 1. Ventas de la semana
El número más obvio y el más importante. Compáralo con la semana anterior y con el mismo período del mes pasado. La tendencia importa más que el dato suelto.

## 2. Producto estrella y producto muerto
Qué se vendió más y qué no se movió. El primero te dice dónde poner foco; el segundo, qué dejar de comprar.

## 3. Margen, no solo venta
Vender mucho con poco margen es trabajar para nada. Revisa cuánto te queda realmente después de costos.

## 4. Estado de la cartera
Cuánto te deben y desde cuándo. La cartera vencida es plata tuya en bolsillo ajeno.

## 5. Flujo de caja
Cuánto entró y cuánto salió. Un negocio puede ser rentable y aun así quedarse sin efectivo si no controla este número.

Cinco números, diez minutos cada lunes. Esa rutina simple separa a los que controlan su negocio de los que solo reaccionan.`,
    },
    {
      id: 'restaurantes-populares-tecnologia',
      categoria: 'Sectorial',
      color: '#F97316',
      emoji: '🍽️',
      titulo: 'Restaurantes populares y tecnología: el mito de que la digitalización es solo para los grandes',
      resumen: 'Una pequeña fritanga en Bogotá aumentó su facturación 28% en tres meses usando comandas digitales. Esta es su historia.',
      autor: 'Equipo ZENIC',
      lectura: '6 min',
      fecha: 'Febrero 2025',
      contenido: `Existe la idea de que la tecnología es cara y solo sirve para las grandes cadenas. La realidad del comercio popular colombiano dice lo contrario.

## El punto de partida
Una fritanga familiar en Bogotá tomaba pedidos a viva voz. En hora pico se perdían platos, se cobraban precios distintos y la cocina vivía en caos. El dueño creía que "eso era normal".

## El cambio: comandas digitales
Implementaron comandas digitales: el mesero toma el pedido en una tablet, llega directo a la cocina sin errores, y la cuenta se calcula sola. Cero malentendidos, cero platos perdidos.

## Los resultados en tres meses
La facturación subió 28%. No porque llegaran más clientes, sino porque dejaron de perder ventas por desorden: menos errores, mesas que rotan más rápido, y precios siempre correctos.

## La lección
La digitalización no es un lujo de grandes. Es una ventaja al alcance de cualquier negocio que quiera dejar de perder dinero por desorden. Y muchas veces, el negocio pequeño es el que más rápido ve el resultado.`,
    },
  ],

  // ── Casos de Éxito (carrusel destacado) ──
  casos: [
    { id: 'tekfix', title: 'Tekfix', sector: 'Accesorios & Tecnología', emoji: '📱', color: '#80DEEA', summary: 'Pasó del control en papel a inventario 100% trazable, vendiendo más al saber exactamente qué tiene y qué se mueve.', metric: '40% menos pérdidas', url: '#tekfix', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80' },
    { id: 'bendito-encanto', title: 'Bendito Encanto', sector: 'Moda & Boutique', emoji: '👗', color: '#EC4899', summary: 'Gestión de tallas, colores y temporadas con alertas de stock. Compra mejor, vende más y pierde menos.', metric: '+35% rotación', url: '#bendito-encanto', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
    { id: 'mc', title: 'MC Innovación Financiera', sector: 'Fintech & Servicios', emoji: '🏦', color: '#9C4DCC', summary: 'Dashboard en tiempo real, control de cartera y seguimiento de clientes corporativos. Decisiones con datos, no con intuición.', metric: '68% menos tiempo en reportes', url: '#mc', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80' },
    { id: 'sarotex', title: 'Sarotex', sector: 'Textiles', emoji: '🧵', color: '#F59E0B', summary: 'Control de inventario textil por referencia y rotación, optimizando compras y reduciendo capital muerto en bodega.', metric: 'Inventario en tiempo real', url: '#sarotex', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80' },
    { id: 'dtavo', title: 'DTavo Dtodo', sector: 'Comercio Popular', emoji: '🛒', color: '#10B981', summary: 'POS y control de inventario para un negocio multiproducto, con reportes de ventas diarios al instante.', metric: 'Ventas al día', url: '#dtavo', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
    { id: 'manhattan', title: 'Babería Manhattan', sector: 'Servicios & Estética', emoji: '✂️', color: '#80DEEA', summary: 'Agenda, control de servicios y caja en un solo lugar. Más orden en la operación y mejor experiencia para el cliente.', metric: 'Operación ordenada', url: '#manhattan', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
    { id: 'digital-market', title: 'Digital Market', sector: 'Retail Digital', emoji: '💻', color: '#9C4DCC', summary: 'Integración de ventas físicas y digitales con datos centralizados para decidir con información precisa.', metric: 'Datos centralizados', url: '#digital-market', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80' },
  ],

  // ── Carrusel de fotos de la empresa (Nosotros) ──
  fotos: [
    { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80', caption: 'Nuestro equipo en acción', desc: 'Construyendo soluciones junto a comerciantes reales.' },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', caption: 'Oficina ZENIC · Bogotá', desc: 'Donde nacen las ideas que digitalizan el comercio.' },
    { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80', caption: 'En la calle, con el cliente', desc: 'Acompañamos cada negocio en su transformación.' },
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', caption: 'Colaboración constante', desc: 'Cada función se prueba con usuarios reales.' },
    { src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80', caption: 'Datos que mueven negocios', desc: 'Inteligencia de negocio al alcance de todos.' },
    { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80', caption: 'Tecnología hecha en Colombia', desc: 'Software pensado para el comercio popular.' },
  ],
}

const ContentContext = createContext(null)
const SECTIONS = Object.keys(defaultContent)

// Deep clone helper so defaults are never mutated
const clone = (v) => JSON.parse(JSON.stringify(v))

// ── Backend API helpers ──
const api = {
  async getAll() {
    const res = await fetch('/api/content')
    if (!res.ok) throw new Error('GET /api/content failed')
    return res.json()
  },
  async putSection(section, data) {
    const res = await fetch(`/api/content/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`PUT /api/content/${section} failed`)
    return res.json()
  },
}

// Cache to localStorage so the site still renders if the backend is offline
const cacheLocal = (content) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(content)) } catch { /* ignore quota */ }
}
const readLocal = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...clone(defaultContent), ...JSON.parse(saved) }
  } catch { /* ignore */ }
  return clone(defaultContent)
}

export function ContentProvider({ children }) {
  // Start from localStorage cache (or defaults) for instant first paint
  const [content, setContent] = useState(readLocal)
  const [online, setOnline] = useState(false)

  // On mount: load from backend; seed any missing sections with defaults
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const remote = await api.getAll()
        if (cancelled) return

        const merged = clone(defaultContent)
        const toSeed = []
        for (const section of SECTIONS) {
          if (remote[section] !== undefined) {
            merged[section] = remote[section]
          } else {
            // backend has nothing yet → seed it with the default
            toSeed.push(section)
          }
        }
        setContent(merged)
        cacheLocal(merged)
        setOnline(true)

        // Seed missing sections (first run)
        for (const section of toSeed) {
          api.putSection(section, merged[section]).catch(() => {})
        }
      } catch (e) {
        // Backend not running → keep working from localStorage cache
        console.warn('Backend no disponible, usando caché local:', e.message)
        setOnline(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // Persist a section to backend + local cache
  const persist = useCallback((section, items) => {
    setContent(prev => {
      const next = { ...prev, [section]: items }
      cacheLocal(next)
      return next
    })
    api.putSection(section, items).catch(e => {
      console.warn(`No se pudo guardar "${section}" en el servidor:`, e.message)
    })
  }, [])

  const updateSection = useCallback((section, items) => persist(section, items), [persist])

  const resetSection = useCallback((section) => persist(section, clone(defaultContent[section])), [persist])

  const resetAll = useCallback(() => {
    const fresh = clone(defaultContent)
    setContent(fresh)
    cacheLocal(fresh)
    for (const section of SECTIONS) {
      api.putSection(section, fresh[section]).catch(() => {})
    }
  }, [])

  return (
    <ContentContext.Provider value={{ content, online, updateSection, resetSection, resetAll }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent debe usarse dentro de <ContentProvider>')
  return ctx
}

// Upload an image file to the backend; returns the stored URL (e.g. /uploads/xxx.jpg)
export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al subir la imagen')
  }
  const { url } = await res.json()
  return url
}
