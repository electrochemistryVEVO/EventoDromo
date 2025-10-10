import image from "@/assets/pictures/festival-overpass-lima.png"

export const items = [
  { id: "1", imageUrl: image, title: "Overpass Lima", subtitle: "Super VIP", quantity: 1, price: 500 },
  { id: "2", imageUrl: image, title: "Overpass Lima", subtitle: "VIP", quantity: 1, price: 400 },
  { id: "3", imageUrl: image, title: "Overpass Lima", subtitle: "Exclusivo", quantity: 1, price: 300 },
];

export function cantidadEntradas() {
  return items.length;
}
