//'use client'
//TODO: usar componente aparte en vez de hacerlo todo en una pagina
import './App.css';

import { cookies } from "next/headers";

import logo from '../assets/logo.png';
import Image from "next/image";
import { redirect } from 'next/navigation';
import imagenMitad from '../assets/imagenMitad.png';
import Form from "next/form";
function App() {
  async function onSubmit(event){
    'use server'
    let loginInfo = {};
    let canRedirect = false;
    console.log("peep");
    loginInfo.Correo = event.get("email");
    loginInfo.Contrasena = event.get("password");
    return await fetch("http://eventodromo-aspnet-1:8080/api/Usuario/AutenticarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    })
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
  return (
    <div className="App">
      <div className='imagen-mitad'>
        <Image
          src={imagenMitad}
          alt="Imagen de fondo"
          className="background-image"
        />
      </div>
      <div className="login-form-container">
        {/* Imagen encima del formulario */}
        <Image
          src={logo}
          alt="Logo"
          className="login-logo"
        />
        <Form className="login-text" action={onSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />

          </div>
          <a className='alinear-derecha' href="#create-account">¿Olvidaste tu contraseña?</a>
          <div className="login-hipervinculos-container">
            <button type="submit">Ingresar</button>
            <p>¿Aún no tienes cuenta?</p>
            <a href="#create-account">Registrate aquí</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default App;
