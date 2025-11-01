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
    }

}
