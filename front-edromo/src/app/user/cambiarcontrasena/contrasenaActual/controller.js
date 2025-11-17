"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyCurrentPassword } from "@/services/cambiarContrasena.js";

// --- 1. IMPORTA EL HOOK 'useUser' ---
import { useUser } from "@/context/UserContext.jsx";

// Creamos un hook personalizado para manejar la lógica de esta vista.
export const useChangePasswordController = () => {
  const router = useRouter();
  // --- 2. LLAMA AL HOOK 'useUser' ---
  const { user } = useUser(); // Obtenemos el usuario (que tiene el token)

  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // --- 3. OBTÉN EL TOKEN DIRECTAMENTE DEL CONTEXTO ---
    const userToken = user?.token;

    if (!currentPassword) {
      setError("Por favor, ingresa tu contraseña actual.");
      setIsLoading(false);
      return;
    }

    try {
      // 4. AHORA 'userToken' SÍ TENDRÁ UN VALOR
      if (userToken) {
        const resultado = await verifyCurrentPassword(
          currentPassword,
          userToken
        );
        if (resultado && resultado.success === true) { // 5. VERIFICA 'status' (según tu ClienteBO)
          console.log("¡Contraseña verificada con éxito!", resultado);

          // 6. Guarda la contraseña verificada para el siguiente paso
          sessionStorage.setItem('verified_password', currentPassword);

          // IMPORTANTE: Ajusta la ruta a la que corresponda.
          router.push("/user/cambiarcontrasena/cambio"); // Asumo esta es la siguiente página
        } else {
          // Si el backend devuelve success=false (status="error")
          setError(resultado.message || "La contraseña es incorrecta. Intente de nuevo.");
        }
      } else {
        // 7. MUESTRA EL ERROR EN LA UI
        setError("No se encontró tu sesión. Por favor, inicia sesión de nuevo.");
      }
    } catch (err) {
      // Si el servicio lanzó un error (ej. 401, 500)
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