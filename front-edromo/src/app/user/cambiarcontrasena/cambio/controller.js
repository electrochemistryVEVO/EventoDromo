// src/controllers/controller-changePasswordStep2.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/services/cambiarContrasena.js"; // Asumo que este servicio está en el archivo correcto

// --- 1. IMPORTA EL HOOK 'useUser' ---
import { useUser } from "@/context/UserContext.jsx";

// --- 2. ELIMINA LA FUNCIÓN 'getTokenFromSession' ---
/*
const getTokenFromSession = () => {
  // ... (Este código es incorrecto, lee de sessionStorage)
};
*/

// Regex para las validaciones (esto está perfecto)
const REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const useChangePasswordStep2Controller = () => {
  const router = useRouter();
  
  // --- 3. LLAMA AL HOOK 'useUser' ---
  const { user } = useUser(); // Obtenemos el usuario (que tiene el token)

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

    // --- 4. OBTÉN EL TOKEN DIRECTAMENTE DEL CONTEXTO ---
    const userToken = user?.token;

    // Validar la existencia del token ANTES de hacer cualquier otra cosa
    if (!userToken) {
      setError(
        "Tu sesión ha expirado o no es válida. Por favor, inicia sesión de nuevo."
      );
      return;
    }

    // Validaciones del formulario (esto ya estaba bien).
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

    setIsLoading(true);
    try {
      // 5. Llamar al servicio con la nueva contraseña Y el token
      const response = await updatePassword(newPassword, userToken);
      
      // 6. Verificar la respuesta del backend
      if (response && response.success === true) {
        setIsSuccess(true); // ¡Éxito!
      } else {
        throw new Error(response.message || "El backend reportó un error.");
      }
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
    // 7. Limpia el password verificado de la sesión anterior
    if (typeof window !== "undefined") {
        sessionStorage.removeItem('verified_password');
    }
    router.push("/user/web/perfil"); // Redirige al perfil
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