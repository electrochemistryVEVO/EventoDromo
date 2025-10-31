using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class CiudadBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<IEnumerable<Ciudad>> ListarCiudades()
        {
            CiudadMapper mapper = new CiudadMapper(globales, DB);
            List<Ciudad> ciudades = mapper.ListarCiudad();
            var response = new GenericResponse<IEnumerable<Ciudad>>();
            response.Success = true;
            response.Data = ciudades;
            return response;
        }
    }
}
