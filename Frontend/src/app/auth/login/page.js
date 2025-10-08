"use client";
import "./App.css";
import logo from "@/assets/logos/logo_eventodromo.png";
import Image from "next/image";
import imagenMitad from "@/assets/pictures/imagenMitad.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { onSubmit } from "./controller";

function App() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const result = await onSubmit(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // Redireccionar según el rol del usuario
        if (result.rol === "A") {
          router.push("/home");
        } else if (result.rol === "U") {
          router.push("/user/eventos");
        } else {
          setError("Rol de usuario no válido");
        }
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      console.error(err);
    }
  };

  return (
    <div className="App">
      <div className="login-form-container">
        <div className="logo-container">
          <Image src={logo} alt="Logo" className="login-logo" priority />
        </div>
        <a href="/" className="volver-inicio">
          Volver al inicio
        </a>
        <form className="login-text" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>
          <a className="alinear-derecha" href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
          <div className="login-hipervinculos-container">
            <button type="submit">Ingresa</button>
            <p>¿Aún no tienes cuenta?</p>
            <a href="/auth/signup">Registrate Aquí</a>
          </div>
        </form>
      </div>
      <div className="imagen-mitad">
        <Image
          src={imagenMitad}
          alt="Imagen de fondo"
          className="background-image"
          priority
        />
      </div>
    </div>
  );
}

export default App;
