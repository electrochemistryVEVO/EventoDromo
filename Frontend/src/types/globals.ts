export type Evento = {
  id: number;
  nombre: string;
  descripcion: string;
  idTipoEvento: number;
  idLocal: number;
  creadoPor: number;
  fechaPublicacion: Date;
  fechaCompra: Date;
  isDeleted: number;
  imagenURL: string;
}