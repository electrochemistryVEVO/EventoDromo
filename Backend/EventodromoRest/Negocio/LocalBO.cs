using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class LocalBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<IEnumerable<Local>> ListarLocales()
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            List<Local> locales = mapper.ListarLocales();
            GenericResponse<IEnumerable<Local>> response = new GenericResponse<IEnumerable<Local>>();
            response.Success = true;
            response.Data = locales;
            return response;
        }
    }
}
