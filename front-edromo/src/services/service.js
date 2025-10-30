import { promises as fs } from 'fs';
import path from 'path';

// --- CONFIGURACIÓN ---
const USE_BACKEND = false; // Cambia a true para usar el backend
const BACKEND_BASE_URL = "http://localhost:5189/api/Evento"; // O la URL de tu backend real

/**
 * Función auxiliar para construir la URL con parámetros de filtro.
 * Envía los filtros al backend.
 */
function buildUrlWithFilters(baseUrl, filters) {
    const params = new URLSearchParams();
    // Convierte fechas relativas a rangos ANTES de enviar al backend
    let backendFilters = { ...filters };
     if (backendFilters.fecha) {
         const range = calculateDateRange(backendFilters.fecha);
         backendFilters.fechaInicio = range.inicio?.toISOString().split('T')[0] || null;
         backendFilters.fechaFin = range.fin?.toISOString().split('T')[0] || null;
         delete backendFilters.fecha;
     } else {
         backendFilters.fechaInicio = filters.fechaInicio || null;
         backendFilters.fechaFin = filters.fechaFin || null;
     }

     // Limpia nulls y añade al params
     Object.keys(backendFilters).forEach(key => {
        const value = backendFilters[key];
        if (value !== null && value !== undefined && value !== '') {
             params.append(key, value);
        }
     });

    const queryString = params.toString();
    // Endpoint sugerido que devuelve eventos Y locales
    return queryString ? `${baseUrl}/ListarFiltradosConLocales?${queryString}` : `${baseUrl}/ListarFiltradosConLocales`;
}

/**
 * Función INTERNA para obtener los datos crudos (eventos y locales)
 * desde el backend o el archivo JSON.
 */
async function fetchData(filters = {}) {
    let jsonData;

    try {
        if (USE_BACKEND) {
            const url = buildUrlWithFilters(BACKEND_BASE_URL, filters);
            console.log("Fetching data from Backend URL:", url);
            const res = await fetch(url);
            if (!res.ok) {
                // Intenta leer el cuerpo del error si es posible
                let errorBody = "Error desconocido";
                try { errorBody = await res.text(); } catch(e){}
                throw new Error(`Error ${res.status} cargando datos del backend: ${errorBody}`);
            }
            jsonData = await res.json();
        } else {
            // Lee el archivo local (asume que contiene la estructura GenericResponse)
            const jsonPath = path.join(process.cwd(), 'public', 'data', 'eventos.json');
            const fileContent = await fs.readFile(jsonPath, 'utf8');
            jsonData = JSON.parse(fileContent);
        }

        // Procesa GenericResponse
        if (!jsonData) throw new Error("Respuesta vacía del servicio");
        if (jsonData.success === false) {
            throw new Error(jsonData.error || jsonData.mensaje || "Error en respuesta del servicio");
        }
        // Devuelve el contenido de 'data' ({ eventos: [], locales: [] })
        return jsonData.data ?? { eventos: [], locales: [] };

    } catch (error) {
         console.error("Error en fetchData:", error);
         // Relanza el error para que la función principal lo maneje
         throw error;
    }
}

/**
 * Función PRINCIPAL exportada: Obtiene eventos (filtrados) y locales.
 * @param {object} [filters={}] - Objeto opcional con filtros a aplicar a los eventos.
 * @returns {Promise<{eventos: Array, locales: Array}>} Un objeto con las listas.
 */
export const getPaginaEventosData = async (filters = {}) => {
    try {
        // 1. Obtiene TODOS los datos (eventos y locales)
        const data = await fetchData(filters);
        let eventos = data.eventos ?? [];
        const locales = data.locales ?? []; // Los locales no se filtran aquí

        // 2. Si NO usamos backend, aplicamos el filtrado a los eventos aquí
        if (!USE_BACKEND) {
            console.log(" SERVICE (Local) - Aplicando filtros:", filters);
            // --- Filtrado Manual ---
            const selectedCategorias = filters.categoria ? filters.categoria.toLowerCase().split(',') : [];
            const selectedCiudades = filters.ciudad ? filters.ciudad.toLowerCase().split(',') : [];
            let filterStartDate = null;
            let filterEndDate = null;

            if (filters.fecha) { // Filtro rápido
                const range = calculateDateRange(filters.fecha);
                filterStartDate = range.inicio;
                filterEndDate = range.fin;
            } else { // Rango personalizado
                if (filters.fechaInicio) try { filterStartDate = new Date(filters.fechaInicio + 'T00:00:00'); } catch (e) {}
                if (filters.fechaFin) try { filterEndDate = new Date(filters.fechaFin + 'T23:59:59'); } catch (e) {}
            }

            eventos = eventos.filter(evento => { // Filtra sobre la lista obtenida
                let pasaFiltro = true;
                if (selectedCategorias.length > 0 && !selectedCategorias.includes(evento.categoria.toLowerCase())) pasaFiltro = false;
                if (selectedCiudades.length > 0 && !selectedCiudades.includes(evento.ciudad.toLowerCase())) pasaFiltro = false;
                if (filters.precioMin && evento.precio < parseFloat(filters.precioMin)) pasaFiltro = false;
                if (filters.precioMax && evento.precio > parseFloat(filters.precioMax)) pasaFiltro = false;
                const eventoDate = new Date(evento.fecha);
                if (isNaN(eventoDate)) { pasaFiltro = false; }
                else {
                    if (filterStartDate && !isNaN(filterStartDate) && eventoDate < filterStartDate) pasaFiltro = false;
                    if (filterEndDate && !isNaN(filterEndDate) && eventoDate > filterEndDate) pasaFiltro = false;
                }
                if (filters.busqueda) {
                    const termino = filters.busqueda.toLowerCase();
                    if (!evento.nombre.toLowerCase().includes(termino) && !evento.nombreLocal.toLowerCase().includes(termino)) pasaFiltro = false;
                }
                return pasaFiltro;
            });
             console.log(` SERVICE (Local) - Eventos después del filtro: ${eventos.length}`);
        }

        // 3. Devuelve el objeto con ambas listas
        return { eventos, locales };

    } catch (error) {
        console.error("Error en getPaginaEventosData:", error);
        // Devuelve listas vacías en caso de error para que la página no se rompa
        return { eventos: [], locales: [] };
        // O podrías relanzar el error si prefieres manejarlo en el controller/page
        // throw error;
    }
};

// --- FUNCIÓN AUXILIAR PARA CALCULAR RANGOS DE FECHA ---
// (Se mantiene igual)
function calculateDateRange(relativeDateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = new Date(today);
    let endDate = new Date(today);

    switch (relativeDateString) {
        case 'Hoy': endDate.setHours(23, 59, 59, 999); break;
        case 'Mañana':
            startDate.setDate(today.getDate() + 1);
            endDate.setDate(today.getDate() + 1);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Esta semana':
            const dayOfWeek = today.getDay();
            const diffStart = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startDate.setDate(diffStart);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Fin de semana':
            const currentDay = today.getDay();
            let diffToSat = 6 - currentDay;
            if (currentDay === 0) diffToSat = -1;
            if (currentDay === 6) diffToSat = 0;
            startDate.setDate(today.getDate() + diffToSat);
            endDate.setDate(startDate.getDate() + 1);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Este Mes':
            startDate.setDate(1);
            endDate.setMonth(today.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Próximo Mes':
            startDate.setMonth(today.getMonth() + 1);
            startDate.setDate(1);
            endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
            break;
        default: return { inicio: null, fin: null };
    }
    // Devuelve fechas Date, la conversión a string se hace si se llama al backend
    return { inicio: startDate, fin: endDate };
}
