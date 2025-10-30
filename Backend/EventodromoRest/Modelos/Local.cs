namespace EventodromoRest.Modelos
{
    public class Local
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int idCiudad { get; set; }
        public Ciudad ciudad { get; set; }
        public string direccion { get; set; }
        public int capacidad { get; set; }
        public bool isDeleted { get; set; }
        public int idAdministrador { get; set; }
        public Administrador administrador { get; set; }
    }

    public class LocalCiudadImagenDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string ciudad { get; set; }
        public string imagen { get; set; }
    }

    public class LocalDTO
    {
        public string nombre { get; set; }
        public string ciudad { get; set; }
    }
}
