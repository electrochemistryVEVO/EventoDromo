// src/components/carrito/CostoDetalleEntradas.controller.jsx
"use client";

import React from "react";
// 1. ELIMINAMOS el servicio de fetch
// import { fetchCostoDetalle } from "@/services/CostoDetalle.service";

// 2. IMPORTAMOS el contexto
import { useCart } from "@/context/CartContext";

// 3. IMPORTAMOS la nueva vista
import CostoDetalleEntradas from "./costoDetalleEntradas";

export const CostoDetalleEntradasController = () => {
  // 4. OBTENEMOS los datos del contexto
  const { cartItems, totalPrice, isLoading } = useCart();

  // 5. ELIMINAMOS los estados locales de 'eventos', 'isLoading', 'error'

  // 6. TRANSFORMAMOS los datos del contexto
  // El 'cartItems' es un array plano de reservas.
  // La vista espera un array de 'eventos' agrupados.
  const eventosMap = cartItems.reduce((acc, item) => {
    const eventoId = item.eventoInfo.id;
    
    // Si el evento no está en el mapa, lo creamos
    if (!acc[eventoId]) {
      acc[eventoId] = {
        id: eventoId,
        eventoNombre: item.eventoInfo.nombre,
        entradas: [], // Aquí guardaremos las entradas transformadas
      };
    }

    // Transformamos las entradas del 'cartItem' al formato que espera la vista
    item.entradas.forEach(entrada => {
      acc[eventoId].entradas.push({
        // Creamos un ID único para la fila
        id: `${item.cartItemId}-${entrada.tipoEntradaId}`,
        cantidad: entrada.cantidad,
        // Agregamos la función para más detalle
        descripcion: `${entrada.nombre} (${item.funcionInfo.fecha})`,
        costoUnitario: entrada.precioUnitario,
        subtotal: entrada.cantidad * entrada.precioUnitario,
      });
    });

    return acc;
  }, {});

  // Convertimos el mapa de objetos en un array
  const eventos = Object.values(eventosMap);

  // 7. CALCULAMOS los puntos usando el 'totalPrice' del contexto
  const dromoPuntos = cartItems.reduce((totalPuntosAcc, item) => {
    const puntosPorItem = item.entradas.reduce((entradasAcc, entrada) => {
      const cantidad = entrada.cantidad || 0;
      const puntos = entrada.puntosUnitarios || 0;
      return entradasAcc + (cantidad * puntos);
    }, 0);
    return totalPuntosAcc + puntosPorItem;
  }, 0);

  return (
    <CostoDetalleEntradas
      eventos={eventos}
      totalGeneral={totalPrice} // Usamos el total del contexto
      dromoPuntos={dromoPuntos}
      isLoading={isLoading} // Pasamos el isLoading del contexto
      error={null} // Asumimos que el contexto maneja los errores
    />
  );
};