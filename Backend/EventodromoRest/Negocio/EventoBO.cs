using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class EventoBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<List<Evento>> ListarEventos()
        {
            var eventoMapper = new EventoMapper(globales, DB);

            return new GenericResponse<List<Evento>>
            {
                Success = true,
                Message = "Eventos obtenidos correctamente.",
                Data = eventoMapper.ListarEvento(),
                Error = null
            };
        }
    }
}
