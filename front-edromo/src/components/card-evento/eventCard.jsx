import Image from "next/image";
import LazyImage from "./lazyImage";
import Link from "next/link";

export default function EventCard({ event, isAuthenticated = false }) {
  // Convertimos la cadena de fecha a un objeto Date.
  // El 'T00:00:00' es para asegurar que se interprete en la zona horaria local y no en UTC.
  const fechaPublicacionFormat = new Intl.DateTimeFormat("es-419", {
    dateStyle: "full",
  }).format(new Date(event.fecha + "T00:00:00"));

  const basePath = isAuthenticated ? "/user-login/web" : "/user/web";
  const detailUrl = `${basePath}/eventos/detalle?id=${event.id}`;

  return (
    <Link href={detailUrl} className="card h-100 card-evento-custom">
      {/* Contenedor para la imagen para controlar el overflow del zoom */}
      <div className="card-img-container">
        <LazyImage imageUrl={event.imagen} />
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
            {event.nombreLocal} - {event.ciudad} /{" "}
            <span className="categoria-highlight">{event.categoria}</span>
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
