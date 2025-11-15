/**
 * @file useDromoPuntosManager.js
 * @description Custom hook (controlador) para la lógica de la página de gestión de DromoPuntos.
 */

import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "@/services/dromopuntos.service.js";
import { getAuthToken } from "@/services/admin-service.js"; // 1. Importar el helper del token

export const useDromoPuntosManager = () => {
  // Estado para la configuración
  const [config, setConfig] = useState({ valorEnSoles: "" });

  // Estados para la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken(); // 2. Obtener el token
        const apiResponse = await getConfig(token); // 3. Pasar el token al servicio

        if (apiResponse && apiResponse.success) {
          setConfig(apiResponse.data);
        } else {
          // Si el backend devuelve success: false
          throw new Error(apiResponse.message || "La respuesta del API no fue exitosa.");
        }
      } catch (err) {
        setError("No se pudo cargar la configuración inicial.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Manejador para los cambios en el input
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de la página
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      // Convertimos el valor a número antes de enviarlo para validación
      const configToUpdate = {
        valorEnSoles: parseFloat(config.valorEnSoles),
      };
      if (isNaN(configToUpdate.valorEnSoles) || configToUpdate.valorEnSoles <= 0) {
        throw new Error("El valor del DromoPunto debe ser un número mayor a cero.");
      }
      const token = getAuthToken(); // 4. Obtener el token también aquí
      await updateConfig(configToUpdate.valorEnSoles, token); // 5. Pasarlo al servicio de actualización
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    isLoading,
    error,
    isSuccess,
    handleConfigChange,
    handleSubmit,
  };
};