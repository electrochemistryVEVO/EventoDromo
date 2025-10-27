// src/controllers/controller-changePasswordStep2.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/services/cambiarContrasena.js";

// Regex para las validaciones
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
  const [isSuccess, setIsSuccess] = useState(false); // Para mostrar la pantalla de éxito

  // Estado para las validaciones en tiempo real
  const [validations, setValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Este useEffect se ejecuta cada vez que el usuario escribe en el campo de nueva contraseña
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

    // 1. Verificar que las contraseñas no estén vacías
    if (!newPassword || !confirmPassword) {
      setError("Ambos campos son obligatorios.");
      return;
    }

    // 2. Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // 3. Verificar que se cumplan todas las reglas
    const allValid = Object.values(validations).every((v) => v);
    if (!allValid) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    // 4. Si todo es correcto, llamar al servicio
    setIsLoading(true);
    try {
      await updatePassword(newPassword);
      setIsSuccess(true); // ¡Éxito! Cambiamos el estado para mostrar la vista final
    } catch (err) {
      setError(err.message || "Ocurrió un error al cambiar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back(); // Vuelve a la página anterior
  };

  const handleFinish = () => {
    // Redirige al perfil o al dashboard cuando el proceso termina
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
