//'use client'
import './App.css';
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
    loginInfo.correo = event.get("email");
    loginInfo.contrasena = event.get("password");
    //placeholders
    loginInfo.nombre = event.get("nombres");
    loginInfo.apellido = event.get("apellidos");
    loginInfo.dni =  event.get("dni");
    loginInfo.telefono = event.get("telefono");
    return await fetch("http://eventodromo-aspnet-1:8080/api/Usuario/InsertarUsuario", {
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
      .finally(()=>{if(canRedirect)redirect("/auth/login");});
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
            <label htmlFor="nombres">Nombres</label>
            <input type="text" id="nombres" name="nombres" required />
          </div>
          <div>
            <label htmlFor="apellidos">Apellidos</label>
            <input type="text" id="apellidos" name="apellidos" required />
          </div>
          <div>
            <label htmlFor="dni">DNI</label>
            <input type="text" id="dni" name="dni" required />
          </div>
          <div>
            <label htmlFor="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" required />
          </div>
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
            <button type="submit">Registrar</button>
            <p>¿Ya tienes cuenta?</p>
            <a href="#create-account">Ingresa aquí</a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default App;
