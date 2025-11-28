/**
 * @file dromopuntos.service.js
 * @description Servicio para la comunicación con el backend para la gestión de DromoPuntos.
 */

// --- Interruptor para cambiar entre Backend y Mock Data ---
// Cambia a 'true' para usar el backend real.
// Cambia a 'false' para usar el archivo dromopuntos-config.json local.
const USE_BACKEND = true;

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Obtiene la configuración actual de DromoPuntos desde el backend.
 * @param {string} token - El token JWT del administrador autenticado.
 * @returns {Promise<{puntosPorSol: number, mesesVigenciaPuntos: number, minutosVigenciaCarrito: number}>} Una promesa que resuelve con la configuración actual.
 */
export const getConfig = async (token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  let response;

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    try {
      console.log("SERVICE: Obteniendo configuración completa de DromoPuntos desde el BACKEND...");
      response = await fetch(`${BASE_API_URL}/Dromopuntos/ObtenerConfiguracion`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error en el servicio getConfig (backend):", error);
      throw error; // Relanzamos el error para que el controlador lo maneje.
    }
  } else {
    // --- Lógica para usar Mock Data (JSON local) ---
    console.log("SERVICE: Obteniendo configuración desde MOCK (dromopuntos-config.json)...");
    // Simulamos un pequeño retraso para imitar una llamada de red
    await new Promise(resolve => setTimeout(resolve, 500));
    response = await fetch(`/data/dromopuntos-config.json`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Error al obtener la configuración de DromoPuntos"
    );
  }

  return await response.json();
};

/**
 * Envía la nueva configuración de DromoPuntos al backend.
 * @param {object} configData - Objeto con los valores a actualizar {puntosPorSol, mesesVigenciaPuntos, minutosVigenciaCarrito}
 * @param {string} token - El token JWT del administrador autenticado.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta del backend.
 */
export const updateConfig = async (configData, token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  if (!configData || typeof configData !== 'object') {
    throw new Error("Los datos de configuración deben ser un objeto.");
  }

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    try {
      console.log("SERVICE: Enviando nueva configuración al BACKEND:", configData);
      const response = await fetch(`${BASE_API_URL}/Dromopuntos/ActualizarConfiguracion`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ocurrió un error al guardar.");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en el servicio updateConfig (backend):", error);
      throw error;
    }
  } else {
    // --- Lógica para simular el envío y verificar el JSON ---
    console.log("SERVICE: Configuración que se enviaría al backend (MOCK):", configData);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red

    // Devolvemos una respuesta de éxito simulada
    return { success: true, message: "Configuración actualizada en el mock." };
  }
};

/**
 * Obtiene los puntos disponibles actuales del usuario autenticado desde el backend.
 * @param {string} token - El token JWT del cliente autenticado.
 * @returns {Promise<number>} Una promesa que resuelve con la cantidad de puntos disponibles.
 */
export const obtenerPuntosDisponibles = async (token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  try {
    console.log("SERVICE: Obteniendo puntos disponibles del usuario desde el BACKEND...");
    const response = await fetch(`${BASE_API_URL}/Dromopuntos/ObtenerResumen`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || errorData.error || `Error HTTP ${response.status}: ${response.statusText}`
      );
    }

    const json = await response.json();

    if (!json.success) {
      throw new Error(json.error || json.message || "Error desconocido en el backend");
    }

    // json.data contiene ResumenDromopuntosDTO, que tiene TotalDisponible
    return json.data?.totalDisponible ?? 0;

  } catch (error) {
    console.error("Error en el servicio obtenerPuntosDisponibles:", error);
    throw error;
  }
};