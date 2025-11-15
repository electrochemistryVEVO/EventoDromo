import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "@/services/dromopuntos.service.js";
import { getAuthToken } from "@/services/admin-service.js";

export const useDromoPuntosManager = () => {
  const [config, setConfig] = useState({ valorEnSoles: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const apiResponse = await getConfig(token);

        if (apiResponse && apiResponse.success) {
          setConfig(apiResponse.data);
        } else {
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

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      const configToUpdate = {
        valorEnSoles: parseFloat(config.valorEnSoles),
      };
      
      if (isNaN(configToUpdate.valorEnSoles) || configToUpdate.valorEnSoles <= 0) {
        throw new Error("El valor del DromoPunto debe ser un número mayor a cero.");
      }
      
      const token = getAuthToken();
      await updateConfig(configToUpdate.valorEnSoles, token);
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