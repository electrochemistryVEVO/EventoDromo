using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class AdministradorBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<RegistrarAdminResponse> RegistrarAdministrador(RegistrarAdminRequest request)
        {
            try
            {
                // Validaciones básicas
                if (string.IsNullOrWhiteSpace(request.nombres) || 
                    string.IsNullOrWhiteSpace(request.apellidos) ||
                    string.IsNullOrWhiteSpace(request.email) ||
                    string.IsNullOrWhiteSpace(request.password))
                {
                    return new GenericResponse<RegistrarAdminResponse>
                    {
                        Success = false,
                        Message = "Todos los campos son requeridos",
                        Error = "Campos incompletos",
                        Data = null
                    };
                }

                // Validar formato de email
                if (!IsValidEmail(request.email))
                {
                    return new GenericResponse<RegistrarAdminResponse>
                    {
                        Success = false,
                        Message = "Formato de email inválido",
                        Error = "Email inválido",
                        Data = null
                    };
                }

                // Validar longitud de contraseña
                if (request.password.Length < 6)
                {
                    return new GenericResponse<RegistrarAdminResponse>
                    {
                        Success = false,
                        Message = "La contraseña debe tener al menos 6 caracteres",
                        Error = "Contraseña muy corta",
                        Data = null
                    };
                }

                var mapper = new AdministradorMapper(globales, DB);

                // Verificar si el email ya existe
                var adminExistente = mapper.ObtenerAdministradorPorEmail(request.email);
                if (adminExistente != null)
                {
                    return new GenericResponse<RegistrarAdminResponse>
                    {
                        Success = false,
                        Message = "El email ya está registrado",
                        Error = "Email duplicado",
                        Data = null
                    };
                }

                // Crear el administrador (sin hashear la contraseña)
                var nuevoAdmin = new Administrador
                {
                    nombres = request.nombres.Trim(),
                    apellidos = request.apellidos.Trim(),
                    email = request.email.Trim().ToLower(),
                    passwordHash = request.password,
                    fechaCreacion = DateTime.Now
                };

                int nuevoId = mapper.InsertarAdministrador(nuevoAdmin);

                if (nuevoId > 0)
                {
                    return new GenericResponse<RegistrarAdminResponse>
                    {
                        Success = true,
                        Message = "Administrador creado exitosamente",
                        Error = null,
                        Data = new RegistrarAdminResponse
                        {
                            id = nuevoId,
                            nombres = nuevoAdmin.nombres,
                            apellidos = nuevoAdmin.apellidos,
                            email = nuevoAdmin.email
                        }
                    };
                }
                else
                {
                    return new GenericResponse<RegistrarAdminResponse>
                    {
                        Success = false,
                        Message = "Error al crear el administrador",
                        Error = "No se pudo insertar en la base de datos",
                        Data = null
                    };
                }
            }
            catch (Exception ex)
            {
                return new GenericResponse<RegistrarAdminResponse>
                {
                    Success = false,
                    Message = "Error al registrar administrador",
                    Error = ex.Message,
                    Data = null
                };
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public FetchUserDataResponse ObtenerNombrePorId(int idAdmin)
        {
            var mapper = new AdministradorMapper(globales, DB);
            Administrador administrador = mapper.ObtenerAdministradorPorId(idAdmin);
            if (administrador != null)
            {
                return new FetchUserDataResponse
                {
                    status = "success",
                    message = "Admin encontrado.",
                    name = $"{administrador.nombres} {administrador.apellidos}"
                };
            }
            else
            {
                return new FetchUserDataResponse
                {
                    status = "error",
                    message = "Admin no encontrado.",
                    name = null
                };
            }
        }

        public GenericResponse<MetricasDashboardDTO> ObtenerIndicadoresDashboard(int idAdmin)
        {
            var mapper = new AdministradorMapper(globales, DB);
            var metricas = mapper.ObtenerMetricasDashboard();

            return new GenericResponse<MetricasDashboardDTO>
            {
                Success = true,
                Message = "Indicadores obtenidos correctamente.",
                Error = null,
                Data = metricas
            };

        }

        public GenericResponse<List<EventoMasVendidoDTO>> ObtenerEventosMasVendidos()
        {
            var mapper = new AdministradorMapper(globales, DB);
            var eventos = mapper.ObtenerEventosMasVendidos();

            if (eventos == null || eventos.Count == 0)
            {
                return new GenericResponse<List<EventoMasVendidoDTO>>
                {
                    Success = true,
                    Message = "No se encontraron eventos vendidos.",
                    Error = null,
                    Data = new List<EventoMasVendidoDTO>()
                };
            }

            return new GenericResponse<List<EventoMasVendidoDTO>>
            {
                Success = true,
                Message = "Eventos más vendidos obtenidos correctamente.",
                Error = null,
                Data = eventos
            };
        }
    }
}
