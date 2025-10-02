using EventodromoRest.Modelos;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ClienteController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<Cliente> AutenticarCliente([FromBody] RequestAutenticarCliente request)
        {
            try
            {
                ValidarBody(request);
                Cliente clienteResponse = new ClienteBO(globales, BD).AutenticarCliente(request);
                if (clienteResponse == null)
                {
                    return new GenericResponse<Cliente> 
                    {
                        Success = false,
                        Message = "Credenciales invalidas",
                        Error = null,
                        Data = null
                    };
                }
                return new GenericResponse<Cliente>
                {
                    Success = true,
                    Message = "Credenciales validas",
                    Error = null,
                    Data = clienteResponse
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Cliente>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}
