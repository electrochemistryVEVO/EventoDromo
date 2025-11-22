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
 * Envía el correo al backend. El backend verifica si existe y manda el email.
 */
export async function enviarCorreoRecuperacion(email) {
  const res = await fetch(`${BASE_API_URL}/Auth/SolicitarRecuperacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Si es 404 o 400, asumimos que el correo no existe o hay error
    throw new Error(
      data.mensaje || "No se pudo enviar el correo de recuperación."
    );
  }

  return data; // { success: true, mensaje: "Correo enviado..." }
}

/**
 * 3. Restablecer Contraseña (Para la pantalla nueva)
 * Envía el token (que venía en el link del correo) y la nueva contraseña.
 */
export async function resetearPasswordConToken(token, newPassword) {
  const res = await fetch(`${BASE_API_URL}/Auth/RestablecerPassword`, {
    method: "POST", // Usualmente es POST o PUT
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensaje || "El enlace ha expirado o es inválido.");
  }

  return data; // { success: true, mensaje: "Contraseña actualizada" }
}
