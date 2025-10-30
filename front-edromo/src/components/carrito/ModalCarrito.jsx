// src/components/carrito/ModalCarrito.jsx
import React from "react";

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
  onRemoveItem,
  onCheckout
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
    // Contenedor principal del cuerpo (con scroll)
    <div className="flex-1 overflow-y-auto">
      {/* Lista de items */}
      <ul className="p-5 list-none">
        {items.map((item) => (
          <li 
            // 1. CORREGIDO: Usamos 'cartItemId'
            key={item.cartItemId} 
            className="flex items-start justify-between pb-5 mb-5 border-b border-gray-100 last:mb-0 last:pb-0 last:border-b-0"
          >
            {/* Detalles del item */}
            <div className="flex flex-row items-start gap-4">
              <img
                // 2. CORREGIDO: Usamos 'eventoInfo'
                src={item.eventoInfo.imagenUrl || "/images/placeholder.png"}
                alt={item.eventoInfo.nombre}
                className="object-cover w-20 h-20 rounded-lg"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-gray-800">
                  {/* 3. CORREGIDO: Usamos 'eventoInfo.nombre' */}
                  {item.eventoInfo.nombre}
                </p>
                <p className="text-sm text-gray-500">
                  {/* 4. CORREGIDO: Mostramos la función */}
                  {item.funcionInfo.fecha} - {item.funcionInfo.hora}
                </p>
                
                {/* 5. CORREGIDO: Mostramos el desglose de entradas */}
                <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                  {item.entradas.map(entrada => (
                    <li key={entrada.tipoEntradaId}>
                      {entrada.cantidad} x {entrada.nombre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Acciones y Precio */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="font-bold text-gray-900">
                {/* 6. ¡ESTE ES EL ERROR! CORREGIDO de 'precioTotal' a 'totalItem' */}
                S/ {item.totalItem.toFixed(2)}
              </span>
              <button
                // 7. CORREGIDO: Usamos 'cartItemId'
                onClick={() => onRemoveItem(item.cartItemId)}
                className="text-xl bg-transparent border-none cursor-pointer hover:text-red-500"
                aria-label={`Eliminar ${item.eventoInfo.nombre}`}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
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