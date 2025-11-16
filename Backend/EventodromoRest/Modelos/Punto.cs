namespace EventodromoRest.Modelos
{
    public class Punto
    {
        public int? id { get; set; }
        public int? cantidad { get; set; }
        public int? cantidadRestante { get; set; }
        public DateTime? fechahoraregistro { get; set; }
        public int? idcliente { get; set; }
        public Cliente? cliente { get; set; }
        public DateTime? fechaexpiracion { get; set; }
    }

    public class LotePunto
    {
        public int Id { get; set; }
        public int CantidadRestante { get; set; }
    }
}