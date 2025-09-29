//'use client'
//TODO: usar componente aparte en vez de hacerlo todo en una pagina
import './App.css';

import { cookies } from "next/headers";

//import logo from '../assets/logo.png';
import logo from '@/assets/logos/eventodromo.svg'
import Image from "next/image";
import { redirect } from 'next/navigation';
import imagenMitad from '@/assets/pictures/imagenMitad.png';
import Form from "next/form";
import { onSubmit } from "./controller";

function App() {
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
