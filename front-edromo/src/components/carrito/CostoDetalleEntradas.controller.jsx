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
x
        // Procesamos la data para agruparla y asignarle un ID único a cada evento.
        // Esta lógica debería estar idealmente en el servicio, pero la ponemos aquí para ilustrar.
        const eventosAgrupados = data.reduce((acc, evento) => {
          // Usamos el nombre del evento como clave temporal para agrupar
          const claveEvento = evento.eventoNombre;
          if (!acc[claveEvento]) {
            // Si es la primera vez que vemos este evento, creamos la estructura
            acc[claveEvento] = {
              // ¡Aquí creamos el ID único para el grupo de eventos!
              // Usamos el ID de la primera entrada del evento como ID del grupo.
              eventoId: evento.entradas[0]?.id || claveEvento,
              eventoNombre: evento.eventoNombre,
              entradas: [],
            };
          }
          // Agregamos las entradas al grupo correspondiente
          acc[claveEvento].entradas.push(...evento.entradas);
          return acc;
        }, {});

        // Convertimos el objeto de vuelta a un array para el renderizado
        setEventos(Object.values(eventosAgrupados));
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
