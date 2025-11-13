namespace EventodromoRest.Modelos
{
    public class Transaccion
    {
        public int id { get; set; }
        public int idCarrito { get; set; }
        public Carrito carrito { get; set; }
        public DateTime fechaHoraCompra { get; set; }
        public string numeroTransaccion { get; set; }
        public string nombresCliente { get; set; }
        public string apellidosCliente { get; set; }
        public string emailCliente { get; set; }
        public string numeroDocumentoCliente { get; set; }
        public int idTipoDocumento { get; set; }
        public TipoDocumento tipoDocumento { get; set; }
        public decimal montoTotal { get; set; }
    }
    public class RequestTransferencia
    {
        public string email { get; set; }
        public List <int> entradas { get; set; }
    }

    public class RequestProcesarPago
    {
        public DatosTarjetaDTO DatosTarjeta { get; set; }
        public DatosFacturacionDTO DatosFacturacion { get; set; }
    }

    public class DatosTarjetaDTO
    {
        public string Numero { get; set; }
        public string NombreTitular { get; set; }
        public string Expiracion { get; set; } // Formato "MM / AA"
        public string Cvv { get; set; }
    }

    public class DatosFacturacionDTO
    {
        public string Email { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public int IdTipoDocumento { get; set; } 
        public string NumeroDocumento { get; set; }
    }

    public class ResponseProcesarPago
    {
        public int IdTransaccion { get; set; }
        public string NumeroTransaccion { get; set; }
        public DateTime FechaCompra { get; set; }
        public decimal MontoTotal { get; set; }
    }

    public class PrecioEntradaDTO
    {
        public int IdEntrada { get; set; }
        public decimal Precio { get; set; }
        public int Puntos { get; set; }
    }

    public class RequestProcesarPagoPuntos
    {
        // Reutilizamos el DTO que ya existe
        public DatosFacturacionDTO DatosFacturacion { get; set; }

        // La cantidad de puntos que el frontend calculó
        public int PuntosAGastar { get; set; }
    }
}
