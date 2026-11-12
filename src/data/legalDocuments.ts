/**
 * Documentación Legal Oficial y Políticas de Cumplimiento Normativo
 * de ZENIC S.A.S. conforme a la legislación de la República de Colombia:
 * - Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data y Protección de Datos Personales).
 * - Ley 1480 de 2011 (Estatuto del Consumidor - Derecho de Retracto Art. 47 y Reversión Art. 51).
 * - Ley 527 de 1999 (Comercio Electrónico y Mensajes de Datos).
 * - Normativa DIAN sobre Facturación Electrónica con Validación Previa.
 * - Circular Única de la Superintendencia de Industria y Comercio (SIC).
 */

export interface LegalSection {
  title: string;
  content: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  badge: string;
  lawReference: string;
  effectiveDate: string;
  summary: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  terminos: {
    id: 'terminos',
    title: 'Términos y Condiciones de Uso del Software',
    badge: 'Contrato SaaS',
    lawReference: 'Ley 527 de 1999 y Ley 1480 de 2011',
    effectiveDate: 'Vigente desde: 1 de Enero de 2026',
    summary: 'Rige el acceso, licenciamiento no exclusivo de la plataforma ZENIC SaaS, responsabilidades, acuerdos de nivel de servicio (SLA) y obligaciones de los usuarios.',
    sections: [
      {
        title: '1. Identificación del Proveedor del Servicio',
        content: [
          'La plataforma tecnológica ZENIC es de propiedad exclusiva y operada por ZENIC S.A.S. (en adelante "ZENIC"), sociedad comercial legalmente constituida bajo las leyes de la República de Colombia, con domicilio principal en la ciudad de Bogotá D.C., identificada con NIT 901.842.109-4.',
          'Al crear una cuenta, contratar una suscripción o acceder a los módulos de ZENIC (incluyendo ZENIC POS, Cloud ERP, Inteligencia Artificial de Visión y Pasarelas de Pago), el cliente declara ser mayor de edad, contar con la capacidad legal o representación comercial suficiente y aceptar expresamente estos Términos y Condiciones.'
        ]
      },
      {
        title: '2. Licencia de Uso del Software (SaaS)',
        content: [
          'ZENIC otorga al cliente una licencia limitada, revocable, no exclusiva, intransferible y no sublicenciable para acceder y utilizar las soluciones en la nube durante la vigencia del plan o suscripción contratada.',
          'El cliente no podrá descompilar, realizar ingeniería inversa, revender, alquilar ni vulnerar los mecanismos de seguridad criptográfica de la plataforma.'
        ]
      },
      {
        title: '3. Niveles de Servicio (SLA) y Disponibilidad',
        content: [
          'ZENIC implementa infraestructura de alta disponibilidad distribuida con un objetivo de operatividad del 99.9% mensual. El software cuenta además con arquitectura de contingencia offline local para puntos de venta (POS), garantizando continuidad en caso de interrupción temporal de Internet.',
          'Las ventanas de mantenimiento preventivo serán notificadas con un mínimo de veinticuatro (24) horas de anticipación a través del panel de control o correo electrónico registrado.'
        ]
      },
      {
        title: '4. Propiedad Intelectual',
        content: [
          'Todos los derechos de propiedad intelectual, derechos de autor, marcas, nombres comerciales, patentes de software, modelos de inteligencia artificial y código fuente de ZENIC son propiedad exclusiva de ZENIC S.A.S. protegido por la Decisión 351 de la Comunidad Andina y la Ley 23 de 1982.',
          'La información comercial, inventarios y bases de datos transaccionales cargadas por el cliente pertenecen exclusivamente al cliente, quien autoriza a ZENIC a procesarlas únicamente para la prestación del servicio contratado.'
        ]
      },
      {
        title: '5. Ley Aplicable y Jurisdicción',
        content: [
          'Este contrato se rige e interpreta íntegramente de conformidad con las leyes de la República de Colombia. Cualquier controversia no resuelta de mutuo acuerdo dentro de los treinta (30) días calendario siguientes a la notificación formal será sometida a los jueces ordinarios de la República de Colombia con sede en Bogotá D.C.'
        ]
      }
    ]
  },

