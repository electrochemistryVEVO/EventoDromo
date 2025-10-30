"use client";
import EventCard from "@/components/card-evento/eventCard.jsx";
import { useSearchParams } from "next/navigation";
import { useState,useEffect } from 'react';
import { listarEventosPorBusqueda } from "@/services/EntradaDetalle.service";


export function ListaEventosBusqueda() {
  let params = useSearchParams();
  let searchstr = params.get("search");
  let [eventList,setEventList] = useState([]);
  const obtenerResultados = async () => {let resultados = await listarEventosPorBusqueda(searchstr);setEventList(resultados ?? {});}
  useEffect(() => {
    obtenerResultados()
  }, []);
  const _eventCard = (evento) => <EventCard event={evento} />;
  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <h2>Resultados de busqueda</h2>
        <div className="col gx-4 gx-lg-5  justify-content-center">
          <div
            id="lista-destacados"
            className="row px-lg-5 container mt-5 px-4"
          >
            {eventList ? eventList.map(_eventCard) : <h2>No se encontraron resultados</h2>}
          </div>
        </div>
      </div>
    </section>
  );
}
