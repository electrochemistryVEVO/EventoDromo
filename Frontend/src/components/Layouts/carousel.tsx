import { Children, PropsWithChildren } from "react";

export default async function Carousel({children} : PropsWithChildren){
  'use server'
  let i=0;
  const CarouselItem = Children.map(children,(child) => {
    i++;
    return (
    <div className={i==1?"carousel-item active":"carousel-item"}>
      {child}
    </div>
  )});
  return (<div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img className="d-block w-100" src="..." alt="First slide" />
      </div>
      <div className="carousel-item">
        <img className="d-block w-100" src="..." alt="Second slide" />
      </div>
      <div className="carousel-item">
        <img className="d-block w-100" src="..." alt="Third slide" />
      </div>
    </div>
  </div>)
}