// src/service/admin-service.js

/**
 * Simula una llamada fetch al backend para obtener los datos del usuario.
 * En un proyecto real, la URL apuntaría a tu endpoint de API.
 * @returns {Promise<Object>} - Una promesa que resuelve con los datos del usuario.
 */
export const fetchUserData = async () => {
  try {
    // Simulación de una llamada a la API. Reemplaza la URL por la tuya.
    // const response = await fetch('https://tu-api.com/user/profile');
    // if (!response.ok) {
    //   throw new Error('Error al obtener los datos del usuario');
    // }
    // const data = await response.json();
    // return data; // Se espera un objeto como { name: 'Carlos Pérez' }

    // --- Inicio: Código de simulación (borrar en producción) ---
    // Simulamos una demora de 1 segundo como si fuera una llamada real.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Devolvemos datos de ejemplo.
    const mockData = {
      name: "Nombre de Usuario",
    };
    // --- Fin: Código de simulación ---

    return mockData;
  } catch (error) {
    console.error("Error en el servicio fetchUserData:", error);
    // Devolvemos un objeto con un nombre por defecto en caso de error
    return { name: "Invitado" };
  }
};
