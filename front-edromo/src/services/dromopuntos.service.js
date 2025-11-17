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
 * @returns {Promise<{valorEnSoles: number}>} Una promesa que resuelve con la configuración actual.
 */
export const getConfig = async (token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  let response;

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    try {
      console.log("SERVICE: Obteniendo valor actual de DromoPuntos desde el BACKEND...");
      response = await fetch(`${BASE_API_URL}/Dromopuntos/DromoPuntosObtenerValorActual`, {
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
 * @param {number} nuevoValor - El nuevo valor numérico para los dromopuntos.
 * @param {string} token - El token JWT del administrador autenticado.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta del backend.
 */
export const updateConfig = async (nuevoValor, token) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  if (typeof nuevoValor !== 'number' || nuevoValor <= 0) {
    throw new Error("El nuevo valor debe ser un número mayor a cero.");
  }

  if (USE_BACKEND) {
    // --- Lógica para conectar con el Backend Real ---
    try {
      console.log("SERVICE: Enviando nuevo valor al BACKEND:", nuevoValor);
      const response = await fetch(`${BASE_API_URL}/Dromopuntos/ActualizarValorDromoPuntos/${nuevoValor.toString().replace(',', '.')}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
    console.log("SERVICE: Valor que se enviaría al backend (MOCK):", nuevoValor);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red

    // Devolvemos una respuesta de éxito simulada
    return { success: true, message: "Configuración actualizada en el mock." };
  }
};