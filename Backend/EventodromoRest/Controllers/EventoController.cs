using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Claims;
using System.Text.Json;


namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class EventoController (Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        //private readonly DBManager.DBManager BD = BD;
        //private readonly Globales.Globales globales = globales; 
        private readonly TokenService tokenService = tokenService;


        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<Evento>> ListarEventosPorTipo([FromBody] RequestListarEventosPorTipo request)
        {
            try
            {
                Debug.WriteLine(request.idTipoEvento);
                ValidarBody(request); 
                return new EventoBO(globales, BD).ListarEventosPorTipo(request.idTipoEvento);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<Evento>>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<IEnumerable<Evento>> ListarEventosPorBusqueda([FromBody] RequestListarEventosPorBusqueda request)
        {
            try
            {
                Debug.WriteLine(request.busqueda);
                ValidarBody(request); 
                return new EventoBO(globales, BD).ListarEventosPorBusqueda(request.busqueda);
            }
            catch (Exception e)
            {
                var response = new GenericResponse<IEnumerable<Evento>>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }
        
        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseObtenerEventoPorId> ObtenerEventoPorId([FromBody] RequestObtenerEventoPorId request)
        {
            try
            {
                Debug.WriteLine(request.idEvento);
                ValidarBody(request);
                return new EventoBO(globales, BD).ObtenerEventoPorId(request.idEvento);
            }
            catch (Exception e) 
            {
                var response = new GenericResponse<ResponseObtenerEventoPorId>
                {
                    Success = false,
                    Message = null,
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(request), JsonSerializer.Serialize(response));
                return response;
            }
        }


        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseListarEventosYLocales> ListarFiltradosConLocales()
        {
            try
            {
                return new EventoBO(globales, BD).ListarEventosYLocales();
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseListarEventosYLocales>
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
        public GenericResponse<CrearEventoResponse> CrearEvento([FromBody] CrearEventoRequest request)
        {
            try
            {
                // 1️⃣ Validar token JWT
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<CrearEventoResponse>
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
                    return new GenericResponse<CrearEventoResponse>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                // 2️⃣ Validaciones básicas
                var validationErrors = new Dictionary<string, string>();

                if (string.IsNullOrWhiteSpace(request.nombre))
                    validationErrors["nombre"] = "El nombre del evento es obligatorio.";

                if (request.capacidad <= 0)
                    validationErrors["capacidad"] = "La capacidad debe ser mayor que cero.";

                if (request.entradas == null || request.entradas.Count == 0)
                    validationErrors["entradas"] = "Debe especificar al menos un tipo de entrada.";

                if (request.horarios == null || request.horarios.Count == 0)
                    validationErrors["horarios"] = "Debe especificar al menos una fecha del evento.";

                int totalEntradas = request.entradas!.Sum(e => e.cantidad);
                if (totalEntradas > request.capacidad)
                    validationErrors["aforo"] = $"La suma de las entradas ({totalEntradas}) no puede exceder la capacidad del local ({request.capacidad}).";

                if (validationErrors.Count > 0)
                {
                    return new GenericResponse<CrearEventoResponse>
                    {
                        Success = false,
                        Message = "La validación de los datos falló.",
                        Error = JsonSerializer.Serialize(validationErrors),
                        Data = null
                    };
                }

                // 3️⃣ Crear el objeto Evento
                var nuevoEvento = new Evento
                {
                    nombre = request.nombre,
                    descripcion = request.descripcion,
                    idLocal = request.localId,
                    idTipoEvento = request.tipoEventoId,
                    fechaPublicacion = DateTime.Parse(request.fechaPublicacion),
                    fechaCompra = DateTime.Parse(request.fechaCompra),
                    creadoPor = idAdmin.Value,
                    isDeleted = false,
                    imagenURL = request.imagenURL
                };

                // 💾 Aquí podrías guardar en la BD:
                // var eventoCreado = new EventoBO(globales, BD).CrearEventoCompleto(nuevoEvento, request.Horarios, request.Entradas);
                // Simulamos:
                nuevoEvento.id = new EventoBO(globales, BD).CrearEvento(nuevoEvento, request.horarios!, request.entradas!);

                // 4️⃣ Respuesta exitosa
                return new GenericResponse<CrearEventoResponse>
                {
                    Success = true,
                    Message = "Evento creado correctamente.",
                    Data = new CrearEventoResponse
                    {
                        success=true
                    }
                };
            }
            catch (Exception ex)
            {
                AgregarEntradaBitacora(ex, "CreateEvent", ex.Message);

                return new GenericResponse<CrearEventoResponse>
                {
                    Success = false,
                    Message = "Ocurrió un error interno al procesar la solicitud.",
                    Error = ex.Message
                };
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]

        public GenericResponse<EventoDetalleDTO> EventoObtenerDatos(int id)
        {
            try
            {
                // 1. Llama al negocio
                var eventoBO = new EventoBO(globales, BD);
                var response = eventoBO.ObtenerDetalleEvento(id);

                // 2. Devuelve la respuesta del negocio (sea éxito o error)
                return response;
            }
            catch (Exception e)
            {
                // 3. Manejo de excepción (tu patrón de bitácora)
                var response = new GenericResponse<EventoDetalleDTO>
                {
                    Success = false,
                    Message = "Error fatal en el controlador.",
                    Error = e.Message,
                    Data = null
                };
                AgregarEntradaBitacora(e, $"id: {id}", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ResponseEventoGetEvents> EventoGetEvents(
            [FromQuery] string? search,
            [FromQuery] int? localId,
            [FromQuery] string? status,
            [FromQuery] string? startDate,
            [FromQuery] string? endDate,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                
                
                // 1️⃣ Validar token JWT
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<ResponseEventoGetEvents>
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
                    return new GenericResponse<ResponseEventoGetEvents>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }
                
                // 2️⃣ Parsear fechas opcionales
                DateTime? start = null;
                DateTime? end = null;
                if (DateTime.TryParse(startDate, out DateTime s)) start = s;
                if (DateTime.TryParse(endDate, out DateTime e)) end = e;

                // 3️⃣ Llamar a la capa de negocio
                var resultado = new EventoBO(globales, BD).GetEventosFiltrados(
                    search,
                    localId,
                    status,
                    start,
                    end,
                    page,
                    pageSize
                );

                // 4️⃣ Retornar resultado
                if (resultado != null)
                {
                    return new GenericResponse<ResponseEventoGetEvents>
                    {
                        Success = true,
                        Message = "Se obtuvo lista de eventos correctamente",
                        Error = null,
                        Data = resultado,
                    };
                }
                else
                {
                    return new GenericResponse<ResponseEventoGetEvents>
                    {
                        Success = false,
                        Message = "Error al obtener los eventos.",
                        Error = "No se encontraron resultados o ocurrió un error.",
                        Data = null
                    };
                }

            }
            catch (Exception ex)
            {
                var response = new GenericResponse<ResponseEventoGetEvents>
                {
                    Success = false,
                    Message = "Error interno al listar los eventos.",
                    Error = ex.Message,
                    Data = null
                };

                AgregarEntradaBitacora(ex, "", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<bool> EliminarEvento([FromQuery] int id)
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "Acceso no autorizado. Se requiere un token válido.",
                        Error = "401 Unauthorized",
                        Data = false
                    };
                }

                var token = authHeader.Substring("Bearer ".Length);
                int? idAdmin = tokenService.ObtenerIdDesdeToken(token);
                if (idAdmin == null)
                {
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = false
                    };
                }

                if (id <= 0)
                {
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "ID de evento inválido.",
                        Error = "El ID debe ser mayor que cero.",
                        Data = false
                    };
                }

                var eventoBO = new EventoBO(globales, BD);
                var resultado = eventoBO.EliminarEvento(id, idAdmin.Value);
                return resultado;
            }
            catch (Exception ex)
            {
                var response = new GenericResponse<bool>
                {
                    Success = false,
                    Message = "Error al eliminar el evento.",
                    Error = ex.Message,
                    Data = false
                };

                AgregarEntradaBitacora(ex, $"id: {id}", JsonSerializer.Serialize(response));
                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<CrearEventoResponseDTO> CrearEventoFinal([FromBody] CrearEventoDTOFinal dto)
        {
            try
            {
                // 1️⃣ Validar token JWT
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<CrearEventoResponseDTO>
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
                    return new GenericResponse<CrearEventoResponseDTO>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }

                // 2. Llamar al Negocio (BO) con el ID fijo
                var bo = new EventoBO(globales, BD);

                // El método CrearEventoCompleto espera (CrearEventoDTOFinal, int)
                return bo.CrearEventoCompleto(dto, idAdmin??0);
            }
            catch (Exception e)
            {
                // 3. Manejo de Errores Global
                var response = new GenericResponse<CrearEventoResponseDTO>
                {
                    Success = false,
                    Message = "Error fatal en el controlador al crear el evento.",
                    Error = e.Message
                };

                // Registrar en bitácora
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(dto), JsonSerializer.Serialize(response));

                return response;
            }
        }

        [HttpPost]
        [Route("/api/[controller]/[action]")]
        public GenericResponse<ActualizarEventoResponseDTO> ActualizarEvento([FromBody] ActualizarEventoDTO dto)
        {
            try
            {
                // 1️⃣ Validar token JWT
                /*var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return new GenericResponse<ActualizarEventoResponseDTO>
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
                    return new GenericResponse<ActualizarEventoResponseDTO>
                    {
                        Success = false,
                        Message = "Token inválido o expirado.",
                        Error = "401 Unauthorized",
                        Data = null
                    };
                }*/
                int? idAdmin = 1;
                // 3. Llamar al Negocio (BO)
                var bo = new EventoBO(globales, BD);

                // Llamamos al método de actualización del BO
                return bo.ActualizarEventoCompleto(dto, idAdmin??0);
            }
            catch (Exception e)
            {
                // 4. Manejo de Errores Global
                var response = new GenericResponse<ActualizarEventoResponseDTO>
                {
                    Success = false,
                    Message = "Error fatal en el controlador al actualizar el evento.",
                    Error = e.Message
                };

                // Registrar en bitácora
                AgregarEntradaBitacora(e, JsonSerializer.Serialize(dto), JsonSerializer.Serialize(response));

                return response;
            }
        }
    }


}
