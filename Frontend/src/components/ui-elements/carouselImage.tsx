import Image from "next/image";
import type { Evento } from "@/types/globals";
import Link from "next/link";
import "@/css/carousel-image.css"; // Importamos los nuevos estilos

type CarouselItemProps = {
  evento:Evento;
}
export default function CarouselImage(props:CarouselItemProps){
  return(
    <div className="carousel-image-container">
      <Image
        src={props.evento.imagen}
        alt={`Imagen de ${props.evento.nombre}`}
        layout="fill"
        className="background-image"
      />
      <div className="carousel-content-overlay">
        <h1 className="carousel-event-name">{props.evento.nombre}</h1>
        <p className="carousel-venue-name">{props.evento.nombreLocal}</p>
        <Link href={`/user/eventos/detalle?id=${props.evento.id}`}>
          <button className="carousel-buy-button">Comprar ahora</button>
        </Link>
      </div>
    </div>
  )
}