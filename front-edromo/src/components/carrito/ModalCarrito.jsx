// src/components/carrito/ModalCarrito.jsx
import React from "react";

const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

/**
 * Vista: Componente "tonto" que solo renderiza el contenido del modal.
 * ¡MODIFICADO! para usar la nueva estructura del CartContext.
 */
export default function ModalCarrito({
  isLoading,
  error,
  items,
  total,
  onClose,
  onRemoveTier,
  onDecreaseTier,
  onIncreaseTier,
  onCheckout,
  syncingItemIds
}) {
  
  // Estado de Carga
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <p className="p-5 text-center">Cargando carrito...</p>
      </div>
    );
  }
  
  // Estado de Error
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto">
        <p className="p-5 text-center text-red-600">Error: {error}</p>
      </div>
    );
  }
  
  // Estado Vacío
  if (items.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full p-5 text-center">
          <p className="mb-6 text-gray-600">Su carrito está vacío</p>
          <button 
            onClick={onClose} 
            className="px-6 py-3 font-bold text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
          >
            CONTINUAR COMPRANDO
          </button>
        </div>
      </div>
    );
  }
  
  // Estado con Items
  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="p-5 list-none">
        {items.map((item) => {
          const isSyncing = syncingItemIds.has(item.cartItemId);
          
          const {
            rowId,
            eventName,
            tierName,
            imageUrl,
            fecha,
            hora,
            quantity,
            totalPrice,
          } = item;

          return (
            <li
              key={rowId}
              className="flex items-start justify-between pb-5 mb-5 border-b border-gray-100 last:mb-0 last:pb-0 last:border-b-0"
            >
              <div className="flex flex-row items-start gap-4">
                <img
                  src={imageUrl}
                  alt={eventName}
                  className="object-cover w-20 h-20 rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-800">{eventName}</p>
                  <p className="text-sm text-gray-500">
                    {fecha}
                    {hora ? ` — ${hora}` : ""}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">{tierName}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDecreaseTier(item)}
                        disabled={isLoading || quantity <= 0 || isSyncing}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-base font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Disminuir cantidad de ${eventName} ${tierName}`}
                      >
                        −
                      </button>
                      <span className="text-base font-semibold tabular-nums">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncreaseTier(item)}
                        disabled={isLoading || isSyncing}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-base font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Incrementar cantidad de ${eventName} ${tierName}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-lg font-bold text-gray-900">
                  {pen.format(totalPrice)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveTier(item)}
                  disabled={isLoading}
                  className="text-gray-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`Eliminar ${eventName} ${tierName}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M9 3a1 1 0 0 0-.894.553L7.382 5H4a1 1 0 1 0 0 2h.278l.846 12.206A2 2 0 0 0 7.117 21h9.766a2 2 0 0 0 1.993-1.794L19.722 7H20a1 1 0 1 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 15 3ZM9.618 5h4.764l.5 1H9.118ZM9 9a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Zm6 0a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-7a1 1 0 0 0-1-1Z" />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      
      {/* Footer con Total y Botón de Checkout */}
      <div className="sticky bottom-0 p-5 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4 text-lg font-bold">
          <span>Total:</span>
          {/* 8. CORREGIDO: 'total' ya viene calculado por el contexto */}
          <span>S/ {total.toFixed(2)}</span>
        </div>
        <button 
          onClick={onCheckout} 
          className="w-full px-6 py-3 font-bold text-center text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
        >
          FINALIZAR PEDIDO
        </button>
      </div>
    </div>
  );
}