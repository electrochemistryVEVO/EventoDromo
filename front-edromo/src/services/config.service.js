/**
 * @file config.service.js
 * @description Servicio para obtener la configuración global del sistema desde el backend
 */

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Obtiene la configuración completa del sistema (puntos, vigencia, carrito)
 * @returns {Promise<{success: boolean, data: {puntosPorSol: number, mesesVigenciaPuntos: number, minutosVigenciaCarrito: number}}>}
 */
export const obtenerConfiguracion = async () => {
  try {
    console.log("SERVICE: Obteniendo configuración del sistema desde el BACKEND...");
    
    const response = await fetch(`${BASE_API_URL}/Dromopuntos/ObtenerConfiguracion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Error HTTP: ${response.status}`,
        data: null,
        error: errorData.error || "HTTP_ERROR",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en el servicio obtenerConfiguracion:", error);
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: null,
      error: error.message,
    };
  }
};
