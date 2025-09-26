import { redirect } from "next/navigation";
import { insertarUsuario } from "../service";

export async function onSubmit(event){
  'use server'
  let loginInfo = {};
  let canRedirect = false;
  console.log("peep");
  loginInfo.correo = event.get("email");
  loginInfo.contrasena = event.get("password");
  //placeholders
  loginInfo.nombre = event.get("nombres");
  loginInfo.apellido = event.get("apellidos");
  loginInfo.dni =  event.get("dni");
  loginInfo.telefono = event.get("telefono");
  return await insertarUsuario(loginInfo)
    .then((res)=>{console.log(res.statusText);return res.json();})
    .then((response)=>{
      console.log(JSON.stringify(response));
      canRedirect = response.resultado;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(()=>{if(canRedirect)redirect("/auth/login");});
}