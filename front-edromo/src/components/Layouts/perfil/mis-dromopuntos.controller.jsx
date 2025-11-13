"use client";

import React, { useState, useEffect } from "react";
import { getResumenDromopuntos } from "@/services/mis-dromopuntos.service";
import MisDromopuntosView from "./mis-dromopuntos";
// --- 1. IMPORTA useUser ---
import { useUser } from "@/context/UserContext.jsx";

export default function MisDromopuntosController() {
  // --- 2. OBTÉN EL USUARIO (Y SU TOKEN) ---
  const { user } = useUser();

  const [processedData, setProcessedData] = useState({ total: 0, porVencer: [] });
  const [movimientos, setMovimientos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [puntosPorSol, setPuntosPorSol] = useState(10);

  // --- 3. useEffect AHORA DEPENDE DE [user] ---
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      console.log("[Controller] Iniciando fetch...");

      // --- 4. VALIDA USANDO EL CONTEXTO ---
      // Si el 'user' (con el token) aún no ha cargado, no hagas nada
      if (!user || !user.token) {
        console.log("[Controller] Esperando al usuario o token...");
        setLoading(false); // Dejamos de cargar, no hay nada que hacer
        return; // Salir del efecto
      }

      setLoading(true); // Ahora que tenemos token, podemos cargar
      try {

        // --- 5. ELIMINA LA LECTURA MANUAL DE sessionStorage ---
        /*
        const session = JSON.parse(sessionStorage.getItem("session"));
        const token = session?.token;
        if (process.env.NEXT_PUBLIC_USE_BACKEND === 'true' && !token) {
           throw new Error("Sesión no encontrada. Por favor, inicie sesión de nuevo.");
        }
        */

        // --- 6. LLAMA AL SERVICIO CON EL TOKEN DEL CONTEXTO ---
        const resumen = await getResumenDromopuntos(user.token);
        console.log("[Controller] Resumen recibido del backend:", resumen);

        // (Tu lógica de procesamiento de fechas está perfecta)
        const ahora = new Date();
        const porVencerProcesado = (resumen.porVencer || []).map(p => {
          const fechaVencimiento = new Date(p.fechaExpiracion);
          const diffTime = fechaVencimiento - ahora;
          const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return { ...p, diasRestantes };
        });

        if (isMounted) {
          setProcessedData({
            total: resumen.total || 0,
            porVencer: porVencerProcesado
          });
          setMovimientos((resumen.movimientos || []).sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento)));
          if (resumen.puntosPorSol > 0) {
            setPuntosPorSol(resumen.puntosPorSol);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("[Controller] Error:", err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          console.log("[Controller] setLoading(false)");
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [user]); // <-- 7. EL EFECTO SE EJECUTA CUANDO 'user' ESTÉ LISTO


  return (
    <MisDromopuntosView
      data={processedData}
      movimientos={movimientos}
      loading={loading}
      error={error}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      puntosPorSol={puntosPorSol} />
  );
}