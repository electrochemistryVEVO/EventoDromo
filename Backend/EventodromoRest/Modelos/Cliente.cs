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
        public string? token { get; set; } // Token JWT
        public int idCliente { get; set; } // ID del cliente autenticado
        public string? token { get; set; } // Token JWT
        public int idCliente { get; set; } // ID del cliente autenticado
    }

    public class RequestSignUpCliente
    {
        public string? nombres { get; set; }
        public string? apellidos { get; set; }
        public string? email { get; set; }
        public string? password { get; set; }

        // Coincidencia exacta con el frontend: idsexo (camelCase y minúscula en 'id')
        public int idsexo { get; set; }

        // Coincidencia exacta: idtipoDocumento
        public int idtipoDocumento { get; set; }


        // Coincidencia exacta con el frontend: idsexo (camelCase y minúscula en 'id')
        public int idsexo { get; set; }

        // Coincidencia exacta: idtipoDocumento
        public int idtipoDocumento { get; set; }

        public string? numeroDocumento { get; set; }
        public string? telefono { get; set; }

        // Coincidencia exacta: idciudad
        public int idciudad { get; set; }


        // Coincidencia exacta: idciudad
        public int idciudad { get; set; }

        public DateTime? fechaNacimiento { get; set; }
        public bool politicaDePrivacidad { get; set; } // Nota: Ya estaba en camelCase/PascalCase
        public bool envioDePublicidad { get; set; }     // Nota: Ya estaba en camelCase/PascalCase
        public bool politicaDePrivacidad { get; set; } // Nota: Ya estaba en camelCase/PascalCase
        public bool envioDePublicidad { get; set; }     // Nota: Ya estaba en camelCase/PascalCase
    }

    public class SignUpResponse
    {
        public required bool success { get; set; }
    }

    public class DatosCliente
    {
        public int? id { get; set; }
        public string? nombres { get; set; }
        public string? apellidos { get; set; }
        public string? email { get; set; }
        public int? idciudad { get; set; }
        public int? idsexo { get; set; }
        public string? telefono { get; set; }
        public string? fechanacimiento { get; set; }
    }

    //Para la pagina de informacion personal del cliente
    public class InformacionPersonal
    {
        public DatosCliente? datosCliente { get; set; }
        public List<Pais>? paises { get; set; }
        public List<CiudadDTO>? ciudades { get; set; }
        public List<Sexo>? sexos { get; set; }
    }

    public class DatosSignUp
    {
        public List<Sexo> sexos { get; set; } = new();
        public List<TipoDocumento> tiposDocumento { get; set; } = new();
        public List<Pais> paises { get; set; } = new();
        public List<Ciudad> ciudades { get; set; } = new();

    }

    public class VerificarCorreoResponse
    {
        public required bool exists { get; set; }
    }

    public class RequestVerificarContrasenaRecuperar
    {
        public required string currentPassword { get; set; }
    }

    public class VerificarContrasenaRecuperarResponse
    {
        public required string status { get; set; }
        public required string message { get; set; }
    }

    public class RequestActualizarContrasena
    {
        public required string newPassword { get; set; }
    }

    public class ActualizarContrasenaResponse
    {
        public required string status { get; set; }
        public required string message { get; set; }
    }

    public class FetchUserDataResponse
    {
        public string status { get; set; } = "";
        public string message { get; set; } = "";
        public string? name { get; set; }
    }


}
