using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class CiudadBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<List<ObtenerCiudadDTO>> ObtenerCiudades()
        {
            try
            {
                var mapper = new CiudadMapper(globales, DB);

               
                List<Ciudad> ciudadesDesdeDB = mapper.ListarCiudad();

                
                List<ObtenerCiudadDTO> dataParaFront = ciudadesDesdeDB.Select(c => new ObtenerCiudadDTO
                {
                    id = c.id,
                    nombre = c.nombre
                }).ToList();


             
                return new GenericResponse<List<ObtenerCiudadDTO>>
                {
                    Success = true,
                    Message = "Ciudades obtenidas correctamente",
                    Data = dataParaFront 
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<List<ObtenerCiudadDTO>>
                {
                    Success = false,
                    Message = "Error interno al obtener la lista de ciudades",
                    Error = ex.Message
                };
            }
        }
    }
}
