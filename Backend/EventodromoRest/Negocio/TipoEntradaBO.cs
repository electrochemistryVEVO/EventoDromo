using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.AspNetCore.Mvc;
namespace EventodromoRest.Negocio
{
    public class TipoEntradaBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<IEnumerable<TipoEntrada>> ListarTipoEntradaPorFechaEvento(int idFechaEvento)
        {
            var mapper = new TipoEntradaMapper(globales,DB);
            var respuesta = new GenericResponse<IEnumerable<TipoEntrada>>();
            respuesta.Success = true;
            respuesta.Data = mapper.ListarTipoEntradaPorFechaEvento(idFechaEvento);
            return respuesta;
        }
    }
}
