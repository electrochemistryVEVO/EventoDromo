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

    public class RequestObtenerCarritoPorIdCliente
    {
        public required int idCliente { get; set; }
    }

    public class ResponseObtenerCarritoPorIdCliente
    {
        public int idCarrito { get; set; }
        public int idCliente { get; set; }
        public DateTime fechaCreacion { get; set; }
        public DateTime fechaExpiracion { get; set; }
        public List<EntradaxCarritoDTO> entradas { get; set; }
    }

}
