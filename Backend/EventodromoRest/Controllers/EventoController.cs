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
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]/{id}")]
        public GenericResponse<Evento> ObtenerEventoPorId([FromRoute] int id)
        {
            try
            {
                if (id <= 0)
                {
                    throw new ArgumentException("El ID del evento debe ser un valor positivo.");
                }
                return new EventoBO(globales, BD).ObtenerEventoPorId(id);
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
                AgregarEntradaBitacora(e, $"id: {id}", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/Buscar")] 
        public GenericResponse<IEnumerable<Evento>> BuscarEventos([FromQuery] string termino)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(termino))
                {
                    return new GenericResponse<IEnumerable<Evento>>
                    {
                        Success = true,
                        Data = new List<Evento>(),
                        Message = "No se proporcionó un término de búsqueda."
                    };
                }

                return new EventoBO(globales, BD).ListarEventosPorBusqueda(termino);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<Evento>>
                {
                    Success = false,
                    Message = "Ocurrió un error al realizar la búsqueda.",
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, $"termino: {termino}", JsonSerializer.Serialize(response));
                return response;
            }
        }

    }
}
