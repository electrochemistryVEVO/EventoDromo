"use client";
import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER_IMAGE = "https://placehold.co/800x400?text=Evento";

// Usa este componente si quieres cargar una imagen dinámicamente.
// Desestructuramos las props directamente en los parámetros de la función.
export default function LazyImage({ imageUrl, className }) {
  const [imgSrc, setImgSrc] = useState(imageUrl || PLACEHOLDER_IMAGE);

  // Construimos la clase final, añadiendo la clase opcional si existe.
  const finalClassName = `img-fluid d-block ${className || ""}`;

  return (
    <div className="w-auto">
      <Image
        className={finalClassName}
        src={imgSrc}
        layout="fill" // <-- La clave está aquí: la imagen llenará el contenedor
        alt="Imagen del evento"
        onError={() => setImgSrc(PLACEHOLDER_IMAGE)} // Si hay un error al cargar, usamos el placeholder
      />
    </div>
  );
}
