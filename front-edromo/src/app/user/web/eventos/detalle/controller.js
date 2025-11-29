"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { v4 } from 'uuid';

// Servicios
import { obtenerDetallePorId, obtenerDisponibilidadEntrada } from "@/services/EntradaDetalle.service";

// Componentes visuales
import EventBanner from "@/components/detalle-evento/EventoBanner";
import EventImage from "@/components/detalle-evento/EventoImagen";
import PromotionBar from "@/components/detalle-evento/PromotionBar";
import EventInfo from "@/components/detalle-evento/EventoInfo";
import BookingPanel from "@/components/detalle-evento/BookingPanel";
import LocationInfo from "@/components/detalle-evento/LocationInfo";

//contexto
import { useCart } from "@/context/CartContext";

const EventPageController = () => {
  const { addToCart } = useCart();
  // --- HOOKS AL INICIO ---
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  // Nuevo estado para guardar la disponibilidad de las entradas
  const [ticketAvailability, setTicketAvailability] = useState({});
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const parsedEventId = id ? Number(id.trim()) : null;
  
  // useMemo DEBE estar aquí, antes de cualquier return
  const { evento, local, funciones } = useMemo(() => {
    if (!eventData || !eventData.success || !eventData.data) {
      return { evento: null, local: null, funciones: [] };
    }
    return eventData.data;
  }, [eventData]);
  
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) {
          throw new Error("No se proporcionó ID en la URL");
        }

        const data = await obtenerDetallePorId(id);

        if (!data) {
          throw new Error("La API devolvió null o undefined");
        }

        if (data.success === false) {
          throw new Error(data.error || data.message || "Error del servidor");
        }

        if (!data.data) {
          throw new Error("El servidor no devolvió datos del evento");
        }

        setEventData(data);

        // --- NUEVA LÓGICA ---
        // Una vez tenemos los datos del evento, buscamos la disponibilidad.
        const allTicketTypes = data.data.funciones.flatMap(f => f.tiposDeEntrada || []);
        const uniqueTicketTypeIds = [...new Set(allTicketTypes.map(t => t.id))];

        // Creamos un array de promesas para obtener la disponibilidad de cada tipo de entrada.
        const availabilityPromises = uniqueTicketTypeIds.map(idTipo =>
          obtenerDisponibilidadEntrada(idTipo).then(avail => ({ id: idTipo, ...avail }))
        );

        // Ejecutamos todas las promesas en paralelo.
        const availabilities = await Promise.all(availabilityPromises);

        // Convertimos el array de resultados en un objeto para fácil acceso.
        const availabilityMap = availabilities.reduce((acc, curr) => {
          acc[curr.id] = { vendidas: curr.vendidas, total: curr.total };
          return acc;
        }, {});

        setTicketAvailability(availabilityMap);
        // --- FIN NUEVA LÓGICA ---

        setError(null);

      } catch (error) {
        console.error("❌ Error en fetchEventData:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id]);
  // --- RENDERIZADO CONDICIONAL ---
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div>Cargando información del evento...</div>
        <div className="text-sm text-gray-500">ID: {id}</div>
      </div>
    );
  }

  if (!evento || error) {
    return (
      <div className="p-4">
        <div className="text-red-600 font-bold">Error: No se pudo cargar la información del evento.</div>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>ID solicitado:</strong> {id || "No proporcionado"}</p>
          <p><strong>Error:</strong> {error || eventData?.error || eventData?.message || "Desconocido"}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // --- PREPARACIÓN DE DATOS ---
  const ticketsPrimeraFuncion = funciones?.[0]?.tiposDeEntrada || [];
  const puntos = ticketsPrimeraFuncion.map((entrada) => entrada.puntos).filter(punto => punto != null);
  const maxPuntos = puntos.length > 0 ? Math.max(...puntos) : 0;

  const url = evento.imagenUrl || "";
  const ciudadInfo = local?.ciudad ?
    `${local.ciudad.nombre}, ${local.ciudad.pais?.nombre || ''}` :
    "Ciudad no disponible";

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
      cartItemId: v4(),
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
  };

  // --- RENDERIZADO FINAL ---
  return (
    <main className="event-page-container">
      <EventBanner imageUrl={url} eventName={evento.nombre} />
      <div className="page-layout">
        <div className="main-column">
          {/* ✅ QUITADO Suspense - EventImage ya es client component normal */}
          <EventImage imageUrl={url} eventName={evento.nombre} />
          <PromotionBar maxPoints={maxPuntos} />
          <EventInfo
            eventName={evento.nombre}
            description={evento.descripcion}
          />
        </div>

        <div className="sidebar-column">
          <BookingPanel
            eventName={evento.nombre}
            functions={funciones || []}
            ticketAvailability={ticketAvailability} // <-- Pasamos el nuevo estado como prop
            onAddToCart={handleAddToCart}
          />
          <LocationInfo
            city={ciudadInfo}
            venue={local?.nombre || "Local no disponible"}
            address={local?.direccion || "Dirección no disponible"}
            googleMapsEmbed={local?.googleMapsEmbed || ""}
          />
        </div>
      </div>
    </main>
  );
};

export default EventPageController;