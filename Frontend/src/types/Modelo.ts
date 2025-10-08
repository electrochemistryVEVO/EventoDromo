export type Cliente = {
  id?: number;
  nombres?: string;
  apellidos?: string;
  email?: string;
  passwordhash?: string;
  fechanacimiento?: string; // Date en C#, string ISO en TS
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

export type Ciudad = {
  id?: number;
  nombre?: string;
  idPais?: number;
  pais?: Pais;
};

export type Pais = {
  id?: number;
  nombre?: string;
};
