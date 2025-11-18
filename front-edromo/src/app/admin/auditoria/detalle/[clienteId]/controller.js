import { useState, useEffect } from "react";
import { obtenerDetalleCliente } from "@/services/service-auditoria";

export const useDetalleClienteController = (clienteId) => {
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalleCliente = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Llamada al servicio
        const response = await obtenerDetalleCliente(clienteId);

        if (response.success) {
          setCliente(response.data);
        } else {
          setError(response.message || "Error al obtener el detalle del cliente");
          setCliente(null);
        }
      } catch (err) {
        console.error("Error en fetchDetalleCliente:", err);
        setError(err.message || "Error inesperado al cargar los datos");
        setCliente(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (clienteId) {
      fetchDetalleCliente();
    }
  }, [clienteId]);

  return {
    cliente,
    isLoading,
    error,
  };
};
