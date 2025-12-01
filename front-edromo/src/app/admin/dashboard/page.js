"use client";

import React from "react";
import { useAnaliticasController } from "./controller";
import IndicadorCard from "@/components/dashboard/IndicadorCard";
import DashboardSectionCard from "@/components/dashboard/dashboardSectionCard";
import EventoItem from "@/components/dashboard/EventoItem";
import OcupacionLocalRow from "@/components/dashboard/OcupacionLocalRow";
import AccionRapidaButton from "@/components/dashboard/AccionRapidaButton";

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

// Función auxiliar para formatear los porcentajes
const formatearPorcentaje = (valor) => {
  if (valor === undefined || valor === null) return 0;

  // Opción A: Siempre muestra 2 decimales (ej: 5.00, 5.50, 5.55) -> Recomendado para dashboards
  return Number(valor).toFixed(2);

  // Opción B: Muestra "como máximo" 2 decimales, borra ceros innecesarios (ej: 5, 5.5, 5.55)
  // return Number(Number(valor).toFixed(2));
};

const DashboardAnaliticasPage = () => {
  const { isLoading, error, indicadores, eventos, ocupacion } =
    useAnaliticasController();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 p-4">
        <p className="text-xl text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <main className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard de Analíticas
      </h1>

      {indicadores && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <IndicadorCard
            icono={ICON_PATHS.ingresos}
            titulo="Ingresos Totales"
            valor={indicadores.ingresosTotales.valor.toLocaleString("es-PE")}
            prefijoValor="S/"
            porcentajeCambio={formatearPorcentaje(
              indicadores.ingresosTotales.porcentajeCambio
            )}
          />
          <IndicadorCard
            icono={ICON_PATHS.entradas}
            titulo="Entradas Vendidas"
            valor={indicadores.entradasVendidas.valor.toLocaleString("es-PE")}
            porcentajeCambio={formatearPorcentaje(
              indicadores.entradasVendidas.porcentajeCambio
            )}
          />
          <IndicadorCard
            icono={ICON_PATHS.usuarios}
            titulo="Usuarios nuevos"
            valor={indicadores.usuariosNuevos.valor.toLocaleString("es-PE")}
            porcentajeCambio={formatearPorcentaje(
              indicadores.usuariosNuevos.porcentajeCambio
            )}
          />
          <IndicadorCard
            icono={ICON_PATHS.sesion}
            titulo="Tiempo medio de sesión"
            valor={indicadores.tiempoSesionPromedio.minutos}
            sufijoValor=" min"
            porcentajeCambio={formatearPorcentaje(
              indicadores.tiempoSesionPromedio.porcentajeCambio
            )}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <DashboardSectionCard
            titulo="Eventos más vendidos"
            icono={ICON_PATHS.eventosVendidos}
            subtitulo="de los últimos 30 días"
          >
            <div className="flex flex-col space-y-2">
              {eventos.map((evento) => (
                <EventoItem key={evento.id} evento={evento} />
              ))}
            </div>
          </DashboardSectionCard>
        </div>

        <div className="lg:col-span-2">
          <DashboardSectionCard
            titulo="Ocupación de Locales"
            icono={ICON_PATHS.ocupacionLocales}
            subtitulo="de los últimos 30 días"
          >
            <div className="grid grid-cols-3 gap-4 pb-2 mb-2 border-b text-sm font-semibold text-gray-500">
              <div className="col-span-1">Local</div>
              <div className="col-span-1 text-center">Días Ocupados</div>
              <div className="col-span-1">Tasa de ocupación</div>
            </div>
            <div className="flex flex-col">
              {ocupacion.map((local) => (
                <OcupacionLocalRow key={local.id} local={local} />
              ))}
            </div>
          </DashboardSectionCard>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AccionRapidaButton
            icono={ICON_PATHS.crearLocal}
            texto="Crear Local"
            href="/admin/locales/crear"
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
