/**
 * @file detalle-transaccion.service.js
 * @description Servicio para obtener los detalles completos de una transacción
 */

// Cambiar a true para usar datos mock durante desarrollo
const USE_MOCK = false;

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Obtiene el detalle completo de una transacción
 * @param {string} numeroTransaccion - Número de transacción (ej: "TXN20250911001")
 * @param {string} token - Token JWT del usuario
 * @returns {Promise<Object>} Objeto con toda la información de la transacción
 */
export async function obtenerDetalleTransaccion(numeroTransaccion, token) {
  if (!numeroTransaccion) {
    throw new Error("Número de transacción requerido");
  }

  if (!token) {
    throw new Error("Token de autenticación requerido");
  }

  // Modo mock para desarrollo
  if (USE_MOCK) {
    console.log("🧪 Usando datos mock para:", numeroTransaccion);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Cargar datos desde la carpeta data según el tipo de transacción
    let dataFile = "/data/detalle-transaccion.json"; // default: tarjeta
    
    if (numeroTransaccion.startsWith("TRP")) {
      dataFile = "/data/detalle-transaccion-puntos.json";
    } else if (numeroTransaccion.startsWith("TRF")) {
      if (numeroTransaccion.includes("004")) {
        dataFile = "/data/detalle-transaccion-pendiente.json";
      } else {
        dataFile = "/data/detalle-transaccion-transferencia.json";
      }
    }

    const response = await fetch(dataFile);
    return await response.json();
  }

  // Modo producción - llamada real al backend
  try {
    const url = `${BASE_API_URL}/Transaccion/ObtenerDetalleCompleto/${encodeURIComponent(numeroTransaccion)}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Transacción no encontrada");
      }
      throw new Error(`Error al obtener detalle: ${response.status}`);
    }

    const json = await response.json();

    if (!json) {
      throw new Error("Respuesta vacía del servidor");
    }

    if (json.success === false) {
      throw new Error(json.error || json.message || "Error al obtener detalle");
    }

    return json; // Retorna el GenericResponse completo con { success, mensaje, data, error }
  } catch (error) {
    console.error("Error en obtenerDetalleTransaccion:", error);
    throw error;
  }
}
