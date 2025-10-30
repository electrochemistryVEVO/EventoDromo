namespace EventodromoRest.Modelos
{
    public class Local
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int idCiudad { get; set; }
        public string imagenURL { get; set; }
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
        public int id_ciudad {  get; set; }
        public string nombre { get; set; }
        public string ciudad { get; set; }
        public string imagenURL { get; set; }
    }
}
