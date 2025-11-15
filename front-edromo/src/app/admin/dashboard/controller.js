import { useState, useEffect } from "react";
import {
  obtenerIndicadoresDashboardHarcodeado,
  obtenerOcupacionLocalesHarcodeado,
  obtenerEventosMasVendidosHarcodeado,
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
          obtenerIndicadoresDashboardHarcodeado(),
          obtenerEventosMasVendidosHarcodeado(),
          obtenerOcupacionLocalesHarcodeado(),
        ]);

        const errores = [];

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