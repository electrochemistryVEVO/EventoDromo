/**
 * Utilidades de autenticación compartidas
 */

/**
 * Obtiene el token de autenticación almacenado en localStorage.
 * @returns {string|null} - El token JWT o null si no existe.
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const userJSON = localStorage.getItem("user");
    if (!userJSON) {
      return null;
    }

    const userData = JSON.parse(userJSON);
    return userData?.token || null;
  } catch (error) {
    console.error("Error al leer token de localStorage:", error);
    return null;
  }
};

/**
 * Realiza una llamada fetch autenticada al backend.
 * @param {string} url - URL completa del endpoint
 * @param {object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<Response>} - Promesa con la respuesta
 * @throws {Error} - Si no hay token de autenticación
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No se encontró el token de autenticación.');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Procesa la respuesta del API y extrae los datos.
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<any>} - Datos extraídos del API
 * @throws {Error} - Si la respuesta no es exitosa
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText
    }));
    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
  }

  const apiResponse = await response.json();

  if (apiResponse && apiResponse.success) {
    return apiResponse.data || apiResponse;
  } else {
    throw new Error(apiResponse.message || 'La respuesta del API no fue exitosa.');
  }
};
