using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class LineaTransaccionBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<List<LineaTransaccion>> ListarLineaTransaccionesPorCliente()
        {
            var transaccionMapper = new LineaTransaccionMapper(globales, DB);

            List<LineaTransaccion> listaDeLineaTransacciones = transaccionMapper.ListarLineaTransaccion();

            return new GenericResponse<List<LineaTransaccion>>
            {
                Success = true,
                Message = "Transacciones obtenidas correctamente.",
                Data = listaDeLineaTransacciones,
                Error = null
            };
        }
    }
    
}
