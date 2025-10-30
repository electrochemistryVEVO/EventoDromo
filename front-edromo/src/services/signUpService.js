  //puerto en local: 5189
  //puerto en docker: 8081
const url =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5189/api/Cliente";
export async function obtenerDatosDeRegistro() {
    // Nota: Necesitas crear este endpoint en tu ClienteController!
    const res = await fetch("http://localhost:5189/api/Cliente/ObtenerDatosSignUp");

    if (!res.ok) {
        throw new Error("Fallo al cargar datos de registro.");
    }

    const response = await res.json();

    if (response.success === false) {
        throw new Error(response.error || "Error en datos estáticos.");
    }
    
    // Suponemos que la respuesta es algo como: { success: true, data: { sexos: [...], paises: [...] } }
    return response.data;
}

export async function insertarUsuario(clienteData) {
  //link q funciona en individual: http://localhost:5189/api/Cliente/AutenticarLoginCliente"
  //link q funciona en individual: http://localhost:8081/api/Cliente/AutenticarLoginCliente"  
  const res = await fetch(
    "http://localhost:8080/api/Cliente/InsertarClienteSignUp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clienteData),
    },
  );
  console.log(res);
  if (!res.ok)
    throw new Error(
      "Error al insertar cliente signUp (status:" + res.status + ")",
    );
  const json = await res.json();
  if (!json) throw new Error("Error al insertar cliente signUp (json vacio)");
  if (json.success === false) {
    throw new Error(
      json.error || json.mensaje || "Error en respuesta del servicio",
    );
  }
  return json.data;

  /*
  return await fetch(url + "/InsertarCliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  });
  */
}
