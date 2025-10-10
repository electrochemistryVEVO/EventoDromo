using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class LineaTransaccionesController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<LineaTransaccion>> ListarLineasTransacciones()
        {
            try
            {
                return new LineaTransaccionBO(globales, BD).ListarLineaTransaccionesPorCliente();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<Modelos.LineaTransaccion>>
                {
                    Success = false,
                    Message = "Error interno del servidor.",
                    Data = null,
                    Error = e.Message
                };

                AgregarEntradaBitacora(e, "ListarTransacciones GET", JsonSerializer.Serialize(response));

                return response;
            }
        }
    }
}
