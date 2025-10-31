"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/services/cambiarContrasena.js";

const getTokenFromSession = () => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }

  const sessionJSON = sessionStorage.getItem("session");
  if (!sessionJSON) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionJSON);
    return sessionData.token || null;
  } catch (error) {
    console.error("Error al parsear los datos de la sesión:", error);
    return null;
  }
};

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

    const userToken = getTokenFromSession();

    if (!userToken) {
      setError(
        "Tu sesión ha expirado o no es válida. Por favor, inicia sesión de nuevo.",
      );
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
    const allValid = Object.values(validations).every((value) => value);
    if (!allValid) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(newPassword, userToken);
      setIsSuccess(true);
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
    router.push("/user/eventos/lista");
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
