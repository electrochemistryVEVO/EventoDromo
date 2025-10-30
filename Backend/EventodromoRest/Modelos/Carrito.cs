using Microsoft.Identity.Client;

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

    public class ObtenerCarritoDTO
    {
        public int idCarrito { get; set; }
        public EventoDTO eventoInfo { get; set; }
        public LocalDTO localInfo { get; set; }
        public FuncionDTO funcionInfo { get; set; }
        public EntradaDTO entrada { get; set; }
        public DateTime fechaExpiracion { get; set; }
    }

    public class RequestAgregarItemAlCarrito
    {
        public List<EntradaAgregarAlCarritoDTO> entradas { get; set; }
        public DateTime fechaExpiracion { get; set; }
    }

    public class ResponseObtenerCarrito
    {
        public int idCarrito { get; set; }
        public EventoDTO eventoInfo { get; set; }
        public LocalDTO localInfo { get; set; }
        public FuncionDTO funcionInfo { get; set; }
        public List<EntradaDTO> entradas { get; set; }
        public decimal totalCarrito { get; set; } = 0;
        public DateTime fechaExpiracion { get; set; }
    }
}
