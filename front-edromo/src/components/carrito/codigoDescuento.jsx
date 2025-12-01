// src/components/carrito/codigoDescuento.jsx
"use client";

import React from "react";

const CodigoDescuento = ({ 
  codigo, 
  setCodigo, 
  onAplicar, 
  onLimpiar,
  onRemover,
  isLoading, 
  mensaje,
  promocionAplicada
}) => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Código de descuento
      </label>
      
      {!promocionAplicada ? (
        // Mostrar input para ingresar código
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  onAplicar();
                }
              }}
              placeholder="Ingresa tu código"
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C49A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {codigo && !isLoading && (
              <button
                onClick={onLimpiar}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Limpiar"
              >
                ✕
              </button>
            )}
            <button
              onClick={onAplicar}
              disabled={isLoading || !codigo.trim()}
              className="px-4 py-2 bg-[#00C49A] text-white text-sm font-semibold rounded-lg hover:bg-[#00b088] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? "Aplicando..." : "Aplicar"}
            </button>
          </div>
          {mensaje.texto && (
            <div
              className={`mt-2 text-xs px-3 py-2 rounded ${
                mensaje.tipo === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : mensaje.tipo === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {mensaje.texto}
            </div>
          )}
        </>
      ) : (
        // Mostrar código aplicado
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-bold text-green-800">
                  Código "{promocionAplicada.codigo}" aplicado
                </p>
              </div>
              <p className="text-xs text-green-700 ml-7">
                {promocionAplicada.tipo === "PORCENTAJE"
                  ? `${promocionAplicada.valor}% de descuento`
                  : `S/ ${promocionAplicada.valor.toFixed(2)} de descuento`}
              </p>
              <p className="text-sm font-semibold text-green-800 mt-1 ml-7">
                Ahorras: S/ {promocionAplicada.montoDescuento.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onRemover}
              disabled={isLoading}
              className={`text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1.5 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Remover código"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodigoDescuento;

