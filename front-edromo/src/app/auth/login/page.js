"use client";

// Importamos los hooks de React y Next.js
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Importamos los contextos y servicios de tu versión "nueva"
import { useUser } from "@/context/UserContext.jsx";
import { autenticarUsuario } from "@/services/Login.service.js";

// Importamos el Modal
import ForgotPasswordModal from "@/components/ForgotPasswordModal/ForgotPasswordModal";

// Importamos el sistema de notificaciones
import { showSuccess, showError, showWarning } from "@/components/Notifications/toast";

// --- IMPORTAMOS LOS CSS DE TU DISEÑO ANTIGUO ---
import "@/css/login-style.css";
import "@/css/forgot-password.css";

function App() {
  // --- TODA LA LÓGICA DE TU VERSIÓN "NUEVA" ---
  const { login } = useUser();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Construir URL de registro preservando el redirect
  const signupUrl = useMemo(() => {
    const redirect = searchParams.get('redirect');
    return redirect ? `/auth/signup?redirect=${encodeURIComponent(redirect)}` : '/auth/signup';
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!email.trim()) {
      showError("Por favor ingresa tu email");
      return;
    }

    if (email.length > 100) {
      showError("El email no puede exceder 100 caracteres");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Por favor ingresa un email válido");
      return;
    }

    if (!password.trim()) {
      showError("Por favor ingresa tu contraseña");
      return;
    }

    if (password.length < 6) {
      showError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password.length > 50) {
      showError("La contraseña no puede exceder 50 caracteres");
      return;
    }

    try {
      console.log("Iniciando proceso de login...");
      // Usamos la lógica de tu versión "nueva" (autenticarUsuario con email/password)
      const response = await autenticarUsuario(email, password);
      console.log("Autenticación exitosa:", response);
      
      showSuccess("¡Inicio de sesión exitoso!");
      
      // El login del UserContext maneja la redirección
      login(response);
    } catch (error) {
      console.error("Error en login:", error);
      const errorMessage = error.message || "Error al intentar iniciar sesión";
      showError(errorMessage);
      setError(errorMessage);
    }
  };
  // --- FIN DE LA LÓGICA ---

  // --- TODO EL DISEÑO (JSX) DE TU VERSIÓN "ANTIGUA" ---
  return (
    <div className="App">
      {" "}
      {/* Usa la clase CSS principal */}
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
              maxLength={100}
              required
              placeholder="correo@ejemplo.com"
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
              minLength={6}
              maxLength={50}
              required
              placeholder="Mínimo 6 caracteres"
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
            {/* Preserva el parámetro redirect al ir a registro */}
            <Link href={signupUrl}>Registrate Aquí</Link>
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
