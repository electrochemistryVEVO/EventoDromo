namespace EventodromoRest.Modelos
{
    public class Ciudad
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int idPais { get; set; }
        public Pais pais { get; set; }
    }

    public class CiudadDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int idPais { get; set; }
    }

    public class ObtenerCiudadDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
    }
}