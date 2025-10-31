namespace EventodromoRest.Modelos
{
    public class TipoEntrada
    {
        public int id { get; set; }
        public decimal precio { get; set; }
        public int? limiteCompra { get; set; }
        public int? puntos { get; set; }
        public string? nombre { get; set; }
        public int? cantidadEntradas { get; set; }
        public int? cantidadVendida { get; set; }
        public int idFechaEvento { get; set; }
        public FechaEvento? FechaEvento { get; set; }
    }
    public class RequestListarTipoEntradaPorFechaEvento
    {
        public required int idFechaEvento { get; set; }
    }

    public class ResponseTipoEntrada
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public double precio { get; set; }
        public int puntos { get; set; }
        public bool agotado { get; set; }
    }
}
