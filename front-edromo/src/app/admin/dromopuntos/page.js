"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDromoPuntosManager } from "./controller";
import { DromoPuntosConfigForm } from "@/components/admin-dromopuntos/dromopuntosConfigForm.jsx";
import { showSuccess } from "@/components/Notifications/toast";

const DromoPuntosPage = () => {
  const router = useRouter();
  const {
    config,
    isLoading,
    error,
    isSuccess,
    handleConfigChange,
    handleSubmit,
  } = useDromoPuntosManager();

  useEffect(() => {
    if (isSuccess) {
      showSuccess("¡Configuración actualizada exitosamente!");
    }
  }, [isSuccess]);

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
            Configuraciones
          </h1>
        </header>

        <div className="space-y-6">
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