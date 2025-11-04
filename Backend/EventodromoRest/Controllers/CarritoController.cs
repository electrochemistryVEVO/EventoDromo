using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class CarritoController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarrito> ObtenerCarrito()
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).ObtenerCarrito(idCliente);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, null, JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarrito> AgregarItemAlCarrito([FromBody] RequestAgregarItemAlCarrito request)
        {
            try
            {
                ValidarBody(request);
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).AgregarItemAlCarrito(idCliente, request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
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

        [HttpDelete]
        [Route("/api/[controller]/[action]/{idEntrada:int}")]
        public GenericResponse<ResponseObtenerCarrito> EliminarItemDelCarrito([FromRoute] int idEntrada)
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new CarritoBO(globales, BD).EliminarItemDelCarrito(idCliente, idEntrada);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarrito>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(idEntrada), JsonSerializer.Serialize(response));
                return response;
            }
        }
    }
}
