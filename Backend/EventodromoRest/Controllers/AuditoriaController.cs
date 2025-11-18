using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;
using EventodromoRest.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EventodromoRest.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize] // Requiere autenticación JWT (solo administradores deberían acceder)
    public class AuditoriaController(Globales.Globales globales, DBManager.DBManager BD, TokenService tokenService) : BaseController
    {
        private readonly DBManager.DBManager BD = BD;
        private readonly Globales.Globales globales = globales;
        private readonly TokenService tokenService = tokenService;

        /// <summary>
        /// Obtiene la lista de clientes con información de auditoría, paginada y con búsqueda
        /// </summary>
        /// <param name="page">Número de página (por defecto 1)</param>
        /// <param name="search">Término de búsqueda opcional</param>
        /// <returns>Lista de clientes con metadata de paginación</returns>
        [HttpGet]
        [Route("[action]")]
        public GenericResponse<ResponseObtenerClientes> ObtenerClientes(
            [FromQuery] int page = 1, 
            [FromQuery] string? search = null)
        {
            try
            {
                // Opcional: Validar que el usuario sea administrador
                // int idUsuario = _ObtenerIdUsuarioDesdeToken();
                // Aquí podrías verificar si el usuario es administrador

                // Llamar a la capa de negocio
                var response = new AuditoriaBO(globales, BD)
                    .ObtenerClientesAuditoria(page, search);

                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ResponseObtenerClientes>
                {
                    Success = false,
                    Message = "Error en el servidor al obtener clientes",
                    Error = e.Message,
                    Data = null
                };
                
                var requestLog = JsonSerializer.Serialize(new { page, search });
                AgregarEntradaBitacora(e, requestLog, JsonSerializer.Serialize(response));
                
                return response;
            }
        }

        /// <summary>
        /// Obtiene el detalle completo de un cliente específico para auditoría
        /// </summary>
        /// <param name="clienteId">ID del cliente</param>
        /// <returns>Detalle del cliente con historial de actividades</returns>
        [HttpGet]
        [Route("[action]/{clienteId}")]
        public GenericResponse<ClienteDetalleDTO> ObtenerDetalleCliente(int clienteId)
        {
            try
            {
                // Opcional: Validar que el usuario sea administrador
                // int idUsuario = _ObtenerIdUsuarioDesdeToken();

                // Llamar a la capa de negocio
                var response = new AuditoriaBO(globales, BD)
                    .ObtenerDetalleCliente(clienteId);

                return response;
            }
            catch (Exception e)
            {
                var response = new GenericResponse<ClienteDetalleDTO>
                {
                    Success = false,
                    Message = "Error en el servidor al obtener detalle del cliente",
                    Error = e.Message,
                    Data = null
                };
                
                var requestLog = JsonSerializer.Serialize(new { clienteId });
                AgregarEntradaBitacora(e, requestLog, JsonSerializer.Serialize(response));
                
                return response;
            }
        }

        /// <summary>
        /// Método auxiliar para obtener el ID del usuario desde el token JWT
        /// </summary>
        private int _ObtenerIdUsuarioDesdeToken()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                throw new Exception("Token no proporcionado o inválido.");
            }

            var token = authHeader.Substring("Bearer ".Length);
            int? idUsuario = tokenService.ObtenerIdDesdeToken(token);

            if (idUsuario == null)
            {
                throw new Exception("Token inválido o expirado.");
            }

            return idUsuario.Value;
        }
    }
}
