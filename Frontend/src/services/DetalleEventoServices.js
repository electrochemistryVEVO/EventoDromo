// --- VERSIÓN 1: Para Desarrollo (usando el JSON hardcodeado) ---
import localEventData from "../../public/data/evento-detalle-data.json";

/**
 * Obtiene los detalles del evento desde un archivo JSON local.
 * Se envuelve en una Promesa para simular el comportamiento de una API real.
 * De esta forma, el controller no necesita cambiar su lógica (siempre usará .then() o await).
 * @returns {Promise<object>} Una promesa que resuelve con los datos del evento.
 */
const getEventDetailsFromJSON = () => {
  console.log("Cargando datos desde el archivo JSON local...");
  return Promise.resolve(localEventData);
};

// --- VERSIÓN 2: Para Producción (llamando a la base de datos vía API) ---
// La URL base de tu API. Es una buena práctica tenerla en un solo lugar.
// En un proyecto real, esto vendría de un archivo de configuración (.env).
const API_BASE_URL = "https://api.tu-dominio.com/v1";

/**
 * Obtiene los detalles de un evento específico desde la API del backend.
 * @param {string | number} eventId - El ID del evento a consultar.
 * @returns {Promise<object>} Una promesa que resuelve con los datos del evento desde la API.
 */
const getEventDetailsFromAPI = async (eventId) => {
  console.log(`Consultando API para el evento con ID: ${eventId}...`);
  try {
    // Hacemos la petición a la URL completa, ej: https://api.tu-dominio.com/v1/eventos/1
    const response = await fetch(`${API_BASE_URL}/eventos/${eventId}`);

    // fetch no lanza un error para respuestas como 404 o 500.
    // Debemos verificar si la respuesta fue exitosa manualmente.
    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`,
      );
    }

    // Si la respuesta es exitosa, la convertimos de JSON a un objeto JavaScript.
    const data = await response.json();
    return data;
  } catch (error) {
    // Si algo falla (problema de red, error en la API, etc.), lo capturamos.
    console.error("Error al obtener datos desde la API:", error);

    // Devolvemos un objeto con el mismo formato que tu JSON de éxito, pero indicando el error.
    // Así el controller sabe cómo manejarlo.
    return {
      success: false,
      mensaje:
        "No se pudieron cargar los datos del evento. Por favor, inténtelo más tarde.",
      data: null,
      error: error.message,
    };
  }
};

// --- EXPORTACIÓN ---
// Exportamos una única función `getEventDetails`.
// Simplemente comenta la línea que no quieras usar para cambiar entre desarrollo y producción.

export const getEventDetails = {
  // **Para usar el JSON local:**
  fetch: getEventDetailsFromJSON,

  // **Para usar la API real (comenta la línea de arriba y descomenta esta):**
  // fetch: (eventId) => getEventDetailsFromAPI(eventId),
};
