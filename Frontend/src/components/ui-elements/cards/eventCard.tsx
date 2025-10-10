import Image from "next/image";
import LazyImage from "@/components/ui-elements/lazyImage";
import Link from "next/link"
import triangleRight from "@/assets/triangleRignt.png"
import type { Evento } from "@/types/globals"

type PropsWithEvento = {
  event: Evento;
}

export default function EventCard(props: PropsWithEvento) {
  let evento: Evento = props.event;

  // Convertimos la cadena de fecha a un objeto Date.
  // El 'T00:00:00' es para asegurar que se interprete en la zona horaria local y no en UTC.
  let fechaPublicacionFormat: string = new Intl.DateTimeFormat("es-419", {
    dateStyle: "full"
  }).format(new Date(evento.fecha + "T00:00:00"));

  return (
    <div className="card h-100 card-evento-custom">
      <LazyImage imageUrl={evento.imagen} /> {/* IMAGEN: card-img-top */}

      <div className="card-body p-4 d-flex flex-column justify-content-between">

        <div className="d-flex align-items-center mb-2">
          <Image className="card-icon-play me-2" src={triangleRight} alt={"Icono"} />
          <h5 className="fw-bolder card-title-custom">{evento.nombre}</h5>
        </div>

        {/* FECHA */}
        <p className="card-date-text mt-auto mb-3">
          {fechaPublicacionFormat}
        </p>

        <Link
          className="btn btn-outline-dark mt-auto btn-custom-outline"
          href={"/user/eventos/detalle?id=" + evento.id.toString()}
        >
          Ver evento
        </Link>
      </div>
    </div>
  );
}