using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Diagnostics;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class FechaEventoController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales; 

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<FechaEvento>> ListarFechaEventoPorEvento([FromBody] RequestListarFechaEventoPorEvento request)
        {
            try
            { 
                ValidarBody(request); 
                return new FechaEventoBO(globales, BD).ListarFechaEventoPorEvento(request.idEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<FechaEvento>>
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
