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
        public string imagenURL { get; set; }  // 👈 viene directo del frontend
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
        public int Capacidad { get; set; } // Viene de la tabla Local
        public string FechaPublicacion { get; set; } // Formato ISO 8601
        public string FechaCompra { get; set; }    // Formato ISO 8601
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
}
