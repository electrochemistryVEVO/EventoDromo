export async function autenticarUsuario(loginInfo) {
  //link q funciona en individual: http://localhost:5189/api/Cliente/AutenticarLoginCliente"
  //link q funciona en docker: http://localhost:8081/api/Cliente/AutenticarLoginCliente"
  const res = await fetch(
    "http://localhost:5189/api/Cliente/AutenticarLoginCliente",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    }
  );
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

  /*
  // Simulación de una llamada al backend
  console.log(" MODO HARDCODEADO: Devolviendo respuesta de login simulada.");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 0.5 segundos
  return {
    success: true,
    rol: "C",
  */
}

export async function verificarCorreoExistente(email) {
  // Simulación - Comenta el código real y usa este para pruebas
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay de red

  // Caso 1: Email existe (ejemplo@gmail.com)
  if (email === "ejemplo@gmail.com") {
    return {
      success: true,
      data: {
        exists: true,
        mensaje: "El correo existe en la base de datos",
      },
    };
  }

  // Caso 2: Email no existe (cualquier otro correo)
  return {
    success: false,
    data: {
      exists: false,
      mensaje: "El correo no está registrado",
    },
  };
}
/*
export async function verificarCorreoExistente(email) {
  try {
    const res = await fetch(`http://localhost:5189/api/Cliente/VerificarCorreoCliente?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error al consultar el correo (status:" + res.status + ")");
    }

    const json = await res.json();

    // Asumimos que el backend devuelve { exists: true/false }
    return json.data;//el propio contenido del json que haré dentro tenga exists como campo.
  } catch (error) {
    console.error("Error en el servicio verificarCorreoExistente:", error);
    throw error;
  }
};*/

/**
 * Llama al backend para solicitar el envío de un correo de recuperación.
 * @param {string} email - El correo del usuario que necesita recuperar la contraseña.
 * @returns {Promise<Object>} - La respuesta del backend.
 */
export async function enviarCorreoRecuperacion(email) {
  try {
    const res = await fetch(
      "http://localhost:5189/api/Auth/EnviarCorreoRecuperacion",
      {
        // <-- Endpoint de ejemplo
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }), // Enviamos el correo en el body
      }
    );

    if (!res.ok) {
      // Si el backend responde con un error (ej: 404 si el correo no existe)
      const errorJson = await res.json();
      throw new Error(
        errorJson.message || "Error al solicitar el envío del correo."
      );
    }

    return await res.json(); // Devuelve { success: true, message: "Correo enviado" }
  } catch (error) {
    console.error("Error en el servicio enviarCorreoRecuperacion:", error);
    throw error;
  }
}
