"use client";
import React, { useState, useEffect } from "react";

// 1. IMPORTACIONES
// Importamos el service que se encarga de traer los datos.
import { getEventDetails } from "@/services/DetalleEventoServices";

// Importamos todos los componentes visuales que hemos creado.
import EventBanner from "@/components/detalle-evento/EventoBanner";
import EventImage from "@/components/detalle-evento/EventoImagen";
import PromotionBar from "@/components/detalle-evento/PromotionBar";
import EventInfo from "@/components/detalle-evento/EventoInfo";
import BookingPanel from "@/components/detalle-evento/BookingPanel";
import LocationInfo from "@/components/detalle-evento/LocationInfo";

const EventPageController = () => {
  // 2. ESTADO
  // Estado para saber si los datos están cargando. Inicia en `true`.
  const [isLoading, setIsLoading] = useState(true);
  // Estado para guardar la respuesta completa del service (el JSON). Inicia en `null`.
  const [eventData, setEventData] = useState(null);

  // 3. EFECTO PARA OBTENER DATOS
  // useEffect se ejecuta una sola vez cuando el componente se monta en la pantalla,
  // gracias al array de dependencias vacío `[]`.
  useEffect(() => {
    // Definimos una función asíncrona para poder usar await.
    const fetchEventData = async () => {
      try {
        // Llamamos a la función `fetch` de nuestro service. Le pasamos un ID de ejemplo.
        // El service se encargará de traer los datos (del JSON local o de la API).
        const data = await getEventDetails.fetch(1);
        setEventData(data); // Guardamos la respuesta en el estado.
      } catch (error) {
        console.error(
          "Error en el controller al obtener datos del evento:",
          error
        );
        // En caso de un error grave, también lo guardamos para mostrar un mensaje.
        setEventData({ success: false, error: "Error de conexión." });
      } finally {
        // Se ejecuta siempre, tanto si hubo éxito como si hubo error.
        setIsLoading(false); // Indicamos que la carga ha terminado.
      }
    };

    fetchEventData(); // Ejecutamos la función.
  }, []); // El `[]` asegura que esto se ejecute solo una vez.

  // 4. MANEJADOR DE EVENTOS
  // Esta función se pasa como prop al BookingPanel. Se ejecutará cuando el usuario
  // haga clic en "Agregar al Carrito" dentro de ese componente hijo.
  const handleAddToCart = (bookingDetails) => {
    console.log("--- DETALLES PARA AGREGAR AL CARRITO ---");
    console.log("Evento:", eventData.data.evento.nombre);
    console.log(
      "Función (Fecha y Hora) ID:",
      bookingDetails.selectedFunctionId
    );
    console.log("Entradas seleccionadas:", bookingDetails.ticketQuantities);
    console.log("Precio Total:", `S/ ${bookingDetails.totalPrice.toFixed(2)}`);

    // Aquí es donde, en un futuro, llamarías a otro servicio para
    // guardar esta información en el estado global de la aplicación o en el backend.
    alert(
      "¡Entradas agregadas al carrito! Revisa la consola para ver los detalles."
    );
  };

  // 5. RENDERIZADO CONDICIONAL
  // Mientras isLoading sea true, mostramos un mensaje de carga.
  if (isLoading) {
    return <div>Cargando información del evento...</div>;
  }

  // Si la carga terminó pero no hay datos, o la respuesta indica que no tuvo éxito,
  // mostramos un mensaje de error. Esto previene que la app se rompa.
  if (!eventData || !eventData.success) {
    return (
      <div>
        Error: No se pudo cargar la información del evento. Por favor, intente
        más tarde.
      </div>
    );
  }

  // 6. PREPARACIÓN DE DATOS PARA LOS COMPONENTES
  // Si llegamos aquí, significa que tenemos datos válidos.
  // Destructuramos los datos para que sea más fácil pasarlos a los componentes.
  const { evento, funciones, tiposDeEntrada, local } = eventData.data;

  // Calculamos el máximo de puntos para la barra de promoción.
  const maxPuntos = Math.max(
    ...tiposDeEntrada.map((entrada) => entrada.puntos)
  );

  // 7. RENDERIZADO FINAL
  // Devolvemos el JSX que ensambla todos nuestros componentes, pasándoles
  // los datos que necesitan a través de los props.
  return (
    <main className="event-page-container">
      {/* 1. El banner de fondo no cambia */}
      <EventBanner imageUrl={evento.imagenUrl} eventName={evento.nombre} />
      <div className="page-layout">
        {/* 2. COLUMNA IZQUIERDA (AHORA CON LA IMAGEN NÍTIDA PRIMERO) */}
        <div className="main-column">
          {/* ¡NUEVO COMPONENTE AQUÍ! */}
          <EventImage imageUrl={evento.imagenUrl} eventName={evento.nombre} />
          <PromotionBar maxPoints={maxPuntos} />
          <EventInfo
            eventName={evento.nombre}
            description={evento.descripcion}
          />
        </div>

        {/* 3. COLUMNA DERECHA (SIN CAMBIOS EN SU CONTENIDO) */}
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
    </main>
  );
};

export default EventPageController;
