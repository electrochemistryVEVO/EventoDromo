namespace EventodromoRest.Modelos
{
    public class LineaTransaccion
    {
        public int? id { get; set; }
        public int? idTransaccion { get; set; }
        public Transaccion? transaccion { get; set; }
        public int? idEntrada { get; set; }
        public Entrada? entrada { get; set; }
        public decimal? precio { get; set; }
        public int? puntosGanados { get; set; }
    }
}