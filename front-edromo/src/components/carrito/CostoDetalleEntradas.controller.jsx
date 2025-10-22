"use client";

import React, { useState, useEffect } from "react";
import { fetchCostoDetalle } from "@/services/CostoDetalle.service";
import { CostoDetalleEntradasView } from "./CostoDetalleEntradas.view";

export const CostoDetalleEntradasController = () => {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCostoDetalle();
        setEventos(data);
      } catch (err) {
        setError("No se pudo cargar el detalle del costo.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calcula el total general sumando los subtotales de todas las entradas
  const totalGeneral = eventos.reduce(
    (total, evento) =>
      total +
      evento.entradas.reduce((sub, entrada) => sub + entrada.subtotal, 0),
    0
  );

  const dromoPuntos = Math.floor(totalGeneral / 100);

  return (
    <CostoDetalleEntradasView
      eventos={eventos}
      totalGeneral={totalGeneral}
      dromoPuntos={dromoPuntos}
      isLoading={isLoading}
      error={error}
    />
  );
};
