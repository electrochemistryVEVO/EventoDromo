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

                // 2️⃣ Extraer el token y obtener el ID del cliente
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



    }
}
