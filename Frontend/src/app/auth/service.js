const url = "http://eventodromo-aspnet-1:8080/api/Cliente"
export async function autenticarUsuario(loginInfo){
    return await fetch(url+"/AutenticarCliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    })
}


export async function insertarUsuario(loginInfo){
  return await fetch(url+"/InsertarCliente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  })
}