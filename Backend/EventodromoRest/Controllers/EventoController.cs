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

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<Evento>> ListarEventosPorBusqueda([FromBody] RequestListarEventosPorBusqueda request)
        {
            try
            {
                Debug.WriteLine(request.busqueda);
                ValidarBody(request);
                return new EventoBO(globales, BD).ListarEventosPorBusqueda(request.busqueda);
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

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<Evento> ObtenerEventoPorId([FromBody] RequestObtenerEventoPorId request)
        {
            try
            {
                Debug.WriteLine(request.idEvento);
                ValidarBody(request);
                return new EventoBO(globales, BD).ObtenerEventoPorId(request.idEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Evento>
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
        public GenericResponse<ResponseListarEventosYLocales> ListarFiltradosConLocales()
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
                return response;
            }
        }
    }
}
