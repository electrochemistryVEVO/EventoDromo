import { getAuthToken } from "@/services/admin-service";
import { getApiUrl } from "@/lib/utils";

export async function listarLocales() {
    const token = getAuthToken();
    if (!token) {
        console.error("listarLocales: No se encontró el token de autenticación.");
        return [];
    }
    
    try {
        const url = await getApiUrl();
        const fullUrl = `${url}/Local/ListarLocalesAdmin`;
        console.log('[listarLocales] Llamando a:', fullUrl);
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            if (response.status === 401) {
                console.error("listarLocales: No autorizado. Por favor, inicie sesión nuevamente.");
                return [];
            }
            if (response.status === 404) {
                console.error("listarLocales: Endpoint no encontrado. Verifica que el backend esté ejecutándose correctamente.");
                return [];
            }
            const errorText = await response.text();
            console.error(`listarLocales: Error HTTP ${response.status}:`, errorText);
            return [];
        }

        // Verificar si hay contenido antes de parsear
        const text = await response.text();
        if (!text || text.trim() === '') {
            console.warn("listarLocales: Respuesta vacía del servidor");
            return [];
        }

        return JSON.parse(text);
    } catch (err) {
        console.error("Error en listarLocales:", err.message);
        return [];
    }
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
        const response = await fetch(`${url}/Ciudad/ListarCiudades`, {
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
        const response = await fetch(`${url}/Local/CrearLocales`, {
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
        console.error("obtenerLocalPorId: No se encontró el token de autenticación.");
        return null;
    }
    
    try {
        const url = await getApiUrl();
        const response = await fetch(`${url}/Local/ObtenerLocalPorId?id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return await response.json();
    } catch (err) {
        console.error("Error en obtenerLocalPorId:", err.message);
        return null;
    }
}

export async function eliminarLocal(id) {
    const token = getAuthToken();
    if (!token) {
        console.error("eliminarLocal: No se encontró el token de autenticación.");
        return { success: false, message: "No se encontró el token de autenticación" };
    }
    
    try {
        const url = await getApiUrl();
        
        // Asegurarnos de que el ID es un número
        const numericId = parseInt(id);
        console.log('[eliminarLocal] Enviando ID:', numericId);
        
        // El endpoint espera el id en el body como JSON
        const response = await fetch(`${url}/Local/PonerInactivoLocal`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(numericId)
        });

        console.log('[eliminarLocal] Response status:', response.status);
        console.log('[eliminarLocal] Response ok:', response.ok);

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, message: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            const errorText = await response.text();
            console.error('[eliminarLocal] Error response:', errorText);
            
            let errorData = null;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                // Error no es JSON válido
            }
            
            return { 
                success: false, 
                message: errorData?.message || errorData?.error || errorText || `Error HTTP: ${response.status}` 
            };
        }

        // Si llegamos aquí, la respuesta fue exitosa (status 200)
        const resultText = await response.text();
        console.log('[eliminarLocal] Response text:', resultText);
        
        // Si la respuesta está vacía, consideramos que fue exitoso
        if (!resultText || resultText.trim() === '') {
            console.log('[eliminarLocal] Respuesta vacía, considerando éxito');
            return { success: true, message: "Local inactivado exitosamente" };
        }
        
        try {
            const result = JSON.parse(resultText);
            console.log('[eliminarLocal] Parsed result:', result);
            
            // Si el backend devuelve un objeto vacío {} o sin la propiedad success, lo consideramos exitoso
            if (!result || Object.keys(result).length === 0 || result.success === undefined) {
                console.log('[eliminarLocal] Objeto vacío o sin success, considerando éxito');
                return { success: true, message: "Local inactivado exitosamente", data: result };
            }
            
            console.log('[eliminarLocal] Retornando result original');
            return result;
        } catch (e) {
            console.log('[eliminarLocal] Error al parsear, considerando éxito');
            // Si no es JSON válido, pero response.ok = true, entonces fue exitoso
            return { success: true, message: "Local inactivado exitosamente" };
        }
    } catch (err) {
        console.error("Error en eliminarLocal:", err);
        return { 
            success: false, 
            message: err.message || "Error desconocido" 
        };
    }
}

export async function editarLocal(modalData) {
    const token = getAuthToken();
    if (!token) {
        console.error("editarLocal: No se encontró el token de autenticación.");
        return { success: false, message: "No se encontró el token de autenticación" };
    }
    
    try {
        const url = await getApiUrl();
        const response = await fetch(`${url}/Local/LocalModificarLocal`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modalData)
        });
        
        return await response.json();
    } catch (err) {
        console.error("Error en editarLocal:", err.message);
        return { success: false, message: err.message || "Error desconocido" };
    }
}

export async function restaurarLocal(id) {
    const token = getAuthToken();
    if (!token) {
        console.error("restaurarLocal: No se encontró el token de autenticación.");
        return { success: false, message: "No se encontró el token de autenticación" };
    }
    
    try {
        const url = await getApiUrl();
        
        // Asegurarnos de que el ID es un número
        const numericId = parseInt(id);
        console.log('[restaurarLocal] Enviando ID:', numericId);
        
        // El endpoint espera el id en el body como JSON
        const response = await fetch(`${url}/Local/PonerActivoLocal`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(numericId)
        });

        console.log('[restaurarLocal] Response status:', response.status);
        console.log('[restaurarLocal] Response ok:', response.ok);

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, message: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            const errorText = await response.text();
            console.error('[restaurarLocal] Error response:', errorText);
            
            let errorData = null;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                // Error no es JSON válido
            }
            
            return { 
                success: false, 
                message: errorData?.message || errorData?.error || errorText || `Error HTTP: ${response.status}` 
            };
        }

        // Si llegamos aquí, la respuesta fue exitosa (status 200)
        const resultText = await response.text();
        console.log('[restaurarLocal] Response text:', resultText);
        
        // Si la respuesta está vacía, consideramos que fue exitoso
        if (!resultText || resultText.trim() === '') {
            console.log('[restaurarLocal] Respuesta vacía, considerando éxito');
            return { success: true, message: "Local restaurado exitosamente" };
        }
        
        try {
            const result = JSON.parse(resultText);
            console.log('[restaurarLocal] Parsed result:', result);
            
            // Si el backend devuelve un objeto vacío {} o sin la propiedad success, lo consideramos exitoso
            if (!result || Object.keys(result).length === 0 || result.success === undefined) {
                console.log('[restaurarLocal] Objeto vacío o sin success, considerando éxito');
                return { success: true, message: "Local restaurado exitosamente", data: result };
            }
            
            console.log('[restaurarLocal] Retornando result original');
            return result;
        } catch (e) {
            console.log('[restaurarLocal] Error al parsear, considerando éxito');
            // Si no es JSON válido, pero response.ok = true, entonces fue exitoso
            return { success: true, message: "Local restaurado exitosamente" };
        }
    } catch (err) {
        console.error("Error en restaurarLocal:", err);
        return { 
            success: false, 
            message: err.message || "Error desconocido" 
        };
    }
}