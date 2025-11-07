export const servicePerfil = {
  /**
  * Obtiene la información inicial del perfil.
  * @param {string} token - El token JWT del usuario.
  */
  getInformacionPersonal: async (token) => {
    // 1. link test (usando el archivo en public/data/perfil.json)
    // const res = await fetch("/data/informacion-personal.json");

    // 2. link q funciona en individual (descomentar para usar)
    const res = await fetch(`http://localhost:5189/api/Cliente/InformacionPersonal`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 3. link q funciona en docker (descomentar para usar)
    // const res = await fetch(`http://localhost:8081/api/Cliente/InformacionPersonal/${idCliente}`);

    if (!res.ok) {
      throw new Error("Error cargando información personal (status " + res.status + ")");
    }

    const json = await res.json();

    // Manejo del GenericResponse
    if (!json) throw new Error("Respuesta vacía del servicio de perfil");
    if (json.success === false) {
      throw new Error(
        json.error || json.mensaje || "Error en respuesta del servicio"
      );
    }

    // Tu backend devuelve 'data' como un objeto, no un array. Esto es correcto.
    return json.data ? json.data : {};
  },

  /**
  * Llama a la API para actualizar la información del usuario.
  * @param {string} token - El token JWT del usuario.
  * @param {object} userInfo - Objeto con la información del usuario (datosCliente).
  */
  actualizarUsuario: async (token, userInfo) => {
    console.log(`Enviando actualización con token...`, userInfo);

    const url = `http://localhost:5189/api/Cliente/ActualizarInformacionPersonal`;
    try {
      const response = await fetch(url, {
        method: 'PUT', // PUT es estándar para actualizar
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userInfo), // Se envía el objeto datosCliente
      });

      if (!response.ok) {
        // Intentar leer el error del cuerpo si lo hay
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.error) {
          throw new Error(errorData.error);
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const json = await response.json();

      if (json.success === false) {
        throw new Error(json.error || json.mensaje || "Error al actualizar");
      }

      return json; // Retorna la respuesta completa del backend

    } catch (error) {
      console.error('Error en servicePerfil.actualizarUsuario:', error);
      // Lanza el error con el mensaje del backend si está disponible
      throw new Error(error.message || 'Error de conexión al actualizar.');
    }
  },
};