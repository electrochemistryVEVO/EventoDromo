export type Evento = {
  id: number;
  nombre: string;
  nombreLocal: string;
  ciudad: string;
  categoria: string;
  fecha: string; // La fecha viene como string desde el JSON
  imagen: string; // La propiedad de la imagen se llama 'imagen'
}