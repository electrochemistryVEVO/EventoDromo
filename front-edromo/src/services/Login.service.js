import {api} from '../lib/api';

export async function autenticarUsuario(correo, password) {
  try {
    const requestParams = {
      Correo: correo,
      Password: password
    }
    
    const response = await api.post('/Cliente/AutenticarLoginCliente', requestParams);

    if (response.token) {
      localStorage.setItem('authToken', response.token);
      return { rol: response.rol, token: response.token};
    } else {
      throw new Error("Token no recibido del servidor.");
    }

  } catch (error) {
    console.error("Error en el login: ", error);
    throw error;
  }
}