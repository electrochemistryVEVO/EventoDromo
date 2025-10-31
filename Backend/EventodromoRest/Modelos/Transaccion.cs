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
}
