namespace EventodromoRest.Modelos
{
    public class Cliente
    {
        public int? ID { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Contrasena { get; set; }

    }

    public class RequestAutenticarCliente
    {
        public string? Correo { get; set; }
        public string? Contrasena { get; set; }
    }

}
