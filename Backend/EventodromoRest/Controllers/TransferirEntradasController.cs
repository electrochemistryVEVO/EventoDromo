using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class TransferirEntradasController(Globales.Globales globales, DBManager.DBManager BD, IConfiguration configuration) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly IConfiguration _configuration = configuration;

        /// <summary>
        /// Obtiene los tipos de entrada disponibles para transferir de una transacción específica.
        /// GET /api/TransferirEntradas/ObtenerTiposEntrada?numeroTransaccion=ABC123&tituloEvento=Coldplay&fechaEvento=2025-12-15
        /// </summary>
        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<TipoEntradaDisponibleDTO>> ObtenerTiposEntrada(
            [FromQuery] string numeroTransaccion,
            [FromQuery] string tituloEvento,
            [FromQuery] string fechaEvento)
        {
            try
            {
                var bo = new TransferirEntradasBO(globales, BD, _configuration);
                return bo.ObtenerTiposEntradaDisponibles(numeroTransaccion, tituloEvento, fechaEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<TipoEntradaDisponibleDTO>>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                
                var request = new { numeroTransaccion, tituloEvento, fechaEvento };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                
                return response;
            }
        }

        /// <summary>
        /// Obtiene el estado de las entradas (disponibles/transferidas/pendientes) para una transacción y evento específico.
        /// GET /api/TransferirEntradas/ObtenerEstadoEntradas?numeroTransaccion=ABC123&idEvento=5
        /// </summary>
        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<EstadoEntradasDTO> ObtenerEstadoEntradas([FromQuery] string numeroTransaccion, [FromQuery] int? idEvento)
        {
            try
            {
                var bo = new TransferirEntradasBO(globales, BD, _configuration);
                return bo.ObtenerEstadoEntradas(numeroTransaccion, idEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<EstadoEntradasDTO>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                
                AgregarEntradaBitacora(e, numeroTransaccion, JsonSerializer.Serialize(response));
                
                return response;
            }
        }

        /// <summary>
        /// Transfiere entradas a otro usuario por correo electrónico.
        /// POST /api/TransferirEntradas/Transferir
        /// Body: { "emailDestino": "user@mail.com", "entradas": [...] }
        /// NOTA: En Fase 1 marca entradas como transferidas en BD. Envío de emails se implementará en Fase 2.
        /// </summary>
        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<TransferirEntradasResponse> Transferir([FromBody] TransferirEntradasRequest request)
        {
            try
            {
                var bo = new TransferirEntradasBO(globales, BD, _configuration);
                return bo.TransferirEntradas(request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<TransferirEntradasResponse>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                
                return response;
            }
        }

        /// <summary>
        /// Acepta o rechaza una transferencia de entradas pendiente.
        /// GET /api/TransferirEntradas/ResponderTransferencia?token={token}&accion=aceptar
        /// </summary>
        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<string> ResponderTransferencia([FromQuery] string token, [FromQuery] string accion)
        {
            try
            {
                var request = new ResponderTransferenciaRequest
                {
                    Token = token,
                    Accion = accion
                };

                var bo = new TransferirEntradasBO(globales, BD, _configuration);
                return bo.ResponderTransferencia(request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<string>
                {
                    Success = false,
                    Message = null,
                    Data = null,
                    Error = e.Message
                };
                
                var requestLog = new { token, accion };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(requestLog), JsonSerializer.Serialize(response));
                
                return response;
            }
        }
    }
}
