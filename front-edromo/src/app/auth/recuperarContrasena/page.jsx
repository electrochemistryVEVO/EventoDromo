// src/app/auth/reset-password/page.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetearPasswordConToken } from "@/services/loginService";
import "@/css/login-style.css"; // Reutiliza estilos

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Al cargar la página, lee el token de la URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Enlace inválido o no se encontró el token de recuperación.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      await resetearPasswordConToken(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Vista de éxito
  if (success) {
    return (
      <div className="login-form-container" style={{ textAlign: "center" }}>
        <h1>¡Contraseña Restablecida!</h1>
        <p>Tu contraseña ha sido actualizada exitosamente.</p>
        <button
          onClick={() => router.push("/auth/login")}
          style={{ marginTop: "1.5rem" }}
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  // Vista del formulario
  return (
    <div className="App">
      <div className="login-form-container">
        <h1>Restablecer Contraseña</h1>
        {token ? (
          <form onSubmit={handleSubmit} className="login-text">
            <p>Elige una nueva contraseña segura para tu cuenta.</p>
            <div>
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
            </button>
          </form>
        ) : (
          <div className="error-message">{error || "Cargando..."}</div>
        )}
      </div>
      <div className="imagen-mitad" /> {/* Opcional: mantén tu imagen */}
    </div>
  );
};

export default ResetPasswordPage;
