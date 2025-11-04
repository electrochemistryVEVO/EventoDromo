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

        public List<Local> ListarLocales2()
        {
            var mapper = new LocalMapper(globales, DB);
            return mapper.ListarLocales2();
        }

        public GenericResponse<IEnumerable<Local>> ListarLocalesAdmin()
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            List<Local> locales = mapper.ListarLocalesAdmin();
            var response = new GenericResponse<IEnumerable<Local>>();
            response.Success = true;
            response.Data = locales;
            return response;
        }

        public GenericResponse<int> InsertarLocal(Local local)
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            var response = new GenericResponse<int>();
            response.Success = true;
            response.Data = mapper.InsertarLocal(local);
            return response;
        }

        public GenericResponse<Local> ObtenerLocalPorId(int id)
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            Local local = mapper.ObtenerLocalPorId(id);
            var response = new GenericResponse<Local>();
            response.Success = true;
            response.Data = local;
            return response;
        }

        public GenericResponse<int> EliminarLocal(int idLocal)
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            var response = new GenericResponse<int>();
            response.Success = true;
            response.Data = mapper.EliminarLocalPorId(idLocal);
            return response;
        }

        public GenericResponse<int> ModificarLocal(Local local)
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            var response = new GenericResponse<int>();
            response.Success = true;
            response.Data = mapper.ModificarLocal(local);
            return response;
        }
    }
}
