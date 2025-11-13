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

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class LocalController(Globales.Globales globales, DBManager.DBManager BD) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;

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

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<Local> LocalCrearLocales([FromBody] CrearLocalDTO dto)
        {
            try
            {
                // --- 3. LÓGICA DEL TOKEN REACTIVADA ---
                var adminIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

                if (adminIdClaim == null)
                {
                    // Esto maneja el caso de un token válido pero sin ID
                    return new GenericResponse<Local> { Success = false, Message = "Error de autenticación: No se pudo identificar al administrador.", Error = "Unauthorized" };
                }

                int adminId = int.Parse(adminIdClaim.Value);
                // --- FIN DE LÓGICA DE TOKEN ---

                // 5. Llamamos al Negocio (BO) y le pasamos el ID del admin
                var bo = new LocalBO(globales, BD);
                var response = bo.CrearLocal(dto, adminId);
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
    }
}