  privacidad: {
    id: 'privacidad',
    title: 'Política de Tratamiento de Datos Personales (Habeas Data)',
    badge: 'Habeas Data',
    lawReference: 'Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013',
    effectiveDate: 'Aprobada: Enero 2026',
    summary: 'Define los principios, finalidades y procedimientos con los cuales ZENIC S.A.S. recolecta, almacena, procesa y protege los datos personales de clientes y usuarios.',
    sections: [
      {
        title: '1. Responsable del Tratamiento',
        content: [
          'ZENIC S.A.S., sociedad colombiana con NIT 901.842.109-4, con domicilio en Bogotá D.C., Colombia, es la persona jurídica responsable del tratamiento de los datos personales suministrados a través del portal web y aplicaciones cliente.',
          'Canal de atención para el ejercicio de Habeas Data: correo electrónico certificado privacidad@zenic.co y línea corporativa +57 311 564 3557.'
        ]
      },
      {
        title: '2. Finalidades de la Recolección de Datos',
        content: [
          'Gestión y ejecución de la relación comercial y contractual para el aprovisionamiento de servicios de software SaaS.',
          'Emisión y validación previa de facturación electrónica de venta ante la Dirección de Impuestos y Aduanas Nacionales (DIAN).',
          'Soporte técnico, diagnóstico preventivo de incidencias y autenticación segura de usuarios en la plataforma.',
          'Envío de alertas operativas críticas (ej. intentos de inicio de sesión no reconocidos, vencimiento de planes, copias de seguridad).'
        ]
      },
      {
        title: '3. Derechos de los Titulares de los Datos',
        content: [
          'Conforme al Artículo 8 de la Ley 1581 de 2012, usted como titular tiene derecho a:',
          'a) Conocer, actualizar y rectificar sus datos personales frente a ZENIC.',
          'b) Solicitar prueba de la autorización otorgada para el tratamiento.',
          'c) Ser informado del uso que se ha dado a sus datos personales.',
          'd) Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.',
          'e) Revocar la autorización y/o solicitar la supresión del dato cuando no medie deber legal o contractual de permanecer en la base de datos.',
          'f) Acceder de forma gratuita a sus datos personales que hayan sido objeto de tratamiento.'
        ]
      },
      {
        title: '4. Procedimiento para Consultas y Reclamos',
        content: [
          'Los titulares pueden remitir su solicitud indicando nombre completo, documento de identidad y descripción clara de la petición a privacidad@zenic.co. Las consultas serán atendidas en un término máximo de diez (10) días hábiles y los reclamos en un término máximo de quince (15) días hábiles conforme a los Artículos 14 y 15 de la Ley 1581 de 2012.'
        ]
      }
    ]
  },

  cookies: {
    id: 'cookies',
    title: 'Política de Cookies y Tecnologías de Almacenamiento Local',
    badge: 'Transparencia Digital',
    lawReference: 'Ley 527 de 1999 y Guía SIC de Privacidad en Internet',
    effectiveDate: 'Actualizada: 2026',
    summary: 'Explica el uso de cookies técnicas, analíticas y almacenamiento seguro para garantizar la funcionalidad de autenticación y rendimiento del sitio web.',
    sections: [
      {
        title: '1. ¿Qué son las Cookies y Almacenamiento Local?',
        content: [
          'Las cookies y los elementos de almacenamiento web (LocalStorage) son pequeños archivos de datos que se descargan de forma segura en su navegador al ingresar a la plataforma ZENIC, permitiendo recordar sus preferencias de sesión y brindar una experiencia fluida.'
        ]
      },
      {
        title: '2. Tipos de Cookies que Empleamos',
        content: [
          'Cookies Técnicas Esenciales: Imprescindibles para el funcionamiento seguro de la plataforma, verificación de token JWT y protección contra ataques CSRF.',
          'Cookies de Personalización: Recuerdan sus preferencias de interfaz (modo oscuro/claro y personalización visual).',
          'Cookies Analíticas Anónimas: Miden de forma agregada el rendimiento y velocidad de carga de las páginas sin identificar individualmente a los usuarios.'
        ]
      },
      {
        title: '3. Administración y Desactivación de Cookies',
        content: [
          'Usted puede bloquear o eliminar las cookies en cualquier momento a través de la configuración de privacidad de su navegador (Chrome, Edge, Firefox, Safari). Tenga en cuenta que deshabilitar cookies esenciales puede impedir el inicio de sesión en los servicios de administración de ZENIC.'
        ]
      }
    ]
  },

