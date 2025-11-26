//para token
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class LocalController(Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService, IS3Service s3Service) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;
        private readonly IS3Service _s3Service = s3Service;

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        [Authorize]
        public async Task<GenericResponse<string>> SubirImagenLocal(IFormFile imagen)
        {
            try
            {
                if (imagen == null || imagen.Length == 0)
                {
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = "No se proporcionó ninguna imagen",
                        Error = null,
                        Data = null
                    };
                }

                // Subir a S3 en la carpeta "locales"
                var rutaArchivo = await _s3Service.SubirImagenAsync(imagen, "locales");
                var urlPublica = _s3Service.ObtenerUrlPublica(rutaArchivo);

                return new GenericResponse<string>
                {
                    Success = true,
                    Message = "Imagen subida correctamente",
                    Error = null,
                    Data = urlPublica
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<string>
                {
                    Success = false,
                    Message = "Error al subir la imagen",
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "SubirImagenLocal", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<getLocalesResponse>> GetLocales()
        {
            try
            {
                var locales = new LocalBO(globales, BD).ListarLocales2();

                if (locales == null || locales.Count == 0)
                {
                    return new GenericResponse<List<getLocalesResponse>>
                    {
                        Success = false,
                        Message = "No se encontraron locales.",
                        Error = null,
                        Data = null
                    };
                }

                var data = locales
                    .Where(l => !l.isDeleted)
                    .Select(l => new getLocalesResponse
                    {
                        id = l.id,
                        nombre = l.nombre,
                        capacidad = l.capacidad
                    })
                    .ToList();

                return new GenericResponse<List<getLocalesResponse>>
                {
                    Success = true,
                    Message = "Lista de locales obtenida correctamente.",
                    Error = null,
                    Data = data
                };
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<getLocalesResponse>>
                {
                    Success = false,
                    Message = "Error en el servidor.",
                    Error = e.Message,
                    Data = null
                };

                AgregarEntradaBitacora(e, "SinBody", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<Local>> ListarLocalesAdmin()
        {
            try
            {
                return new LocalBO(globales, BD).ListarLocalesAdmin();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<Local>>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<int> InsertarLocal([FromBody] Local local)
        {
            try
            {
                return new LocalBO(globales, BD).InsertarLocal(local);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = 0
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<Local> ObtenerLocalPorId([FromQuery] int id)
        {
            try
            {
                return new LocalBO(globales, BD).ObtenerLocalPorId(id);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Local>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpDelete]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<int> EliminarLocal([FromQuery] int id)
        {
            try
            {
                return new LocalBO(globales, BD).EliminarLocal(id);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = 0
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPut]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<int> ModificarLocal([FromBody] Local local)
        {
            try
            {
                return new LocalBO(globales, BD).ModificarLocal(local);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<int>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = 0
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<List<OcuapcionLocalResponse>> OcupacionLocales()
        {
            try
            {
                var userIdString = User.FindFirst("idCliente")?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int idCliente))
                {
                    throw new Exception("ID de usuario inválido en el token.");
                }
                return new LocalBO(globales, BD).OcupacionLocales();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<List<OcuapcionLocalResponse>>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<Local> LocalCrearLocales([FromBody] CrearLocalDTO dto)
        {
            try
            {
                // 1️⃣ Validar token JWT
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<Local>
                    {
                        Success = false,
                        Message = "Acceso no autorizado. Se requiere un token válido.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);
                if (idAdmin == null)
                {
                    return new GenericResponse<Local>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                // 5. Llamamos al Negocio (BO) y le pasamos el ID del admin
                var bo = new LocalBO(globales, BD);
                var response = bo.CrearLocal(dto, idAdmin??0);
                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Local>
                {
                    Success = false,
                    Message = "Error fatal en el controlador de Local.",
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(dto), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseLocalModificarLocal> LocalModificarLocal([FromBody] LocalModificarLocalRequest request)
        {
            try
            {
                // 1️⃣ Validar token JWT
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<ResponseLocalModificarLocal>
                    {
                        Success = false,
                        Message = "Acceso no autorizado. Se requiere un token válido.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);
                if (idAdmin == null)
                {
                    return new GenericResponse<ResponseLocalModificarLocal>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                Local localNuevo = new Local
                {
                    id = request.idLocal,
                    nombre = request.Nombre,
                    idCiudad = request.CiudadId,
                    direccion = request.Direccion,
                    capacidad = request.Capacidad,
                    imagenURL = request.imagenURL,
                    Latitud = request.Latitud,
                    Longitud = request.Longitud,
                    GoogleMapsUrl = request.GoogleMapsUrl

                };

                // 5. Llamamos al Negocio (BO) y le pasamos el ID del admin
                var bo = new LocalBO(globales, BD);
                int response = bo.ModificarLocalAdmin(localNuevo);
                if (response > 0)
                {
                    ResponseLocalModificarLocal data = new ResponseLocalModificarLocal
                    {
                        success = true
                    };
                    return new GenericResponse<ResponseLocalModificarLocal>
                    {
                        Success = true,
                        Message = "Se modificó con éxito",
                        Error = null,
                        Data = data
                    };
                }
                else
                {
                    return new GenericResponse<ResponseLocalModificarLocal>
                    {
                        Success = false,
                        Message = "Error al modificar el local",
                        Error = null,
                        Data = null
                    };
                }
                    
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseLocalModificarLocal>
                {
                    Success = false,
                    Message = "Error fatal en el controlador de Local.",
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
        [HttpPost]
        [Route("/api/[controller]/[action]")] // -> /api/Local/PonerActivoLocal
        public GenericResponse<Local> PonerActivoLocal([FromBody] int idLocal)
        {
            try
            {
                var bo = new LocalBO(globales, BD);
                // Llama al negocio, pasando 'false' para isDeleted
                var response = bo.CambiarEstadoLocal(idLocal, false);
                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Local>
                {
                    Success = false,
                    Message = "Error fatal en el controlador.",
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, $"idLocal: {idLocal}", JsonSerializer.Serialize(response));
                return response;
            }
        }

        /// <summary>
        /// Pone un local en estado Inactivo (isDeleted = true).
        /// Recibe el ID del local en el body.
        /// </summary>
        [HttpPost]
        [Route("/api/[controller]/[action]")] // -> /api/Local/PonerInactivoLocal
        public GenericResponse<Local> PonerInactivoLocal([FromBody] int idLocal)
        {
            try
            {
                var bo = new LocalBO(globales, BD);
                // Llama al negocio, pasando 'true' para isDeleted
                var response = bo.CambiarEstadoLocal(idLocal, true);
                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<Local>
                {
                    Success = false,
                    Message = "Error fatal en el controlador.",
                    Error = e.Message
                };
                AgregarEntradaBitacora(e, $"idLocal: {idLocal}", JsonSerializer.Serialize(response));
                return response;
            }
        }

    }
}
