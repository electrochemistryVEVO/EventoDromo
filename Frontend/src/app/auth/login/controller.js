import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { autenticarUsuario } from "../service";

export async function onSubmit(event){
  'use server'
  let loginInfo = {};
  let canRedirect = false;
  console.log("peep");
  loginInfo.Correo = event.get("email");
  loginInfo.Contrasena = event.get("password");
  return await autenticarUsuario(loginInfo)
    .then((res)=>{console.log(res.statusText);return res.json();})
    .then((response)=>{
      console.log(JSON.stringify(response));
      canRedirect = response.usuarioValido;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(()=>{
      if(canRedirect){
        cookies().set("session",loginInfo,Date.now() + 10 * 1000 * 60 * 60); //10 horas
        redirect("/");
      }});
}