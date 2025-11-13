import { api } from "@/lib/api"; // Asegúrate que esta ruta sea correcta

const TRANSACCION_ENDPOINTS = {
  procesarTarjeta: "/Transaccion/ProcesarPagoTarjeta",
  // (Aquí podríamos agregar procesarPuntos en el futuro)
};

/**
 * Llama al backend para procesar un pago con tarjeta.
 * @param {object} payload - El objeto con 'datosTarjeta' y 'datosFacturacion'.
 * @param {string} token - El token JWT del usuario.
 * @returns {Promise<object>} - Respuesta del servicio.
 */
export const procesarPagoConTarjeta = async (payload, token) => {
  try {
    // api.post ya stringifica el body y añade Content-Type
    const response = await api.post(
      TRANSACCION_ENDPOINTS.procesarTarjeta, 
      payload, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    // Si api.post tiene éxito, 'response' ya es 'genericResponse.data'
    return { success: true, data: response }; 

  } catch (error) {
    console.error("Error al procesar el pago:", error);
    // tu apiFetch lanza un Error con el 'errorMessage'
    return { success: false, error: error.message || "Error al conectar con el servidor" };
  }
};