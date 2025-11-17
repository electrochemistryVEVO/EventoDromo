import {api} from '../lib/api';

export async function autenticarUsuario(correo, password) {
  try {
    const requestParams = {
      Correo: correo,
      Password: password
    }
    
    console.log("Intentando autenticar usuario...");
    const response = await api.post('/Cliente/AutenticarLoginCliente', requestParams);
    console.log("Respuesta del servidor:", response);
    
    // La respuesta de api.post ya debería ser solo el 'data' si success=true
    // gracias a la lógica en api.js
    if (response && response.token) {
      // Guardamos el token en localStorage
      localStorage.setItem('authToken', response.token);
      return response;
    } else {
      throw new Error("Token no recibido del servidor.");
    }

  } catch (error) {
    console.error("Error en el login: ", error);
    throw error;
  }
}