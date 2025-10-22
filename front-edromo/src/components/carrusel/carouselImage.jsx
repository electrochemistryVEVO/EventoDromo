import Image from "next/image";
import Link from "next/link";
import "@/css/carousel-image.css"; // Se mantiene la importación de los estilos

// La función ahora recibe el objeto de props y lo "desestructura"
// para sacar directamente la propiedad `evento`.
export default function CarouselImage({ evento }) {
  return (
    <div className="carousel-image-container">
      <Image
        src={evento.imagen} // Ya no necesitas escribir "props.evento..."
        alt={`Imagen de ${evento.nombre}`}
        layout="fill"
        className="background-image"
      />
      <div className="carousel-content-overlay">
        <h1 className="carousel-event-name">{evento.nombre}</h1>
        <p className="carousel-venue-name">{evento.nombreLocal}</p>
        <Link href={`/user/eventos/detalle?id=${evento.id}`}>
          <button className="carousel-buy-button">Comprar ahora</button>
        </Link>
      </div>
    </div>
  );
}
