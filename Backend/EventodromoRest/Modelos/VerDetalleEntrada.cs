namespace EventodromoRest.Modelos
{
    public class VerDetalleEntrada
    {
        // Datos del evento
        public string? ImagenEventoURL { get; set; } // La URL de la imagen
        public string NombreEvento { get; set; }
        public string FechaEvento { get; set; }
        public string HoraEvento { get; set; }
        public string Ubicacion { get; set; }

        // Datos de la transacción
        public string FechaCompra { get; set; }
        public string HoraCompra { get; set; }
        public string NumeroTransaccion { get; set; }

        // Datos del cliente
        public string NombreCliente { get; set; }
        public string CorreoCliente { get; set; }
        public string TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; }

        // Datos de la compra
        public List<EntradaDetalle> Entradas { get; set; }

        // Datos del pago
        public string MetodoPago { get; set; }
        public string NumeroTarjeta { get; set; }
        public decimal Subtotal { get; set; }
        public decimal? MontoDescuento { get; set; }
        public string? CodigoDescuento { get; set; }
        public decimal Total { get; set; }
    }

    public class EntradaDetalle
    {
        public string Tipo { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
    }
}
