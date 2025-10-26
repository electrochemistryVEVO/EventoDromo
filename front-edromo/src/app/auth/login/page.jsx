"use client";

import "@/css/login-style.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { onSubmit } from "./controller";
import Link from "next/link";

// 👇 IMPORTANTE: traemos el hook del contexto
import { useUser } from "@/context/UserContext.jsx";

function App() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  // Traemos la función login() del contexto global de usuario
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const result = await onSubmit(formData);

      if (result?.error) {
        // credenciales malas o error de backend
        setError(result.error);
        return;
      }

      if (result?.success) {
        // 👤 1. Construimos los datos que queremos guardar en el contexto global.
        //    Por ahora tenemos el rol. Más adelante puedes agregar idCliente, nombre, email, token, etc.
        const userData = {
          rol: result.rol,
          // idCliente: result.clientData?.idCliente,
          // nombre: result.clientData?.nombres,
          // email: result.clientData?.correo,
          // token: result.clientData?.token,
        };

        // 👤 2. Guardamos el usuario en el contexto global.
        //    Esto también lo persiste en localStorage gracias a tu UserContext.jsx
        login(userData);

        // 👣 3. Redirección post-login

        // Si venía con ?redirect=/algo, respetamos eso primero
        const redirectUrl = searchParams.get("redirect");
        if (redirectUrl) {
          router.push(redirectUrl);
          return;
        }

        // Si no hay redirect explícito, decidimos según rol
        if (result.rol === "A") {
          router.push("/data/loginHardCodeo.json");
        } else if (result.rol === "C") {
          router.push("/user/eventos/lista");
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
          <Image
            src={"/images/logo/logo_eventodromo.png"}
            alt="Logo"
            className="login-logo"
            fill={true}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <Link href="/user/eventos/lista" className="volver-inicio">
          Volver al inicio
        </Link>

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

          <Link className="alinear-derecha" href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>

          <div className="login-hipervinculos-container">
            <button type="submit">Ingresa</button>
            <p>¿Aún no tienes cuenta?</p>
            <Link href="/auth/signup">Registrate Aquí</Link>
          </div>
        </form>
      </div>

      <div className="imagen-mitad">
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
