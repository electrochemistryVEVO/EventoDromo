using Azure.Core;
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Servicios;

namespace EventodromoRest.Negocio
{
    public class TransaccionBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<List<Transaccion>> ListarTransacciones()
        {
            var transaccionMapper = new TransaccionMapper(globales, DB);

            List<Transaccion> listaDeTransacciones = transaccionMapper.ListarTransaccion();

            return new GenericResponse<List<Transaccion>>
            {
                Success = true,
                Message = "Transacciones obtenidas correctamente.",
                Data = listaDeTransacciones,
                Error = null
            };
        }
        public GenericResponse<bool> TransferirEntradas(int idCliente, RequestTransferencia request)
        {
            var transaccionMapper = new TransaccionMapper(globales, DB);

            var response = transaccionMapper.TransferirEntradas(idCliente, request);

            return new GenericResponse<bool>
            {
                Success = true,
                Message = "Transacciones obtenidas correctamente.",
                Data = response,
                Error = null
            };
        }

        public GenericResponse<List<Entrada>> ListarEntradasPorTransaccion(int idTransaccion)
        {
            try
            {
                var transaccionMapper = new TransaccionMapper(globales, DB);
                List<Entrada> entradas = transaccionMapper.ObtenerEntradasPorTransaccion(idTransaccion);

                return new GenericResponse<List<Entrada>>
                {
                    Success = true,
                    Message = "Entradas obtenidas correctamente.",
                    Data = entradas,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<List<Entrada>>
                {
                    Success = false,
                    Message = "Error al obtener las entradas.",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        public GenericResponse<ResponseProcesarPago> ProcesarPagoTarjeta(int idCliente, RequestProcesarPago request)
        {
            // --- 1. Validación de Negocio (Simulación de Pasarela) ---
            // Usamos el "111" que simulaste en tu frontend.
            if (request.DatosTarjeta.Cvv == "111")
            {
                // Este throw será atrapado por el Controller y devuelto como un error 400.
                throw new Exception("Pago rechazado. Fondos insuficientes.");
            }
            // Aquí irían otras validaciones, como la fecha de expiración.

            // --- 2. Lógica de Base de Datos ---
            var transaccionMapper = new TransaccionMapper(globales, DB);
            var response = transaccionMapper.CrearTransaccionTarjeta(idCliente, request);

            // --- 3. Enviar email de confirmación ---
            try
            {
                var detallesEntradas = transaccionMapper.ObtenerDetallesEntradasParaEmail(response.IdTransaccion);
                var emailService = new EmailService();
                
                emailService.EnviarEmailConfirmacionCompraTarjeta(
                    request.DatosFacturacion.Email,
                    request.DatosFacturacion.Nombres + " " + request.DatosFacturacion.Apellidos,
                    response.NumeroTransaccion,
                    response.FechaCompra,
                    response.MontoTotal,
                    response.PuntosGanados,
                    response.Ultimos4DigitosTarjeta ?? "****",
                    detallesEntradas
                );
            }
            catch (Exception ex)
            {
                // No fallar la transacción si el email falla, solo loguearlo
                Console.WriteLine($"⚠️ No se pudo enviar email de confirmación: {ex.Message}");
            }

            // --- 4. Devolver respuesta exitosa ---
            return new GenericResponse<ResponseProcesarPago>
            {
                Success = true,
                Message = "Pago procesado exitosamente.",
                Data = response
            };
        }

        public GenericResponse<ResponseProcesarPago> ProcesarPagoPuntos(int idCliente, RequestProcesarPagoPuntos request)
        {
            // --- 1. Lógica de Base de Datos ---
            var transaccionMapper = new TransaccionMapper(globales, DB);
            var response = transaccionMapper.CrearTransaccionPuntos(idCliente, request);

            // --- 2. Enviar email de confirmación ---
            try
            {
                var detallesEntradas = transaccionMapper.ObtenerDetallesEntradasParaEmail(response.IdTransaccion);
                var emailService = new EmailService();
                
                emailService.EnviarEmailConfirmacionCompraPuntos(
                    request.DatosFacturacion.Email,
                    request.DatosFacturacion.Nombres + " " + request.DatosFacturacion.Apellidos,
                    response.NumeroTransaccion,
                    response.FechaCompra,
                    response.PuntosGastados,
                    detallesEntradas
                );
            }
            catch (Exception ex)
            {
                // No fallar la transacción si el email falla, solo loguearlo
                Console.WriteLine($"⚠️ No se pudo enviar email de confirmación: {ex.Message}");
            }

            // --- 3. Devolver respuesta exitosa ---
            return new GenericResponse<ResponseProcesarPago>
            {
                Success = true,
                Message = "Pago con puntos procesado exitosamente.",
                Data = response
            };
        }
    }

}
