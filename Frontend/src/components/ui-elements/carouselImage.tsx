import Image from "next/image";
import { Suspense,use } from "react";
import { Carousel } from 'react-bootstrap'
import type { Evento } from "@/types/globals";
type CarouselItemProps = {
  evento:Evento;
}
export default function CarouselImage(props:CarouselItemProps){
  const img = import('@/assets/pictures/'+props.evento.imagenURL)
  return(
    <div>
      <Suspense fallback={<div>Hola mundo</div>}>
        <Image
          className="img-fluid d-block w-100"
          src={use(img)}
          alt="..."
        />
      </Suspense>
    </div>
  )
}