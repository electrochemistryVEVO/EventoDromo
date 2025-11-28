"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetearPasswordConToken } from "@/services/loginService"; // Usamos el servicio que ya creaste

// Reglas de validación
const REGEX = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const useResetPasswordController = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados del formulario
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de UI
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Estado de validación en tiempo real
  const [validations, setValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // 1. Leer el token de la URL al cargar
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Enlace inválido o no se encontró el token de recuperación.");
    }
  }, [searchParams]);

  // 2. Validar contraseña en tiempo real
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

    // Validaciones preventivas
    if (!token) {
      setError("No se puede proceder sin un token válido.");
      return;
    }
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
      setError(
        "La contraseña no cumple con todos los requisitos de seguridad."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Llamamos al servicio real con el token de la URL
      const response = await resetearPasswordConToken(token, newPassword);

      // Asumimos que si no lanza error, fue exitoso.
      // Si tu servicio devuelve algo específico como { success: true }, verifica aquí.
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error al restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  // Acción al cancelar: Volver al login
  const handleCancel = () => {
    router.push("/auth/login");
  };

  // Acción al finalizar con éxito: Ir al login
  const handleFinish = () => {
    router.push("/auth/login");
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
    tokenMissing: !token && !!error, // Helper para saber si mostrar solo el error inicial
  };
};
