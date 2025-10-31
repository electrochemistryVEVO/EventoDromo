using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class LocalBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<IEnumerable<LocalCiudadImagenDTO>> ListarLocales()
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            List<LocalCiudadImagenDTO> locales = mapper.ListarLocales();
            var response = new GenericResponse<IEnumerable<LocalCiudadImagenDTO>>();
            response.Success = true;
            response.Data = locales;
            return response;
        }
    }
}
