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
                
                // Obtener información del descuento de la transacción ANTES del Task.Run
                var promocionMapper = new PromocionMapper(globales, DB);
                var transaccion = transaccionMapper.ObtenerTransaccionPorId(response.IdTransaccion);
                
                decimal? montoDescuentoCapturado = null;
                string codigoDescuentoCapturado = null;
                
                if (transaccion != null)
                {
                    // Obtener descuento directo de la transacción
                    if (transaccion.montoDescuento > 0)
                    {
                        montoDescuentoCapturado = transaccion.montoDescuento;
                        
                        if (transaccion.idPromocionAplicada.HasValue)
                        {
                            var promocion = promocionMapper.ObtenerPromocionPorId(transaccion.idPromocionAplicada.Value);
                            codigoDescuentoCapturado = promocion?.codigo;
                        }
                    }
                }
                
                // Capturar todas las variables necesarias
                string emailCapturado = request.DatosFacturacion.Email;
                string nombreCapturado = request.DatosFacturacion.Nombres + " " + request.DatosFacturacion.Apellidos;
                string numeroTransaccionCapturado = response.NumeroTransaccion;
                DateTime fechaCompraCapturada = response.FechaCompra;
                decimal montoTotalCapturado = response.MontoTotal;
                int puntosGanadosCapturados = response.PuntosGanados;
                string tarjetaCapturada = response.Ultimos4DigitosTarjeta ?? "****";
                
                // Enviar email de forma asíncrona sin bloquear la respuesta
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await emailService.EnviarEmailConfirmacionCompraTarjetaAsync(
                            emailCapturado,
                            nombreCapturado,
                            numeroTransaccionCapturado,
                            fechaCompraCapturada,
                            montoTotalCapturado,
                            puntosGanadosCapturados,
                            tarjetaCapturada,
                            detallesEntradas,
                            montoDescuentoCapturado,
                            codigoDescuentoCapturado
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"⚠️ No se pudo enviar email de confirmación: {ex.Message}");
                    }
                });
            }
            catch (Exception ex)
            {
                // No fallar la transacción si el email falla, solo loguearlo
                Console.WriteLine($"⚠️ Error preparando email de confirmación: {ex.Message}");
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
                
                // Obtener información del descuento de la transacción ANTES del Task.Run
                var promocionMapper = new PromocionMapper(globales, DB);
                var transaccion = transaccionMapper.ObtenerTransaccionPorId(response.IdTransaccion);
                
                decimal? montoDescuentoCapturado = null;
                string codigoDescuentoCapturado = null;
                
                if (transaccion != null)
                {
                    // Obtener descuento directo de la transacción
                    if (transaccion.montoDescuento > 0)
                    {
                        montoDescuentoCapturado = transaccion.montoDescuento;
                        
                        if (transaccion.idPromocionAplicada.HasValue)
                        {
                            var promocion = promocionMapper.ObtenerPromocionPorId(transaccion.idPromocionAplicada.Value);
                            codigoDescuentoCapturado = promocion?.codigo;
                        }
                    }
                }
                
                // Capturar todas las variables necesarias
                string emailCapturado = request.DatosFacturacion.Email;
                string nombreCapturado = request.DatosFacturacion.Nombres + " " + request.DatosFacturacion.Apellidos;
                string numeroTransaccionCapturado = response.NumeroTransaccion;
                DateTime fechaCompraCapturada = response.FechaCompra;
                int puntosGastadosCapturados = response.PuntosGastados;
                
                // Enviar email de forma asíncrona sin bloquear la respuesta
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await emailService.EnviarEmailConfirmacionCompraPuntosAsync(
                            emailCapturado,
                            nombreCapturado,
                            numeroTransaccionCapturado,
                            fechaCompraCapturada,
                            puntosGastadosCapturados,
                            detallesEntradas,
                            montoDescuentoCapturado,
                            codigoDescuentoCapturado
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"⚠️ No se pudo enviar email de confirmación: {ex.Message}");
                    }
                });
            }
            catch (Exception ex)
            {
                // No fallar la transacción si el email falla, solo loguearlo
                Console.WriteLine($"⚠️ Error preparando email de confirmación: {ex.Message}");
            }

            // --- 3. Devolver respuesta exitosa ---
            return new GenericResponse<ResponseProcesarPago>
            {
                Success = true,
                Message = "Pago con puntos procesado exitosamente.",
                Data = response
            };
        }

        /// <summary>
        /// Obtiene el detalle completo de una transacción filtrado por evento
        /// Verifica que la transacción pertenezca al cliente autenticado
        /// </summary>
        public GenericResponse<DetalleTransaccionCompleto> ObtenerDetalleCompleto(string numeroTransaccion, int idEvento, int idCliente)
        {
            var transaccionMapper = new TransaccionMapper(globales, DB);
            var detalle = transaccionMapper.ObtenerDetalleCompleto(numeroTransaccion, idEvento, idCliente);

            if (detalle == null)
            {
                throw new Exception("Transacción no encontrada o no tiene permisos para ver esta transacción.");
            }

            return new GenericResponse<DetalleTransaccionCompleto>
            {
                Success = true,
                Message = "Detalle de transacción obtenido correctamente.",
                Data = detalle,
                Error = null
            };
        }
    }

}
