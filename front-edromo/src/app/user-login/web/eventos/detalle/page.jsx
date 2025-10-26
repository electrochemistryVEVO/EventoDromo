"use client";
import React from "react";

import { useEventPageController } from "./controller";

import EventBanner from "@/components/detalle-evento/EventoBanner";
import EventImage from "@/components/detalle-evento/EventoImagen";
import PromotionBar from "@/components/detalle-evento/PromotionBar";
import EventInfo from "@/components/detalle-evento/EventoInfo";
import BookingPanel from "@/components/detalle-evento/BookingPanel";
import LocationInfo from "@/components/detalle-evento/LocationInfo";

import "@/css/detalle-Evento/detalle-evento-style.css";

const EventPage = () => {
  const { isLoading, eventData, handleAddToCart } = useEventPageController();

  if (isLoading) {
    return (
      <div className="event-page-background">
        <div className="event-page-container">
          Cargando información del evento...
        </div>
      </div>
    );
  }

  if (!eventData || !eventData.success) {
    return (
      <div className="event-page-background">
        <div className="event-page-container">
          Error: No se pudo cargar la información del evento. Por favor, intente
          más tarde.
        </div>
      </div>
    );
  }

  const { evento, funciones, tiposDeEntrada, local } = eventData.data;
  const maxPuntos = Math.max(
    ...tiposDeEntrada.map((entrada) => entrada.puntos)
  );

  return (
    <div className="event-page-background">
      <div className="event-page-container">
        <>
          <EventBanner imageUrl={evento.imagenUrl} eventName={evento.nombre} />
          
          <div className="page-layout">
            <div className="main-column">
              <EventImage imageUrl={evento.imagenUrl} eventName={evento.nombre} />
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
                ticketTiers={tiposDeEntrada}
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
        </>
      </div>
    </div>
  );
};

export default EventPage;