// src/components/carrito/codigoDescuento.jsx
"use client";

import React from "react";

const CodigoDescuento = ({ 
  codigo, 
  setCodigo, 
  onAplicar, 
  onLimpiar, 
  isLoading, 
  mensaje 
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Código de descuento
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
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
          {isLoading ? "..." : "Aplicar"}
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
    </div>
  );
};

export default CodigoDescuento;
