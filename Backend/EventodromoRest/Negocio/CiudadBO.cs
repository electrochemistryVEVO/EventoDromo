using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class CiudadBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Ciudad> ListarCiudad()
        {
            CiudadMapper ciudadMapper = new CiudadMapper(globales, DB);
            return ciudadMapper.ListarCiudad();
        }
    }
}