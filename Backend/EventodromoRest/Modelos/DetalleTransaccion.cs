namespace EventodromoRest.Modelos
{
    /// <summary>
    /// Modelo completo para mostrar el detalle de una transacción
    /// Incluye información del evento, transacción, cliente, entradas y método de pago
    /// </summary>
    public class DetalleTransaccionCompleto
    {
        public EventoTransaccionDTO Evento { get; set; }
        public TransaccionDetalleDTO Transaccion { get; set; }
        public ClienteTransaccionDTO Cliente { get; set; }
        public List<EntradaTransaccionDTO> Entradas { get; set; }
        public MetodoPagoDTO MetodoPago { get; set; }
        public decimal Total { get; set; }
    }

    public class EventoTransaccionDTO
    {
        public string Titulo { get; set; }
        public string Imagen { get; set; }
        public string Ubicacion { get; set; }
        public DateTime Fecha { get; set; }
    }

    public class TransaccionDetalleDTO
    {
        public string NumeroTransaccion { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; }
    }

    public class ClienteTransaccionDTO
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; }
    }

    public class EntradaTransaccionDTO
    {
        public string TipoEntrada { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public string Estado { get; set; } // "disponible", "transferida", "pendiente"
    }

    public class MetodoPagoDTO
    {
        public string Tipo { get; set; } // "tarjeta", "puntos", "transferencia", "transferencia_pendiente"
        public DetallesPagoDTO Detalles { get; set; }
    }

    public class DetallesPagoDTO
    {
        public string? Ultimos4Digitos { get; set; } // Para tarjeta
        public int? PuntosUtilizados { get; set; } // Para puntos
        public string? EmailDestino { get; set; } // Para transferencia pendiente
    }
}
