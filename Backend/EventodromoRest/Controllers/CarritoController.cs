using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CarritoController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarritoEventos> ObtenerCarritoEventos([FromBody] RequestObtenerCarrito request)
        {
            try
            {
                ValidarBody(request);
                return new CarritoBO(globales, BD).ObtenerCarritoEventos(request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarritoEventos>
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

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerCarritoEntradas> ObtenerCarritoEntradas([FromBody] RequestObtenerCarrito request)
        {
            try
            {
                ValidarBody(request);
                return new CarritoBO(globales, BD).ObtenerCarritoEntradas(request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerCarritoEntradas>
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
