"use client";

import { useState } from "react";
import { obtenerDetalleTransaccion } from "@/services/detalle-transaccion.service";

export function useDetalleTransaccion() {
  const [isOpen, setIsOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Abre el modal y carga los detalles de la transacción
   * @param {string} numeroTransaccion - Número de transacción a consultar
   * @param {string} token - Token JWT del usuario
   */
  const abrirDetalle = async (numeroTransaccion, token) => {
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setDetalle(null);

    try {
      const data = await obtenerDetalleTransaccion(numeroTransaccion, token);
      setDetalle(data);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const cerrarDetalle = () => {
    setIsOpen(false);
    setDetalle(null);
    setError(null);
  };

  return {
    isOpen,
    detalle,
    loading,
    error,
    abrirDetalle,
    cerrarDetalle,
  };
}
