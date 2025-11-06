//src/services/useCartTimer.js
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

// Helper para formatear milisegundos a MM:SS
// Usamos MM:SS ya que el timer es de 10 minutos.
const formatTime = (ms) => {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
};

export const useCartTimer = () => {
  // Obtenemos los datos clave del contexto
  const { expirationTime, itemCount } = useCart();
  
  // Estado local para el string "MM:SS"
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // Si no hay tiempo o no hay items, no hay timer.
    if (!expirationTime || itemCount === 0) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const remaining = expirationTime - Date.now();

      if (remaining <= 0) {
        setTimeLeft("00:00");
        // NOTA: No llamamos a clearCart() aquí.
        // Tu CartContext ya tiene un "efecto vigilante" que maneja la expiración.
        // Este hook solo se encarga de *mostrar* el tiempo.
      } else {
        setTimeLeft(formatTime(remaining));
      }
    };

    updateTimer(); // Ejecutar al inicio
    const intervalId = setInterval(updateTimer, 1000);

    // Limpieza del intervalo
    return () => clearInterval(intervalId);

  }, [expirationTime, itemCount]); // Depende del tiempo y si hay items

  // El hook devuelve el string formateado (o null)
  return timeLeft;
};