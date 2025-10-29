// src/service/admin-service.js

/**
 * Obtiene el token de autenticación almacenado.
 * @returns {string|null} - El token JWT o null si no existe.
 */
const getAuthToken = () => {
  const sessionJSON = sessionStorage.getItem("session");

  // Variable para guardar el token final
  let userToken = null;
  // 2. MUY IMPORTANTE: Verificar que el dato exista antes de continuar
  if (sessionJSON) {
    // 3. Convertir (parsear) la cadena JSON a un objeto de JavaScript real
    const sessionData = JSON.parse(sessionJSON);
    // 4. Ahora sí, acceder a la propiedad "token" del objeto
    userToken = sessionData.token;
  }
  return userToken;
};

/**
 * Realiza una llamada fetch al backend para obtener los datos del usuario.
 * @returns {Promise<Object>} - Una promesa que resuelve con los datos del usuario.
 */
export const fetchUserData = async () => {
  const API_URL = "http://localhost:5189/api/Administrador/FetchAdminData";
  try {
    const token = getAuthToken();
    if (!token) {
      console.error(
        "fetchUserData: No se encontró el token de autenticación en localStorage."
      );
      return { name: "Invitado" }; // Retornamos temprano si no hay token.
    }
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Convierte la respuesta a JSON sin importar si fue exitosa o no, para poder leer el mensaje.
    const result = await response.json();
    // Línea de depuración clave: mira en la consola del navegador qué está respondiendo el backend.
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
