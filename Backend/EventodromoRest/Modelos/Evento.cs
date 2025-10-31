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
}
