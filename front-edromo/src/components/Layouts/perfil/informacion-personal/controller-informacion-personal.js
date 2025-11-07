import { servicePerfil } from '@/services/service-informacion-personal.js';

// --- ELIMINAMOS LA FUNCIÓN _getClienteId() Y _getAuthInfo() ---
// Ya no son necesarias aquí. El token vendrá desde el componente.

export const controllerPerfil = {
  /**
   * Función invocada desde el page.js al cargar la página.
   * @param {string} token - El token JWT (AHORA ES UN PARÁMETRO)
   */
  onPageLoad: async (token) => { // <-- 1. RECIBE EL TOKEN
    try {
      if (!token) {
        throw new Error("Usuario no autenticado.");
      }
      
      // 2. Pasa el token al servicio
      const responseData = await servicePerfil.getInformacionPersonal(token);

      // --- Lógica para +18 ---
      const today = new Date();
      const maxYear = today.getFullYear() - 18;
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const maxDate = `${maxYear}-${month}-${day}`;

      return { ...responseData, maxDate: maxDate };
    } catch (error) {
      console.error('Error en controllerPerfil.onPageLoad:', error);
      throw error; // Lanza el error para que el page.js lo atrape
    }
  },

  /**
   * Función invocada desde el page.js al hacer submit.
   * @param {string} token - El token JWT (AHORA ES UN PARÁMETRO)
   * @param {object} formData - Los datos del formulario (el objeto datosCliente).
   */
  onSubmit: async (token, formData) => { // <-- 3. RECIBE EL TOKEN
    try {
      if (!token) {
        throw new Error("Usuario no autenticado.");
      }

      // 4. Invoca al servicio con el token y los datos
      const response = await servicePerfil.actualizarUsuario(token, formData);
      return response; // Retorna la respuesta al page.js

    } catch (error) {
      console.error('Error en controllerPerfil.onSubmit:', error);
      return { success: false, message: error.message || 'Error al conectar con el servicio.' };
    }
  },
};