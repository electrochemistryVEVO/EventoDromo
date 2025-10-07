const url = "http://localhost:5189/api/Cliente"
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