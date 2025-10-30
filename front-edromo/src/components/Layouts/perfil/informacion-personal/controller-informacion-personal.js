import { servicePerfil } from '@/services/service-informacion-personal.js';

/**
 * Función "privada" para obtener el ID del cliente.
 * En el futuro, aquí irá la lógica para leer el token o la sesión.
 * @returns {number} El ID del cliente hardcodeado.
 */
const _getClienteId = () => {
  // TODO: Implementar lógica de token/sesión aquí.
  // Por ahora, devolvemos un ID fijo para pruebas.
  // Usa el ID que corresponda a tus datos de prueba (ej: 3).
  return 3;
};

export const controllerPerfil = {
  /**
  * Función invocada desde el _page.js al cargar la página.
  * Llama al servicio para obtener los datos iniciales.
  */
  onPageLoad: async () => {
    try {
      // 1. Obtenemos el ID del cliente
      const idCliente = _getClienteId();
      
      // 2. Pasamos el ID al servicio
      const responseData = await servicePerfil.getInformacionPersonal(idCliente);

      // --- INICIO: Lógica para +18 (Movida aquí) ---
      const today = new Date();
      const maxYear = today.getFullYear() - 18;
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
      const day = String(today.getDate()).padStart(2, '0');
      const maxDate = `${maxYear}-${month}-${day}`;

      return { ...responseData, maxDate: maxDate };
    } catch (error) {
      console.error('Error en controllerPerfil.onPageLoad:', error);
      throw error; // Lanza el error para que el _page.js lo atrape
    }
  },

  /**
  * Función invocada desde el _page.js al hacer submit.
  * Prepara los datos y llama al servicio de actualización.
  * @param {object} formData - Los datos del formulario (el objeto datosCliente).
  */
  onSubmit: async (formData) => {
    // El objeto formData ya tiene la estructura de 'datosCliente'
    
    try {
      // 1. Obtenemos el ID del cliente
      const idCliente = _getClienteId();

      // 2. Invocamos al servicio con ambos parámetros
      const response = await servicePerfil.actualizarUsuario(idCliente, formData);
      return response; // Retorna la respuesta al _page.js
      
    } catch (error) {
      console.error('Error en controllerPerfil.onSubmit:', error);
      return { success: false, message: error.message || 'Error al conectar con el servicio.' };
    }
  },
};