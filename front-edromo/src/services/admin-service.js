// src/services/admin-service.js

/**
 * Obtiene el token de autenticación almacenado del UserContext.
 * @returns {string|null} - El token JWT o null si no existe.
 */
export const getAuthToken = () => {
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
 * Realiza una llamada fetch al backend para obtener los datos del admin.
 * @param {string} token - El token JWT para autenticar la llamada.
 * @returns {Promise<Object>} - Una promesa que resuelve con los datos del usuario.
 */
export const fetchUserData = async (token) => {
  const API_URL = "http://localhost:5189/api/Administrador/FetchAdminData";
  try {
    // 3. El token ahora se pasa como argumento (no se lee aquí)
    if (!token) {
      console.error(
        "fetchUserData: No se proporcionó un token."
      );
      return { name: "Invitado" }; 
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("Respuesta completa del backend:", result);

    if (response.ok && result.success === true) {
      return {
        name: result.data.name, 
      };
    } else {
      throw new Error(
        result.message || "El backend indicó un error desconocido."
      );
    }
  } catch (error) {
    console.error("Error final en el servicio fetchUserData:", error.message);
    return { name: "Invitado" };
  }
};