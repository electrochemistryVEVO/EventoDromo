namespace EventodromoRest.Modelos
{
    public class Administrador
    {
        public int? id { get; set; }
        public string? nombres { get; set; }
        public string? apellidos { get; set; }
        public string? email { get; set; }
        public string? passwordHash { get; set; }
        public DateTime? fechaCreacion { get; set; }
    }
}