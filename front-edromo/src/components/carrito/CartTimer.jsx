// src/components/carrito/CartTimer.jsx
"use client";

// Asegúrate que la ruta a tu hook sea correcta
// (en un paso anterior usamos @/services/useCartTimer, otros usan @/hooks/useCartTimer)
import { useCartTimer } from "@/services/useCartTimer"; 

// El componente ahora acepta una prop 'variant' con 'default' como valor predeterminado
const CartTimer = ({ variant = 'default' }) => {
  const timeLeft = useCartTimer(); // El hook nos da el tiempo "MM:SS"

  // Si no hay tiempo (carrito vacío o expirado), no renderiza nada
  if (!timeLeft) {
    return null;
  }

  // --- Renderizado basado en la variante ---

  // Versión "default": La caja amarilla para la página de "Mi Carrito"
  if (variant === 'default') {
    return (
      <div className="h-16 p-3 justify-center bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 flex items-center">
        <p className="text-sm m-0">
          Tu carrito expira en:{" "}
          <strong className="text-base font-bold tabular-nums">{timeLeft}</strong>
        </p>
      </div>
    );
  }

  // Versión "minimal": Texto simple para el resumen de compra en checkout
  if (variant === 'minimal') {
    return (
      // Un texto centrado, con un color rojo/naranja para el tiempo
      <div className="text-left"> 
        <p className="text-sm text-gray-600 m-0">
          Tu carrito expira en:{" "}
          <strong className="font-bold text-red-600 tabular-nums">
            {timeLeft}
          </strong>
        </p>
      </div>
    );
  }

  // Fallback por si se pasa una variante incorrecta
  return null;
};

export default CartTimer;