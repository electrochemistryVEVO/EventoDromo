const url =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5189/api/Cliente";
export async function autenticarUsuario(loginInfo) {
  //link q funciona en individual: http://localhost:5189/api/Cliente/AutenticarLoginCliente"
  const res = await fetch("http://localhost:8081/api/Cliente/AutenticarLoginCliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  });
  console.log(res);
  if (!res.ok) throw new Error("Error al autenticar cliente login (status:" + res.status + ")");
  const json = await res.json();
  if(!json) throw new Error("Error al autenticar cliente login (json vacio)");
  if(json.success===false){
    throw new Error(json.error || json.mensaje || "Error en respuesta del servicio");
  }
  return json.data; 
  
  /*
  try {
    const res = await fetch("http://localhost:5189/api/Cliente/AutenticarLoginCliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  });
    console.log(res);
    //if (!res.ok) throw new Error("Error al autenticar cliente login");

    const json = await res.json();

    // 🔹 Validaciones básicas
    if (!json || typeof json.success === "undefined") {
      throw new Error("Respuesta inválida o vacía del login");
    }

    return json; // ✅ devuelve { success, rol }

  } catch (error) {
    console.error("Error en autenticación:", error);
    throw error;
  }
    */
}