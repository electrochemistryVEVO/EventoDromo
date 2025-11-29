"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEventCreator } from "./controller"; // Ajusta la ruta si es necesario
import { showSuccess } from "@/components/Notifications/toast";

// Importación de los componentes de la interfaz
import { EventInfoForm } from "@/components/crear-evento/EventInfoForm.jsx";
import { EventDatesForm } from "@/components/crear-evento/EventDatesForm.jsx";
import { EventTicketsForm } from "@/components/crear-evento/EventTicketsForm.jsx";
import { EventDiscountsForm } from "@/components/crear-evento/EventDiscountsForm.jsx";

const CrearEventoPage = () => {
  const router = useRouter();

  // 1. Usamos el controlador para obtener toda la lógica y el estado.
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
    handleInfoChange,
    addFecha,
    removeFecha,
    handleFechaChange,
    addTipoEntrada,
    removeTipoEntrada,
    handleTipoEntradaChange,
    handleImageChange, // Obtener la nueva función del controlador
    handleSubmit,
    minDateTime, // Obtener la nueva prop del controlador
    descuentos,
    addDescuento,
    removeDescuento,
    handleDescuentoChange,
  } = useEventCreator();

  // Opcional: Redirigir al usuario tras una creación exitosa.
  React.useEffect(() => {
    if (isSuccess) {
      showSuccess("¡Evento creado exitosamente!");
      router.push("/admin/eventos/gestion"); // Redirige a la página de la lista
    }
  }, [isSuccess, router]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* --- Encabezado de la Página --- */}
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
          <h1 className="text-2xl font-bold text-gray-800">
            Creación de Evento
          </h1>
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
            descuentosAsociados={descuentos}
          />
          {/* --- Componente 4: Descuentos del Evento --- */}
          <EventDiscountsForm
            descuentos={descuentos}
            tiposEntrada={tiposEntrada} // Pasar los tipos de entrada para el select
            addDescuento={addDescuento}
            removeDescuento={removeDescuento}
            handleDescuentoChange={handleDescuentoChange}
          />

          {/* --- Acciones Finales y Mensajes de Error --- */}
          <div className="flex justify-end items-center gap-4 pt-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#00C49A] text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando Evento..." : "Crear Evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearEventoPage;