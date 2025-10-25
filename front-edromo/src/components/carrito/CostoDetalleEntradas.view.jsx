// src/components/carrito/CostoDetalleEntradas.view.js
"use client";

import React from "react";

const formatCurrency = (value) => `S/. ${value.toFixed(2)}`;

export const CostoDetalleEntradasView = ({
  eventos,
  totalGeneral,
  dromoPuntos,
  isLoading,
  error,
}) => {
  const renderContent = () => {
    if (isLoading)
      return <p className="p-4 text-center">Cargando detalle...</p>;
    if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
    if (eventos.length === 0)
      return <p className="p-4 text-center">No hay entradas para mostrar.</p>;

    return (
      // Contenedor desplazable si el contenido excede la altura máxima
      <div className="max-h-96 overflow-y-auto pr-2">
        {eventos.map((evento) => (
          <div key={evento.eventoId} className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
              {evento.eventoNombre}
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-sm font-semibold text-gray-600">
                    Entrada
                  </th>
                  <th className="pb-2 text-center text-sm font-semibold text-gray-600">
                    Costo Unit.
                  </th>
                  <th className="pb-2 text-right text-sm font-semibold text-gray-600">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {evento.entradas.map((entrada) => (
                  <tr key={entrada.id} className="text-sm">
                    <td className="py-3">
                      x{entrada.cantidad} {entrada.descripcion}
                    </td>
                    <td className="py-3 text-center">
                      {formatCurrency(entrada.costoUnitario)}
                    </td>
                    <td className="py-3 text-right">
                      {formatCurrency(entrada.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 w-full bg-white p-4 shadow-md rounded-lg">
      {renderContent()}
      <div className="mt-6 border-t-2 border-gray-300 pt-4 text-right text-xl font-bold text-gray-800">
        Total: {formatCurrency(totalGeneral)}
      </div>
      <div className="mt-8 w-fit rounded-lg bg-[#00C49A] px-8 py-3 text-center text-base font-semibold text-white shadow-md mx-auto">
        ¡En esta compra ganarás {dromoPuntos.toFixed(0)} DromoPuntos!
      </div>
    </div>
  );
};
