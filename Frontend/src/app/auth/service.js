const url =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/Cliente";
export async function autenticarUsuario(loginInfo) {
  try {
    const response = await fetch(url + "/AutenticarCliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error en autenticación:", error);
    throw error;
  }
}

export async function insertarUsuario(loginInfo) {
  return await fetch(url + "/InsertarCliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  });
}
