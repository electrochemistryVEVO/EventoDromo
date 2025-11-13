import { useState, useEffect } from "react";
import {
  obtenerIndicadoresDashboardHarcodeado,
  obtenerEventosMasVendidosHarcodeado,
  obtenerOcupacionLocalesHarcodeado,
  // --- Descomenta estas líneas para usar los servicios reales ---
  // obtenerIndicadoresDashboard,
  // obtenerEventosMasVendidos,
  // obtenerOcupacionLocales,
} from "@/services/dashboard.services.js";
/**
 * @fileoverview Controller hook para la página del dashboard de analíticas.
 * Se encarga de la lógica de obtención de datos, manejo de estados de carga y errores.
 */

/**
 * Custom Hook que gestiona la lógica del dashboard de analíticas.
 *
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   indicadores: object | null,
 *   eventos: Array<object>,
 *   ocupacion: Array<object>
 * }}
 *   isLoading: Verdadero mientras se cargan los datos.
 *   error: Mensaje de error si alguna de las peticiones falla.
 *   indicadores: Objeto con los datos de los KPIs.
 *   eventos: Array con los eventos más vendidos.
 *   ocupacion: Array con los datos de ocupación de locales.
 */
export const useAnaliticasController = () => {
  // Estado para los datos de los indicadores (KPIs)
  const [indicadores, setIndicadores] = useState(null);
  // Estado para la lista de eventos más vendidos
  const [eventos, setEventos] = useState([]);
  // Estado para la lista de ocupación de locales
  const [ocupacion, setOcupacion] = useState([]);

  // Estado unificado para la carga
  const [isLoading, setIsLoading] = useState(true);
  // Estado para manejar cualquier error que ocurra
  const [error, setError] = useState(null);

  // useEffect se ejecuta una sola vez cuando el componente se monta (gracias a [])
  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        // Ponemos los estados en su valor inicial antes de empezar la carga
        setIsLoading(true);
        setError(null);

        // Usamos Promise.allSettled para ejecutar todas las peticiones en paralelo.
        // Esto es más robusto que Promise.all, ya que si una petición falla,
        // las otras pueden continuar y podemos mostrar datos parciales.
        const resultados = await Promise.allSettled([
          obtenerIndicadoresDashboardHarcodeado(),
          obtenerEventosMasVendidosHarcodeado(),
          obtenerOcupacionLocalesHarcodeado(),
          // --- Usa estas funciones para conectar con el backend real ---
          // obtenerIndicadoresDashboard(),
          // obtenerEventosMasVendidos(),
          // obtenerOcupacionLocales(),
        ]);

        const errores = [];

        // Procesamos el resultado de los indicadores
        if (
          resultados[0].status === "fulfilled" &&
          resultados[0].value.success
        ) {
          setIndicadores(resultados[0].value.data);
        } else {
          errores.push("No se pudieron cargar los indicadores.");
          console.error(
            "Error obteniendo indicadores:",
            resultados[0].reason || resultados[0].value.message
          );
        }

        // Procesamos el resultado de los eventos
        if (
          resultados[1].status === "fulfilled" &&
          resultados[1].value.success
        ) {
          setEventos(resultados[1].value.data);
        } else {
          errores.push("No se pudieron cargar los eventos más vendidos.");
          console.error(
            "Error obteniendo eventos:",
            resultados[1].reason || resultados[1].value.message
          );
        }

        // Procesamos el resultado de la ocupación
        if (
          resultados[2].status === "fulfilled" &&
          resultados[2].value.success
        ) {
          setOcupacion(resultados[2].value.data);
        } else {
          errores.push("No se pudo cargar la ocupación de locales.");
          console.error(
            "Error obteniendo ocupación:",
            resultados[2].reason || resultados[2].value.message
          );
        }

        // Si hubo algún error, lo guardamos en el estado
        if (errores.length > 0) {
          setError(errores.join(" "));
        }
      } catch (err) {
        // Error general por si algo inesperado ocurre
        console.error("Error inesperado en cargarDatosDashboard:", err);
        setError("Ocurrió un error inesperado al cargar la página.");
      } finally {
        // Al final de todo (éxito o fracaso), quitamos el estado de carga
        setIsLoading(false);
      }
    };

    cargarDatosDashboard();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  // El hook devuelve un objeto con todos los estados que la 'page' necesitará
  return {
    isLoading,
    error,
    indicadores,
    eventos,
    ocupacion,
  };
};
