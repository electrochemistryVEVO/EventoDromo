using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Negocio
{
    public class TransferirEntradasBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly DBManager.DBManager DB = DB;
        private readonly Globales.Globales globales = globales;

        /// <summary>
        /// Obtiene los tipos de entrada disponibles para transferir de una transacción específica.
        /// </summary>
        public GenericResponse<List<TipoEntradaDisponibleDTO>> ObtenerTiposEntradaDisponibles(
            string numeroTransaccion,
            string tituloEvento,
            string fechaEvento)
        {
            try
            {
                // Validar parámetros
                if (string.IsNullOrWhiteSpace(numeroTransaccion) || 
                    string.IsNullOrWhiteSpace(tituloEvento) || 
                    string.IsNullOrWhiteSpace(fechaEvento))
                {
                    return new GenericResponse<List<TipoEntradaDisponibleDTO>>
                    {
                        Success = false,
                        Message = "Parámetros incompletos",
                        Data = null,
                        Error = "Debe proporcionar número de transacción, título del evento y fecha"
                    };
                }

                var mapper = new TransferirEntradasMapper(globales, DB);
                var tipos = mapper.ObtenerTiposEntradaDisponibles(numeroTransaccion, tituloEvento, fechaEvento);

                return new GenericResponse<List<TipoEntradaDisponibleDTO>>
                {
                    Success = true,
                    Message = $"Se encontraron {tipos.Count} tipos de entrada disponibles",
                    Data = tipos,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<List<TipoEntradaDisponibleDTO>>
                {
                    Success = false,
                    Message = "Error al obtener tipos de entrada",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        /// <summary>
        /// Transfiere entradas a otro usuario por correo electrónico.
        /// FASE 1: Solo valida y retorna éxito simulado. La transferencia real se implementará en Fase 2.
        /// </summary>
        public GenericResponse<TransferirEntradasResponse> TransferirEntradas(TransferirEntradasRequest request)
        {
            try
            {
                // Validar request
                if (request == null || request.entradas == null || request.entradas.Count == 0)
                {
                    return new GenericResponse<TransferirEntradasResponse>
                    {
                        Success = false,
                        Message = "Solicitud inválida",
                        Data = null,
                        Error = "Debe especificar al menos una entrada para transferir"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.emailDestino))
                {
                    return new GenericResponse<TransferirEntradasResponse>
                    {
                        Success = false,
                        Message = "Email de destino requerido",
                        Data = null,
                        Error = "Debe proporcionar un email de destino válido"
                    };
                }

                // Validar formato de email
                if (!IsValidEmail(request.emailDestino))
                {
                    return new GenericResponse<TransferirEntradasResponse>
                    {
                        Success = false,
                        Message = "Email inválido",
                        Data = null,
                        Error = "El formato del email de destino no es válido"
                    };
                }

                var mapper = new TransferirEntradasMapper(globales, DB);

                // Validar que las entradas existan y estén disponibles
                bool entradasValidas = mapper.ValidarEntradasDisponibles(request.entradas);
                if (!entradasValidas)
                {
                    return new GenericResponse<TransferirEntradasResponse>
                    {
                        Success = false,
                        Message = "Entradas no disponibles",
                        Data = null,
                        Error = "Una o más entradas no están disponibles para transferir"
                    };
                }

                // FASE 1: Marcar entradas como transferidas en BD
                // En Fase 2 se implementará:
                // - Envío de correos electrónicos
                // - Registro en historial de transferencias con más detalle
                
                int totalTransferidas = mapper.MarcarEntradasComoTransferidas(request.entradas, request.emailDestino);

                var response = new TransferirEntradasResponse
                {
                    emailDestino = request.emailDestino,
                    totalEntradas = totalTransferidas
                };

                return new GenericResponse<TransferirEntradasResponse>
                {
                    Success = true,
                    Message = "Transferencia realizada exitosamente",
                    Data = response,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<TransferirEntradasResponse>
                {
                    Success = false,
                    Message = "Error al transferir entradas",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        /// <summary>
        /// Obtiene el estado de las entradas para una transacción.
        /// </summary>
        public GenericResponse<EstadoEntradasDTO> ObtenerEstadoEntradas(string numeroTransaccion)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(numeroTransaccion))
                {
                    return new GenericResponse<EstadoEntradasDTO>
                    {
                        Success = false,
                        Message = "Número de transacción requerido",
                        Data = null,
                        Error = "Debe proporcionar un número de transacción"
                    };
                }

                var mapper = new TransferirEntradasMapper(globales, DB);
                var estadoDict = mapper.ObtenerEstadoEntradas(numeroTransaccion);
                
                var estadoDTO = new EstadoEntradasDTO
                {
                    Total = estadoDict.GetValueOrDefault("total", 0),
                    Disponibles = estadoDict.GetValueOrDefault("disponibles", 0),
                    Transferidas = estadoDict.GetValueOrDefault("transferidas", 0),
                    Pendientes = estadoDict.GetValueOrDefault("pendientes", 0)
                };

                return new GenericResponse<EstadoEntradasDTO>
                {
                    Success = true,
                    Message = "Estado obtenido exitosamente",
                    Data = estadoDTO,
                    Error = null
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<EstadoEntradasDTO>
                {
                    Success = false,
                    Message = "Error al obtener estado",
                    Data = null,
                    Error = ex.Message
                };
            }
        }

        /// <summary>
        /// Valida si un email tiene formato correcto.
        /// </summary>
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
