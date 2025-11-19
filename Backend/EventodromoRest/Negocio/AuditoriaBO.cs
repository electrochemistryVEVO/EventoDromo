using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class AuditoriaBO(Globales.Globales globales, DBManager.DBManager BD)
    {
        private readonly Globales.Globales globales = globales;
        private readonly DBManager.DBManager BD = BD;

        /// <summary>
        /// Obtiene la lista de clientes paginada con información de auditoría
        /// </summary>
        /// <param name="page">Número de página (1-indexed)</param>
        /// <param name="search">Término de búsqueda opcional</param>
        /// <returns>GenericResponse con lista de clientes y metadata de paginación</returns>
        public GenericResponse<ResponseObtenerClientes> ObtenerClientesAuditoria(int page, string? search)
        {
            try
            {
                // Validar página
                if (page < 1)
                {
                    page = 1;
                }

                // Tamaño de página fijo (6 clientes por página según mock data)
                const int pageSize = 6;

                // Llamar al mapper
                var mapper = new AuditoriaMapper(globales, BD);
                var (clientes, totalClientes) = mapper.ObtenerClientesPaginados(page, pageSize, search);

                // Calcular total de páginas
                int totalPages = totalClientes > 0 ? (int)Math.Ceiling((double)totalClientes / pageSize) : 1;

                // Construir respuesta
                var response = new ResponseObtenerClientes
                {
                    Clientes = clientes,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    TotalClientes = totalClientes
                };

                return new GenericResponse<ResponseObtenerClientes>
                {
                    Success = true,
                    Message = "Clientes obtenidos exitosamente",
                    Data = response,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<ResponseObtenerClientes>
                {
                    Success = false,
                    Message = "Error al obtener los clientes",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        /// <summary>
        /// Obtiene el detalle completo de un cliente para auditoría
        /// </summary>
        /// <param name="clienteId">ID del cliente</param>
        /// <param name="pageHistorial">Página del historial de actividades</param>
        /// <param name="pageSizeHistorial">Tamaño de página del historial</param>
        /// <returns>GenericResponse con el detalle del cliente</returns>
        public GenericResponse<ClienteDetalleDTO> ObtenerDetalleCliente(int clienteId, int pageHistorial = 1, int pageSizeHistorial = 5)
        {
            try
            {
                // Validar ID
                if (clienteId <= 0)
                {
                    return new GenericResponse<ClienteDetalleDTO>
                    {
                        Success = false,
                        Message = "ID de cliente inválido",
                        Data = null,
                        Error = "INVALID_CLIENT_ID"
                    };
                }

                // Validar página
                if (pageHistorial < 1)
                {
                    pageHistorial = 1;
                }

                // Llamar al mapper con paginación
                var mapper = new AuditoriaMapper(globales, BD);
                var detalle = mapper.ObtenerDetalleClientePorId(clienteId, pageHistorial, pageSizeHistorial);

                if (detalle == null)
                {
                    return new GenericResponse<ClienteDetalleDTO>
                    {
                        Success = false,
                        Message = $"No se encontró el cliente con ID {clienteId}",
                        Data = null,
                        Error = "CLIENT_NOT_FOUND"
                    };
                }

                return new GenericResponse<ClienteDetalleDTO>
                {
                    Success = true,
                    Message = "Detalle del cliente obtenido exitosamente",
                    Data = detalle,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<ClienteDetalleDTO>
                {
                    Success = false,
                    Message = "Error al obtener el detalle del cliente",
                    Data = null,
                    Error = ex.Message
                };
            }
        }
    }
}
