namespace EventodromoRest.Modelos.Utiles
{
    public class DetalleEntradaEmail
    {
        public string NombreEvento { get; set; } = "";
        public string TipoEntrada { get; set; } = "";
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}
