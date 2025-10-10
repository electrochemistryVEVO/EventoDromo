using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.AspNetCore.Mvc;
namespace EventodromoRest.Negocio
{
    public class FechaEventoBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<IEnumerable<FechaEvento>> ListarFechaEventoPorEvento(int idEvento)
        {
            var mapper = new FechaEventoMapper(globales,DB);
           var respuesta = new GenericResponse<IEnumerable<FechaEvento>>();
            respuesta.Success = true;
            respuesta.Data = mapper.ListarFechaEventoPorEvento(idEvento);
            return respuesta;
        }
    }
}
