import {api} from '../lib/api';

export async function autenticarUsuario(correo, password) {
  try {
    const requestParams = {
      Correo: correo,
      Password: password
    }
    alert("Antes de la llamada al API");
    const response = await api.post('/Cliente/AutenticarLoginCliente', requestParams);
    alert("Después de la llamada al API");
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