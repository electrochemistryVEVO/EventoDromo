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
        public EventoCarritoDTO eventoInfo { get; set; }
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
        public decimal subtotal { get; set; } = 0; // Subtotal sin descuento
        public decimal descuento { get; set; } = 0; // Monto del descuento aplicado
        public decimal totalCarrito { get; set; } = 0; // Total con descuento aplicado
        public DateTime fechaExpiracion { get; set; }
        public List<EventoCarritoDTO> eventos { get; set; }
        public PromocionCarritoDTO? promocionAplicada { get; set; } // Info de la promoción si hay alguna
    }

    public class PromocionCarritoDTO
    {
        public string codigo { get; set; }
        public string tipo { get; set; } // "PORCENTAJE" o "MONTO_FIJO"
        public decimal valor { get; set; }
        public decimal montoDescuento { get; set; }
    }

    public class RequestSincronizarCarrito
    {
        public List<EntradaAgregarAlCarritoDTO> entradas { get; set; }
    }

    // NUEVO: Modelo para un item rechazado
    public class RechazadoDTO
    {
        public int idTipoEntrada { get; set; }
        public string nombre { get; set; } // Nombre del tipo de entrada para mostrar al usuario
        public int cantidadSolicitada { get; set; }
        public int cantidadDisponible { get; set; }
    }

    // NUEVO: Modelo de respuesta para la sincronización, que incluye el carrito y los rechazados
    public class ResponseSincronizarCarrito
    {
        // El carrito final y validado
        public ResponseObtenerCarrito carrito { get; set; }
        // La lista de items que no se pudieron agregar
        public List<RechazadoDTO> rechazados { get; set; }
    }

    public class RequestEliminarTipoEntrada
    {
        public string CartItemId { get; set; }
        public int TipoEntradaId { get; set; }
        public int? IdFechaEvento { get; set; } // NUEVO: Para filtrar por fecha específica
    }
}
