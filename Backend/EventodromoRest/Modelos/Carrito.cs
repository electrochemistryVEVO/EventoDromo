namespace EventodromoRest.Modelos
{
    public class Carrito
    {
        public int id { get; set; }
        public Cliente cliente { get; set; }
        public int idCliente { get; set; }
        public DateTime fechaCreacion { get; set; }
        public DateTime fechaExpiracion { get; set; }
    }

    public class RequestObtenerCarrito
    {
        public required int idCliente { get; set; }
    }

    public class ResponseObtenerCarritoEventos
    {
        public int idCarrito { get; set; }
        public int idCliente { get; set; }
        public DateTime fechaCreacion { get; set; }
        public DateTime fechaExpiracion { get; set; }
        public List<EventoxCarritoDTO> eventos { get; set; }
    }

    public class ResponseObtenerCarritoEntradas
    { 
        public List<EntradaxCarritoDTO> entradas { get; set; }
    }

}
