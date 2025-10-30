// src/controllers/resetPasswordController.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetearPasswordConToken } from "@/services/loginService"; // Importaremos este nuevo servicio

// Reutilizamos las mismas reglas de validación que antes
const REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const useResetPasswordController = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para leer parámetros de la URL

  // Estados para los inputs y la lógica de la UI
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para las validaciones de la contraseña
  const [validations, setValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Efecto para leer el token de la URL una sola vez cuando la página carga
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError(
        "Token de recuperación no encontrado. El enlace puede ser inválido o haber expirado."
      );
    }
  }, [searchParams]);

  // Efecto para validar la contraseña en tiempo real
  useEffect(() => {
    setValidations({
      hasUpper: REGEX.upper.test(newPassword),
      hasLower: REGEX.lower.test(newPassword),
      hasNumber: REGEX.number.test(newPassword),
      hasSpecial: REGEX.special.test(newPassword),
    });
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validaciones del frontend
    if (!token) {
      setError("No se puede proceder sin un token válido.");
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }
    const allValid = Object.values(validations).every((v) => v);
    if (!allValid) {
      setError("La contraseña no cumple con todos los requisitos.");
      setIsLoading(false);
      return;
    }

    try {
      // Llamamos al nuevo servicio del backend
      await resetearPasswordConToken(token, newPassword);
      setSuccess(true); // ¡Éxito!
    } catch (err) {
      // El backend nos dirá si el token es inválido o expiró
      setError(err.message || "No se pudo restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    router.push("/auth/login"); // Redirigir al login al terminar
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    isLoading,
    validations,
    token,
    handleSubmit,
    handleFinish,
  };
};
