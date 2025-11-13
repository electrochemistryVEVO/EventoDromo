"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

// 1. Importamos el NUEVO controlador de visualización
import { useEventViewer } from "../controller"; // Asegúrate de que la ruta sea correcta

// 2. Reutilizamos los mismos componentes de siempre
import { EventInfoForm } from "@/components/crear-evento/EventInfoForm.jsx";
import { EventDatesForm } from "@/components/crear-evento/EventDatesForm.jsx";
import { EventTicketsForm } from "@/components/crear-evento/EventTicketsForm.jsx";
import { EventDiscountsForm } from "@/components/crear-evento/EventDiscountsForm.jsx";

// Componente de carga (puedes reutilizar el mismo que en la página de edición)
const LoadingSpinner = () => (
  <div className="text-center py-10">
    <p className="text-lg font-semibold text-gray-600">
      Cargando detalles del evento...
    </p>
  </div>
);

const VerEventoPage = () => {
  const router = useRouter();
  const params = useParams();
  const { eventId } = params;

  // 3. Usamos el controlador de VISUALIZACIÓN
  const {
    eventInfo,
    fechas,
    tiposEntrada,
    locales,
    descuentos,
    eventTypes,
    isLoading,
    error,
  } = useEventViewer(eventId);

  // Si está cargando, mostramos el spinner
  if (isLoading) {
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
            <h1 className="text-2xl font-bold text-gray-800">
              Detalles del Evento
            </h1>
          </header>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Si hubo un error, lo mostramos
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black"
            title="Volver"
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
            Detalles del Evento
          </h1>
        </header>

        {/* --- LA MAGIA ESTÁ AQUÍ --- */}
        {/* 4. Envolvemos todo el formulario en un <fieldset disabled>.
            Esto deshabilita automáticamente todos los inputs, selects, textareas y buttons
            que estén dentro, haciéndolos de solo lectura de forma efectiva. */}
        <fieldset disabled className="space-y-6">
          <style>{`.cursor-not-allowed{ cursor: default !important; }`}</style>

          <EventInfoForm
            eventInfo={eventInfo}
            locales={locales}
            eventTypes={eventTypes}
            isReadOnly={true}
          />

          <EventDatesForm fechas={fechas} isReadOnly={true} />

          <EventTicketsForm tiposEntrada={tiposEntrada} isReadOnly={true} />

          {descuentos && descuentos.length > 0 && (
            <EventDiscountsForm
              descuentos={descuentos}
              tiposEntrada={tiposEntrada} // Lo pasamos para que el <select> muestre el nombre correcto
              isReadOnly={true}
            />
          )}
        </fieldset>
      </div>
    </div>
  );
};

export default VerEventoPage;
