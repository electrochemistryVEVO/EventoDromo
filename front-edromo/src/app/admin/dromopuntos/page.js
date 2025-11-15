"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDromoPuntosManager } from "./controller";
import { DromoPuntosConfigForm } from "@/components/admin-dromopuntos/dromopuntosConfigForm.jsx";

const DromoPuntosPage = () => {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  // 1. Usamos el controlador para obtener la lógica y el estado.
  const {
    config,
    isLoading,
    error,
    isSuccess,
    handleConfigChange,
    handleSubmit,
  } = useDromoPuntosManager();

  // Efecto para mostrar alerta de éxito
  useEffect(() => {
    if (isSuccess) {
      alert("¡Configuración de DromoPuntos actualizada exitosamente!");
    }
  }, [isSuccess]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un componente de carga genérico que no dependa de hooks con estado inicial variable
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* --- Encabezado de la Página --- */}
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
            Gestión de DromoPuntos
          </h1>
        </header>

        <div className="space-y-6">
          {/* --- Componente del Formulario de Configuración --- */}
          <DromoPuntosConfigForm
            config={config}
            handleConfigChange={handleConfigChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default DromoPuntosPage;