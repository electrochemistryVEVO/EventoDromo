using Azure.Core;
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

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
            // Llamamos al Mapper, que crearemos en el siguiente paso.
            // El Mapper se encargará de la transacción de BD completa.
            var transaccionMapper = new TransaccionMapper(globales, DB);
            var response = transaccionMapper.CrearTransaccionTarjeta(idCliente, request);

            // --- 3. (Opcional) Enviar email de confirmación, etc. ---
            // Aquí podrías agregar una lógica para enviar un correo
            // al 'request.DatosFacturacion.Email' con los detalles de la compra.

            // --- 4. Devolver respuesta exitosa ---
            return new GenericResponse<ResponseProcesarPago>
            {
                Success = true,
                Message = "Pago procesado exitosamente.",
                Data = response
            };
        }
    }

}
