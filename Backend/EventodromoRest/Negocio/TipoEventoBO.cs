using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class TipoEventoBO (Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TipoEvento> ListarTiposEvento()
        {
            var mapper = new TipoEventoMapper(globales, DB);
            return mapper.ListarTipoEvento();
        }
    }
}
