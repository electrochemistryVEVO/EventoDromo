"use client";
import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER_IMAGE = "https://placehold.co/800x400?text=Evento";

// Usa este componente si quieres cargar una imagen dinámicamente.
// Desestructuramos las props directamente en los parámetros de la función.
export default function LazyImage({ imageUrl, className }) {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!imageUrl) {
      return PLACEHOLDER_IMAGE;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }

    return `/images/${imageUrl}`;
  });

  // Construimos la clase final, añadiendo la clase opcional si existe.
  const finalClassName = `img-fluid d-block ${className || ""}`;

  return (
    <div className="w-auto">
      <img
        className={finalClassName}
        src={imgSrc}
        alt="Imagen del evento"
        onError={() => setImgSrc(PLACEHOLDER_IMAGE)} // Si hay un error al cargar, usamos el placeholder
      />
    </div>
  );
}
