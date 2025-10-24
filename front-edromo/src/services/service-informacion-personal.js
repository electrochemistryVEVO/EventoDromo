export const servicePerfil = {
  /**
   * Obtiene la información inicial del perfil (datos del cliente y listas para dropdowns).
   * Sigue el patrón de GenericResponse.
   */
  getInformacionPersonal: async () => {
    // 1. link test (usando el archivo en public/data/perfil.json)
    const res = await fetch("/data/informacion-personal.json");

    // 2. link q funciona en individual (descomentar para usar)
    // const res = await fetch("http://localhost:5189/api/Cliente/InformacionPersonal");
    
    // 3. link q funciona en docker (descomentar para usar)
    // const res = await fetch("http://localhost:8081/api/Cliente/InformacionPersonal");

    if (!res.ok) {
      throw new Error("Error cargando información personal (status " + res.status + ")");
    }

    const json = await res.json();

    // Manejo del GenericResponse { success: bool, mensaje: string, data: T, error: string }
    if (!json) throw new Error("Respuesta vacía del servicio de perfil");
    if (json.success === false) {
      // prioriza error, luego mensaje
      throw new Error(
        json.error || json.mensaje || "Error en respuesta del servicio"
      );
    }

    // La data viene en un array, tomamos el primer elemento
    return json.data ? json.data[0] : {};
  },

  /**
   * Simula el llamado a la API del backend para actualizar la información del usuario.
   * @param {object} userInfo - Objeto con la información del usuario a actualizar (datosCliente).
   */
  actualizarUsuario: async (userInfo) => {
    console.log('Enviando al backend (simulado):', userInfo);

    // --- EJEMPLO DE CÓDIGO FETCH REAL (comentado) ---
    // const url = 'http://localhost:5189/api/Cliente/Actualizar'; // O la URL del backend real
    // try {
    //   const response = await fetch(url, {
    //     method: 'PUT', // o 'POST'
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(userInfo), // Se envía el objeto datosCliente
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error(`Error del servidor: ${response.status}`);
    //   }
    //
    //   const json = await response.json();
    //   if (json.success === false) {
    //      throw new Error(json.error || json.mensaje || "Error al actualizar");
    //   }
    //   return json; // Retorna la respuesta completa del backend
    //
    // } catch (error) {
    //   console.error('Error en servicePerfil.actualizarUsuario:', error);
    //   throw error; // Propaga el error para que el controlador lo maneje
    // }
    // --- FIN EJEMPLO FETCH ---

    // Simulación de una respuesta exitosa del backend
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Usuario actualizado correctamente', data: userInfo };
  },
};