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
        public string? nombreCiudad { get; set; }
        public int? eventos { get; set; }
    }
    

    public class LocalCiudadImagenDTO
    {
        public int idLocal { get; set; }
        public string nombreLocal { get; set; }
        public int idCiudad { get; set; }
        public string imagenURL { get; set; }
        public string nombreCiudad { get; set; }
    }

    public class LocalDTO
    {
        public string nombre { get; set; }
        public string ciudad { get; set; }
    }

    public class ResponseLocal
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string direccion { get; set; }
        public Ciudad ciudad { get; set; }
        public string googleMapsEmbed { get; set; }
    }

    public class getLocalesResponse
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int capacidad { get; set; }
    }
    public class LocalInfo
    {
        public string Nombre { get; set; }
        public string Ciudad { get; set; }
    }

    public class CrearLocalDTO
    {

        public string Nombre { get; set; }


        public int CiudadId { get; set; }


        public string Direccion { get; set; }


        public int Capacidad { get; set; }


        public string? imagenURL { get; set; }
    }

    public class LocalModificarLocalRequest
    {
        public int idLocal { get; set; }
        public string Nombre { get; set; }
        public int CiudadId { get; set; }
        public string Direccion { get; set; }
        public int Capacidad { get; set; }
        public string? imagenURL { get; set; }
    }

    public class ResponseLocalModificarLocal
    {
        public bool success { get; set; }
    }


    public class OcupacionLocalDTO
    {
        public int idlocal { get; set; }
        public string nombreLocal { get; set; }
        public DateTime fecha { get; set; }
        public int TotalEntradas { get; set; }
        public int TotalVendidas { get; set; }
    }

    public class OcuapcionLocalResponse
    {
        public int idLocal { get; set; }
        public string nombreLocal { get; set; }
        public int diasOcupados { get; set; }
        public decimal tasaOcupacion { get; set; }
    }

    public class Feat_MetricDashB_ObtenerOcupacionLocales
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public int diasOcupados { get; set; }
        public decimal tasaOcupacion { get; set; }
    }
}
