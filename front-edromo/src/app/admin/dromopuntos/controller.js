import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "@/services/dromopuntos.service.js";
import { getAuthToken } from "@/services/admin-service.js";

export const useDromoPuntosManager = () => {
  const [config, setConfig] = useState({
    puntosPorSol: "",
    mesesVigenciaPuntos: "",
    minutosVigenciaCarrito: "",
    horasExpiracionTransferencia: "",
    minutosExpiracionRecovery: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const apiResponse = await getConfig(token);

        if (apiResponse?.success) {
          setConfig({
            puntosPorSol: apiResponse.data.puntosPorSol?.toString() || "",
            mesesVigenciaPuntos: apiResponse.data.mesesVigenciaPuntos?.toString() || "",
            minutosVigenciaCarrito: apiResponse.data.minutosVigenciaCarrito?.toString() || "",
            horasExpiracionTransferencia: apiResponse.data.horasExpiracionTransferencia?.toString() || "",
            minutosExpiracionRecovery: apiResponse.data.minutosExpiracionRecovery?.toString() || ""
          });
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
      const puntosPorSol = parseFloat(config.puntosPorSol);
      const mesesVigenciaPuntos = parseInt(config.mesesVigenciaPuntos);
      const minutosVigenciaCarrito = parseInt(config.minutosVigenciaCarrito);
      const horasExpiracionTransferencia = parseInt(config.horasExpiracionTransferencia);
      
      if (isNaN(puntosPorSol) || puntosPorSol <= 0) {
        throw new Error("El valor en soles del punto debe ser un número mayor a cero.");
      }
      
      if (isNaN(mesesVigenciaPuntos) || mesesVigenciaPuntos <= 0) {
        throw new Error("Los meses de vigencia deben ser un número entero mayor a cero.");
      }
      
      if (isNaN(minutosVigenciaCarrito) || minutosVigenciaCarrito <= 0) {
        throw new Error("Los minutos de vigencia del carrito deben ser un número entero mayor a cero.");
      }

      if (isNaN(horasExpiracionTransferencia) || horasExpiracionTransferencia <= 0) {
        throw new Error("Las horas de expiración de transferencias deben ser un número entero mayor a cero.");
      }

      const minutosExpiracionRecovery = parseInt(config.minutosExpiracionRecovery);
      if (isNaN(minutosExpiracionRecovery) || minutosExpiracionRecovery <= 0) {
        throw new Error("Los minutos de expiración del token de recuperación deben ser un número entero mayor a cero.");
      }
      
      const token = getAuthToken();
      const configData = {
        puntosPorSol,
        mesesVigenciaPuntos,
        minutosVigenciaCarrito,
        horasExpiracionTransferencia,
        minutosExpiracionRecovery
      };
      
      await updateConfig(configData, token);
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