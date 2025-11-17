using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class VerDetalleEntradaController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<VerDetalleEntrada> ObtenerDetalleEntrada([FromBody] int idEntrada)
        {
            try
            {
                ValidarBody(idEntrada);
                // Llama al negocio (aún vacío)
                var detalle = new EntradaBO(globales, BD).ObtenerDetalleEntrada(idEntrada);
                return detalle;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<VerDetalleEntrada>
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