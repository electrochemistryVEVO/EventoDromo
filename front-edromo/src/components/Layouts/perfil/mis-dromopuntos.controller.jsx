"use client";

import React, { useState, useEffect } from "react";
import { getResumenDromopuntos } from "@/services/mis-dromopuntos.service";
import MisDromopuntosView from "./mis-dromopuntos";

export default function MisDromopuntosController() {
  const [processedData, setProcessedData] = useState({ total: 0, porVencer: [] });
  const [movimientos, setMovimientos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  let isMounted = true;
  const fetchData = async () => {
    console.log("[Controller] Iniciando fetch...");
    try {

      // 1. Obtenemos el token desde la sesión del navegador.
      // NOTA: Esto asume que tras el login, guardas el token en sessionStorage.
      const session = JSON.parse(sessionStorage.getItem("session"));
      const token = session?.token; // Asumimos que el token se guarda con la clave "token"

      //
      // Si usamos el backend, es obligatorio tener un token.
      // Si no, podemos proceder con el mock.
      if (process.env.NEXT_PUBLIC_USE_BACKEND === 'true' && !token) {
        throw new Error("Sesión no encontrada. Por favor, inicie sesión de nuevo.");
      }

      // 2. Hacemos una sola llamada al servicio, pasando el token.
      const resumen = await getResumenDromopuntos(token);
      console.log("[Controller] Resumen recibido del backend:", resumen);

      // El backend ya debería enviar los días restantes, pero si no, lo calculamos aquí.
      const ahora = new Date();
      const porVencerProcesado = (resumen.porVencer || []).map(p => {
        const fechaVencimiento = new Date(p.fechaExpiracion);
        const diffTime = fechaVencimiento - ahora;
        const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...p, diasRestantes };
      });

      if (isMounted) {
        // El backend ya nos da los datos procesados y listos para usar
        setProcessedData({
          total: resumen.total || 0,
          porVencer: porVencerProcesado
        });
        // Ordenamos los movimientos por fecha más reciente
        setMovimientos((resumen.movimientos || []).sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento)));
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
}, []);


  return (
    <MisDromopuntosView
      data={processedData}
      movimientos={movimientos}
      loading={loading}
      error={error}
      currentPage={currentPage}
      onPageChange={setCurrentPage} />
  );
}