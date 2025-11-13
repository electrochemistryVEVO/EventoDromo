"use client";

// Importamos los hooks de React y Next.js
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Importamos los contextos y servicios de tu versión "nueva"
import { useUser } from "@/context/UserContext.jsx";
import { autenticarUsuario } from "@/services/Login.service.js";

// Importamos el Modal
import ForgotPasswordModal from "@/components/ForgotPasswordModal/ForgotPasswordModal";

// --- IMPORTAMOS LOS CSS DE TU DISEÑO ANTIGUO ---
import "@/css/login-style.css"; 
import "@/css/forgot-password.css"; 

function App() {
  // --- TODA LA LÓGICA DE TU VERSIÓN "NUEVA" ---
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const router = useRouter();
  //const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Usamos la lógica de tu versión "nueva" (autenticarUsuario con email/password)
      const response = await autenticarUsuario(email, password);
      login(response);
      /*
      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      if (response.rol === 'A') {
        router.push("/admin/dashboard");
      } else if (response.rol === 'C') {
        router.push("/user/web/eventos/lista");
      } else {
        setError('Rol de usuario no válido');
      }
        */
    } catch (error) {
      setError(error.message);
    }
  };
  // --- FIN DE LA LÓGICA ---


  // --- TODO EL DISEÑO (JSX) DE TU VERSIÓN "ANTIGUA" ---
  return (
    <div className="App"> {/* Usa la clase CSS principal */}
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

        <Link href="/user/web/eventos/lista" className="volver-inicio">
          Volver al inicio
        </Link>

        {/* * Este formulario usa el 'handleSubmit' de tu versión "nueva"
          * y los inputs están "controlados" con 'value' y 'onChange'.
        */}
        <form className="login-text" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email} // Controlado por el estado
              onChange={(e) => setEmail(e.target.value)} // Controlado por el estado
              required 
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password} // Controlado por el estado
              onChange={(e) => setPassword(e.target.value)} // Controlado por el estado
              required 
            />
          </div>

          <div className="alinear-derecha">
            <button
              type="button" // Importante: 'type="button"' para que no envíe el form
              className="forgot-password-link"
              onClick={() => setIsModalOpen(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="login-hipervinculos-container">
            <button type="submit">Ingresa</button>
            <p>¿Aún no tienes cuenta?</p>
            {/* El Link a 'signup' es el mismo en ambas versiones */}
            <Link href="/auth/signup">Registrate Aquí</Link> 
          </div>
        </form>

        <ForgotPasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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