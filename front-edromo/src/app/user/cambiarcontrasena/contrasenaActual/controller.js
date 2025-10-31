"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyCurrentPassword } from "@/services/cambiarContrasena.js";

export const useChangePasswordController = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sessionJSON = sessionStorage.getItem("session");
    let userToken = null;

    if (sessionJSON) {
      const sessionData = JSON.parse(sessionJSON);
      userToken = sessionData.token;
    }

    setError("");
    setIsLoading(true);

    if (!currentPassword) {
      setError("Por favor, ingresa tu contraseña actual.");
      setIsLoading(false);
      return;
    }

    try {
      if (userToken) {
        await verifyCurrentPassword(currentPassword, userToken);
        router.push("/user/cambiarcontrasena/cambio");
      } else {
        console.error("No se encontró token de usuario. Debes iniciar sesión.");
        setError("Tu sesión no es válida. Inicia sesión nuevamente.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
