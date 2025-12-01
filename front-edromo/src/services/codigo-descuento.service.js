// src/services/codigo-descuento.service.js
import { api } from "@/lib/api";

/**
 * Valida un código de descuento
 * @param {string} codigo - El código de descuento a validar
 * @param {number} idCarrito - ID del carrito (opcional)
 * @returns {Promise<{valido: boolean, descuento: number, mensaje: string}>}
 */
export const validarCodigoDescuento = async (codigo, idCarrito = null) => {
  try {
    let endpoint = `/CodigoDescuento/Validar?codigo=${encodeURIComponent(codigo)}`;
    if (idCarrito) {
      endpoint += `&idCarrito=${idCarrito}`;
    }

    const data = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error("Error en validarCodigoDescuento:", error);
    throw error;
  }
};

/**
 * Aplica un código de descuento al carrito
 * @param {string} codigo - El código de descuento
 * @param {number} idCarrito - ID del carrito
 * @returns {Promise<{exito: boolean, descuentoAplicado: number, mensaje: string}>}
 */
export const aplicarCodigoDescuento = async (codigo, idCarrito) => {
  try {
    const data = await api.post("/CodigoDescuento/Aplicar", { codigo, idCarrito });
    return data;
  } catch (error) {
    console.error("Error en aplicarCodigoDescuento:", error);
    throw error;
  }
};

/**
 * Remueve un código de descuento del carrito
 * @param {number} idCarrito - ID del carrito
 * @returns {Promise<{exito: boolean, mensaje: string}>}
 */
export const removerCodigoDescuento = async (idCarrito) => {
  try {
    const data = await api.delete(`/CodigoDescuento/Remover/${idCarrito}`);
    return data;
  } catch (error) {
    console.error("Error en removerCodigoDescuento:", error);
    throw error;
  }
};
