//src/services/useCartTimer.js
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

// Helper para formatear milisegundos a MM:SS
// Usamos MM:SS ya que el timer es de 10 minutos.
const formatTime = (ms) => {
  if (ms <= 0) return "00:00";
  
  let totalSeconds = Math.floor(ms / 1000);
  
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600; // Segundos restantes después de quitar las horas
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    // Si hay horas, las mostramos. Ej: "05:09:46"
    return `${String(hours).padStart(2, "0")}:${paddedMinutes}:${paddedSeconds}`;
  }
  
  // Si no, solo mostramos minutos y segundos. Ej: "09:59"
  return `${paddedMinutes}:${paddedSeconds}`;
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

    console.log("useCartTimer DEBUG:", {
        expirationTime, // Timestamp del backend
        now: Date.now(), // Timestamp actual del navegador
        difference_ms: expirationTime - Date.now(), // La resta en milisegundos
        difference_minutes: (expirationTime - Date.now()) / 60000 // La resta en minutos
    });

    const updateTimer = () => {
      const remaining = expirationTime - Date.now();

      setTimeLeft(formatTime(remaining));
    };

    updateTimer(); // Ejecutar al inicio
    const intervalId = setInterval(updateTimer, 1000);

    // Limpieza del intervalo
    return () => clearInterval(intervalId);

  }, [expirationTime, itemCount]); // Depende del tiempo y si hay items

  // El hook devuelve el string formateado (o null)
  return timeLeft;
};