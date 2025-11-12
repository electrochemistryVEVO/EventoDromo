// src/components/carrito/costoDetalleEntradas.jsx
"use client";

import React, { useEffect } from "react";

const formatCurrency = (value) => `S/. ${value.toFixed(2)}`;

export const CostoDetalleEntradas = ({
  eventos,
  totalGeneral,
  dromoPuntos,
  isLoading,
  error,
}) => {
  // ✅ DEBUG: Verificar IDs únicos
  useEffect(() => {
    if (eventos && eventos.length > 0) {
      const allEntradaIds = eventos.flatMap(evento => 
        evento.entradas.map(entrada => entrada.id)
      );
      const uniqueIds = new Set(allEntradaIds);
      
      console.log('🔍 CostoDetalleEntradas - IDs:', {
        totalEntradas: allEntradaIds.length,
        uniqueIds: uniqueIds.size,
        hasDuplicates: allEntradaIds.length !== uniqueIds.size
      });

      if (allEntradaIds.length !== uniqueIds.size) {
        console.error('❌ DUPLICADOS EN CostoDetalleEntradas:');
        const duplicates = allEntradaIds.filter((id, index) => 
          allEntradaIds.indexOf(id) !== index
        );
        console.error('Duplicados:', duplicates);
      }
    }
  }, [eventos]);

  const renderContent = () => {
    if (isLoading)
      return <p className="p-4 text-center">Cargando detalle...</p>;
    if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
    if (eventos.length === 0)
      return <p className="p-4 text-center">No hay entradas para mostrar.</p>;

    return (
      <div className="pr-2 overflow-y-auto max-h-96">
        {eventos.map((evento) => (
          <div key={evento.id} className="mb-6">
            <h3 className="pb-2 mb-3 text-lg font-bold text-gray-800 border-b-2 border-gray-300">
              {evento.eventoNombre}
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="pb-2 text-sm font-semibold text-left text-gray-600">
                    Entrada
                  </th>
                  <th className="pb-2 text-sm font-semibold text-center text-gray-600">
                    Costo Unit.
                  </th>
                  <th className="pb-2 text-sm font-semibold text-right text-gray-600">
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
    <div className="w-full p-4 mt-6 bg-white rounded-lg shadow-md">
      {renderContent()}
      <div className="pt-4 mt-6 text-xl font-bold text-right text-gray-800 border-t-2 border-gray-300">
        Total: {formatCurrency(totalGeneral)}
      </div>
      <div className="mt-8 w-fit rounded-lg bg-[#00C49A] px-8 py-3 text-center text-base font-semibold text-white shadow-md mx-auto">
        ¡En esta compra ganarás {dromoPuntos.toFixed(0)} DromoPuntos!
      </div>
    </div>
  );
};

export default CostoDetalleEntradas;