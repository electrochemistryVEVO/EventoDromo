//'use client'
import './App.css';
import logo from '@/assets/logos/eventodromo.svg';
import Image from "next/image";
import { redirect } from 'next/navigation';
import imagenMitad from '@/assets/pictures/imagenMitad.png';
import Form from "next/form";
import { onSubmit } from "./controller";

import Link from "next/link"; // Asegúrate de tener esta importación al inicio

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <div className='imagen-mitad'>
=======
      <div className="login-form-container">
        <div className="form-header">
          <div className="logo-container">
            <Image src={logo} alt="Logo" className="login-logo" priority />
          </div>
          <Link href="/" className="volver-inicio">
            Volver a iniciar sesión
          </Link>
          <h1>Bienvenido a Eventódromo</h1>
        </div>
        <div className="form-content">
          <form className="login-text" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-row">
              <div>
                <label htmlFor="nombres">Nombres</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  required
                  placeholder="Nombres"
                />
              </div>
              <div>
                <label htmlFor="apellidos">Apellidos</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  required
                  placeholder="Apellidos"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Contraseña"
              />
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="tipoDocumento">Tipo de documento</label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  className="select-custom"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <div>
                <label htmlFor="numeroDocumento">Número de documento</label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  required
                  placeholder="Número de documento"
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  required
                />
              </div>
              <div>
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  required
                  placeholder="Teléfono"
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="pais">País</label>
                <select
                  id="pais"
                  name="pais"
                  className="select-custom"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="PE">Perú</option>
                  <option value="CL">Chile</option>
                  <option value="CO">Colombia</option>
                </select>
              </div>
              <div>
                <label htmlFor="ciudad">Ciudad</label>
                <select
                  id="ciudad"
                  name="ciudad"
                  className="select-custom"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="LIMA">Lima</option>
                  <option value="AREQUIPA">Arequipa</option>
                  <option value="TRUJILLO">Trujillo</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="sexo">Sexo</label>
              <select id="sexo" name="sexo" className="select-custom" required>
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="terminos" name="terminos" required />
              <label htmlFor="terminos">
                Declaro que he leído y acepto los Términos y Condiciones, y
                Política de Privacidad de Eventódromo.
              </label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="promociones" name="promociones" />
              <label htmlFor="promociones">
                Autorizo que Teleticket envíe información sobre eventos y/o
                promociones que ofrece, así como encuestas.
              </label>
            </div>
            <button type="submit">Registrar</button>
            <div className="login-hipervinculos-container">
              <p>¿Ya tienes cuenta?</p>
              <Link href="/auth/login">Ingresa aquí</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="imagen-mitad">
>>>>>>> 4257796 (todo funciona el login con docker)
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
