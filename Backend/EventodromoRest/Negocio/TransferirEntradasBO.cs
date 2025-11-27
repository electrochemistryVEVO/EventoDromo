using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Servicios;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace EventodromoRest.Negocio
{
    public class TransferirEntradasBO(Globales.Globales globales, DBManager.DBManager DB, IConfiguration configuration)
    {
        private readonly DBManager.DBManager DB = DB;
        private readonly Globales.Globales globales = globales;
        private readonly IConfiguration _configuration = configuration;

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

                // Marcar entradas como pendientes y obtener los IDs afectados
                List<int> idsEntradasTransferidas = mapper.MarcarEntradasComoPendientes(request.entradas, request.emailDestino);
                
                if (idsEntradasTransferidas.Count == 0)
                {
                    return new GenericResponse<TransferirEntradasResponse>
                    {
                        Success = false,
                        Message = "No se pudieron marcar las entradas",
                        Data = null,
                        Error = "No se encontraron entradas para transferir"
                    };
                }

                // Generar token único para esta transferencia (no usar TokenService, solo Guid)
                string tokenTransferencia = Guid.NewGuid().ToString("N"); // Token simple para la transferencia
                
                // Obtener horas de expiraci\u00f3n desde configuraci\u00f3n
                var dromopuntosMapper = new DromopuntosMapper(globales, DB);
                int horasExpiracion = dromopuntosMapper.ObtenerHorasExpiracionTransferencia();

                // Registrar la transferencia pendiente en la tabla
                var transferenciaPendiente = new TransferenciaPendiente
                {
                    Token = tokenTransferencia,
                    NumeroTransaccion = request.entradas[0].numeroTransaccion,
                    EmailRemitente = request.emailRemitente ?? "",
                    EmailDestino = request.emailDestino,
                    CantidadEntradas = idsEntradasTransferidas.Count,
                    DetalleEntradas = JsonSerializer.Serialize(idsEntradasTransferidas),
                    Estado = "pendiente",
                    FechaCreacion = DateTime.Now,
                    FechaExpiracion = DateTime.Now.AddHours(horasExpiracion)
                };

                bool registroExitoso = mapper.RegistrarTransferenciaPendiente(transferenciaPendiente);
                
                if (!registroExitoso)
                {
                    // Si falla el registro, revertir el estado de las entradas
                    mapper.CancelarTransferencia(idsEntradasTransferidas);
                    
                    return new GenericResponse<TransferirEntradasResponse>
                    {
                        Success = false,
                        Message = "Error al registrar transferencia",
                        Data = null,
                        Error = "No se pudo completar el registro de la transferencia"
                    };
                }

                // Obtener información del evento para el email
                string nombreEvento = ObtenerNombreEventoPorTransaccion(request.entradas[0].numeroTransaccion);
                
                // Enviar emails - Obtener nombres de tipos de entrada en vez de IDs
                var emailService = new EmailService();
                var tiposEntradaTexto = request.entradas.Select(e => 
                {
                    string nombreTipo = mapper.ObtenerNombreTipoEntrada(e.idTipoEntrada);
                    return $"{e.cantidad}x {nombreTipo}";
                }).ToList();
                
                // Enviar emails de forma asíncrona sin bloquear la respuesta
                string urlBase = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
                _ = Task.Run(async () =>
                {
                    try
                    {
                        // Email al destinatario con botones de aceptar/rechazar
                        await emailService.EnviarEmailDestinatarioTransferenciaAsync(
                            request.emailDestino,
                            request.nombreRemitente ?? "Un usuario",
                            nombreEvento,
                            idsEntradasTransferidas.Count,
                            tiposEntradaTexto,
                            tokenTransferencia,
                            urlBase,
                            horasExpiracion
                        );

                        // Email al remitente confirmando el envío
                        if (!string.IsNullOrWhiteSpace(request.emailRemitente))
                        {
                            await emailService.EnviarEmailRemitenteTransferenciaAsync(
                                request.emailRemitente,
                                request.nombreRemitente ?? "Usuario",
                                nombreEvento,
                                request.emailDestino,
                                idsEntradasTransferidas.Count,
                                tiposEntradaTexto,
                                horasExpiracion
                            );
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"⚠️ No se pudo enviar emails de transferencia: {ex.Message}");
                    }
                });

                var response = new TransferirEntradasResponse
                {
                    emailDestino = request.emailDestino,
                    totalEntradas = idsEntradasTransferidas.Count
                };

                return new GenericResponse<TransferirEntradasResponse>
                {
                    Success = true,
                    Message = $"Transferencia enviada exitosamente. El destinatario tiene {horasExpiracion} horas para aceptarla.",
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
        /// Obtiene el nombre del evento asociado a una transacción.
        /// </summary>
        private string ObtenerNombreEventoPorTransaccion(string? numeroTransaccion)
        {
            if (string.IsNullOrWhiteSpace(numeroTransaccion))
                return "evento";

            try
            {
                var mapper = new TransferirEntradasMapper(globales, DB);
                return mapper.ObtenerNombreEventoPorTransaccion(numeroTransaccion);
            }
            catch
            {
                return "evento";
            }
        }

        /// <summary>
        /// Procesa la respuesta del destinatario (aceptar o rechazar transferencia).
        /// </summary>
        public GenericResponse<string> ResponderTransferencia(ResponderTransferenciaRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Token))
                {
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = "Token inválido",
                        Data = null,
                        Error = "Debe proporcionar un token válido"
                    };
                }

                var mapper = new TransferirEntradasMapper(globales, DB);
                
                // Buscar la transferencia pendiente
                var transferencia = mapper.ObtenerTransferenciaPorToken(request.Token);
                
                if (transferencia == null)
                {
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = "Transferencia no encontrada",
                        Data = null,
                        Error = "El token proporcionado no existe o ya fue procesado"
                    };
                }

                if (transferencia.Estado != "pendiente")
                {
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = $"Transferencia ya {transferencia.Estado}",
                        Data = null,
                        Error = $"Esta transferencia ya fue {transferencia.Estado}"
                    };
                }

                if (DateTime.Now > transferencia.FechaExpiracion)
                {
                    // Marcar como expirada y devolver entradas
                    mapper.ActualizarEstadoTransferencia(request.Token, "expirada");
                    
                    if (!string.IsNullOrWhiteSpace(transferencia.DetalleEntradas))
                    {
                        List<int>? idsEntradas = JsonSerializer.Deserialize<List<int>>(transferencia.DetalleEntradas);
                        if (idsEntradas != null && idsEntradas.Count > 0)
                        {
                            mapper.CancelarTransferencia(idsEntradas);
                        }
                    }
                    
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = "Transferencia expirada",
                        Data = null,
                        Error = "Esta transferencia ha expirado (más de 24 horas)"
                    };
                }

                if (string.IsNullOrWhiteSpace(transferencia.DetalleEntradas))
                {
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = "Datos de transferencia incompletos",
                        Data = null,
                        Error = "La transferencia no tiene detalles válidos"
                    };
                }

                List<int>? idsEntradasAfectadas = JsonSerializer.Deserialize<List<int>>(transferencia.DetalleEntradas);
                
                if (idsEntradasAfectadas == null || idsEntradasAfectadas.Count == 0)
                {
                    return new GenericResponse<string>
                    {
                        Success = false,
                        Message = "No se pudieron procesar las entradas",
                        Data = null,
                        Error = "Los datos de las entradas no son válidos"
                    };
                }

                if (request.Accion?.ToLower() == "aceptar")
                {
                    // Obtener el ID del cliente destinatario por email
                    int? idClienteDestinatario = mapper.ObtenerIdClientePorEmail(transferencia.EmailDestino);
                    
                    if (!idClienteDestinatario.HasValue)
                    {
                        return new GenericResponse<string>
                        {
                            Success = false,
                            Message = "Destinatario no encontrado",
                            Data = null,
                            Error = "No se pudo encontrar el cliente destinatario"
                        };
                    }
                    
                    // Crear nueva transacción para el destinatario
                    int? idNuevaTransaccion = mapper.CrearTransaccionParaTransferencia(
                        idClienteDestinatario.Value,
                        transferencia,
                        idsEntradasAfectadas
                    );
                    
                    if (!idNuevaTransaccion.HasValue)
                    {
                        return new GenericResponse<string>
                        {
                            Success = false,
                            Message = "Error al crear transacción",
                            Data = null,
                            Error = "No se pudo crear la transacción para las entradas transferidas"
                        };
                    }
                    
                    // Confirmar la transferencia y cambiar dueño
                    bool confirmado = mapper.ConfirmarTransferencia(idsEntradasAfectadas, idClienteDestinatario);
                    
                    if (confirmado)
                    {
                        mapper.ActualizarEstadoTransferencia(request.Token, "aceptada");
                        
                        // Registrar en auditoría (tipo 2 = Transferencia Enviada para remitente)
                        int? idClienteRemitente = mapper.ObtenerIdClientePorTransaccion(transferencia.NumeroTransaccion);
                        
                        if (idClienteRemitente.HasValue)
                        {
                            var auditoriaMapper = new AuditoriaMapper(globales, DB);
                            var auditoria = new Auditoria
                            {
                                idcliente = idClienteRemitente.Value,
                                idtipoauditoria = 2, // Tipo: Transferencia Enviada
                                descripcion = $"Transferencia de {transferencia.CantidadEntradas} entrada(s) a {transferencia.EmailDestino}",
                                fechahora = DateTime.Now,
                                monto = 0
                            };
                            auditoriaMapper.InsertarAuditoria(auditoria);
                        }
                        
                        // Registrar en auditoría (tipo 6 = Transferencia Recibida para destinatario)
                        // Reutilizamos idClienteDestinatario que ya fue obtenido anteriormente
                        var auditoriaMapperRecibida = new AuditoriaMapper(globales, DB);
                        var auditoriaRecibida = new Auditoria
                        {
                            idcliente = idClienteDestinatario.Value,
                            idtipoauditoria = 6, // Tipo: Transferencia Recibida
                            descripcion = $"Recibió transferencia de {transferencia.CantidadEntradas} entrada(s) de {transferencia.EmailRemitente ?? "usuario"}",
                            fechahora = DateTime.Now,
                            monto = 0
                        };
                        auditoriaMapperRecibida.InsertarAuditoria(auditoriaRecibida);
                        
                        return new GenericResponse<string>
                        {
                            Success = true,
                            Message = "¡Entradas aceptadas exitosamente!",
                            Data = "aceptada",
                            Error = null
                        };
                    }
                }
                else if (request.Accion?.ToLower() == "rechazar")
                {
                    // Rechazar y devolver entradas al remitente
                    bool cancelado = mapper.CancelarTransferencia(idsEntradasAfectadas);
                    
                    if (cancelado)
                    {
                        mapper.ActualizarEstadoTransferencia(request.Token, "rechazada");
                        
                        return new GenericResponse<string>
                        {
                            Success = true,
                            Message = "Transferencia rechazada. Las entradas fueron devueltas al remitente.",
                            Data = "rechazada",
                            Error = null
                        };
                    }
                }

                return new GenericResponse<string>
                {
                    Success = false,
                    Message = "Acción inválida",
                    Data = null,
                    Error = "La acción debe ser 'aceptar' o 'rechazar'"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<string>
                {
                    Success = false,
                    Message = "Error al procesar respuesta",
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
