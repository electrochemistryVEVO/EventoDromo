const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
    console.error("⚠️ NEXT_PUBLIC_API_BASE_URL no está definida en las variables de entorno");
}

/**
 * Función centralizada para hacer peticiones HTTP.
 * @param {string} endpoint - El endpoint al que llamar (ej. '/usuarios')
 * @param {RequestInit} options - Opciones de fetch (method, body, headers, etc.)
 */

async function apiFetch(endpoint, options = {}) {
    console.log("API Base URL:", BASE_URL);
    console.log("Endpoint:", endpoint);
    
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
    
    // ✅ Soporte para body en DELETE (usando 'data' como en axios)
    if (options.data && !config.body) {
        config.body = JSON.stringify(options.data);
    }
    
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log("Llamando a:", fullUrl);
    console.log("Config:", config);
    
    const response = await fetch(fullUrl, config);
    console.log("Respuesta HTTP:", response.status, response.statusText);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            console.error('Token inválido o expirado. Deslogueando...');
            localStorage.removeItem('authToken');
        }

        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            console.error("Datos de error:", errorData);
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
    console.log("Respuesta JSON completa:", genericResponse);

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