"use client"; // El carrusel de react-bootstrap necesita ser un Client Component

import { Carousel, CarouselItem } from "react-bootstrap";
import CarouselImage from "@/components/carrusel/carouselImage";

export function CarruselView({ eventos }) {
  // Si no hay eventos, no renderizamos nada para evitar errores.
  if (!eventos || eventos.length === 0) {
    return null;
  }

  return (
    <Carousel>
      {eventos.slice(0, 4).map((evento) => (
        <CarouselItem key={evento.id}>
          <CarouselImage evento={evento} />
        </CarouselItem>
      ))}
    </Carousel>
  );
}
