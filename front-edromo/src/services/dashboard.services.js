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
    const token = getAuthToken();

    const response = await fetch(`${URL_BASE_API}/Administrador/Indicadores`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: La solicitud de indicadores falló.`
      );
    }

    // 1. Obtenemos la respuesta original del backend
    const resultado = await response.json();

    if (resultado.success && resultado.data) {
      resultado.data.tiempoSesionPromedio = {
        minutos: 23,
        porcentajeCambio: 12.5,
      };
    }

    // 3. Retornamos el resultado ya con el dato agregado
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
      `${URL_BASE_API}/Administrador/EventosMasVendidos`,
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
 * Requiere autenticación Bearer Token.
 * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
 */
export const obtenerOcupacionLocales = async () => {
  try {
    // 1. Obtener el token
    const token = getAuthToken();

    // 2. Validar si existe el token antes de hacer la llamada
    if (!token) {
      console.warn("Intento de obtener ocupación sin token de autenticación.");
      return {
        success: false,
        message:
          "No se encontró sesión activa. Por favor inicie sesión nuevamente.",
      };
    }

    // 3. Realizar la petición
    const response = await fetch(
      `${URL_BASE_API}/Local/Feat_MetricDashB_ObtenerOcupacionLocales`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 4. Manejo de errores HTTP (401, 403, 404, 500, etc.)
    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: "Sesión expirada o inválida." };
      }

      throw new Error(
        `Error HTTP ${response.status}: La solicitud de ocupación de locales falló.`
      );
    }

    // 5. Retornar el JSON
    const resultado = await response.json();
    return resultado;
  } catch (error) {
    console.error("Error en servicio obtenerOcupacionLocales:", error.message);
    return { success: false, message: error.message };
  }
};
