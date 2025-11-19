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
        public int totalPuntos { get; set; }
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

        public string? numeroDocumento { get; set; }
        public string? telefono { get; set; }

        // Coincidencia exacta: idciudad
        public int idciudad { get; set; }

        public DateTime? fechaNacimiento { get; set; }
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

    public class DatosPersonalesDTO
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string TipoDoc { get; set; } // El nombre del Tipo de Documento, ej: "DNI"
        public string NumDoc { get; set; }
        public string Pais { get; set; }    // El nombre del País, ej: "Perú"
        public string Ciudad { get; set; }  // El nombre de la Ciudad, ej: "Callao"
    }

    // ==================== DTOs PARA AUDITORÍAS ====================
    
    /// <summary>
    /// DTO para la lista de clientes en la página de auditoría
    /// </summary>
    public class ClienteAuditoriaDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string FechaCreacion { get; set; }
        public string UltimaEdicion { get; set; }
        public UltimaSesionDTO UltimaSesion { get; set; }
        public ActividadDTO Actividad { get; set; }
        public TransferenciasDTO Transferencias { get; set; }
    }

    public class UltimaSesionDTO
    {
        public string Fecha { get; set; }
        public string Hora { get; set; }
    }

    public class ActividadDTO
    {
        public int Compras { get; set; }
        public string Total { get; set; }
        public string PuntosUsados { get; set; }
    }

    public class TransferenciasDTO
    {
        public int Enviadas { get; set; }
        public int Recibidas { get; set; }
    }

    /// <summary>
    /// Response para el endpoint ObtenerClientes
    /// </summary>
    public class ResponseObtenerClientes
    {
        public List<ClienteAuditoriaDTO> Clientes { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int TotalClientes { get; set; }
    }

    /// <summary>
    /// DTO para el detalle completo de un cliente en auditoría
    /// </summary>
    public class ClienteDetalleDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; }
        public string Telefono { get; set; }
        public int Puntos { get; set; }
        public ResumenClienteDTO Resumen { get; set; }
        public List<ActividadHistorialDTO> HistorialActividades { get; set; }
        
        // Propiedades para paginación del historial
        public int TotalPaginasHistorial { get; set; }
        public int PaginaActualHistorial { get; set; }
        public int TotalActividades { get; set; }
    }

    public class ResumenClienteDTO
    {
        public int ComprasTotales { get; set; }
        public string GastoTotal { get; set; }
        public int Transferencias { get; set; }
        public int PuntosUsados { get; set; }
    }

    public class ActividadHistorialDTO
    {
        public int Id { get; set; }
        public string Tipo { get; set; }
        public string Icono { get; set; }
        public string Etiqueta { get; set; }
        public string? Monto { get; set; }
        public string? PuntosUsados { get; set; }
        public string Descripcion { get; set; }
        public string Fecha { get; set; }
        public string Hora { get; set; }
    }

}
