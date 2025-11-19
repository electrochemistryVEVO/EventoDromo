import { useState, useEffect, useCallback } from "react";
import { obtenerDetalleCliente } from "@/services/service-auditoria";

export const useDetalleClienteController = (clienteId) => {
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false);
  const [error, setError] = useState(null);
  const [pageHistorial, setPageHistorial] = useState(1);
  const [totalPaginasHistorial, setTotalPaginasHistorial] = useState(1);
  const pageSizeHistorial = 5; // Tamaño fijo de página

  // Cargar datos iniciales (primera carga completa)
  useEffect(() => {
    const fetchDetalleCliente = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Llamada al servicio con paginación
        const response = await obtenerDetalleCliente(clienteId, pageHistorial, pageSizeHistorial);

        if (response.success) {
          setCliente(response.data);
          setTotalPaginasHistorial(response.data.totalPaginasHistorial || 1);
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
  }, [clienteId]); // Solo se ejecuta cuando cambia clienteId

  // Cargar solo el historial cuando cambia la página
  useEffect(() => {
    const fetchHistorial = async () => {
      // Skip solo si no hay cliente cargado aún
      if (!cliente) return;

      try {
        setIsLoadingHistorial(true);

        const response = await obtenerDetalleCliente(clienteId, pageHistorial, pageSizeHistorial);

        if (response.success) {
          // Solo actualizar el historial, mantener el resto de los datos
          setCliente(prev => ({
            ...prev,
            historialActividades: response.data.historialActividades,
            totalPaginasHistorial: response.data.totalPaginasHistorial,
            paginaActualHistorial: response.data.paginaActualHistorial,
            totalActividades: response.data.totalActividades
          }));
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setIsLoadingHistorial(false);
      }
    };

    // Solo ejecutar si pageHistorial cambió después de la carga inicial
    if (cliente) {
      fetchHistorial();
    }
  }, [pageHistorial, clienteId]); // Se ejecuta cuando cambia pageHistorial o clienteId

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPaginasHistorial) {
      setPageHistorial(page);
    }
  }, [totalPaginasHistorial]);

  return {
    cliente,
    isLoading,
    isLoadingHistorial,
    error,
    pageHistorial,
    totalPaginasHistorial,
    handlePageChange,
  };
};
