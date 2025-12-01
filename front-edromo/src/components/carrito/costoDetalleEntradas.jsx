// src/components/carrito/costoDetalleEntradas.jsx
"use client";

import React, { useEffect } from "react";

const formatCurrency = (value) => `S/. ${value?.toFixed(2) ?? 0}`;

export const CostoDetalleEntradas = ({
  eventos,
  subtotal,
  descuento,
  totalGeneral,
  promocionAplicada,
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
      return <p className="p-2 text-center text-sm">Cargando detalle...</p>;
    if (error) return <p className="p-2 text-center text-red-500 text-sm">{error}</p>;
    if (eventos?.length === 0)
      return <p className="p-2 text-center text-sm">No hay entradas para mostrar.</p>;

    return (
      <div className="overflow-y-auto max-h-60">
        {eventos?.map((evento) => (
          <div key={evento.id} className="mb-3">
            <h3 className="pb-1 mb-2 font-bold text-gray-800 border-b border-gray-300" style={{ fontSize: '16px' }}>
              {evento.eventoNombre}
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="pb-1 text-[10px] font-semibold text-left text-gray-600">
                    Entrada
                  </th>
                  <th className="pb-1 text-[10px] font-semibold text-center text-gray-600">
                    Costo Unit.
                  </th>
                  <th className="pb-1 text-[10px] font-semibold text-right text-gray-600">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {evento.entradas.map((entrada) => (
                  <tr key={entrada.id} className="text-xs">
                    <td className="py-2">
                      x{entrada.cantidad} {entrada.descripcion}
                    </td>
                    <td className="py-2 text-center">
                      {formatCurrency(entrada.costoUnitario)}
                    </td>
                    <td className="py-2 text-right">
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
    <div className="w-full">
      {renderContent()}
      <div className="pt-3 mt-3 space-y-2">
        {descuento > 0 ? (
          <>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-semibold">
              <span>Descuento:</span>
              <span>- {formatCurrency(descuento)}</span>
            </div>
            <div className="pt-2 border-t-2 border-gray-300 flex justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span>{formatCurrency(totalGeneral)}</span>
            </div>
          </>
        ) : (
          <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span>{formatCurrency(totalGeneral)}</span>
          </div>
        )}
      </div>
      {dromoPuntos > 0 && (
        <div className="mt-4 px-3 py-2 bg-linear-to-r from-emerald-50 to-teal-50 border-l-4 border-[#00C49A] rounded">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00C49A]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-700">
              ¡Ganarás <strong className="text-[#00C49A]">{dromoPuntos?.toFixed(0) ?? 0} DromoPuntos</strong> con esta compra!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostoDetalleEntradas;