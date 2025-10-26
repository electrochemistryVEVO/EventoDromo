"use client";
import "@/css/signup-style.css";
import Image from "next/image";
import { useState } from "react";
import { onSubmit } from "./controller";

import Link from "next/link"; // Asegúrate de tener esta importación al inicio

function App() {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const result = await onSubmit(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Error al registrar usuario");
      console.error(err);
    }
  };

  return (
    <div className="App-signup">
      <div className="login-form-container-signup">
        <div className="form-header-signup">
          <div className="logo-container-signup">
            <Image
              src={"/images/logo/logo_eventodromo.png"}
              alt="Logo"
              className="login-logo"
              fill={true}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <Link href="/auth/login" className="volver-inicio-signup">
            Volver a iniciar sesión
          </Link>
          <h1>Bienvenido a Eventódromo</h1>
        </div>
        <div className="form-content">
          <form className="login-text-signup" onSubmit={handleSubmit}>
            {error && <div className="error-message-signup">{error}</div>}
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
            <div>
              <label htmlFor="pais">País</label>
              <select id="pais" name="pais" className="select-custom" required>
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
          </form>
        </div>
      </div>
      <div className="imagen-mitad-signup">
        <Image
          src={"/images/otros/imagenMitad.png"}
          alt="Imagen de fondo"
          className="background-image"
          fill={true}
          priority
        />
      </div>
    </div>
  );
}

export default App;
