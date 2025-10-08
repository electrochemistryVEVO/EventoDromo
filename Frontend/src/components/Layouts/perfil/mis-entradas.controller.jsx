"use client";

import React, { useEffect, useState } from "react";
import { getEntradas } from "../../../services/mis-entradas.service";
import MisEntradasView from "./mis-entradas";

/**
 * Controller: maneja la paginación y filtro por rango de fechas y estado.
 * PAGE_SIZE es configurable SOLO a nivel de código cambiando DEFAULT_PAGE_SIZE
 */
const DEFAULT_PAGE_SIZE = 10; // <-- cambiar aquí para ajustar por defecto

export default function MisEntradasController({ initialPageSize = DEFAULT_PAGE_SIZE }) {
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageSize] = useState(initialPageSize); // configurable solo en código
  const [currentPage, setCurrentPage] = useState(1);

  // filtros de fechas (ISO: yyyy-mm-dd)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // filtro por estado: "all" | "vigente" | "vencido" (puedes añadir más)
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getEntradas()
      .then((data) => {
        if (!mounted) return;
        setAllEntries(Array.isArray(data) ? data : []);
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
  }, []);

  // función auxiliar para filtro por rango de fechas
  const withinRange = (fechaStr) => {
    if (!startDate && !endDate) return true;
    if (!fechaStr) return true; // incluir si no hay fecha
    const d = new Date(fechaStr);
    if (Number.isNaN(d.getTime())) return true;
    if (startDate) {
      const s = new Date(startDate);
      if (d < s) return false;
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      if (d > e) return false;
    }
    return true;
  };

  // función auxiliar para filtro por estado
  const matchesStatus = (entry) => {
    if (!statusFilter || statusFilter === "all") return true;
    const estado = (entry.estado || "").toString().toLowerCase();
    return estado === statusFilter;
  };

  // aplica filtros
  const filteredEntries = allEntries.filter((e) => withinRange(e.fecha) && matchesStatus(e));

  const totalItems = filteredEntries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));

  // Ajusta currentPage si fuera de rango cuando cambian filtros/datos
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const pageEntries = filteredEntries.slice(startIndex, startIndex + pageSize);

  const goToPage = (n) => {
    const page = Math.max(1, Math.min(totalPages, Number(n) || 1));
    setCurrentPage(page);
    // scroll al top del contenedor
    const el = document.getElementById("mis-entradas-scrollable");
    if (el) el.scrollTop = 0;
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handleDateFilter = (start, end) => {
    setStartDate(start || null);
    setEndDate(end || null);
    setCurrentPage(1);
  };

  const handleStateFilter = (status) => {
    setStatusFilter(status || "all");
    setCurrentPage(1);
  };

  return (
    <MisEntradasView
      entries={pageEntries}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={goToPage}
      onPrev={handlePrev}
      onNext={handleNext}
      onDateFilter={handleDateFilter}
      startDate={startDate}
      endDate={endDate}
      statusFilter={statusFilter}
      onStateFilter={handleStateFilter}
    />
  );
}