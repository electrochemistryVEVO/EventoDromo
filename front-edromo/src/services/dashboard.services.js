'use server'
// =================================================================================================
// --- DATOS HARCODEADOS ---
// Estos datos simulan la respuesta que el backend debería enviar. Útiles para maquetar.
// =================================================================================================
const datosHarcodeados = {
  indicadores: {
    ingresosTotales: {
      monto: 124670,
      porcentajeCambio: 12.5,
    },
    puntosUsadosPromedio: {
      monto: 36,
      porcentajeCambio: 12.5,
    },
    entradasVendidas: {
      monto: 1890,
      porcentajeCambio: 12.5,
    },
    usuariosNuevos: {
      monto: 4592,
      porcentajeCambio: 12.5,
    },
    tiempoSesionPromedio: {
      minutos: 23,
      porcentajeCambio: 12.5,
    },
    tasaConversion: {
      tasa: 67.5,
      porcentajeCambio: -2.5,
    },
  },
  eventosMasVendidos: [
    {
      id: "EVT001",
      nombre: "Overpass Lima",
      ubicacion: "Estadio San Marcos",
      precio: 2300,
      entradasVendidas: 450,
    },
    {
      id: "EVT002",
      nombre: "Circo Alegría Lima",
      ubicacion: "Teatro Municipal de Lima",
      precio: 1100,
      entradasVendidas: 320,
    },
    {
      id: "EVT003",
      nombre: "Teatro Cordobés",
      ubicacion: "Teatro Municipal de Lince",
      precio: 1030,
      entradasVendidas: 54,
    },
    {
      id: "EVT004",
      nombre: "Linkin Park",
      ubicacion: "Estadio San Marcos",
      precio: 5600,
      entradasVendidas: 467,
    },
    {
      id: "EVT005",
      nombre: "Universitario vs Alianza Lima",
      ubicacion: "Estadio Monumental",
      precio: 4300,
      entradasVendidas: 473,
    },
  ],
  ocupacionLocales: [
    {
      id: "VEN001",
      nombre: "Estadio San Marcos",
      diasOcupados: 28,
      tasaOcupacion: 93.3,
    },
    {
      id: "VEN002",
      nombre: "Teatro Municipal de Lima",
      diasOcupados: 28,
      tasaOcupacion: 93.3,
    },
    {
      id: "VEN003",
      nombre: "Teatro Municipal de Lince",
      diasOcupados: 28,
      tasaOcupacion: 93.3,
    },
    {
      id: "VEN004",
      nombre: "Estadio Nacional",
      diasOcupados: 28,
      tasaOcupacion: 93.3,
    },
    {
      id: "VEN005",
      nombre: "Estadio Monumental",
      diasOcupados: 28,
      tasaOcupacion: 93.3,
    },
    {
      id: "VEN006",
      nombre: "Jockey Club",
      diasOcupados: 28,
      tasaOcupacion: 93.3,
    },
  ],
};

// =================================================================================================
// --- SERVICIOS HARCODEADOS (PARA DESARROLLO Y VISUALIZACIÓN) ---
// Funciones asíncronas que simulan una llamada a la API con un pequeño retardo.
// =================================================================================================

/**
 * Obtiene los KPIs del dashboard (versión hardcodeada).
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const obtenerIndicadoresDashboardHarcodeado = async () => {
  console.log("Servicio: Obteniendo Indicadores (hardcoded)");
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simula retardo de red
  return { success: true, data: datosHarcodeados.indicadores };
};

/**
 * Obtiene la lista de eventos más vendidos (versión hardcodeada).
 * @returns {Promise<{success: boolean, data: Array<object>}>}
 */
export const obtenerEventosMasVendidosHarcodeado = async () => {
  console.log("Servicio: Obteniendo eventos más vendidos (hardcoded)");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simula retardo de red
  return { success: true, data: datosHarcodeados.eventosMasVendidos };
};

/**
 * Obtiene los datos de ocupación de locales de los últimos 30 días (versión hardcodeada).
 * @returns {Promise<{success: boolean, data: Array<object>}>}
 */
export const obtenerOcupacionLocalesHarcodeado = async () => {
  console.log("Servicio: Obteniendo ocupación de locales (hardcoded)");
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simula retardo de red
  return { success: true, data: datosHarcodeados.ocupacionLocales };
};

// =================================================================================================
// --- SERVICIOS REALES (CON FETCH PARA EL BACKEND) ---
// Estas funciones se conectarán a los endpoints reales del backend.
// =================================================================================================

const URL_BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL; // Reemplazar con la URL real del backend
const getAuthToken = () => {
  try {
    // 1. Lee la clave "user" de localStorage (donde UserContext la guarda)
    const userJSON = localStorage.getItem("user");

    if (!userJSON) {
      return null;
    }

    // 2. Parsea el objeto y devuelve la propiedad "token"
    const userData = JSON.parse(userJSON);
    return userData?.token || null;
  } catch (error) {
    console.error("Error al leer token de localStorage:", error);
    return null;
  }
};
/**
 * Llama al endpoint del backend para obtener los KPIs del dashboard.
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const obtenerIndicadoresDashboard = async () => {
  try {
    const response = await fetch(`${URL_BASE_API}/indicadores`);
    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: La solicitud de indicadores falló.`
      );
    }
    const resultado = await response.json();
    // Asumimos que el backend responde con { success: true, data: {...} }
    return resultado;
  } catch (error) {
    console.error(
      "Error en servicio obtenerIndicadoresDashboard:",
      error.message
    );
    return { success: false, message: error.message };
  }
};

/**
 * Llama al endpoint del backend para obtener los eventos más vendidos.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const obtenerEventosMasVendidos = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Token de autenticación no encontrado.");
    const response = await fetch(
      `${URL_BASE_API}/Evento/EventoGetEventosMasVendidos`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: La solicitud de eventos más vendidos falló.`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(
      "Error en servicio obtenerEventosMasVendidos:",
      error.message
    );
    return { success: false, message: error.message };
  }
};

/**
 * Llama al endpoint para obtener la ocupación de locales en los últimos 30 días.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const obtenerOcupacionLocales = async () => {
  try {
    const response = await fetch(
      `${URL_BASE_API}/ocupacion-locales?periodo=30d`
    );
    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: La solicitud de ocupación de locales falló.`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en servicio obtenerOcupacionLocales:", error.message);
    return { success: false, message: error.message };
  }
};
