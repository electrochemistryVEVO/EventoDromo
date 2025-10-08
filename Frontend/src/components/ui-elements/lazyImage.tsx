import Image from "next/image";
import { Suspense,use } from "react";
type LazyImageProps = {
  imageUrl:string;
}
//Usa este componente si quieres cargar una imagen dinamicamente
export default function LazyImage(props:LazyImageProps){
  const img = import('@/assets/pictures/'+props.imageUrl);
  return (
    <div>
      <Suspense fallback={<Image
        className="img-fluid d-block w-100"
        src={"https://placehold.co/400"}
        alt="..."
      />}>
        <Image
          className="img-fluid d-block w-100"
          src={use(img)}
          alt="..."
        />
      </Suspense>
    </div>
  )
}