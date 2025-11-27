"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const PLACEHOLDER_IMAGE = "https://placehold.co/800x400?text=Evento";

// Lista de dominios permitidos en next.config.mjs
const ALLOWED_DOMAINS = [
  'via.placeholder.com',
  'placehold.co',
  'i0.wp.com',
  'ejemplo.com',
  'example.com',
  'localhost',
  'eventodromo-s3.s3.amazonaws.com',
  's3.amazonaws.com'
];

// Función para validar si una URL es válida y está en dominios permitidos
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Verificar si el hostname está en la lista de permitidos o es un subdominio de S3
    return ALLOWED_DOMAINS.some(domain => 
      hostname === domain || 
      hostname.endsWith(`.${domain}`) ||
      hostname.includes('s3.amazonaws.com')
    );
  } catch (e) {
    // Si la URL no es válida, retornar false
    return false;
  }
};

// Usa este componente si quieres cargar una imagen dinámicamente.
export default function LazyImage({ imageUrl, className }) {
  const [imgSrc, setImgSrc] = useState(PLACEHOLDER_IMAGE);

  useEffect(() => {
    // Validar la URL antes de usarla
    if (isValidImageUrl(imageUrl)) {
      setImgSrc(imageUrl);
    } else if (imageUrl) {
      console.warn(`URL de imagen no válida o no configurada: ${imageUrl}`);
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  }, [imageUrl]);

  // Construimos la clase final, añadiendo la clase opcional si existe.
  const finalClassName = `img-fluid d-block ${className || ""}`;

  return (
    <div className="w-auto">
      <Image
        className={finalClassName}
        src={imgSrc}
        layout="fill"
        alt="Imagen del evento"
        onError={() => {
          console.warn(`Error al cargar imagen: ${imgSrc}`);
          setImgSrc(PLACEHOLDER_IMAGE);
        }}
      />
    </div>
  );
}
