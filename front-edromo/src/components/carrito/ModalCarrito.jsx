// src/components/carrito/ModalCarrito.jsx
import React from "react";
import "@/css/ModalCarrito.css"; // Asumimos que los estilos están en esta ruta

/**
 * Vista: Componente "tonto" que solo renderiza la UI del modal.
 * Recibe todos los datos y funciones a través de props desde su controlador.
 */
export default function ModalCarritoView({
  items,
  isLoading,
  tiempoRestante,
  error,
  total,
  onClose, // Función para cerrar el modal
  onRemoveItem, // Función para eliminar un item
  onCheckout, // Función para finalizar el pedido
}) {
  // Manejo de estados de carga y error
  if (isLoading) {
    return <div className="modal-carrito__body"><p>Cargando carrito...</p></div>;
  }

  if (error) {
    return <div className="modal-carrito__body"><p className="modal-carrito__empty-text" style={{color: 'red'}}>Error: {error}</p></div>;
  }

  return (
    <div className="modal-carrito__body">
      {items.length === 0 ? (
        // Vista para cuando el carrito está vacío
        <div className="modal-carrito__empty">
          <p className="modal-carrito__empty-text">Su carrito está vacío</p>
          <button onClick={onClose} className="modal-carrito__continue-button">
            CONTINUAR COMPRANDO
          </button>
        </div>
      ) : (
        // Vista para cuando hay items en el carrito
        <div>
          <ul className="modal-carrito__item-list">
            {items.map((item) => (
              <li key={item.id} className="modal-carrito__item">
                <div className="modal-carrito__item-details flex flex-row">
                  <img // Usamos un ternario para evitar src=""
                    src={item.imagen || "/images/placeholder.png"} // Fallback a una imagen por defecto
                    alt={item.titulo}
                    className="modal-carrito__item-image"
                  />
                  <div className="flex flex-col">
                    <p className="modal-carrito__item-title">{item.titulo}</p>
                    <p className="modal-carrito__item-quantity">
                      Cantidad: {item.cantidadTotal}
                    </p>
                  </div>
                </div>
                <div className="modal-carrito__item-actions">
                  <span className="modal-carrito__item-price">
                    {/* El precio total ya viene calculado desde el backend */}
                    S/ {item.precioTotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="modal-carrito__remove-button"
                    aria-label={`Eliminar ${item.titulo}`}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="modal-carrito__footer">
            <div className="modal-carrito__total">
              <span>Total:</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="modal-carrito__checkout-button">
              FINALIZAR PEDIDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}