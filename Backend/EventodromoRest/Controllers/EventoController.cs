using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
<<<<<<< HEAD

namespace EventodromoRest.Controllers
{
    public class EventoController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<Evento>> ListarEventos()
        {
            try
            {
                return new EventoBO(globales, BD).ListarEventos();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<Modelos.Evento>>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, "Admin request", JsonSerializer.Serialize(response));
=======
using System.Diagnostics;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class EventoController (Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales; 

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<Evento>> ListarEventosPorTipo([FromBody] RequestListarEventosPorTipo request)
        {
            try
            {
                Debug.WriteLine(request.idTipoEvento);
                ValidarBody(request); 
                return new EventoBO(globales, BD).ListarEventosPorTipo(request.idTipoEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<Evento>>
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

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseListarEventosYLocales> ListarEventosYLocales()
        {
            try
            {
                return new EventoBO(globales, BD).ListarEventosYLocales();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseListarEventosYLocales>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
>>>>>>> origin/grupo3
                return response;
            }
        }
    }
}
