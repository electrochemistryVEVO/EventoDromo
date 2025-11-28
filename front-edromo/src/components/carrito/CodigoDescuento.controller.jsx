// src/components/carrito/CodigoDescuento.controller.jsx
"use client";

import React, { useState } from "react";
import CodigoDescuento from "./codigoDescuento";

export const CodigoDescuentoController = () => {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: null, texto: "" });

  const handleAplicarCodigo = async () => {
    if (!codigo.trim()) {
      setMensaje({ tipo: "error", texto: "Por favor ingresa un código" });
      return;
    }

    setIsLoading(true);
    setMensaje({ tipo: null, texto: "" });

    try {
      // TODO: Implementar la llamada al servicio
      // const resultado = await validarCodigoDescuento(codigo);
      
      // Por ahora simular respuesta
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulación de respuesta
      setMensaje({ 
        tipo: "info", 
        texto: "Funcionalidad de códigos de descuento en desarrollo" 
      });
      
      // TODO: Una vez implementado el backend:
      // if (resultado.valido) {
      //   setMensaje({ tipo: "success", texto: `¡Código aplicado! Descuento: ${resultado.descuento}%` });
      // } else {
      //   setMensaje({ tipo: "error", texto: "Código inválido o expirado" });
      // }
    } catch (error) {
      console.error("Error al aplicar código:", error);
      setMensaje({ tipo: "error", texto: "Error al validar el código" });
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
      isLoading={isLoading}
      mensaje={mensaje}
    />
  );
};
