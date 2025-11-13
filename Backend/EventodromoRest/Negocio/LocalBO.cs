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

        public GenericResponse<Local> CrearLocal(CrearLocalDTO dto, int adminId)
        {
            try
            {
                var mapper = new LocalMapper(globales, DB);

                // 2. Validar campos
                if (string.IsNullOrWhiteSpace(dto.Nombre) || string.IsNullOrWhiteSpace(dto.Direccion))
                {
                    return new GenericResponse<Local> { Success = false, Message = "El nombre y la dirección son obligatorios." };
                }

                // 3. Validar dirección única (Requisito del PDF)
                if (mapper.VerificarDireccionUnica(dto.Direccion))
                {
                    return new GenericResponse<Local> { Success = false, Message = "La dirección ya existe. Debe ser única." };
                }

                // 4. Transformar DTO a Modelo de BD
                var local = new Local
                {
                    nombre = dto.Nombre,
                    idCiudad = dto.CiudadId,
                    direccion = dto.Direccion,
                    capacidad = dto.Capacidad,
                    isDeleted = false, // <-- REGLA: Siempre falso al crear

                    // 5. Asignar el ID del admin (del token) al campo 'creadoPor'
                    idAdministrador = adminId  // <-- REGLA: ID del token
                };

                // 6. Insertar en la BD
                int nuevoId = mapper.InsertarLocal(local);

                // 7. Obtener y devolver el objeto recién creado (confirmación)
                Local localCreado = mapper.ObtenerLocalPorId(nuevoId);

                return new GenericResponse<Local>
                {
                    Success = true,
                    Message = "Local creado exitosamente.",
                    Data = localCreado
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<Local>
                {
                    Success = false,
                    Message = "Error interno al crear el local.",
                    Error = ex.Message
                };
            }
        }
    }
}
