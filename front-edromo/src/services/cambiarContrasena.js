/**
 * Verifica la contraseña actual del usuario contra el backend.
 * @param {string} currentPassword - La contraseña que el usuario ingresó.
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta del backend.
 */

export const verifyCurrentPassword = async (currentPassword, token) => {
  // IMPORTANTE: Reemplaza esta URL con el endpoint real de tu backend.
  const API_URL =
    "http://localhost:5189/api/Cliente/VerificarContrasenaRecuperar";

  // Verificación: Asegúrate de que el token se está recibiendo.
  if (!token) {
    // Si no hay token, no tiene sentido hacer la llamada. Lanza un error.
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Si usas autenticación por token (JWT), deberías incluirlo aquí.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword: currentPassword }),
    });

    // Si la respuesta no es exitosa (ej: 401 Contraseña incorrecta),
    // el backend debería enviar un mensaje de error en formato JSON.
    if (!response.ok) {
      const errorData = await response.json();
      // Lanzamos un error que será capturado por el controller.
      throw new Error(
        errorData.message || "La contraseña es incorrecta. Intente de nuevo."
      );
    }
    // Si todo fue bien, devolvemos la respuesta.
    return await response.json();
  } catch (error) {
    // Si hay un error de red o el lanzado por nosotros, lo relanzamos.
    console.error("Error en el servicio de verificación:", error);
    throw error;
  }
};

// src/service/service-changePassword.js

// ... (la función verifyCurrentPassword que ya tienes se queda igual)

/**
 * Envía la nueva contraseña para ser actualizada.
 * @param {string} newPassword - La nueva contraseña a guardar.
 * @returns {Promise<Object>} - Una promesa que simula una respuesta exitosa.
 */
// --- CÓDIGO REAL PARA EL BACKEND (para el futuro) ---

export const updatePassword = async (newPassword, token) => {
  const API_URL = "http://localhost:5189/api/Cliente/ActualizarContrasena";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword: newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "No se pudo cambiar la contraseña.");
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Error en el servicio de actualización de contraseña:",
      error
    );
    throw error;
  }
};
