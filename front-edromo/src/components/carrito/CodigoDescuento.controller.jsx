// src/components/carrito/CodigoDescuento.controller.jsx
"use client";

import React, { useState, useEffect } from "react";
import CodigoDescuento from "./codigoDescuento";
import { useCart } from "@/context/CartContext";
import { aplicarCodigoDescuento, removerCodigoDescuento } from "@/services/codigo-descuento.service";
import { showSuccess, showError, showWarning } from "@/components/Notifications/toast";

export const CodigoDescuentoController = () => {
  const { cart, refreshCart } = useCart();
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: null, texto: "" });

  // Obtener promoción aplicada del carrito
  const promocionAplicada = cart?.promocionAplicada || null;

  const handleAplicarCodigo = async () => {
    if (!codigo.trim()) {
      setMensaje({ tipo: "error", texto: "Por favor ingresa un código" });
      showWarning("Por favor ingresa un código");
      return;
    }

    if (!cart?.idCarrito) {
      setMensaje({ tipo: "error", texto: "No se pudo obtener el carrito" });
      showError("No se pudo obtener el carrito");
      return;
    }

    setIsLoading(true);
    setMensaje({ tipo: null, texto: "" });

    try {
      const data = await aplicarCodigoDescuento(codigo.toUpperCase(), cart.idCarrito);
      
      // api.post ya devuelve data directamente (no Success/Data)
      showSuccess(data?.mensaje || "¡Código aplicado exitosamente!");
      setCodigo("");
      setMensaje({ 
        tipo: "success", 
        texto: `¡Código aplicado! Ahorras S/ ${data?.descuentoAplicado?.toFixed(2) || '0.00'}` 
      });
      
      // Refrescar el carrito para obtener los datos actualizados
      await refreshCart();
    } catch (error) {
      console.error("Error al aplicar código:", error);
      const errorMsg = error.message || "Error al validar el código";
      setMensaje({ tipo: "error", texto: errorMsg });
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverCodigo = async () => {
    if (!cart?.idCarrito) {
      showError("No se pudo obtener el carrito");
      return;
    }

    setIsLoading(true);

    try {
      const data = await removerCodigoDescuento(cart.idCarrito);
      
      showSuccess(data?.mensaje || "Código removido exitosamente");
      setMensaje({ tipo: null, texto: "" });
      
      // Refrescar el carrito para obtener los datos actualizados
      await refreshCart();
    } catch (error) {
      console.error("Error al remover código:", error);
      showError(error.message || "Error al remover el código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimpiarCodigo = () => {
    setCodigo("");
    setMensaje({ tipo: null, texto: "" });
  };

  return (
    <CodigoDescuento
      codigo={codigo}
      setCodigo={setCodigo}
      onAplicar={handleAplicarCodigo}
      onLimpiar={handleLimpiarCodigo}
      onRemover={handleRemoverCodigo}
      isLoading={isLoading}
      mensaje={mensaje}
      promocionAplicada={promocionAplicada}
    />
  );
};
