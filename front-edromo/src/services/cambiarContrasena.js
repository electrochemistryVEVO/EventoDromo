export const verifyCurrentPassword = async (currentPassword, token) => {
  const API_URL =
    "http://localhost:5189/api/Cliente/VerificarContrasenaRecuperar";

  if (!token) {
    throw new Error("Token de autenticación no proporcionado al servicio.");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword: currentPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "La contraseña es incorrecta. Intente de nuevo."
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error en el servicio de verificación:", error);
    throw error;
  }
};


export const updatePassword = async (newPassword, token) => {
  const API_URL = "http://localhost:5189/api/Cliente/ActualizarContrasena";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Esta línea está limpia, sin caracteres raros
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