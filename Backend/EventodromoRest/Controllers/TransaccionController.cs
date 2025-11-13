using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    public class TransaccionController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        [Authorize]
        public GenericResponse<List<Transaccion>> ListarTransacciones()
        {
            try
            {
                return new TransaccionBO(globales, BD).ListarTransacciones();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<Modelos.Transaccion>>
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

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<bool> TransferirEntradas([FromBody] RequestTransferencia request)
        {
            try
            {
                ValidarBody(request);
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de cliente inválido en el token.");
                }
                return new TransaccionBO(globales, BD).TransferirEntradas(idCliente, request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<bool>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = false
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseProcesarPago> ProcesarPagoTarjeta([FromBody] RequestProcesarPago request)
        {
            try
            {
                ValidarBody(request);
                var idCliente = GetIdClienteFromToken(); // Helper para obtener el ID del JWT

                // Llamamos al Business Object (BO) que crearemos en el siguiente paso
                return new TransaccionBO(globales, BD).ProcesarPagoTarjeta(idCliente, request);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseProcesarPago> { Success = false, Error = e.Message };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseProcesarPago> ProcesarPagoPuntos([FromBody] RequestProcesarPagoPuntos request)
        {
            try
            {
                ValidarBody(request);
                var idCliente = GetIdClienteFromToken(); // Usamos el helper que ya existe

                // Llamamos al nuevo método del BO que crearemos en el siguiente paso
                return new TransaccionBO(globales, BD).ProcesarPagoPuntos(idCliente, request);
            }
            catch (Exception e)
            {
                // Devolvemos el mismo tipo de respuesta (ResponseProcesarPago)
                // para que el modal de "Éxito" funcione igual.
                var response = new GenericResponse<ResponseProcesarPago> { Success = false, Error = e.Message };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        // --- 6. (Opcional) AÑADE ESTE HELPER DENTRO DE LA CLASE ---
        // (Para no repetir código y obtener el ID del cliente)
        private int GetIdClienteFromToken()
        {
            var userIdString = User.FindFirst("idCliente")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
            {
                throw new Exception("ID de cliente inválido en el token.");
            }
            return idCliente;
        }
    }
}
