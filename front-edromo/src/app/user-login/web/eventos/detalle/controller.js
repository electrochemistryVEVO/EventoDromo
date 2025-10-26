// controller.js
"use client";
import { useState, useEffect } from "react";
import { getEventDetails } from "@/services/DetalleEventoServices";
// 1. IMPORTAMOS EL HOOK 'useCart' DE TU CONTEXTO
// (Corregido: quitamos .jsx, aunque no es la causa del error)
import { useCart } from "@/context/CartContext"; 

export const useEventPageController = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  
  // 2. OBTENEMOS LA FUNCIÓN 'addToCart' (sin cambios)
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventDetails.fetch(1);
        setEventData(data);
      } catch (error) {
        console.error(
          "Error en el hook al obtener datos del evento:",
          error
        );
        setEventData({ success: false, error: "Error de conexión." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, []);

  // 3. MODIFICAMOS 'handleAddToCart'
  const handleAddToCart = (bookingDetails) => {
    // Verificación de seguridad
    if (!eventData || !eventData.data) {
      console.error("Los datos del evento aún no están cargados.");
      return;
    }

    // Mantenemos tus logs (sin cambios)
    console.log("--- DETALLES PARA AGREGAR AL CARRITO ---");
    // ...

    // --- ¡INICIO DE LA CORRECCIÓN! ---

    // 4. PREPARAMOS EL OBJETO PARA ENVIAR AL CARRITO
    // ¡CORREGIDO! Necesitamos 'local' y 'tiposDeEntrada'
    const { evento, funciones, local, tiposDeEntrada } = eventData.data;
    
    const selectedFunction = funciones.find(
      (f) => f.id.toString() === bookingDetails.selectedFunctionId
    );

    // 5. CONSTRUIMOS EL ARRAY DE 'entradas'
    // Convertimos el objeto { 1: 2, 3: 1 } en un array [{...}, {...}]
    const entradasSeleccionadas = Object.keys(bookingDetails.ticketQuantities)
      .filter((tierId) => bookingDetails.ticketQuantities[tierId] > 0) // Filtra solo las > 0
      .map((tierId) => {
        // Encontramos la info de este tipo de entrada
        const tipoEntrada = tiposDeEntrada.find(
          (t) => t.id.toString() === tierId
        );
        return {
          tipoEntradaId: tipoEntrada.id,
          nombre: tipoEntrada.nombre,
          cantidad: bookingDetails.ticketQuantities[tierId],
          precioUnitario: tipoEntrada.precio,
        };
      });

    // 6. CREAMOS EL OBJETO 'cartItem' CON LA ESTRUCTURA ANIDADA CORRECTA
    const cartItem = {
      cartItemId: crypto.randomUUID(), // Clave correcta
      eventoInfo: { // Objeto anidado
        id: evento.id,
        nombre: evento.nombre,
        imagenUrl: evento.imagenUrl,
      },
      localInfo: { // Objeto anidado
        nombre: local.nombre,
        ciudad: local.ciudad.nombre,
      },
      funcionInfo: { // Objeto anidado
        id: selectedFunction.id,
        fecha: selectedFunction.fecha,
        hora: selectedFunction.hora,
      },
      entradas: entradasSeleccionadas, // El array que creamos
      totalItem: bookingDetails.totalPrice, // Clave correcta
    };

    // --- FIN DE LA CORRECCIÓN ---

    // 7. LLAMAMOS A LA FUNCIÓN DEL CONTEXTO
    addToCart(cartItem);

    alert(
      "¡Entradas agregadas al carrito!"
    );
  };

  return {
    isLoading,
    eventData,
    handleAddToCart,
  };
};