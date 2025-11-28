// src/services/codigo-descuento.service.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Valida un código de descuento
 * @param {string} codigo - El código de descuento a validar
 * @param {string} token - Token de autenticación del usuario
 * @returns {Promise<{valido: boolean, descuento: number, mensaje: string}>}
 */
export const validarCodigoDescuento = async (codigo, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/CodigoDescuento/Validar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ codigo }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || "Error al validar el código");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en validarCodigoDescuento:", error);
    throw error;
  }
};

/**
 * Aplica un código de descuento al carrito
 * @param {string} codigo - El código de descuento
 * @param {number} idCarrito - ID del carrito
 * @param {string} token - Token de autenticación
 * @returns {Promise<{exito: boolean, descuentoAplicado: number, mensaje: string}>}
 */
export const aplicarCodigoDescuento = async (codigo, idCarrito, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/CodigoDescuento/Aplicar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ codigo, idCarrito }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || "Error al aplicar el código");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en aplicarCodigoDescuento:", error);
    throw error;
  }
};

/**
 * Remueve un código de descuento del carrito
 * @param {number} idCarrito - ID del carrito
 * @param {string} token - Token de autenticación
 * @returns {Promise<{exito: boolean, mensaje: string}>}
 */
export const removerCodigoDescuento = async (idCarrito, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/CodigoDescuento/Remover/${idCarrito}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || "Error al remover el código");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en removerCodigoDescuento:", error);
    throw error;
  }
};
