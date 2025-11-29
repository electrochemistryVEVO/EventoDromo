using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios; // <-- 1. AÑADE ESTO (para TokenService)
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class EntradaEventoAuxiliarController(Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService; 

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<PaginacionResponse<EntradaEventoAuxiliar>> ListarMisEntradas([FromQuery] FiltroEntradasRequest filtros)
        {
            try
            {
                int idCliente = _obtenerIdClienteDesdeToken();
                
                var entradaBO = new EntradaBO(globales, BD);
                return entradaBO.ListarMisEntradasPaginado(idCliente, filtros);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<PaginacionResponse<EntradaEventoAuxiliar>>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(filtros), JsonSerializer.Serialize(response));
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
    }
}