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
    public class LocalController (Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<getLocalesResponse>> GetLocales()
        {
            try
            {
                // 1️⃣ Leer el token de la cabecera
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<List<getLocalesResponse>>
                    {
                        Success = false,
                        Message = "Token no proporcionado o inválido.",
                        Error = null,
                        Data = null
                    };
                }

                // 2️⃣ Extraer el token y obtener el ID del admin
                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);

                if (idAdmin == null)
                {
                    return new GenericResponse<List<getLocalesResponse>>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = null,
                        Data = null
                    };
                }

                // 2️⃣ Obtener los locales desde la capa de negocio
                var locales = new LocalBO(globales, BD).ListarLocales2();

                if (locales == null || locales.Count == 0)
                {
                    return new GenericResponse<List<getLocalesResponse>>
                    {
                        Success = false,
                        Message = "No se encontraron locales.",
                        Error = null,
                        Data = null
                    };
                }

                // 3️⃣ Mapear solo los campos requeridos al DTO
                var data = locales
                    .Where(l => !l.isDeleted)
                    .Select(l => new getLocalesResponse
                    {
                        id = l.id,
                        nombre = l.nombre,
                        capacidad = l.capacidad
                    })
                    .ToList();

                // 4️⃣ Respuesta exitosa
                return new GenericResponse<List<getLocalesResponse>>
                {
                    Success = true,
                    Message = "Lista de locales obtenida correctamente.",
                    Error = null,
                    Data = data
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<getLocalesResponse>>
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
