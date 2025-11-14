const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Función centralizada para hacer peticiones HTTP.
 * @param {string} endpoint - El endpoint al que llamar (ej. '/usuarios')
 * @param {RequestInit} options - Opciones de fetch (method, body, headers, etc.)
 */

async function apiFetch(endpoint, options = {}) {
    console.log(BASE_URL)
    let token = null;

    if (typeof window !== 'undefined') {
        token = localStorage.getItem('authToken');
    }

    const baseHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        baseHeaders['Authorization'] = `Bearer ${token}`;
    }


    const config = {
        ...options, // Sobrescribe con las opciones que nos pasen
        headers: baseHeaders,
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }
    console.log(BASE_URL)
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            console.error('Token inválido o expirado. Deslogueando...');
            localStorage.removeItem('authToken');
        }

        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
            // No había cuerpo JSON en el error
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    const genericResponse = await response.json();

    if (genericResponse.success === true) {
        return genericResponse.data;
    } else {
        const errorMessage = genericResponse.error || genericResponse.message || 'Error en la operación';
        throw new Error(errorMessage);
    }
}

export const api = {
    get: (endpoint, options = {}) =>
        apiFetch(endpoint, { ...options, method: 'GET' }),

    post: (endpoint, body, options = {}) =>
        apiFetch(endpoint, { ...options, method: 'POST', body }),

    put: (endpoint, body, options = {}) =>
        apiFetch(endpoint, { ...options, method: 'PUT', body }),

    delete: (endpoint, options = {}) =>
        apiFetch(endpoint, { ...options, method: 'DELETE' }),
};