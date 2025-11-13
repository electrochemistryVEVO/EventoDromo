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
/*
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
*/
/**
 * Envía el token y la nueva contraseña al backend para finalizar el reseteo.
 * @param {string} token - El token de la URL.
 * @param {string} newPassword - La nueva contraseña del usuario.
 * @returns {Promise<Object>}
 */
/*
export async function resetearPasswordConToken(token, newPassword) {
  try {
    // Este es el segundo endpoint que tu amigo debe crear
    const res = await fetch("http://localhost:5189/api/Auth/ResetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "El enlace es inválido o ha expirado."
      );
    }
    return await res.json();
  } catch (error) {
    console.error("Error en servicio resetearPasswordConToken:", error);
    throw error;
  }
}
*/
// ... (tus otras funciones como autenticarUsuario se quedan igual)

/**
 * --- SIMULACIÓN ---
 * Finge que envía un correo de recuperación.
 */
export async function enviarCorreoRecuperacion(email) {
  // Definimos un correo que "existe" en nuestra simulación
  const MOCK_EXISTING_EMAIL = "test@example.com";

  console.log(`SIMULACIÓN: Solicitud para enviar correo a: ${email}`);

  // Usamos una Promesa para simular el tiempo de espera de la red
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Comparamos el email ingresado con nuestro email de prueba
      if (email === MOCK_EXISTING_EMAIL) {
        console.log("SIMULACIÓN: Correo encontrado. Fingiendo envío exitoso.");
        // Si el correo es el correcto, resolvemos la promesa (éxito)
        resolve({ success: true, message: "Correo de recuperación enviado." });
      } else {
        console.log("SIMULACIÓN: Correo no encontrado. Rechazando la promesa.");
        // Si no es correcto, rechazamos la promesa (error)
        reject(new Error("El correo no está registrado."));
      }
    }, 1500); // Simulamos una espera de 1.5 segundos
  });
}

/**
 * --- SIMULACIÓN ---
 * Finge que resetea la contraseña con un token.
 */
export async function resetearPasswordConToken(token, newPassword) {
  // Definimos un token que es "válido" en nuestra simulación
  const MOCK_VALID_TOKEN = "valid-token-123";

  console.log(`SIMULACIÓN: Intento de reseteo con token: ${token}`);
  console.log(`SIMULACIÓN: Nueva contraseña recibida: ${newPassword}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === MOCK_VALID_TOKEN) {
        console.log(
          "SIMULACIÓN: Token válido. Contraseña 'actualizada' exitosamente."
        );
        resolve({ success: true, message: "Contraseña actualizada." });
      } else {
        console.log("SIMULACIÓN: Token inválido o expirado.");
        reject(new Error("El enlace es inválido o ha expirado."));
      }
    }, 1500); // Simulamos 1.5 segundos de espera
  });
}
