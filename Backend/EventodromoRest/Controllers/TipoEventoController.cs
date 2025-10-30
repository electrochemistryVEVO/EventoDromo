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
    public class TipoEventoController (Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<TipoEvento>> GetTiposEvento()
        {
            try
            {
                // 1️⃣ Leer token de la cabecera
                var authHeader = Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    Response.StatusCode = 401;
                    return new GenericResponse<List<TipoEvento>>
                    {
                        Success = false,
                        Message = "Acceso no autorizado. Se requiere un token válido.",
                        Error = null,
                        Data = null
                    };
                }

                // 2️⃣ Validar token
                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);

                if (idAdmin == null)
                {
                    Response.StatusCode = 401;
                    return new GenericResponse<List<TipoEvento>>
                    {
                        Success = false,
                        Message = "Acceso no autorizado. Token inválido o expirado.",
                        Error = null,
                        Data = null
                    };
                }

                // 3️⃣ Obtener lista de tipos de evento
                var tipos = new TipoEventoBO(globales, BD).ListarTiposEvento();

                if (tipos == null || tipos.Count == 0)
                {
                    return new GenericResponse<List<TipoEvento>>
                    {
                        Success = false,
                        Message = "No se encontraron tipos de evento.",
                        Error = null,
                        Data = null
                    };
                }

                // 4️⃣ Éxito
                return new GenericResponse<List<TipoEvento>>
                {
                    Success = true,
                    Message = "Lista de tipos de evento obtenida correctamente.",
                    Error = null,
                    Data = tipos
                };
            }
            catch (Exception e)
            {
                Response.StatusCode = 500;
                var response = new GenericResponse<List<TipoEvento>>
                {
                    Success = false,
                    Message = "Ocurrió un error interno al procesar la solicitud.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, "SinBody", JsonSerializer.Serialize(response));
                return response;
            }
        }



    }
}
