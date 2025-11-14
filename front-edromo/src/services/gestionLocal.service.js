import { getAuthToken } from "@/services/admin-service";
import { getApiUrl } from "@/lib/utils";

export async function listarLocales() {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "fetchUserData: No se encontró el token de autenticación en localStorage."
        );
        return []; // Retornamos temprano si no hay token.
    }
    return await getApiUrl()
        .then((url) => (fetch(url + 'Local/ListarLocalesAdmin', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })))
        .then((res) => res.json())
        .catch((err) => { console.log(err.message || "El backend indicó un error desconocido.") })
}

export async function listarCiudades() {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "listarCiudades: No se encontró el token de autenticación en localStorage."
        );
        return { success: false, message: "No se encontró el token de autenticación", data: [] };
    }
    
    try {
        const url = await getApiUrl();
        const response = await fetch(url + 'Ciudad/ListarCiudades', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, message: "No autorizado. Por favor, inicie sesión nuevamente.", data: [] };
            }
            const errorData = await response.json().catch(() => null);
            return { 
                success: false, 
                message: errorData?.message || errorData?.error || `Error HTTP: ${response.status}`,
                data: []
            };
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Error en listarCiudades:", err);
        return { 
            success: false, 
            message: err.message || "El backend indicó un error desconocido.",
            data: []
        };
    }
}

export async function insertarLocal(local) {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "insertarLocal: No se encontró el token de autenticación en localStorage."
        );
        return { success: false, message: "No se encontró el token de autenticación" };
    }
    
    try {
        const url = await getApiUrl();
        const response = await fetch(url + 'Local/InsertarLocal', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(local)
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, message: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            const errorData = await response.json().catch(() => null);
            return { 
                success: false, 
                message: errorData?.message || errorData?.error || `Error HTTP: ${response.status}` 
            };
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Error en insertarLocal:", err);
        return { 
            success: false, 
            message: err.message || "El backend indicó un error desconocido." 
        };
    }
}

export async function obtenerLocalPorId(id) {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "fetchUserData: No se encontró el token de autenticación en localStorage."
        );
        return []; // Retornamos temprano si no hay token.
    }
    return await getApiUrl()
        .then((url) => (fetch(`${url}Local/ObtenerLocalPorId?id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })))
        .then((res) => res.json())
        .catch((err) => { console.log(err.message || "El backend indicó un error desconocido.") })
}

export async function eliminarLocal(id) {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "fetchUserData: No se encontró el token de autenticación en localStorage."
        );
        return []; // Retornamos temprano si no hay token.
    }
    return await getApiUrl()
        .then((url) => (fetch(`${url}Local/EliminarLocal?id=${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })))
        .then((res) => res.json())
        .catch((err) => { console.log(err.message || "El backend indicó un error desconocido.") })
}

export async function editarLocal(modalData) {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "fetchUserData: No se encontró el token de autenticación en localStorage."
        );
        return []; // Retornamos temprano si no hay token.
    }
    return await getApiUrl()
        .then((url) => (fetch(`${url}Local/ModificarLocal`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modalData)
        })))
        .then((res) => res.json())
        .catch((err) => { console.log(err.message || "El backend indicó un error desconocido.") })
}