using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class AdministradorBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public FetchUserDataResponse ObtenerNombrePorId(int idAdmin)
        {
            var mapper = new AdministradorMapper(globales, DB);
            Administrador administrador = mapper.ObtenerAdministradorPorId(idAdmin);
            if (administrador != null)
            {
                return new FetchUserDataResponse
                {
                    status = "success",
                    message = "Admin encontrado.",
                    name = $"{administrador.nombres} {administrador.apellidos}"
                };
            }
            else
            {
                return new FetchUserDataResponse
                {
                    status = "error",
                    message = "Admin no encontrado.",
                    name = null
                };
            }

        }
    }
}
