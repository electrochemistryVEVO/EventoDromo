"use client";

import React, { useEffect, useState } from "react";
import { getEntradas } from "../../../services/mis-entradas.service";
import MisEntradasView from "./mis-entradas";
// --- 1. IMPORTA useUser PARA OBTENER EL TOKEN ---
import { useUser } from "@/context/UserContext";

const DEFAULT_PAGE_SIZE = 10;

export default function MisEntradasController({ initialPageSize = DEFAULT_PAGE_SIZE }) {
  // --- 2. OBTÉN EL USUARIO (Y SU TOKEN) ---
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize] = useState(initialPageSize);

  // --- 3. ESTOS ESTADOS AHORA SON LOS FILTROS PARA LA API ---
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState({
    vigente: true,
    vencido: false,
    transferida: false,
  });

  // --- 4. ESTADOS PARA ALMACENAR LA RESPUESTA DE LA API ---
  const [pageEntries, setPageEntries] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // --- 5. useEffect ACTUALIZADO ---
  // Ahora se ejecuta cada vez que el usuario, los filtros o la página cambian.
  useEffect(() => {
    let mounted = true;

    // No hacer nada si el usuario (con el token) aún no ha cargado
    if (!user || !user.token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Prepara los filtros para el servicio
    const filters = {
      startDate,
      endDate,
      statusFilter,
      currentPage,
      pageSize
    };

    // Llama al servicio con el token y los filtros
    getEntradas(user.token, filters)
      .then((data) => {
        if (!mounted) return;
        // El backend nos da los datos ya paginados
        setPageEntries(data.items || []);
        setTotalItems(data.totalItems || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
      
    return () => {
      mounted = false;
    };
  }, [user, startDate, endDate, statusFilter, currentPage, pageSize]); // <-- El hook depende de los filtros

  // --- 6. ELIMINAMOS TODA LA LÓGICA DE FILTRADO CLIENT-SIDE ---
  // (Ya no son necesarios los helpers 'withinRange', 'matchesStatus', 
  // 'filteredEntries', 'startIndex', etc.)

  // --- 7. HANDLERS (Ahora solo cambian el estado, lo que dispara el useEffect) ---
  const goToPage = (n) => {
    const page = Math.max(1, Math.min(totalPages, Number(n) || 1));
    setCurrentPage(page);
    // (Tu lógica de scroll está bien)
    const el = document.getElementById("mis-entradas-scrollable");
    if (el) el.scrollTop = 0;
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handleStartDateChange = (newStart) => {
    const start = newStart || null;
    setStartDate(start);
    if (start && endDate && new Date(start) > new Date(endDate)) {
      setEndDate(start);
    }
    setCurrentPage(1); // Resetea a la página 1 al cambiar filtro
  };

  const handleEndDateChange = (newEnd) => {
    const end = newEnd || null;
    setEndDate(end);
    if (end && startDate && new Date(end) < new Date(startDate)) {
      setStartDate(end);
    }
    setCurrentPage(1); // Resetea a la página 1 al cambiar filtro
  };

  const handleStateFilter = (status, isChecked) => {
    setStatusFilter(prev => ({ ...prev, [status]: isChecked }));
    setCurrentPage(1); // Resetea a la página 1 al cambiar filtro
  };

  // --- 8. PASAMOS LOS DATOS DE LA API A LA VISTA ---
  return (
    <MisEntradasView
      entries={pageEntries} // Los items de esta página
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages} // El total de páginas (calculado por el backend)
      totalItems={totalItems} // El total de items (calculado por el backend)
      pageSize={pageSize}
      onPageChange={goToPage}
      onPrev={handlePrev}
      onNext={handleNext}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      startDate={startDate}
      endDate={endDate}
      statusFilter={statusFilter}
      onStateFilter={handleStateFilter}
    />
  );
}