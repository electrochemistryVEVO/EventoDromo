"use client";
import { Toaster } from 'react-hot-toast';

/**
 * ToastProvider - Componente proveedor para las notificaciones toast
 * 
 * Este componente debe envolverse en el layout principal para habilitar
 * notificaciones en toda la aplicación.
 * 
 * Configuración:
 * - Posición: top-right
 * - Duración por defecto: 4 segundos
 * - Animaciones suaves con entrada/salida
 * - Soporte para múltiples notificaciones apiladas
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Opciones por defecto para todos los toasts
        duration: 4000,
        
        // Estilos base
        style: {
          background: '#fff',
          color: '#363636',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          maxWidth: '500px',
        },
        
        // Estilos específicos por tipo
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #10b981',
          },
        },
        
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #ef4444',
          },
          duration: 6000, // Errores duran más tiempo
        },
        
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #3b82f6',
          },
        },
      }}
      containerStyle={{
        top: 80, // Espacio desde el top para evitar overlap con header
        right: 20,
      }}
    />
  );
}
