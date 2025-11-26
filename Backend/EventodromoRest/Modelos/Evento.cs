namespace EventodromoRest.Modelos
{
    public class Evento
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public int idTipoEvento { get; set; }
        public TipoEvento TipoEvento { get; set; }
        public int idLocal { get; set; }
        public Local Local { get; set; }
        public int creadoPor { get; set; }
        public DateTime fechaPublicacion { get; set; }
        public DateTime fechaCompra { get; set; }
        public bool isDeleted { get; set; }
        public string? imagenURL { get; set; }
        public FechaEvento[]? fechasEvento {get; set;}
        public TipoEntrada[]? tiposEntrada { get; set; }
    }
    public class EventoxCarritoDTO
    {
        public int idEvento { get; set; }
        public string nombreEvento { get; set; }
        public string nombreLocal { get; set; }
        public int cantidadTotal { get; set; }
        public decimal? precioTotal { get; set; }
        public string imagenURL { get; set; }
    }

    public class RequestListarEventosPorTipo
    {
        public required int idTipoEvento { get; set; }
    }

    public class RequestListarEventosPorBusqueda
    {
        public required string busqueda { get; set; }
    }

    public class RequestObtenerEventoPorId
    {
        public required int idEvento { get; set; }
    }

    public class ResponseListarEventosYLocales
    {
        public List<EventosLocalCiudadCategoriaDTO> eventos { get; set; }
        public List<LocalCiudadImagenDTO> locales { get; set; }
    }

    public class EventoActivoProxFechaDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public int idTipoEvento { get; set; }
        public int idLocal { get; set; }
        public int creadoPor { get; set; }
        public DateTime fechaPublicacion { get; set; }
        public DateTime fechaCompra { get; set; }
        public bool isDeleted { get; set; }
        public string imagenURL { get; set; }
        public DateTime fechaProximoEvento { get; set; }
    }

    public class EventosLocalCiudadCategoriaDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string nombreLocal { get; set; }
        public string ciudad { get; set; }
        public string categoria { get; set; }
        public string fecha { get; set; }
        public double precio { get; set; }
        public string imagen { get; set; }
    }

    public class EventoCarritoDTO
    {
        public int idEvento { get; set; }
        public string nombreEvento { get; set; }
        public string imagenURL { get; set; }
        public decimal totalEvento { get; set; } = 0;
        public LocalDTO localInfo { get; set; }
        public FuncionDTO funcionInfo { get; set; }
        public List<EntradaDTO> entradas { get; set; }
    }
    public class ResponseObtenerEventoPorId
    {
        public ResponseEvento evento { get; set; }
        public ResponseLocal local { get; set; }
        public List<ResponseFechaEvento> funciones { get; set; }
    }

    public class ResponseEvento
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public string imagenUrl { get; set; }
        public TipoEvento tipoEvento { get; set; }
    }

    public class EventoDTO
    {
        public int id { get; set; }
        public string nombreEvento { get; set; }
        public string imagenURL { get; set; }
    }

    public class CrearEventoResponse
    {
        public bool success {get; set; }
    }

    public class CrearEventoRequest
    {
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public int localId { get; set; }
        public int tipoEventoId { get; set; }
        public int capacidad { get; set; }
        public string fechaPublicacion { get; set; }
        public string fechaCompra { get; set; }
        public string imagenURL { get; set; }
        public List<string> horarios { get; set; }
        public List<EntradaRequest> entradas { get; set; }
    }

    public class EntradaRequest
    {
        public string nombre { get; set; }
        public decimal precio { get; set; }
        public int cantidad { get; set; }
        public int limiteCompra { get; set; }
        public int puntos { get; set; }
    }

    public class EventoDetalleDTO
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string ImagenURL { get; set; }
        public int LocalId { get; set; }
        public int TipoEventoId { get; set; }
        public int Capacidad { get; set; } 
        public string FechaPublicacion { get; set; }
        public string FechaCompra { get; set; }
        public List<EventoDatosHorarioDTO> Horarios { get; set; }
        public List<EventoDatosEntradaDTO> Entradas { get; set; }
    }

    
    public class EventoDatosHorarioDTO
    {
        public int Id { get; set; }
        public string Fecha { get; set; } 
        public string Hora { get; set; }  
    }

    
    public class EventoDatosEntradaDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int Cantidad { get; set; } 
        public int LimiteCompra { get; set; }
        public int Puntos { get; set; }
    }

    public class ResponseEventoGetEvents
    {
        public List<ResponseEventoGetEventsEventos> Data { get; set; }           // ← lista de eventos simplificados
        public Pagination Pagination { get; set; }          // ← bloque de paginación
    }

    public class Pagination
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalEvents { get; set; }
    }

    public class ResponseEventoGetEventsEventos
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Local { get; set; }
        public string Tipo { get; set; }
        public DateTime FechaPublicacion { get; set; }
        public DateTime FechaCompra { get; set; }

        public List<EventoHorarioDTO> Horarios { get; set; } // ← NUEVO

        public decimal IngresosBrutos { get; set; }

        public string Estado { get; set; }
    }


    public class EventoHorarioDTO
    {
        public DateTime Horario { get; set; }
        public OcupacionDTO Ocupacion { get; set; }
    }

    public class OcupacionDTO
    {
        public int Actual { get; set; }
        public int Total { get; set; }
    }

    public class ActualizarEventoRequest
    {
        public int idEvento { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public string imagenURL { get; set; }
        public int localId { get; set; }
        public int tipoEventoId { get; set; }
        public int capacidad { get; set; }
        public DateTime fechaPublicacion { get; set; }
        public DateTime fechaCompra { get; set; }
        public List<HorarioDTO> horarios { get; set; }
        public List<EntradaYHorarioDTO> entradas { get; set; }
    }

    public class ResponseEventoGetEventosMasVendidos
    {
        public string id { get; set; }
        public string nombre { get; set; }
        public string ubicacion { get; set; }
        public decimal precio { get; set; }
        public int entradasVendidas { get; set; }
    }

    public class EventoMasVendidoDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string ubicacion { get; set; }
        public decimal precio { get; set; }
        public int entradasVendidas { get; set; }
    }

    // --- PEGA ESTO AL FINAL DE TU ARCHIVO Evento.cs (dentro del namespace) ---

    public class CrearEventoDTO
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int LocalId { get; set; }
        public int TipoEventoId { get; set; }
        public int Capacidad { get; set; }
        public string FechaPublicacion { get; set; }
        public string FechaCompra { get; set; }
        public string ImagenURL { get; set; }
        public List<string> Horarios { get; set; }
        public List<EntradaCreacionDTO> Entradas { get; set; }
        public List<DescuentoCreacionDTO> Descuentos { get; set; }
    }

    public class CrearEventoDTOFinal
    {
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public int localId { get; set; }
        public int tipoEventoId { get; set; }
        public int capacidad { get; set; }
        public string fechaPublicacion { get; set; } // ISO String
        public string fechaCompra { get; set; }      // ISO String
        public string imagenURL { get; set; }

        public List<string> horarios { get; set; }   // Lista de ISO Strings
        public List<EntradaCreacionDTO> entradas { get; set; }
        public List<DescuentoCreacionDTO> descuentos { get; set; }
    }

    public class EntradaCreacionDTO
    {
        // NO es el ID de la base de datos. (Campo opcional para lógica de descuentos en memoria)
        // Si el JSON del frontend NO lo envía, este será 0.
        public int idTemporal { get; set; }

        public string nombre { get; set; }
        public decimal precio { get; set; }
        public int cantidad { get; set; }
        public int limiteCompra { get; set; }
        public int puntos { get; set; }
    }

    public class DescuentoCreacionDTO
    {
        public string nombre { get; set; }
        public string codigo { get; set; }
        public string tipo { get; set; } // "Porcentaje" o "Fijo"
        public decimal valor { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }
        public int usosMaximos { get; set; }

        // Referencia al idTemporal de una entrada si se usa esa lógica
        public int tipoEntradaId { get; set; }
    }

    public class CrearEventoResponseDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
    }

    public class ActualizarEventoDTO
    {
        public int idEvento { get; set; } // Obligatorio para actualizar
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public string imagenURL { get; set; }
        public int localId { get; set; }
        public int tipoEventoId { get; set; }
        public int capacidad { get; set; }
        public string fechaPublicacion { get; set; } // ISO String
        public string fechaCompra { get; set; }      // ISO String

        // Listas anidadas con lógica de ID (0 = nuevo, >0 = existente)
        public List<HorarioUpdateDTO> horarios { get; set; }
        public List<EntradaUpdateDTO> entradas { get; set; }
        public List<DescuentoUpdateDTO> descuentos { get; set; }
    }

    public class HorarioUpdateDTO
    {
        public int id { get; set; } // 0 = Nuevo, >0 = Actualizar
        public string fecha { get; set; } // "YYYY-MM-DD"
        public string hora { get; set; }  // "HH:mm"
    }

    public class EntradaUpdateDTO
    {
        public int idEntrada { get; set; } // 0 = Nuevo, >0 = Actualizar
        public string nombre { get; set; }
        public decimal precio { get; set; }
        public int cantidadEntradas { get; set; }
        public int limiteCompra { get; set; }
        public int puntos { get; set; }

        // Objeto anidado para vincular con el horario
        public HorarioUpdateDTO horario { get; set; }
    }

    public class DescuentoUpdateDTO
    {
        public int id { get; set; } // 0 = Nuevo, >0 = Actualizar
        public string nombre { get; set; }
        public string codigo { get; set; }
        public string tipo { get; set; }
        public decimal valor { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }
        public int usosMaximos { get; set; }
        public int tipoEntradaId { get; set; } // FK hacia la entrada
    }

    public class ActualizarEventoResponseDTO
    {
        public int idEvento { get; set; }
        public string nombre { get; set; }
    }
}
