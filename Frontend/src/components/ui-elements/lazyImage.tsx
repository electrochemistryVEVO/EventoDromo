import Image from "next/image";
import { Suspense,use } from "react";
type LazyImageProps = {
  imageUrl:string;
  className?:string;
}
//Usa este componente si quieres cargar una imagen dinamicamente
export default function LazyImage(props:LazyImageProps){
  const img = import('@/assets/pictures/'+props.imageUrl);
  const finalClassName = "img-fluid d-block "+(props?.className ?? "")
  return (
    <div className="w-auto">
      <Suspense fallback={<Image
        className={finalClassName}
        src={"https://placehold.co/400"}
        alt="..."
      />}>
        <Image
          className={finalClassName}
          src={use(img)}
          alt="..."
        />
      </Suspense>
    </div>
  )
}