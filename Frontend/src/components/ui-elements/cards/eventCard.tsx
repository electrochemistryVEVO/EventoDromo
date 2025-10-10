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
    <Link href={`/user/eventos/detalle?id=${evento.id}`} className="card h-100 card-evento-custom">
      {/* Contenedor para la imagen para controlar el overflow del zoom */}
      <div className="card-img-container">
        <LazyImage imageUrl={evento.imagen} />
      </div>
      
      <div className="card-body p-3 d-flex align-items-center">
        {/* Columna del icono */}
        <div className="me-3">
          <Image className="card-icon-play" src={triangleRight} alt="Icono de play" width={40} height={40} />
        </div>

        {/* Columna del texto */}
        <div className="d-flex flex-column text-truncate">
          {/* Fila 1: Local - Ciudad / Categoría */}
          <div className="card-info-title text-truncate">
            {evento.nombreLocal} - {evento.ciudad} / <span className="categoria-highlight">{evento.categoria}</span>
          </div>
          {/* Fila 2: Nombre del Evento */}
          <h5 className="fw-bolder card-title-custom my-1 text-truncate">{evento.nombre}</h5>
          {/* Fila 3: Fecha */}
          <p className="card-date-text mb-0">{fechaPublicacionFormat}</p>
        </div>
      </div>
    </Link>
  );
}