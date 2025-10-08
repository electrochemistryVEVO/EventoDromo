import Image from "next/image";
import LazyImage from "@/components/ui-elements/lazyImage";
import Link from "next/link"
import { redirect } from "next/navigation";
import triangleRight from "@/assets/triangleRignt.png"
import type { Evento } from "@/types/globals"
type PropsWithEvento = {
  event: Evento;
}
export default function EventCard(props:PropsWithEvento){
  let evento : Evento = props.event;
  const img = import('@/assets/pictures/'+evento.imagenURL)
  let fechaPublicacionFormat : string = new Intl.DateTimeFormat("es-419", {
    dateStyle: "full"
  }).format(evento.fechaPublicacion)
  return (<div className="col mb-5">
    <div className="card h-100">
      <LazyImage imageUrl={evento.imagenURL}/>
      <div className="row card-body p-4">
        <Image className="col-2" src={triangleRight} alt={"ok"}/>
        <div className="col-md-auto text-center">
          <h5 className="fw-bolder">{evento.nombre}</h5>
          {fechaPublicacionFormat}
        </div>
      </div>
      <div className="card-footer border-top-0 bg-transparent p-4 pt-0">
        <div className="text-center">
          <Link className="btn btn-outline-dark mt-auto" href={"/user/eventos/detalle?id="+evento.id.toString()}>
            View options
          </Link>
        </div>
      </div>
    </div>
  </div>);
}