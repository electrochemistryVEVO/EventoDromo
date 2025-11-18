import { useState, useEffect, useCallback } from "react";
import { obtenerClientesAuditoria } from "@/services/service-auditoria";

export const useAuditoriaController = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset a la primera página al buscar
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Solo mostrar isLoading en la primera carga (cuando no hay clientes ni búsqueda previa)
        const isFirstLoad = clientes.length === 0 && debouncedSearchTerm === "";
        
        if (isFirstLoad) {
          setIsLoading(true);
        } else {
          setIsSearching(true);
        }
        setError(null);

        // Llamada al servicio
        const response = await obtenerClientesAuditoria(currentPage, debouncedSearchTerm);

        if (response.success) {
          setClientes(response.data.clientes);
          setTotalPages(response.data.totalPages);
          setTotalClientes(response.data.totalClientes);
        } else {
          setError(response.message || "Error al obtener los clientes");
          setClientes([]);
        }
      } catch (err) {
        console.error("Error en fetchClientes:", err);
        setError(err.message || "Error inesperado al cargar los datos");
        setClientes([]);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    };

    fetchClientes();
  }, [currentPage, debouncedSearchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return {
    clientes,
    isLoading,
    isSearching,
    error,
    searchTerm,
    handleSearchChange,
    currentPage,
    totalPages,
    totalClientes,
    handlePageChange,
  };
};
