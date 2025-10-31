using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class LocalBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Local> ListarLocales()
        {
            var mapper = new LocalMapper(globales, DB);
            return mapper.ListarLocales();
        }
    }
}
