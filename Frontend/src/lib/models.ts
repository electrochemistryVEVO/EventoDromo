export type Cliente = {
  id?: number;
  nombres?: string;
  apellidos?: string;
  email?: string;
  passwordhash?: string;
  fechanacimiento?: string;
  idsexo?: number;
  sexo?: Sexo;
  idtipodocumento?: number;
  tipodocumento?: TipoDocumento;
  numerodocumento?: string;
  telefono?: string;
  idciudad?: number;
  ciudad?: Ciudad;
  politicadeprivacidad?: boolean;
  enviodepublicidad?: boolean;
  fechacreacion?: string;
  fechaultimaedicion?: string;
  fechaultimasession?: string;
};

export type Sexo = {
  id?: number;
  nombre?: string;
};

export type TipoDocumento = {
  id?: number;
  nombre?: string;
};

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
  tipoEvento: TipoEvento;
  Local: Local;
}

export type TipoEvento = {
  id: number;
  nombre: string;
}

export type Local = {
  id: number;
  nombre: string;
  idCiudad: number;
  direccion: string;
  creadoPor: number;
  ciudad: Ciudad;
}

export type Ciudad = {
  id: number;
  nombre: string;
  idPais: number;
  pais: Pais;
}

export type Pais = {
  id: number;
  nombre: string;
}

export type Entrada = {
  id: number;
  idCarrito: number;
  idTipoEntrada: number;
  carrito: Carrito;
  tipoEntrada: TipoEntrada;
}

export type Carrito = {
  id: number;
  idCliente: number;
  cliente: Cliente;
  fechaExpiracion: string;
  fechacreacion: string;
}

export type TipoEntrada = {
  id: number;
  precio: number;
  limiteCompra: number;
  puntos: number;
  cantidadEntradas: number;
  cantidadVendida: number;
  idFechaEvento: number;
  FechaEvento: FechaEvento;
  nombre: string;
}

export type FechaEvento = {
  id: number;
  idEvento: number;
  fechaHora: string;
  evento: Evento;
}



