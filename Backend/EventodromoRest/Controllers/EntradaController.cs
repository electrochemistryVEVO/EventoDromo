using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios; // <-- 
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class EntradaController(Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService; 

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<TicketInfo>> ListarMisEntradas([FromQuery] string numeroTransaccion)
        {
            try
            {
                int idCliente = _obtenerIdClienteDesdeToken();

                var entradaBO = new EntradaBO(globales, BD);
                return entradaBO.ListarTipoEntradasPorTransaccion(idCliente, numeroTransaccion);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<TicketInfo>>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(numeroTransaccion), JsonSerializer.Serialize(response));
                return response;
            }
        }
        private int _obtenerIdClienteDesdeToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                throw new Exception("Token no proporcionado o invalido.");
            }

            var token = authHeader.Substring("Bearer ".Length);
            int? idCliente = tokenService.ObtenerIdDesdeToken(token);

            if (idCliente == null)
            {
                throw new Exception("Token invalido o expirado.");
            }
            return idCliente.Value;
        }
    }
}