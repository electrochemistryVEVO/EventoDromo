export const servicePerfil = {
  /**
  * Obtiene la información inicial del perfil.
  * @param {string | number} idCliente - El ID del cliente a consultar.
  */
  getInformacionPersonal: async (idCliente) => {
    // 1. link test (usando el archivo en public/data/perfil.json)
    // const res = await fetch("/data/informacion-personal.json");

    // 2. link q funciona en individual (descomentar para usar)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Cliente/InformacionPersonal/${idCliente}`);
    
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
  * Llama a la API del backend para actualizar la información del usuario.
  * @param {string | number} idCliente - El ID del cliente a actualizar.
  * @param {object} userInfo - Objeto con la información del usuario (datosCliente).
  */
  actualizarUsuario: async (idCliente, userInfo) => {
    console.log(`Enviando actualización para ID: ${idCliente}`, userInfo);

    // --- CÓDIGO FETCH REAL ---
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Cliente/ActualizarInformacionPersonal/${idCliente}`; // O la URL del backend real
    try {
      const response = await fetch(url, {
        method: 'PUT', // PUT es estándar para actualizar
        headers: {
          'Content-Type': 'application/json',
          // En el futuro, aquí iría tu token:
          // 'Authorization': `Bearer ${token}`
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

  /**
   * Llama al endpoint Cliente/ObtenerPorEmail/{emailCliente}
   * Retorna el objeto Cliente (json.data) o lanza error si no existe/ocurre fallo.
   * @param {string} emailCliente
   */
  obtenerPorEmail: async (emailCliente) => {
    if (!emailCliente || typeof emailCliente !== 'string') {
      throw new Error('emailCliente requerido');
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Cliente/ObtenerPorEmail/${encodeURIComponent(emailCliente)}`;

    try {
      const res = await fetch(url, { method: 'GET' });

      if (!res.ok) {
        if (res.status === 404) throw new Error('Cliente no encontrado');
        throw new Error('Error buscando cliente (status ' + res.status + ')');
      }

      const json = await res.json();
      if (!json) throw new Error('Respuesta vacía del servicio de clientes');
      if (json.success === false) {
        throw new Error(json.error || json.mensaje || 'Error en respuesta del servicio de clientes');
      }

      return json.data ? json.data : null;
    } catch (error) {
      console.error('Error en servicePerfil.obtenerPorEmail:', error);
      throw new Error(error.message || 'Error de conexión al obtener cliente por email.');
    }
  },

  /**
   * Transfiere entradas a otro cliente por email
   * @param {object} transferData - { emailDestino, entradas: [{ numeroTransaccion, idTipoEntrada, cantidad }] }
   */
  transferirEntradas: async (transferData) => {
    console.log('Enviando transferencia:', transferData);

    // --- CÓDIGO REAL DEL BACKEND (FASE 1: Solo validación) ---
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/TransferirEntradas/Transferir`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Agregar token cuando esté disponible
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.error) {
          throw new Error(errorData.error);
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const json = await response.json();
      
      if (json.success === false) {
        throw new Error(json.error || json.message || "Error al transferir");
      }
      
      return json;
    } catch (error) {
      console.error('Error en servicePerfil.transferirEntradas:', error);
      throw new Error(error.message || 'Error de conexión al transferir entradas.');
    }
  },

  /**
   * Obtiene los tipos de entrada disponibles para una transacción + evento + fecha específicos.
   * @param {string} numeroTransaccion - Número de transacción (ej: "TXN20250911001")
   * @param {string} tituloEvento - Título del evento
   * @param {string} fechaEvento - Fecha del evento en formato YYYY-MM-DD
   */
  obtenerTiposEntradaPorTransaccion: async (numeroTransaccion, tituloEvento, fechaEvento) => {
    try {
      // --- CÓDIGO REAL DEL BACKEND ---
      const params = new URLSearchParams({
        numeroTransaccion,
        tituloEvento,
        fechaEvento
      });
      
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/TransferirEntradas/ObtenerTiposEntrada?${params.toString()}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Agregar token cuando esté disponible
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al obtener tipos de entrada (status ' + res.status + ')');
      }

      const json = await res.json();

      if (!json || json.success === false) {
        throw new Error(json.error || json.message || 'Error al obtener tipos de entrada');
      }

      return json.data || [];
    } catch (error) {
      console.error('Error al obtener tipos de entrada:', error);
      return [];
    }
  },

  /**
   * Obtiene el estado de las entradas de una transacción (disponibles/transferidas/pendientes).
   * @param {string} numeroTransaccion - Número de transacción
   */
  obtenerEstadoEntradas: async (numeroTransaccion) => {
    try {
      const params = new URLSearchParams({ numeroTransaccion });
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/TransferirEntradas/ObtenerEstadoEntradas?${params.toString()}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error('Error al obtener estado de entradas (status ' + res.status + ')');
      }

      const json = await res.json();

      if (!json || json.success === false) {
        throw new Error(json.error || json.message || 'Error al obtener estado');
      }

      return json.data || { total: 0, disponibles: 0, transferidas: 0, pendientes: 0 };
    } catch (error) {
      console.error('Error al obtener estado de entradas:', error);
      return { total: 0, disponibles: 0, transferidas: 0, pendientes: 0 };
    }
  },

  /**
   * Transfiere entradas a otro usuario.
   * @param {object} transferData - Datos de la transferencia
   */
  transferirEntradas: async (transferData) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/TransferirEntradas/Transferir`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData)
      });

      if (!res.ok) {
        throw new Error('Error al transferir entradas (status ' + res.status + ')');
      }

      const json = await res.json();

      if (!json || json.success === false) {
        throw new Error(json.error || json.message || 'Error al transferir entradas');
      }

      return json;
    } catch (error) {
      console.error('Error al transferir entradas:', error);
      throw error;
    }
  },
};