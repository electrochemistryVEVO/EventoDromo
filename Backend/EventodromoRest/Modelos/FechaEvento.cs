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

    public class ResponseFechaEvento
    {
        public int id { get; set; }
        public string fecha { get; set; }
        public string hora { get; set; }
        public List<ResponseTipoEntrada> tiposDeEntrada { get; set; }
    }

    public class FuncionDTO
    {
        public int id { get; set; }
        public DateTime fechaHora { get; set; }
    }

    public class HorarioDTO
    {
        public int id { get; set; }
        public string fecha { get; set; }
        public string hora { get; set; }
    }
} 
