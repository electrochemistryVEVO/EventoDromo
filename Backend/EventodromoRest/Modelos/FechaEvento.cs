namespace EventodromoRest.Modelos
{
    public class FechaEvento
    {
        public int? id { get; set; }
        public DateTime? fechaHora { get; set; }
        public int idEvento { get; set; }
        public Evento? Evento { get; set; }
    }
    public class RequestListarFechaEventoPorEvento
    {
        public required int idEvento { get; set; } 
    }
}
