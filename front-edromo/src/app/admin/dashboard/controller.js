import { useState, useEffect } from "react";
import {
  obtenerIndicadoresDashboard,
  obtenerOcupacionLocales,
  obtenerEventosMasVendidos,
} from "@/services/dashboard.services.js";

export const useAnaliticasController = () => {
  const [indicadores, setIndicadores] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const resultados = await Promise.allSettled([
          obtenerIndicadoresDashboard(),
          obtenerEventosMasVendidos(),
          obtenerOcupacionLocales(),
        ]);

        const errores = [];

        if (
          resultados[0].status === "fulfilled" &&
          resultados[0].value.success
        ) {
          setIndicadores(resultados[0].value.data);
        } else {
          // Si no hay datos, no es un error crítico
          setIndicadores(null);
        }

        if (
          resultados[1].status === "fulfilled" &&
          resultados[1].value.success
        ) {
          const listaEventos = resultados[1].value.data || [];

          // Ordenamos de MAYOR a MENOR precio
          const eventosOrdenados = listaEventos.sort((a, b) => {
            const precioA = a.precio || 0;
            const precioB = b.precio || 0;

            return precioB - precioA; // Orden descendente (Mayor -> Menor)
          });

          setEventos(eventosOrdenados);
        } else {
          // Si no hay eventos, array vacío (no es error)
          setEventos([]);
        }

        if (
          resultados[2].status === "fulfilled" &&
          resultados[2].value.success
        ) {
          // 1. Obtenemos el array original
          const listaLocales = resultados[2].value.data || [];

          // 2. Ordenamos de MAYOR a MENOR por tasa de ocupación
          const listaOrdenada = listaLocales.sort((a, b) => {
            const tasaA = a.tasaOcupacion || 0;
            const tasaB = b.tasaOcupacion || 0;
            return tasaB - tasaA; // Resta b - a para orden descendente
          });

          // 3. Cortamos el array para quedarnos solo con los 10 primeros
          const top10Locales = listaOrdenada.slice(0, 10);

          // 4. Guardamos en el estado
          setOcupacion(top10Locales);
        } else {
          // Si no hay ocupación, array vacío (no es error)
          setOcupacion([]);
        }

        // Solo mostrar error si todas las llamadas fallaron
        if (errores.length > 0) {
          setError(errores.join(" "));
        }
      } catch (err) {
        console.error("Error inesperado en cargarDatosDashboard:", err);
        setError("Ocurrió un error inesperado al cargar la página.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  return {
    isLoading,
    error,
    indicadores,
    eventos,
    ocupacion,
  };
};
