"use client"; // Directiva necesaria en Next.js App Router para componentes con hooks

import React from "react";

// 1. Importar el Controller
import { useAnaliticasController } from "./controller";

// 2. Importar todos los componentes de presentación
import IndicadorCard from "@/components/dashboard/IndicadorCard";
import DashboardSectionCard from "@/components/dashboard/dashboardSectionCard";
import EventoItem from "@/components/dashboard/EventoItem";
import OcupacionLocalRow from "@/components/dashboard/OcupacionLocalRow";
import AccionRapidaButton from "@/components/dashboard/AccionRapidaButton";

// 3. Importar los íconos (reemplazar con los tuyos)
// Estos son solo ejemplos. Deberías tener tus propios componentes de íconos.
const ICON_PATHS = {
  ingresos: "/images/icon/icon-dollar.png",
  puntos: "/images/icon/icon-monedas.png",
  entradas: "/images/icon/icon-ticket.png",
  usuarios: "/images/icon/icon-personas.png",
  sesion: "/images/icon/icon-time.png",
  conversion: "/images/icon/icon-stats.png",
  crearLocal: "/images/icon/icon-evento.png",
  crearEvento: "/images/icon/icon-calendario.png",
  eventosVendidos: "/images/icon/icon-estadistias.png",
  ocupacionLocales: "/images/icon/icon-ubicacion.png",
};

// Componente para mostrar mientras los datos cargan
const LoadingComponent = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-xl text-gray-600">Cargando datos del dashboard...</p>
  </div>
);

// Componente para mostrar en caso de error
const ErrorComponent = ({ message }) => (
  <div className="flex items-center justify-center h-screen bg-red-50 p-4">
    <p className="text-xl text-red-700">Error: {message}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const DashboardAnaliticasPage = () => {
  // 4. Usar el controller para obtener el estado y los datos
  const { isLoading, error, indicadores, eventos, ocupacion } =
    useAnaliticasController();

  // 5. Manejar los estados de carga y error
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  // 6. Renderizar la UI cuando los datos están listos
  return (
    <main className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard de Analíticas
      </h1>

      {/* --- Sección de Indicadores (KPIs) --- */}
      {indicadores && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {/* --- CAMBIO: Pasamos las rutas de los íconos como strings --- */}
          <IndicadorCard
            icono={ICON_PATHS.ingresos}
            titulo="Ingresos Totales"
            valor={indicadores.ingresosTotales.monto.toLocaleString("es-PE")}
            prefijoValor="S/"
            porcentajeCambio={indicadores.ingresosTotales.porcentajeCambio}
          />
          <IndicadorCard
            icono={ICON_PATHS.puntos}
            titulo="Uso de puntos promedio"
            valor={indicadores.puntosUsadosPromedio.monto}
            porcentajeCambio={indicadores.puntosUsadosPromedio.porcentajeCambio}
          />
          <IndicadorCard
            icono={ICON_PATHS.entradas}
            titulo="Entradas Vendidas"
            valor={indicadores.entradasVendidas.monto.toLocaleString("es-PE")}
            porcentajeCambio={indicadores.entradasVendidas.porcentajeCambio}
          />
          <IndicadorCard
            icono={ICON_PATHS.usuarios}
            titulo="Usuarios nuevos"
            valor={indicadores.usuariosNuevos.monto.toLocaleString("es-PE")}
            porcentajeCambio={indicadores.usuariosNuevos.porcentajeCambio}
          />
          <IndicadorCard
            icono={ICON_PATHS.sesion}
            titulo="Tiempo medio de sesión"
            valor={indicadores.tiempoSesionPromedio.minutos}
            sufijoValor=" min"
            porcentajeCambio={indicadores.tiempoSesionPromedio.porcentajeCambio}
          />
          <IndicadorCard
            icono={ICON_PATHS.conversion}
            titulo="Tasa de Conversión"
            valor={indicadores.tasaConversion.tasa}
            sufijoValor="%"
            porcentajeCambio={indicadores.tasaConversion.porcentajeCambio}
          />
        </div>
      )}

      {/* --- Sección Principal (Eventos y Ocupación) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Columna de Eventos más vendidos */}
        <div className="lg:col-span-1">
          <DashboardSectionCard
            titulo="Eventos más vendidos"
            icono={ICON_PATHS.eventosVendidos}
          >
            <div className="flex flex-col space-y-2">
              {eventos.map((evento) => (
                <EventoItem key={evento.id} evento={evento} />
              ))}
            </div>
          </DashboardSectionCard>
        </div>

        {/* Columna de Ocupación de Locales */}
        <div className="lg:col-span-2">
          <DashboardSectionCard
            titulo="Ocupación de Locales"
            icono={ICON_PATHS.ocupacionLocales}
          >
            {/* Cabecera de la tabla */}
            <div className="grid grid-cols-3 gap-4 pb-2 mb-2 border-b text-sm font-semibold text-gray-500">
              <div className="col-span-1">Local</div>
              <div className="col-span-1 text-center">Días Ocupados</div>
              <div className="col-span-1">
                Tasa de ocupación{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (Últimos 30 días)
                </span>
              </div>
            </div>
            {/* Filas de la tabla */}
            <div className="flex flex-col">
              {ocupacion.map((local) => (
                <OcupacionLocalRow key={local.id} local={local} />
              ))}
            </div>
          </DashboardSectionCard>
        </div>
      </div>

      {/* --- Sección de Acciones Rápidas --- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AccionRapidaButton
            icono={ICON_PATHS.crearLocal}
            texto="Crear Local"
            href="/admin/locales"
            onClick={() => console.log("Crear Local")}
          />
          <AccionRapidaButton
            icono={ICON_PATHS.crearEvento}
            texto="Crear Evento"
            href="/admin/eventos/crear"
            onClick={() => console.log("Crear Evento")}
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardAnaliticasPage;