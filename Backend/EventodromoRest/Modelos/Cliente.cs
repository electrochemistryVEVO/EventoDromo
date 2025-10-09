namespace EventodromoRest.Modelos
{
    public class Cliente
    {
        public int? id { get; set; }
        public string? nombres { get; set; }
        public string? apellidos { get; set; }
        public string? email { get; set; }
        public string? passwordhash { get; set; }
        public DateTime? fechanacimiento { get; set; }
        public int? idsexo { get; set; }
        public Sexo? sexo { get; set; }
        public int? idtipodocumento { get; set; }
        public TipoDocumento? tipodocumento { get; set; }
        public string? numerodocumento { get; set; }
        public string? telefono { get; set; }
        public int? idciudad { get; set; }
        public Ciudad? ciudad { get; set; }
        public bool? politicadeprivacidad { get; set; }
        public bool? enviodepublicidad { get; set; }
        public DateTime? fechacreacion { get; set; }
        public DateTime? fechaultimaedicion { get; set; }
        public DateTime? fechaultimasession { get; set; }
    }

    public class RequestAutenticarCliente
    {
        public required string Correo { get; set; }
        public required string Password { get; set; }
    }

    public class LoginResponse
    {
        public required bool success { get; set; }
        public required char rol { get; set; }
    }

    public class signUpResponse
    {
        public required bool success { get; set; }
    }

}
