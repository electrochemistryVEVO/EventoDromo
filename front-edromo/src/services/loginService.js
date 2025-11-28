const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function autenticarUsuario(loginInfo) {
  //link q funciona en individual: http://localhost:5189/api/Cliente/AutenticarLoginCliente"
  //link q funciona en docker: http://localhost:8081/api/Cliente/AutenticarLoginCliente"
  const res = await fetch(BASE_API_URL + "/Cliente/AutenticarLoginCliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  });
  console.log(res);
  if (!res.ok)
    throw new Error(
      "Error al autenticar cliente login (status:" + res.status + ")"
    );
  const json = await res.json();
  if (!json) throw new Error("Error al autenticar cliente login (json vacio)");
  if (json.success === false) {
    throw new Error(
      json.error || json.mensaje || "Error en respuesta del servicio"
    );
  }
  return json.data;
}

/**
 * 2. Solicitar Recuperación
 * Envía el correo al backend.
 */
export async function enviarCorreoRecuperacion(email) {
  console.log("--> [FRONT] Enviando a /Cliente/RecuperarContrasena:", {
    email,
  });

  const res = await fetch(`${BASE_API_URL}/Cliente/RecuperarContrasena`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  console.log("<-- [FRONT] Respuesta recibida del backend:", data);

  // 1. Validación de error HTTP (Status 400, 500, etc.)
  if (!res.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "No se pudo enviar el correo de recuperación."
    );
  }

  // Si el backend dice success: false, lanzamos el error manualmente para que el Modal lo capture.
  if (data.success === false) {
    // Usamos data.message o data.error según lo que mande tu backend
    throw new Error(data.message || data.error || "El correo no es válido.");
  }

  return data;
}
/**
 * 3. Restablecer Contraseña
 * Envía el token y la nueva contraseña para cambiarla definitivamente.
 */
export async function resetearPasswordConToken(token, newPassword) {
  // 1. VALIDACIÓN PREVENTIVA (Best Practice)
  // Antes de llamar al servidor, validamos que tengamos los datos necesarios.
  if (!token) {
    throw new Error("Token no válido o expirado.");
  }
  if (!newPassword || newPassword.length < 6) {
    // Puedes ajustar la longitud según tus reglas de negocio
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  // 2. LOG DE ENTRADA
  // Mostramos qué se envía. Por seguridad, en logs reales se suele ocultar la pass,
  // pero para tu desarrollo actual lo dejaremos visible o parcialmente oculto.
  console.log("--> [FRONT] Enviando a /Auth/RestablecerPassword:", {
    token,
    newPassword, // Ojo: en producción evita loguear contraseñas reales
  });

  try {
    const res = await fetch(`${BASE_API_URL}/Cliente/RestablecerContrasena`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    // Verificamos que el servidor realmente devuelva JSON antes de intentar parsearlo
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Error de servidor: La respuesta no es un JSON válido.");
    }

    const data = await res.json();

    // 3. LOG DE SALIDA
    console.log("<-- [FRONT] Respuesta recibida del backend:", data);

    // 4. VALIDACIÓN DE ERROR HTTP (404, 500, etc.)
    if (!res.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Error del servidor (Código: ${res.status})`
      );
    }

    // 5. VALIDACIÓN LÓGICA DEL BACKEND (Status 200 pero success: false)
    if (data.success === false) {
      throw new Error(
        data.message ||
          data.error ||
          "No se pudo restablecer la contraseña. El enlace puede haber expirado."
      );
    }

    return data; // Retorna éxito
  } catch (error) {
    console.error("xxx [FRONT] Error en resetearPasswordConToken:", error);
    throw error;
  }
}
