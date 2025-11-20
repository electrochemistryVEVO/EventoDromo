namespace EventodromoRest.Modelos
{
    public class Entrada
    {
        public int id { get; set; }
        public int idCarrito { get; set; }
        public Carrito carrito { get; set; }
        public int idTipoEntrada { get; set; }
        public TipoEntrada tipoEntrada { get; set; }
    }

    public class EntradaxCarritoDTO
    {
        public int idTipoEntrada { get; set; }
        public string imagenURL { get; set; }
        public string nombreEvento { get; set; }
        public string nombreTipoEntrada { get; set; }
        public int cantidad { get; set; }
        public decimal precio { get; set; }
    }

    public class EntradaDTO
    {
        public int idEntrada { get; set; }
        public int idTipoEntrada { get; set; }
        public string nombreTipoEntrada { get; set; }
        public decimal precio { get; set; }
        public int limiteCompra { get; set; }
        public int puntos { get; set; }
    }

    public class EntradaAgregarAlCarritoDTO
    {
        public int idTipoEntrada { get; set; }
        public int cantidad { get; set; }
    }

    public class EntradaYHorarioDTO
    {
        public int idEntrada { get; set; }
        public string nombre { get; set; }
        public decimal precio { get; set; }
        public int cantidadEntradas { get; set; }
        public int limiteCompra { get; set; }
        public int puntos { get; set; }
        public HorarioDTO horario { get; set; }
    }

    // --- DTOs para Transferencia de Entradas ---
    public class TipoEntradaDisponibleDTO
    {
        public int idTipoEntrada { get; set; }
        public string? nombreTipo { get; set; }
        public int cantidadDisponible { get; set; }
    }

    public class TransferirEntradasRequest
    {
        public string? emailDestino { get; set; }
        public string? emailRemitente { get; set; }
        public string? nombreRemitente { get; set; }
        public List<EntradaATransferirDTO>? entradas { get; set; }
    }

    public class EntradaATransferirDTO
    {
        public string? numeroTransaccion { get; set; }
        public int idTipoEntrada { get; set; }
        public int cantidad { get; set; }
    }

    public class TransferirEntradasResponse
    {
        public string? emailDestino { get; set; }
        public int totalEntradas { get; set; }
    }

    public class EstadoEntradasDTO
    {
        public int Total { get; set; }
        public int Disponibles { get; set; }
        public int Transferidas { get; set; }
        public int Pendientes { get; set; }
    }

    // Modelo para transferencia pendiente
    public class TransferenciaPendiente
    {
        public int Id { get; set; }
        public string? Token { get; set; }
        public string? NumeroTransaccion { get; set; }
        public string? EmailRemitente { get; set; }
        public string? EmailDestino { get; set; }
        public int CantidadEntradas { get; set; }
        public string? DetalleEntradas { get; set; } // JSON con IDs de entradas
        public string? Estado { get; set; } // pendiente, aceptada, rechazada, expirada
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaExpiracion { get; set; }
        public DateTime? FechaRespuesta { get; set; }
    }

    // Request para aceptar/rechazar transferencia
    public class ResponderTransferenciaRequest
    {
        public string? Token { get; set; }
        public string? Accion { get; set; } // "aceptar" o "rechazar"
        public int? IdCliente { get; set; } // ID del cliente que acepta (opcional si no está logueado)
    }
}