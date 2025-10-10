namespace EventodromoRest.Modelos
{
    public class Evento
    {
        public int id { get; set; }
        public string? nombre { get; set; }
        public string? descripcion { get; set; }
        public int? idTipoEvento { get; set; }
        public TipoEvento? TipoEvento { get; set; }
        public int idLocal { get; set; }
        public Local? Local { get; set; }
        public int? creadoPor { get; set; }
        public DateTime? fechaPublicacion { get; set; }
        public DateTime? fechaCompra { get; set; }
        public bool? isDeleted { get; set; }
        public string? imagenURL { get; set; }
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
}