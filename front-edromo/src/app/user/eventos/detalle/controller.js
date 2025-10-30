"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getEventDetails } from "@/services/DetalleEvento.service";
import { useCart } from "@/context/CartContext";

export const useEventPageController = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get("id");
  const parsedEventId = eventIdParam ? Number(eventIdParam.trim()) : null;

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventIdParam) {
        setEventData({ success: false, error: "Evento no especificado." });
        setIsLoading(false);
        return;
      }

      if (Number.isNaN(parsedEventId)) {
        setEventData({ success: false, error: "Identificador de evento invalido." });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const data = await getEventDetails.fetch(parsedEventId);
        setEventData(data);
      } catch (error) {
        console.error("Error en el hook al obtener datos del evento:", error);
        setEventData({ success: false, error: "Error de conexion." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [eventIdParam, parsedEventId]);

  const handleAddToCart = (bookingDetails) => {
    if (!eventData || !eventData.data) {
      console.error("Los datos del evento aun no estan cargados.");
      return;
    }

    const { evento, funciones, local, tiposDeEntrada } = eventData.data;

    const selectedFunction = funciones.find(
      (f) => f.id.toString() === bookingDetails.selectedFunctionId
    );

    if (!selectedFunction) {
      console.warn("No se encontro la funcion seleccionada para el carrito.");
      return;
    }

    const entradasSeleccionadas = Object.keys(bookingDetails.ticketQuantities)
      .filter((tierId) => bookingDetails.ticketQuantities[tierId] > 0)
      .map((tierId) => {
        const tipoEntrada = tiposDeEntrada.find(
          (t) => t.id.toString() === tierId
        );

        if (!tipoEntrada) {
          console.warn("No se encontro el tipo de entrada", tierId);
          return null;
        }

        return {
          tipoEntradaId: tipoEntrada.id,
          nombre: tipoEntrada.nombre,
          cantidad: bookingDetails.ticketQuantities[tierId],
          precioUnitario: tipoEntrada.precio,
        };
      })
      .filter(Boolean);

    if (!entradasSeleccionadas.length) {
      console.warn("No se agregaron entradas por falta de seleccion valida.");
      return;
    }

    // Mantiene la estructura esperada por CartContext al agregar un item.
    const cartItem = {
      cartItemId: crypto.randomUUID(),
      eventoInfo: {
        id: evento.id,
        nombre: evento.nombre,
        imagenUrl: evento.imagenUrl,
      },
      localInfo: {
        nombre: local.nombre,
        ciudad: local.ciudad.nombre,
      },
      funcionInfo: {
        id: selectedFunction.id,
        fecha: selectedFunction.fecha,
        hora: selectedFunction.hora,
      },
      entradas: entradasSeleccionadas,
      totalItem: bookingDetails.totalPrice,
    };

    addToCart(cartItem);

    alert("Entradas agregadas al carrito!");
  };

  return {
    isLoading,
    eventData,
    handleAddToCart,
  };
};
