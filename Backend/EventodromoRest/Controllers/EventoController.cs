using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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
                return response;
            }
        }
    }
}
