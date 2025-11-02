"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

// Servicios
import { obtenerDetallePorId } from "@/services/EntradaDetalle.service";

// Componentes visuales
import EventBanner from "@/components/detalle-evento/EventoBanner";
import EventImage from "@/components/detalle-evento/EventoImagen";
import PromotionBar from "@/components/detalle-evento/PromotionBar";
import EventInfo from "@/components/detalle-evento/EventoInfo";
import BookingPanel from "@/components/detalle-evento/BookingPanel";
import LocationInfo from "@/components/detalle-evento/LocationInfo";

const EventPageController = () => {
  // --- HOOKS AL INICIO ---
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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
        setError(null);
        
      } catch (error) {
        console.error("❌ Error en fetchEventData:", error);
        setError(error.message);
        setEventData({ 
          success: false, 
          error: error.message,
          message: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    } else {
      const errorMsg = "No se proporcionó un ID en la URL.";
      setError(errorMsg);
      setEventData({ 
        success: false, 
        error: errorMsg,
        message: errorMsg
      });
      setIsLoading(false);
    }
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
    console.log("--- DETALLES PARA AGREGAR AL CARRITO ---");
    console.log("Evento:", evento.nombre);
    console.log("Función ID:", bookingDetails.selectedFunctionId);
    console.log("Entradas:", bookingDetails.ticketQuantities);
    console.log("Precio Total:", `S/ ${bookingDetails.totalPrice.toFixed(2)}`);

    alert("¡Entradas agregadas al carrito! Revisa la consola para ver los detalles.");
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