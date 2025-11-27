using Azure;
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
            response.Data = mapper.ModificarLocalAdmin(local);
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
                    imagenURL = dto.imagenURL,
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

        public int ModificarLocalAdmin(Local local)
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            int response = mapper.ModificarLocalAdmin(local);
            return response;
        }
        public GenericResponse<Local> CambiarEstadoLocal(int idLocal, bool isDeleted)
        {
            try
            {
                // 0. Instancia el mapper (Asumo que ya tienes 'globales' y 'DB' en tu BO)
                var mapper = new LocalMapper(globales, DB);

                // 1. Intentar actualizar el estado
                //    (Esto usa el método 'ActualizarEstadoLocal' de tu LocalMapper)
                int rowsAffected = mapper.ActualizarEstadoLocal(idLocal, isDeleted);

                // 2. Verificar si la actualización funcionó
                if (rowsAffected == 0)
                {
                    return new GenericResponse<Local>
                    {
                        Success = false,
                        Message = "No se encontró un local con el ID " + idLocal,
                        Error = "Not Found"
                    };
                }

                // 3. Obtener y devolver el local actualizado para confirmación
                //    (Esto usa el método 'ObtenerLocalPorId' de tu LocalMapper)
                Local localActualizado = mapper.ObtenerLocalPorId(idLocal);

                return new GenericResponse<Local>
                {
                    Success = true,
                    Message = $"Local {localActualizado.nombre} actualizado a {(isDeleted ? "Inactivo" : "Activo")}.",
                    Data = localActualizado
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<Local>
                {
                    Success = false,
                    Message = "Error interno al actualizar el estado del local.",
                    Error = ex.Message
                };
            }
        }


        public GenericResponse<List<OcuapcionLocalResponse>> OcupacionLocales()
        {
            LocalMapper mapper = new LocalMapper(globales, DB);
            List<OcuapcionLocalResponse> ocupacionLocales = mapper.OcupacionLocales();
            return new GenericResponse<List<OcuapcionLocalResponse>>
            {
                Success = true,
                Message = "Evento actualizado correctamente.",
                Error = null,
                Data = ocupacionLocales
            };
        }

        public GenericResponse<LocalCrearMasivoResponseData> InsertarLocalesMasivo(List<LocalMasivoItem> locales, int idAdministrador)
        {
            try
            {
                var mapper = new LocalMapper(globales, DB);

                // 1. Validar que el array no esté vacío
                if (locales == null || !locales.Any())
                {
                    return new GenericResponse<LocalCrearMasivoResponseData>
                    {
                        Success = false,
                        Message = "El array de locales no puede estar vacío.",
                        Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales?.Count ?? 0 }
                    };
                }

                // 2. Validar que cada local tenga campos requeridos
                for (int i = 0; i < locales.Count; i++)
                {
                    var local = locales[i];
                    
                    if (string.IsNullOrWhiteSpace(local.nombre))
                    {
                        return new GenericResponse<LocalCrearMasivoResponseData>
                        {
                            Success = false,
                            Message = $"Local en posición {i + 1}: El nombre es requerido.",
                            Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                        };
                    }

                    if (string.IsNullOrWhiteSpace(local.direccion))
                    {
                        return new GenericResponse<LocalCrearMasivoResponseData>
                        {
                            Success = false,
                            Message = $"Local en posición {i + 1}: La dirección es requerida.",
                            Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                        };
                    }

                    if (local.capacidad <= 0)
                    {
                        return new GenericResponse<LocalCrearMasivoResponseData>
                        {
                            Success = false,
                            Message = $"Local en posición {i + 1}: La capacidad debe ser mayor a 0.",
                            Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                        };
                    }

                    if (local.idCiudad <= 0)
                    {
                        return new GenericResponse<LocalCrearMasivoResponseData>
                        {
                            Success = false,
                            Message = $"Local en posición {i + 1}: El ID de ciudad es requerido.",
                            Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                        };
                    }
                }

                // 3. Validar direcciones duplicadas dentro del batch
                var direcciones = locales.Select(l => l.direccion.Trim()).ToList();
                var direccionesDuplicadasEnBatch = direcciones
                    .GroupBy(d => d)
                    .Where(g => g.Count() > 1)
                    .Select(g => g.Key)
                    .ToList();

                if (direccionesDuplicadasEnBatch.Any())
                {
                    return new GenericResponse<LocalCrearMasivoResponseData>
                    {
                        Success = false,
                        Message = $"Dirección duplicada dentro del batch: {direccionesDuplicadasEnBatch.First()}",
                        Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                    };
                }

                // 4. Validar que las direcciones no existan en la BD
                var direccionesDuplicadasEnBD = mapper.ObtenerDireccionesDuplicadasEnBD(direcciones);
                if (direccionesDuplicadasEnBD.Any())
                {
                    return new GenericResponse<LocalCrearMasivoResponseData>
                    {
                        Success = false,
                        Message = $"Dirección ya existe en la base de datos: {direccionesDuplicadasEnBD.First()}",
                        Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                    };
                }

                // 5. Validar que los idCiudad existan
                var idsCiudad = locales.Select(l => l.idCiudad).Distinct().ToList();
                bool ciudadesExisten = mapper.VerificarCiudadesExisten(idsCiudad);
                
                if (!ciudadesExisten)
                {
                    return new GenericResponse<LocalCrearMasivoResponseData>
                    {
                        Success = false,
                        Message = "Una o más ciudades especificadas no existen en la base de datos.",
                        Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales.Count }
                    };
                }

                // 6. Insertar todos los locales en una transacción
                int insertados = mapper.InsertarLocalesMasivo(locales, idAdministrador);

                return new GenericResponse<LocalCrearMasivoResponseData>
                {
                    Success = true,
                    Message = $"Se insertaron {insertados} locales exitosamente.",
                    Data = new LocalCrearMasivoResponseData { insertados = insertados, fallidos = 0 }
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<LocalCrearMasivoResponseData>
                {
                    Success = false,
                    Message = "Error al insertar locales masivamente.",
                    Error = ex.Message,
                    Data = new LocalCrearMasivoResponseData { insertados = 0, fallidos = locales?.Count ?? 0 }
                };
            }
        }
    }
}
