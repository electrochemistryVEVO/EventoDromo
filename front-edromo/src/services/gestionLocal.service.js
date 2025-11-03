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
            "fetchUserData: No se encontró el token de autenticación en localStorage."
        );
        return []; // Retornamos temprano si no hay token.
    }
    return await getApiUrl()
        .then((url) => (fetch(url + 'Ciudad/ListarCiudades', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })))
        .then((res) => res.json())
        .catch((err) => { console.log(err.message || "El backend indicó un error desconocido.") })
}

export async function insertarLocal(local) {
    const token = getAuthToken();
    if (!token) {
        console.error(
            "fetchUserData: No se encontró el token de autenticación en localStorage."
        );
        return []; // Retornamos temprano si no hay token.
    }
    return await getApiUrl()
        .then((url) => (fetch(url + 'Local/InsertarLocal', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(local)
        })))
        .then((res) => res.json())
        .catch((err) => { console.log(err.message || "El backend indicó un error desconocido.") })
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