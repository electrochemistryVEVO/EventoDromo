namespace EventodromoRest.Dominio
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

    public class RequestUsuario
    {
        public string? Correo { get; set; }
        public string? Contrasena { get; set; }
    }

    public class ResponseAutenticacion
    {
        public int Codigo { get; set; }
        public string? Mensaje { get; set; }
        public string? NombreUsuario { get; set; }
        public bool UsuarioValido { get; set; }
    }
}
