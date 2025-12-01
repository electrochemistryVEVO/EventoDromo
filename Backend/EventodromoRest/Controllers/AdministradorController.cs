//para token
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AdministradorController (Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        /// <summary>
        /// Registra un nuevo administrador en el sistema.
        /// POST /api/Administrador/Registrar
        /// </summary>
        [HttpPost]
        [Route("/api/[controller]/Registrar")]
        public GenericResponse<RegistrarAdminResponse> Registrar([FromBody] RegistrarAdminRequest request)
        {
            try
            {
                var administradorBO = new AdministradorBO(globales, BD);
                return administradorBO.RegistrarAdministrador(request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<RegistrarAdminResponse>
                {
                    Success = false,
                    Message = "Error al registrar administrador.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/FetchAdminData")]
        public GenericResponse<FetchUserDataResponse> FetchAdminData()
        {
            try
            {
                // 1️⃣ Leer el token de la cabecera
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<FetchUserDataResponse>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = null,
                        Data = new FetchUserDataResponse
                        {
                            status = "error",
                            message = "Token no proporcionado o inválido."
                        }
                    };
                }

                // 2️⃣ Extraer el token y obtener el ID del admin
                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);

                if (idAdmin == null)
                {
                    return new GenericResponse<FetchUserDataResponse>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = null,
                        Data = new FetchUserDataResponse
                        {
                            status = "error",
                            message = "Token inválido o expirado."
                        }
                    };
                }

                // 3️⃣ Consultar el nombre del cliente
                var response = new AdministradorBO(globales, BD).ObtenerNombrePorId(idAdmin.Value);

                if (response.status!="success")
                {
                    return new GenericResponse<FetchUserDataResponse>
                    {
                        Success = false,
                        Message = "No se pudo obtener la información del admin.",
                        Error = null,
                        Data = response
                    };
                }

                // 4️⃣ Éxito
                return new GenericResponse<FetchUserDataResponse>
                {
                    Success = true,
                    Message = "Admin encontrado.",
                    Error = null,
                    Data = response
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<FetchUserDataResponse>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, "SinBody", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/Indicadores")]
        //[Authorize]
        public GenericResponse<MetricasDashboardDTO> ObtenerIndicadores()
        {
            try
            {
                
                // 1️⃣ Leer el token de la cabecera
                var authHeader = Request.Headers["Authorization"].ToString();
                
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<MetricasDashboardDTO>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                // 2️⃣ Extraer el token y obtener el ID del admin
                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);

                if (idAdmin == null)
                {
                    return new GenericResponse<MetricasDashboardDTO>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }
                
                // 3️⃣ Obtener las métricas del dashboard
                var administradorBO = new AdministradorBO(globales, BD);
                //return administradorBO.ObtenerIndicadoresDashboard(10);
                return administradorBO.ObtenerIndicadoresDashboard(idAdmin.Value);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<MetricasDashboardDTO>
                {
                    Success = false,
                    Message = "Error al obtener los indicadores.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, "SinBody", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/EventosMasVendidos")]
        [Authorize]
        public GenericResponse<List<EventoMasVendidoDTO>> ObtenerEventosMasVendidos()
        {
            try
            {
                // 1️⃣ Leer el token de la cabecera
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<List<EventoMasVendidoDTO>>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                // 2️⃣ Extraer el token y obtener el ID del admin
                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);

                if (idAdmin == null)
                {
                    return new GenericResponse<List<EventoMasVendidoDTO>>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                // 3️⃣ Obtener los eventos más vendidos
                var administradorBO = new AdministradorBO(globales, BD);
                return administradorBO.ObtenerEventosMasVendidos();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<EventoMasVendidoDTO>>
                {
                    Success = false,
                    Message = "Error al obtener los eventos más vendidos.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, "SinBody", JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}
