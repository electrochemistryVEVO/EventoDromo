namespace EventodromoRest.Modelos
{
    public class Usuario
    {
        public string? Correo { get; set; }
        public string? Contrasena { get; set; }
        public string? Rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? DNI { get; set; }
        public string? Telefono { get; set; }
        public string? Estado { get; set; }
        public DateTime FechaUltModif { get; set; }
        public string? UsuarioUltModif { get; set; }
    }

    public class RequestAutenticarUsuario
    {
        public string? Correo { get; set; }
        public string? Contrasena { get; set; }
    }

    public class ResponseAutenticarUsuario
    {
        public int Codigo { get; set; }
        public string? Mensaje { get; set; }
        public string? NombreUsuario { get; set; }
        public bool UsuarioValido { get; set; }
    }

    public class RequestInsertarUsuario
    {
        public required string Correo { get; set; }
        public required string Contrasena { get; set; }
        public required string Nombre { get; set; }
        public required string Apellido { get; set; }
        public required string DNI { get; set; }
        public required string Telefono { get; set; }
    }

    public class ResponseBool
    {
        public int Codigo { get; set; }
        public string? Mensaje { get; set; }
        public bool Resultado { get; set; }
    }
}
