// src/components/carrito/CostoDetalleEntradas.controller.jsx
"use client";

import React, { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import CostoDetalleEntradas from "./costoDetalleEntradas";

export const CostoDetalleEntradasController = () => {
  const { cartItems, totalPrice, isLoading, cart } = useCart();

  // Obtener información de descuento del carrito
  const subtotal = cart?.subtotal ?? totalPrice;
  const descuento = cart?.descuento ?? 0;
  const promocionAplicada = cart?.promocionAplicada ?? null;

  const { eventos, dromoPuntos } = useMemo(() => {
    console.log('🔍 [CostoDetalleEntradas] cartItems recibidos:', cartItems);
    
    const eventosMap = {};
    let totalPuntos = 0;

    cartItems.forEach((item, itemIndex) => {
      console.log(`🔍 [Item ${itemIndex}] Procesando:`, {
        cartItemId: item.cartItemId,
        eventoNombre: item.eventoInfo?.nombre,
        totalEntradas: item.entradas?.length
      });

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
      
      item.entradas.forEach((entrada, entradaIndex) => {
        console.log(`  📝 [Entrada ${entradaIndex}]:`, {
          nombre: entrada.nombre,
          cantidad: entrada.cantidad,
          precioUnitario: entrada.precioUnitario,
          puntosUnitarios: entrada.puntosUnitarios,
          tipoEntradaId: entrada.tipoEntradaId
        });

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
        const puntosDeEstaEntrada = cantidad * (entrada.puntosUnitarios || 0);
        console.log(`    💰 Puntos: ${cantidad} x ${entrada.puntosUnitarios} = ${puntosDeEstaEntrada}`);
        totalPuntos += puntosDeEstaEntrada;
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
    
    console.log('✅ [CostoDetalleEntradas] RESULTADO FINAL:', {
      totalEventos: eventos.length,
      totalPuntos,
      eventos
    });
    
    return {
      eventos,
      dromoPuntos: totalPuntos
    };
  }, [cartItems]);

  console.log('🎯 [CostoDetalleEntradas] Renderizando con dromoPuntos:', dromoPuntos);

  return (
    <CostoDetalleEntradas
      eventos={eventos}
      subtotal={subtotal}
      descuento={descuento}
      totalGeneral={totalPrice}
      promocionAplicada={promocionAplicada}
      dromoPuntos={dromoPuntos}
      isLoading={isLoading}
      error={null}
    />
  );
};