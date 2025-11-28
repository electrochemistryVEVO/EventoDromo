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
    public class TipoEntradaController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
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

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<DisponibilidadResponseDTO> ObtenerDisponibilidadPorTipoEntrada([FromBody] DisponibilidadRequestDTO request)
        {
            try
            {
                // 1. Validar entrada
                if (request == null || request.idTipoEntrada <= 0)
                {
                    return new GenericResponse<DisponibilidadResponseDTO>
                    {
                        Success = false,
                        Message = "El idTipoEntrada es obligatorio y debe ser válido.",
                        Error = "400 Bad Request"
                    };
                }

                // 2. Llamar al negocio
                var bo = new TipoEntradaBO(globales, BD);
                return bo.ObtenerDisponibilidadPorTipoEntrada(request.idTipoEntrada);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<DisponibilidadResponseDTO>
                {
                    Success = false,
                    Message = "Error fatal en el controlador.",
                    Error = e.Message
                };
                // (Opcional) Loggear error
                return response;
            }
        }
    }
}
