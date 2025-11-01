"use client";
// 1. Importamos useMemo
import React, { useState, useEffect, Suspense, useMemo } from "react";
// --- IMPORTACIONES ---
import { useSearchParams } from "next/navigation";

// Servicios
// import { getEventDetails } from "@/services/DetalleEventoServices";
import { obtenerDetallePorId } from "@/services/EntradaDetalle.service";

// Componentes visuales
import EventBanner from "@/components/detalle-evento/EventoBanner";
import EventImage from "@/components/detalle-evento/EventoImagen";
import PromotionBar from "@/components/detalle-evento/PromotionBar";
import EventInfo from "@/components/detalle-evento/EventoInfo";
import BookingPanel from "@/components/detalle-evento/BookingPanel";
import LocationInfo from "@/components/detalle-evento/LocationInfo"


const EventPageController = () => {
  // --- 2. SECCIÓN DE HOOKS (TODOS JUNTOS) ---
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await obtenerDetallePorId(id);
        setEventData(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setEventData({ success: false, error: "Error de conexión." });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    } else {
      console.error("No se proporcionó un ID en la URL.");
      setEventData({ success: false, error: "ID de evento no encontrado." });
      setIsLoading(false);
    }
  }, [id]);

  // <-- ¡SOLUCIÓN! Movemos el useMemo aquí arriba
  // Lo hacemos "seguro" para que no falle si eventData es null
  const { evento, local, funciones } = useMemo(() => {
    // Si no hay datos O la petición falló, devolvemos una estructura vacía y estable
    if (!eventData || !eventData.success || !eventData.data) {
      return { evento: null, local: null, funciones: [] };
    }
    // Si hay datos, los devolvemos
    return eventData.data;
  }, [eventData]); // Solo se recalcula si 'eventData' cambia

  // --- 4. MANEJADOR DE EVENTOS ---
  const handleAddToCart = (bookingDetails) => {
    // Añadimos una comprobación por si acaso, usando la variable 'evento' del useMemo
    if (!evento) {
      console.error("handleAddToCart se llamó sin datos del evento.");
      return;
    }
    
    console.log("--- DETALLES PARA AGREGAR AL CARRITO ---");
    console.log("Evento:", evento.nombre); // Usamos la variable 'evento'
    console.log("Función (Fecha y Hora) ID:", bookingDetails.selectedFunctionId);
    console.log("Entradas seleccionadas:", bookingDetails.ticketQuantities);
    console.log("Precio Total:", `S/ ${bookingDetails.totalPrice.toFixed(2)}`);

    alert(
      "¡Entradas agregadas al carrito! Revisa la consola para ver los detalles."
    );
  };

  // --- 5. RENDERIZADO CONDICIONAL ---
  // (Ahora todos los hooks están ANTES de estos returns, lo cual es correcto)
  if (isLoading) {
    return <div>Cargando información del evento...</div>;
  }

  // Si 'evento' es null (del useMemo), significa que el fetch falló o no vino data.
  if (!evento) {
    return (
      <div>
        Error: No se pudo cargar la información del evento.
        {eventData?.error && <p>{eventData.error}</p>}
      </div>
    );
  }

  // --- 6. PREPARACIÓN DE DATOS ---
  // (Las variables 'evento', 'local', y 'funciones' ya vienen del useMemo)

  const ticketsPrimeraFuncion = (funciones || [])[0]?.tiposDeEntrada || [];
  const puntos = ticketsPrimeraFuncion.map((entrada) => entrada.puntos);
  const maxPuntos = puntos.length > 0 ? Math.max(...puntos) : 0;
  let url = evento.imagenUrl;

  // --- 7. RENDERIZADO FINAL ---
  return (
    <main className="event-page-container">
      <EventBanner imageUrl={url} eventName={evento.nombre} />
      <div className="page-layout">
        <div className="main-column">
          <Suspense fallback={<div>Cargando imagen del evento...</div>}>
            <EventImage imageUrl={url} eventName={evento.nombre} />
          </Suspense>
          <PromotionBar maxPoints={maxPuntos} />
          <EventInfo
            eventName={evento.nombre}
            description={evento.descripcion}
          />
        </div>

        <div className="sidebar-column">
          <BookingPanel
            eventName={evento.nombre}
            functions={funciones}
            onAddToCart={handleAddToCart}
          />
          <LocationInfo
            city={`${local.ciudad.nombre}, ${local.ciudad.pais.nombre}`}
            venue={local.nombre}
            address={local.direccion}
            googleMapsEmbed={local.googleMapsEmbed}
          />
        </div>
      </div>
    </main>
  );
};

export default EventPageController;