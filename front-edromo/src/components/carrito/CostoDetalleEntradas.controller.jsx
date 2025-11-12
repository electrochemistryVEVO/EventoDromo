// src/components/carrito/CostoDetalleEntradas.controller.jsx
"use client";

import React, { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import CostoDetalleEntradas from "./costoDetalleEntradas";

export const CostoDetalleEntradasController = () => {
  const { cartItems, totalPrice, isLoading } = useCart();

  const { eventos, dromoPuntos } = useMemo(() => {
    const eventosMap = {};
    let totalPuntos = 0;

    cartItems.forEach((item) => {
      const eventoId = item.eventoInfo.id;
      
      if (!eventosMap[eventoId]) {
        eventosMap[eventoId] = {
          id: eventoId,
          eventoNombre: item.eventoInfo.nombre,
          entradas: [],
        };
      }

      // ✅ CORRECCIÓN: Agrupar entradas por tipo dentro del mismo evento
      const entradasPorTipo = {};
      
      item.entradas.forEach((entrada) => {
        const tipoEntradaId = entrada.tipoEntradaId;
        const claveTipo = `${tipoEntradaId}`;
        
        if (!entradasPorTipo[claveTipo]) {
          entradasPorTipo[claveTipo] = {
            id: `${eventoId}-${tipoEntradaId}`, // ID único para el tipo
            cantidad: 0,
            nombre: entrada.nombre,
            costoUnitario: entrada.precioUnitario,
            subtotal: 0,
          };
        }
        
        const cantidad = entrada.cantidad || 0;
        entradasPorTipo[claveTipo].cantidad += cantidad;
        entradasPorTipo[claveTipo].subtotal += cantidad * entrada.precioUnitario;
        
        // Calcular puntos
        totalPuntos += cantidad * (entrada.puntosUnitarios || 0);
      });

      // Agregar las entradas agrupadas al evento
      Object.values(entradasPorTipo).forEach(entradaAgrupada => {
        eventosMap[eventoId].entradas.push({
          ...entradaAgrupada,
          descripcion: `${entradaAgrupada.nombre} (${item.funcionInfo.fecha})`
        });
      });
    });

    const eventos = Object.values(eventosMap);
    
    return {
      eventos,
      dromoPuntos: totalPuntos
    };
  }, [cartItems]);

  console.log('🔍 CostoDetalleEntradas - Eventos agrupados:', eventos);

  return (
    <CostoDetalleEntradas
      eventos={eventos}
      totalGeneral={totalPrice}
      dromoPuntos={dromoPuntos}
      isLoading={isLoading}
      error={null}
    />
  );
};