"use client";
import EventCard from "../../../../../../front-edromo/src/components/eventCard";
import { useSearchParams } from "next/navigation";

const eventoMockData = [
  {
    id: 0,
    nombre: "Festival Overpass Lima",
    descripcion: "Concierto internacional con artistas destacados.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-14"),
    fechaCompra: new Date("2025-09-14"),
    isDeleted: 1,
    imagenURL: "festival-overpass-lima.png",
  },
  {
    id: 1,
    nombre: "Noches de Folklore",
    descripcion: "Presentación cultural con danzas típicas y música peruana.",
    idTipoEvento: 3, // Teatro / Cultural
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-06"),
    fechaCompra: new Date("2025-09-06"),
    isDeleted: 1,
    imagenURL: "noches-de-folklore.jpg",
  },
  {
    id: 2,
    nombre: "Carmen Ópera de Georges Bizet",
    descripcion: "Ópera clásica presentada en el Teatro Municipal de Lima.",
    idTipoEvento: 3, // Teatro
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-11"),
    fechaCompra: new Date("2025-09-11"),
    isDeleted: 1,
    imagenURL: "carmen-opera.jpg",
  },
  {
    id: 3,
    nombre: "Tour + Museo Monumental",
    descripcion: "Recorrido por el Estadio Monumental y su museo.",
    idTipoEvento: 2, // Deportivo
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-11"),
    fechaCompra: new Date("2025-09-11"),
    isDeleted: 1,
    imagenURL: "tour-museo-monumental.jpg",
  },
  {
    id: 4,
    nombre: "Daniela Darcourt",
    descripcion: "Concierto de salsa en vivo de Daniela Darcourt.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-15"),
    fechaCompra: new Date("2025-09-15"),
    isDeleted: 1,
    imagenURL: "daniela-darcourt.png",
  },
  {
    id: 5,
    nombre: "Linkin Park",
    descripcion: "From Zero World Tour con Linkin Park en Lima.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-19"),
    fechaCompra: new Date("2025-09-19"),
    isDeleted: 1,
    imagenURL: "linkin-park.jpg",
  },
  {
    id: 6,
    nombre: "Imagine Dragons",
    descripcion: "Concierto de la banda Imagine Dragons en Lima.",
    idTipoEvento: 1, // Concierto
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-21"),
    fechaCompra: new Date("2025-09-21"),
    isDeleted: 1,
    imagenURL: "imagine-dragons.jpg",
  },
  {
    id: 7,
    nombre: "Carrera 10 Kilómetros Alimentación 10/10",
    descripcion: "Carrera de atletismo para promover la buena alimentación.",
    idTipoEvento: 2, // Deportivo
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-22"),
    fechaCompra: new Date("2025-09-22"),
    isDeleted: 1,
    imagenURL: "carrera-10k.png",
  },
  {
    id: 8,
    nombre: "Rimac Sports Festival",
    descripcion: "Evento deportivo con diferentes disciplinas.",
    idTipoEvento: 2, // Deportivo
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-24"),
    fechaCompra: new Date("2025-09-24"),
    isDeleted: 1,
    imagenURL: "rimac-sports-festival.png",
  },
  {
    id: 9,
    nombre: "Marinera y Show Peruano",
    descripcion:
      "Evento cultural con baile de marinera y espectáculos típicos.",
    idTipoEvento: 3, // Teatro / Cultural
    idLocal: 1,
    creadoPor: 1,
    fechaPublicacion: new Date("2025-09-26"),
    fechaCompra: new Date("2025-09-26"),
    isDeleted: 1,
    imagenURL: "marinera-show.png",
  },
];

function obtenerEventosBusqueda(str) {
  let eventos = [];
  for (let evento of eventoMockData) {
    if (evento.nombre.toLowerCase().indexOf(str.toLowerCase()) > 0)
      eventos.push(evento);
  }
  return eventos;
}

export function ListaEventosBusqueda() {
  let params = useSearchParams();
  let searchstr = params.get("search");
  let resultados = obtenerEventosBusqueda(searchstr);
  const _eventCard = (evento) => <EventCard event={evento} />;
  return (
    <section className="py-5">
      <div className="px-lg-5 container mt-5 px-4">
        <h2>Resultados de busqueda</h2>
        <div className="col gx-4 gx-lg-5 justify-content-center">
          <div
            id="lista-destacados"
            className="row px-lg-5 container mt-5 px-4"
          >
            {resultados.map(_eventCard)}
          </div>
        </div>
      </div>
    </section>
  );
}
