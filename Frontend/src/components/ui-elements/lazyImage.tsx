"use client"
import Image from "next/image";
import { useState } from "react";

type LazyImageProps = {
  imageUrl:string;
  className?:string;
}

const PLACEHOLDER_IMAGE = "https://placehold.co/800x400?text=Evento";

//Usa este componente si quieres cargar una imagen dinamicamente
export default function LazyImage(props:LazyImageProps){
  const [imgSrc, setImgSrc] = useState(
    // Si la URL ya es una ruta completa (empieza con /), la usamos.
    // Si no, asumimos que está en /images/.
    props.imageUrl.startsWith('/') ? props.imageUrl : `/images/${props.imageUrl}`
  );

  const finalClassName = "img-fluid d-block "+(props?.className ?? "")

  return (
    <div className="w-auto">
        <Image
          className={finalClassName}
          src={imgSrc}
          width={800} // Añadimos un width y height por defecto para el layout
          height={400}
          alt="Imagen del evento"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)} // Si hay un error al cargar, usamos el placeholder
        />
    </div>
  )
}