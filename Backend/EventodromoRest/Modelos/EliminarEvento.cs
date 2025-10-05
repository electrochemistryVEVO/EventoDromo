namespace EventodromoRest.Modelos
{
    public class EliminarEvento
    {
        public int? id { get; set; }
        public int? idEvento { get; set; }
        public Evento? evento { get; set; }
        public DateTime? fechaEliminacion { get; set; }
        public DateTime? fechaEliminacionReal { get; set; }
    }
}