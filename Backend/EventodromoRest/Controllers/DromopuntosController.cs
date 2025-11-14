using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios; // 1. ASEGÚRATE DE IMPORTAR TokenService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class DromopuntosController(Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        [HttpGet]
        [Route("/api/[controller]/ObtenerResumen")]
        public GenericResponse<ResumenDromopuntosDTO> ObtenerResumen()
        {
            try
            {
                int idClienteFromToken = _obtenerIdClienteDesdeToken();

                var dromopuntosBO = new DromopuntosBO(globales, BD);

                return dromopuntosBO.ObtenerResumenCompleto(idClienteFromToken);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResumenDromopuntosDTO>
                {
                    Success = false,
                    Message = "Error al obtener el resumen de DromoPuntos.",
                    Data = null,
                    Error = e.Message
                };

                var requestLog = JsonSerializer.Serialize(new { AuthToken = "Bearer ..." }); 
                AgregarEntradaBitacora(e, requestLog, JsonSerializer.Serialize(response));
                return response;
            }
        }

        private int _obtenerIdClienteDesdeToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                throw new Exception("Token no proporcionado o inválido.");
            }

            var token = authHeader.Substring("Bearer ".Length);
            int? idCliente = tokenService.ObtenerIdDesdeToken(token);

            if (idCliente == null)
            {
                throw new Exception("Token inválido o expirado.");
            }
            return idCliente.Value;
        }

        [HttpPut]
        [Route("/api/[controller]/[action]/{nuevoValor:int}")]
        public GenericResponse<object> ActualizarValorDromoPuntos([FromRoute] int nuevoValor)
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de usuario inválido en el token.");
                }
                return new DromopuntosBO(globales, BD).ActualizarValorDromoPuntos(nuevoValor);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<object>
                {
                    Success = false,
                    Message = "El valor del DromoPunto debe ser un número mayor a cero.",
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, null, JsonSerializer.Serialize(response));
                return response;
            }
        }

    }
}