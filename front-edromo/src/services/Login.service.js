export async function autenticarUsuario(loginInfo) {
  try {
    const API_URL = "http://localhost:5189/api/Cliente/AutenticarLoginCliente";

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });

    const json = await res.json();

    if (!res.ok) {
      const errorMessage = json.message || json.error || res.statusText;
      throw new Error(`Error HTTP ${res.status}: ${errorMessage}`);
    }

    if (json.success !== true || !json.data) {
      throw new Error(json.message || json.error || "La respuesta del servidor no fue exitosa o no contiene datos.");
    }

    const { success, rol, token, idCliente } = json.data;

    return {
      success: success ?? null,
      rol: rol ?? null,
      token: token ?? null,
      idCliente: idCliente ?? null,
    };

  } catch (error) {
    console.error("Error en autenticarUsuario:", error.message);
    return {
      success: false,
      message: error.message,
      rol: null,
      token: null,
      idCliente: null,
    };
  }
}