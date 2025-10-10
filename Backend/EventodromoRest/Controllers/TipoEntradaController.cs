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
    public class TipoEntradaController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales; 

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<TipoEntrada>> ListarTipoEntradaPorFechaEvento([FromBody] RequestListarTipoEntradaPorFechaEvento request)
        {
            try
            { 
                ValidarBody(request); 
                return new TipoEntradaBO(globales, BD).ListarTipoEntradaPorFechaEvento(request.idFechaEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<TipoEntrada>>
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
