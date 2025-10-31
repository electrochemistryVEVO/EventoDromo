"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

// 1. Importamos el NUEVO controlador para la edición
import { useEventEditor } from "../controller.js"; // Ajusta la ruta si es necesario

// 2. Reutilizamos EXACTAMENTE los mismos componentes de la página de creación
import { EventInfoForm } from "@/components/crear-evento/EventInfoForm.jsx";
import { EventDatesForm } from "@/components/crear-evento/EventDatesForm.jsx";
import { EventTicketsForm } from "@/components/crear-evento/EventTicketsForm.jsx";

// Componente para mostrar un spinner o esqueleto de carga
const LoadingSpinner = () => (
  <div className="text-center py-10">
    <p className="text-lg font-semibold text-gray-600">
      Cargando datos del evento...
    </p>
    {/* Aquí podrías poner un spinner SVG o un componente de esqueleto más avanzado */}
  </div>
);

const EditarEventoPage = () => {
  const router = useRouter();
  const params = useParams(); // Hook de Next.js para obtener los parámetros de la ruta
  const { eventId } = params; // Extraemos el ID del evento de la URL

  // 3. Usamos el controlador de EDICIÓN, pasándole el eventId
  const {
    eventInfo,
    fechas,
    tiposEntrada,
    locales,
    eventTypes,
    aforoRestante,
    isLoading,
    error,
    isSuccess,
    minDateTime,
    handleInfoChange,
    handleImageChange,
    addFecha,
    removeFecha,
    handleFechaChange,
    addTipoEntrada,
    removeTipoEntrada,
    handleTipoEntradaChange,
    handleSubmit,
  } = useEventEditor(eventId);

  // Efecto para redirigir tras una actualización exitosa
  React.useEffect(() => {
    if (isSuccess) {
      alert("¡Evento actualizado exitosamente!");
      router.push("/admin/eventos/gestion"); // Redirige a la lista
    }
  }, [isSuccess, router]);

  // 4. Si está cargando los datos iniciales, mostramos un mensaje
  if (isLoading && !eventInfo.nombre) {
    // Mostramos la carga solo la primera vez
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-black"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Editar Evento</h1>
          </header>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* --- Encabezado --- */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Editar Evento</h1>
        </header>

        <div className="space-y-6">
          {/* --- Componente 1: Información del Evento --- */}
          <EventInfoForm
            eventInfo={eventInfo}
            handleInfoChange={handleInfoChange}
            locales={locales}
            eventTypes={eventTypes}
            handleImageChange={handleImageChange}
            minDateTime={minDateTime}
          />

          {/* --- Componente 2: Fechas del Evento --- */}
          <EventDatesForm
            fechas={fechas}
            addFecha={addFecha}
            removeFecha={removeFecha}
            handleFechaChange={handleFechaChange}
            fechaCompra={eventInfo.fechaCompra}
          />

          {/* --- Componente 3: Tipos de Entradas --- */}
          <EventTicketsForm
            tiposEntrada={tiposEntrada}
            addTipoEntrada={addTipoEntrada}
            removeTipoEntrada={removeTipoEntrada}
            handleTipoEntradaChange={handleTipoEntradaChange}
            aforoRestante={aforoRestante}
          />

          {/* --- Acciones Finales --- */}
          <div className="flex justify-end items-center gap-4 pt-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {/* Cambiamos el texto del botón según el estado */}
              {isLoading ? "Actualizando..." : "Editar Evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEventoPage;
