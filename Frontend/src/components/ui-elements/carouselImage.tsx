import Image from "next/image";
import { Suspense,use } from "react";
import LazyImage from "@/components/ui-elements/lazyImage";
import type { Evento } from "@/types/globals";

type CarouselItemProps = {
  evento:Evento;
}
export default function CarouselImage(props:CarouselItemProps){
  return(
    <LazyImage imageUrl={props.evento.imagenURL}/>
  )
}