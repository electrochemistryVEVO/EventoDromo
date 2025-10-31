import Image from "next/image";
import LazyImage from "./lazyImage";
import Link from "next/link";

export default function EventCard({ event, isAuthenticated = false }) {
  let fechaPublicacionFormat = "Fecha no disponible";
  const rawDate = event?.fechaPublicacion ?? event?.fechaEvento;

  if (rawDate) {
    const parsedDate = new Date(rawDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      fechaPublicacionFormat = new Intl.DateTimeFormat("es-419", {
        dateStyle: "full",
      }).format(parsedDate);
    }
  }

  const detailUrl = `/user/eventos/detalle?id=${event.id}`;

  return (
    <Link href={detailUrl} className="card h-100 card-evento-custom">
      {/* Contenedor para la imagen para controlar el overflow del zoom */}
      <div className="card-img-container">
        <LazyImage imageUrl={event.imagenURL} />
      </div>

      <div className="card-body p-3 d-flex align-items-center">
        {/* Columna del icono */}
        <div className="me-3">
          <Image
            className="card-icon-play"
            src={"/images/icon/triangleRignt.png"}
            alt="Icono de play"
            width={40}
            height={40}
          />
        </div>

        {/* Columna del texto */}
        <div className="d-flex flex-column text-truncate">
          {/* Fila 1: Local - Ciudad / Categoría */}
          <div className="card-info-title text-truncate">
            {event?.local?.nombre ?? "Local no disponible"} -
            {" "}
            {event?.local?.ciudad?.nombre ?? "Ciudad no disponible"} /{" "}
            <span className="categoria-highlight">
              {event?.tipoEvento?.nombre ?? "Categoría no disponible"}
            </span>
          </div>
          {/* Fila 2: Nombre del Evento */}
          <h5 className="fw-bolder card-title-custom my-1 text-truncate">
            {event.nombre}
          </h5>
          {/* Fila 3: Fecha */}
          <p className="card-date-text mb-0">{fechaPublicacionFormat}</p>
        </div>
      </div>
    </Link>
  );
}