  retracto: {
    id: 'retracto',
    title: 'Facturación Electrónica DIAN, Retracto y Reembolsos',
    badge: 'Estatuto del Consumidor',
    lawReference: 'Ley 1480 de 2011 (Arts. 47 y 51) y Dec. 587 de 2016',
    effectiveDate: 'Vigente: 2026',
    summary: 'Mecanismos legales de emisión de factura electrónica con CUFE, derecho de retracto en comercio electrónico dentro de 5 días hábiles y reversión de pagos.',
    sections: [
      {
        title: '1. Facturación Electrónica Obligatoria ante la DIAN',
        content: [
          'ZENIC S.A.S. es facturador electrónico obligatorio. Cada transacción realizada en la plataforma genera una Factura Electrónica de Venta con Código Único de Facturación Electrónica (CUFE), validada previamente por la Dirección de Impuestos y Aduanas Nacionales (DIAN) y remitida automáticamente al correo del adquirente.'
        ]
      },
      {
        title: '2. Derecho de Retracto (Artículo 47 Ley 1480 de 2011)',
        content: [
          'Para ventas realizadas mediante métodos a distancia o comercio electrónico, el adquirente tiene derecho a retractarse de la compra dentro del término de cinco (5) días hábiles contados a partir de la fecha de suscripción del plan.',
          'En caso de ejercer el derecho de retracto, ZENIC reintegrará el dinero pagado en su totalidad dentro de los treinta (30) días calendario siguientes a la radicación de la solicitud, sin deducción ni retención alguna.'
        ]
      },
      {
        title: '3. Reversión de Pagos (Artículo 51 Ley 1480 y Decreto 587 de 2016)',
        content: [
          'Cuando el pago se haya realizado a través de tarjetas de crédito, débito o cualquier otro instrumento de pago electrónico, el cliente podrá solicitar la reversión en los siguientes eventos:',
          '- Cuando haya sido víctima de un fraude comprobado.',
          '- Cuando corresponda a una operación no solicitada.',
          '- Cuando el servicio adquirido no haya sido prestado.',
          'La solicitud debe presentarse dentro de los cinco (5) días hábiles siguientes a la fecha en que tuvo conocimiento del evento.'
        ]
      }
    ]
  },

  pqr: {
    id: 'pqr',
    title: 'Aviso Legal, Vigilancia SIC y Radicación de PQR',
    badge: 'Atención al Cliente',
    lawReference: 'Ley 1480 de 2011 y Circular Única de la SIC',
    effectiveDate: 'Vigente: 2026',
    summary: 'Canales oficiales de radicación de Peticiones, Quejas y Reclamos con radicado único, tiempos de respuesta de 15 días hábiles e información de la Superintendencia de Industria y Comercio.',
    sections: [
      {
        title: '1. Datos Corporativos Oficiales',
        content: [
          'Razón Social: ZENIC S.A.S.',
          'NIT: 901.842.109-4',
          'Domicilio: Bogotá D.C., Colombia',
          'Correo Oficial de Notificaciones Judiciales: judicial@zenic.co',
          'Línea de Atención: +57 311 564 3557'
        ]
      },
      {
        title: '2. Sistema de Peticiones, Quejas y Reclamos (PQR)',
        content: [
          'Cualquier usuario o suscriptor puede radicar peticiones, quejas, reclamos o sugerencias a través del correo pqr@zenic.co o mediante el formulario de contacto web.',
          'A toda solicitud se le asignará un número de radicado único de seguimiento.',
          'Tiempo de respuesta legal: Máximo quince (15) días hábiles siguientes a la fecha de radicación conforme a la Ley 1755 de 2015 y el Estatuto del Consumidor.'
        ]
      },
      {
        title: '3. Entidad de Control y Vigilancia',
        content: [
          'La Superintendencia de Industria y Comercio (SIC) es la entidad encargada de velar por el cumplimiento de los derechos de los consumidores en Colombia y de la protección de datos personales.',
          'Página oficial de la entidad de vigilancia: www.sic.gov.co',
          'Sede física de la SIC: Carrera 13 No. 27 - 00, Bogotá D.C., Colombia.'
        ]
      }
    ]
  }
};

