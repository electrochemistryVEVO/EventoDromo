const url = "http://eventodromo-aspnet-1:8080/api/Usuario"
export async function autenticarUsuario(loginInfo){
    return await fetch(url+"/AutenticarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    })
}
export async function insertarUsuario(loginInfo){
  return await fetch(url+"/InsertarUsuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  })
}