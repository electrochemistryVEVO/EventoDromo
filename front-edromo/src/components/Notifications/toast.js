import toast from 'react-hot-toast';

/**
 * Sistema de Notificaciones Toast - API de Utilidades
 * 
 * Este módulo proporciona una API limpia y reutilizable para mostrar
 * notificaciones en toda la aplicación sin acoplar el código a la
 * implementación específica de react-hot-toast.
 * 
 * VENTAJAS DE ESTE ENFOQUE:
 * - Desacoplamiento: Podemos cambiar la librería sin tocar el código
 * - Consistencia: Todos los toasts tienen el mismo comportamiento
 * - Mantenibilidad: Un solo lugar para configurar notificaciones
 * - Reutilización: Importa y usa en cualquier componente/context
 * 
 * USO:
 * import { showSuccess, showError, showWarning, showInfo } from '@/components/Notifications/toast';
 * 
 * showSuccess('¡Operación exitosa!');
 * showError('Ocurrió un error');
 * showWarning('Ten cuidado con esto');
 * showInfo('Información importante');
 */

/**
 * Muestra una notificación de éxito
 * @param {string} message - Mensaje a mostrar
 * @param {object} options - Opciones adicionales (duration, etc.)
 * @returns {string} ID del toast
 * 
 * @example
 * showSuccess('¡Configuración guardada exitosamente!');
 * showSuccess('Producto agregado al carrito', { duration: 3000 });
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: options.duration || 4000,
    ...options,
  });
};

/**
 * Muestra una notificación de error
 * @param {string} message - Mensaje de error a mostrar
 * @param {object} options - Opciones adicionales
 * @returns {string} ID del toast
 * 
 * @example
 * showError('No se pudo procesar la solicitud');
 * showError('Stock insuficiente', { duration: 6000 });
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: options.duration || 6000, // Errores duran más
    ...options,
  });
};

/**
 * Muestra una notificación de advertencia
 * @param {string} message - Mensaje de advertencia
 * @param {object} options - Opciones adicionales
 * @returns {string} ID del toast
 * 
 * @example
 * showWarning('Esta acción no se puede deshacer');
 */
export const showWarning = (message, options = {}) => {
  return toast(message, {
    icon: '⚠️',
    duration: options.duration || 5000,
    style: {
      border: '1px solid #f59e0b',
    },
    ...options,
  });
};

/**
 * Muestra una notificación informativa
 * @param {string} message - Mensaje informativo
 * @param {object} options - Opciones adicionales
 * @returns {string} ID del toast
 * 
 * @example
 * showInfo('Tienes 3 notificaciones nuevas');
 */
export const showInfo = (message, options = {}) => {
  return toast(message, {
    icon: 'ℹ️',
    duration: options.duration || 4000,
    style: {
      border: '1px solid #3b82f6',
    },
    ...options,
  });
};

/**
 * Muestra un toast de carga (loading)
 * Útil para operaciones asíncronas
 * @param {string} message - Mensaje de carga
 * @returns {string} ID del toast
 * 
 * @example
 * const loadingToast = showLoading('Guardando cambios...');
 * // ... operación asíncrona ...
 * dismissToast(loadingToast);
 * showSuccess('¡Cambios guardados!');
 */
export const showLoading = (message) => {
  return toast.loading(message);
};

/**
 * Cierra un toast específico por su ID
 * @param {string} toastId - ID del toast a cerrar
 * 
 * @example
 * const id = showLoading('Procesando...');
 * await doSomething();
 * dismissToast(id);
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Cierra todos los toasts activos
 * 
 * @example
 * dismissAllToasts();
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Toast con promesa - Muestra loading, luego éxito o error automáticamente
 * Ideal para operaciones asíncronas
 * 
 * @param {Promise} promise - Promesa a ejecutar
 * @param {object} messages - Mensajes para cada estado
 * @returns {Promise} La promesa original
 * 
 * @example
 * await showPromise(
 *   saveConfiguration(),
 *   {
 *     loading: 'Guardando configuración...',
 *     success: '¡Configuración guardada exitosamente!',
 *     error: 'Error al guardar la configuración',
 *   }
 * );
 */
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Cargando...',
    success: messages.success || '¡Éxito!',
    error: messages.error || 'Error',
  });
};

// Exportar también el toast original por si se necesita funcionalidad avanzada
export default toast;
