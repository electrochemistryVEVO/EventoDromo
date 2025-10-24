import { servicePerfil } from '@/services/service-informacion-personal.js'; 

export const controllerPerfil = {
  /**
   * Función invocada desde el page.js al cargar la página.
   * Llama al servicio para obtener los datos iniciales.
   */
  onPageLoad: async () => {
    try {
      const responseData = await servicePerfil.getInformacionPersonal();
      return responseData;
    } catch (error) {
      console.error('Error en controllerPerfil.onPageLoad:', error);
      throw error; // Lanza el error para que el page.js lo atrape
    }
  },

  /**
   * Función invocada desde el page.js al hacer submit.
   * Prepara los datos y llama al servicio de actualización.
   * @param {object} formData - Los datos del formulario (el objeto datosCliente).
   */
  onSubmit: async (formData) => {
    // El objeto formData ya tiene la estructura de 'datosCliente'
    // Se podrían hacer validaciones adicionales aquí si es necesario
    
    try {
      // Invoca a la función del servicio
      const response = await servicePerfil.actualizarUsuario(formData);
      return response; // Retorna la respuesta al page.js
    } catch (error) {
      console.error('Error en controllerPerfil.onSubmit:', error);
      return { success: false, message: error.message || 'Error al conectar con el servicio.' };
    }
  },
};