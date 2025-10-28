// src/controllers/controller-changePasswordStep2.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/services/cambiarContrasena.js";

// --- BUENA PRÁCTICA: Función auxiliar reutilizable ---
// Esta función se encarga de una sola cosa: obtener el token de la sesión.
// La puedes mover a un archivo de utilidades (ej: src/utils/auth.js) para usarla en todo tu proyecto.
const getTokenFromSession = () => {
  // Verificamos si estamos en el navegador para evitar errores en el servidor
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }

  const sessionJSON = sessionStorage.getItem("session");
  if (sessionJSON) {
    try {
      const sessionData = JSON.parse(sessionJSON);
      return sessionData.token || null; // Devuelve el token o null si no existe
    } catch (e) {
      console.error("Error al parsear los datos de la sesión:", e);
      return null;
    }
  }
  return null;
};

// Regex para las validaciones (esto está perfecto)
const REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const useChangePasswordStep2Controller = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [validations, setValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Este useEffect sigue estando perfecto.
  useEffect(() => {
    setValidations({
      hasUpper: REGEX.upper.test(newPassword),
      hasLower: REGEX.lower.test(newPassword),
      hasNumber: REGEX.number.test(newPassword),
      hasSpecial: REGEX.special.test(newPassword),
    });
  }, [newPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // --> PASO 1: Obtener el token usando nuestra nueva función auxiliar.
    const userToken = getTokenFromSession();

    // --> PASO 2: Validar la existencia del token ANTES de hacer cualquier otra cosa (Fail-Fast).
    if (!userToken) {
      setError(
        "Tu sesión ha expirado o no es válida. Por favor, inicia sesión de nuevo."
      );
      // Opcionalmente, podrías redirigir al login aquí.
      // router.push("/user-login");
      return;
    }

    // 3. Validaciones del formulario (esto ya estaba bien).
    if (!newPassword || !confirmPassword) {
      setError("Ambos campos son obligatorios.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const allValid = Object.values(validations).every((v) => v);
    if (!allValid) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    // 4. Si todo es correcto, llamar al servicio con los datos necesarios.
    setIsLoading(true);
    try {
      // --> PASO 3: Llamar al servicio pasando la nueva contraseña Y el token.
      await updatePassword(newPassword, userToken);

      setIsSuccess(true); // ¡Éxito!
    } catch (err) {
      setError(err.message || "Ocurrió un error al cambiar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFinish = () => {
    router.push("/user-login/web/eventos/lista");
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    isSuccess,
    validations,
    handleSubmit,
    handleCancel,
    handleFinish,
  };
};
