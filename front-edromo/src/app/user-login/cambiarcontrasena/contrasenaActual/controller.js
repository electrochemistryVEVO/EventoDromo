// src/controllers/controller-changePassword.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyCurrentPassword } from "@/services/cambiarContrasena.js";

// Creamos un hook personalizado para manejar la lógica de esta vista.
export const useChangePasswordController = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función que se ejecuta cuando el usuario presiona el botón "Siguiente".
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que la página se recargue.

    // Obtienes el token guardado después del login
    const userToken = sessionStorage.getItem("token");

    // Limpiamos errores previos y activamos el estado de carga.
    setError("");
    setIsLoading(true);

    if (!currentPassword) {
      setError("Por favor, ingresa tu contraseña actual.");
      setIsLoading(false);
      return;
    }

    try {
      // Llamamos a la función del servicio.
      if (userToken) {
        const resultado = await verifyCurrentPassword(password, userToken);
        console.log("¡Contraseña verificada con éxito!", resultado);
        // Si la función anterior no lanzó un error, la contraseña es correcta.
        // Navegamos al siguiente paso del flujo.
        // IMPORTANTE: Ajusta la ruta a la que corresponda.
        router.push("/user-login/cambiarcontrasena/cambio");
      } else {
        console.error("No se encontró token de usuario. Debes iniciar sesión.");
      }
    } catch (err) {
      // Si el servicio lanzó un error, lo mostramos al usuario.
      setError(err.message);
    } finally {
      // Pase lo que pase, desactivamos el estado de carga.
      setIsLoading(false);
    }
  };

  // Exponemos el estado y las funciones que la página (la vista) necesita.
  return {
    currentPassword,
    setCurrentPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
