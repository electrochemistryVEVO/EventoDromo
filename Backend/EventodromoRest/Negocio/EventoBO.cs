using EventodromoRest.Controllers;
using EventodromoRest.Globales;
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
namespace EventodromoRest.Negocio
{
    public class EventoBO(Globales.Globales globales, DBManager.DBManager DB)
    {

        public GenericResponse<IEnumerable<Evento>> ListarEventosPorTipo(int tipoEventoId)
        {
            EventoMapper mapper = new EventoMapper(globales, DB);
            List<Evento> eventos = mapper.ListarEventosPorTipo(tipoEventoId);
            GenericResponse<IEnumerable<Evento>> response = new GenericResponse<IEnumerable<Evento>>();
            response.Success = true;
            response.Data = eventos;
            return response;
        }
        public GenericResponse<IEnumerable<Evento>> ListarEventosPorBusqueda(string busqueda)
        {
            EventoMapper mapper = new EventoMapper(globales, DB);
            List<Evento> eventos = mapper.ListarEventosBusqueda(busqueda);
            GenericResponse<IEnumerable<Evento>> response = new GenericResponse<IEnumerable<Evento>>();
            response.Success = true;
            response.Data = eventos;
            return response;
        }
        public GenericResponse<ResponseObtenerEventoPorId> ObtenerEventoPorId(int eventoId)
        {
            EventoMapper mapper = new EventoMapper(globales, DB);
            ResponseObtenerEventoPorId data = mapper.ObtenerDatosCompletosEventoPorId(eventoId);

            if (data == null)
            {
                return new GenericResponse<ResponseObtenerEventoPorId>
                {
                    Success = false,
                    Message = "Evento no encontrado.",
                    Data = null
                };
            }

            // Construir la respuesta
            GenericResponse<ResponseObtenerEventoPorId> response = new GenericResponse<ResponseObtenerEventoPorId>();
            response.Success = true;
            response.Data = data;
            return response;
            /*
            EventoMapper mapper = new EventoMapper(globales, DB);
            ResponseEvento evento = mapper.ObtenerResponseEventoPorId(eventoId);
            ResponseLocal local = new LocalMapper(globales, DB).ObtenerLocalPorIdEvento(eventoId);
            List<ResponseFechaEvento> funciones = new FechaEventoMapper(globales, DB).ListarResponseFechaEventoPorEvento(eventoId);

            GenericResponse<ResponseObtenerEventoPorId> response = new GenericResponse<ResponseObtenerEventoPorId>();
            response.Success = true;
            response.Data = new ResponseObtenerEventoPorId()
            {
                evento = evento,
                local = local,
                funciones = funciones

            };
            return response;
            */
        }
        public GenericResponse<ResponseListarEventosYLocales> ListarEventosYLocales()
        {
            try
            {
                var eventoMapper = new EventoMapper(globales, DB);
                var localMapper = new LocalMapper(globales, DB);

                var eventosResponse = eventoMapper.ListarEventosActivosCompletos();
                var localesResponse = localMapper.ListarLocalesDestacados();

                if (eventosResponse.Count == 0 && localesResponse.Count == 0)
                {
                    return new GenericResponse<ResponseListarEventosYLocales>
                    {
                        Success = true,
                        Message = "No hay eventos activos ni locales disponibles.",
                        Error = null,
                        Data = null
                    };
                }

                return new GenericResponse<ResponseListarEventosYLocales>
                {
                    Success = true,
                    Message = "Eventos y locales activos obtenidos correctamente.",
                    Error = null,
                    Data = new ResponseListarEventosYLocales
                    {
                        eventos = eventosResponse,
                        locales = localesResponse
                    }
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<ResponseListarEventosYLocales>
                {
                    Success = false,
                    Message = null,
                    Error = ex.Message,
                    Data = null
                };
            }
        }

        private double obtenerPrecioMinimoEvento(EventoActivoProxFechaDTO e)
        {
            FechaEvento fechaEvento = new FechaEventoMapper(globales, DB).ListarFechaEventoPorEvento(e.id)[0];
            List<TipoEntrada> tipoEntradas = new TipoEntradaMapper(globales, DB).ListarTipoEntradaPorFechaEvento((int)fechaEvento.id); //raro

            return double.Parse(tipoEntradas.Min(t => t.precio).ToString());
        }

        public int CrearEvento(Evento nuevoEvento, List<string> horarios, List<EntradaRequest> entradas)
        {
            // 1️⃣ Insertar el evento principal
            var eventoMapper = new EventoMapper(globales, DB);
            int idEvento = eventoMapper.InsertarEvento(nuevoEvento);

            // 2️⃣ Insertar las fechas (horarios)
            var fechaMapper = new FechaEventoMapper(globales, DB);
            var entradaMapper = new TipoEntradaMapper(globales, DB);

            foreach (var fecha in horarios)
            {
                // Crear la fechaEvento
                var fechaEvento = new FechaEvento
                {
                    fechaHora = DateTime.Parse(fecha),
                    idEvento = idEvento
                };

                // Insertar y obtener el id de la fechaEvento recién creada
                int idFechaEvento = fechaMapper.InsertarFechaEvento(fechaEvento);

                // 3️⃣ Por cada fechaEvento, insertar todas las entradas
                foreach (var entrada in entradas)
                {
                    var nuevaEntrada = new TipoEntrada
                    {
                        nombre = entrada.nombre,
                        precio = entrada.precio,
                        cantidadEntradas = entrada.cantidad,
                        limiteCompra = entrada.limiteCompra,
                        puntos = entrada.puntos,
                        cantidadVendida = 0,
                        idFechaEvento = idFechaEvento   // ✅ asignar el id correspondiente
                    };

                    entradaMapper.InsertarTipoEntrada(nuevaEntrada);
                }
            }

            return idEvento;
        }

        public GenericResponse<EventoDetalleDTO> ObtenerDetalleEvento(int idEvento)
        {
            try
            {
                // --- 1. Instanciar Mappers ---
                var eventoMapper = new EventoMapper(globales, DB);
                var fechaEventoMapper = new FechaEventoMapper(globales, DB);
                var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);

                // --- 2. Obtener datos principales ---
                // Tu EventoMapper.ObtenerEventoPorId ya carga el Local (necesario para la capacidad)
                Evento evento = eventoMapper.ObtenerEventoPorId(idEvento);

                if (evento == null)
                {
                    return new GenericResponse<EventoDetalleDTO> { Success = false, Message = "No se encontró el evento con el ID " + idEvento, Error = "Not Found" };
                }

                // --- 3. Obtener listas relacionadas (Horarios y Entradas) ---
                List<FechaEvento> horariosDB = fechaEventoMapper.ListarHorariosPorEvento(idEvento);
                List<TipoEntrada> entradasDB = tipoEntradaMapper.ListarEntradasPorEvento(idEvento);

                // --- 4. Transformar (Mapear) a los DTOs ---
                var dto = new EventoDetalleDTO
                {
                    Nombre = evento.nombre,
                    Descripcion = evento.descripcion,
                    ImagenURL = evento.imagenURL,
                    LocalId = evento.idLocal,
                    TipoEventoId = evento.idTipoEvento,
                    Capacidad = evento.Local?.capacidad ?? 0,

                    // Formato ISO 8601 "YYYY-MM-DDTHH:mm" (la 's' es "sortable")
                    FechaPublicacion = evento.fechaPublicacion.ToString("s"),
                    FechaCompra = evento.fechaCompra.ToString("s"),

                    // Mapear la lista de horarios
                    Horarios = horariosDB.Select(h => new EventoDatosHorarioDTO
                    {
                        Id = h.id ?? 0,
                        Fecha = h.fechaHora.HasValue ? h.fechaHora.Value.ToString("yyyy-MM-dd") : "", // Formato YYYY-MM-DD
                        Hora = h.fechaHora.HasValue ? h.fechaHora.Value.ToString("HH:mm") : ""      // Formato HH:mm
                    }).ToList(),

                    // Mapear la lista de entradas
                    Entradas = entradasDB.Select(e => new EventoDatosEntradaDTO
                    {
                        Id = e.id,
                        Nombre = e.nombre,
                        Precio = e.precio,
                        Cantidad = e.cantidadEntradas ?? 0, // Renombrado
                        LimiteCompra = e.limiteCompra ?? 0,
                        Puntos = e.puntos ?? 0
                    }).ToList()
                };

                // --- 5. Retornar éxito ---
                return new GenericResponse<EventoDetalleDTO> { Success = true, Message = "Evento obtenido", Data = dto };
            }
            catch (Exception ex)
            {
                // En caso de un error de SQL o lógica
                return new GenericResponse<EventoDetalleDTO> { Success = false, Message = "Error interno al obtener el evento.", Error = ex.Message };
            }
        }

        public ResponseEventoGetEvents? GetEventosFiltrados(
            string? search,
            int? localId,
            string? status,
            DateTime? startDate,
            DateTime? endDate,
            int page,
            int pageSize)
        {
            var mapper = new EventoMapper(globales, DB);
            var mapperFecha = new FechaEventoMapper(globales, DB);
            var mapperEntrada = new TipoEntradaMapper(globales, DB);

            List<Evento> listaEventos = mapper.ObtenerEventosFiltrados(
                search, localId, status, startDate, endDate, page, pageSize, out int totalEventos);

            if (listaEventos.Count == 0)
                return null;

            int totalPaginas = (int)Math.Ceiling((double)totalEventos / pageSize);

            var idsEvento = listaEventos.Select(e => e.id).ToList();

            var horarios = mapperFecha.ObtenerFechaEventosPorListaEventoIds(idsEvento);

            var idsFecha = horarios.Select(h => h.id ?? 0).ToList();

            var entradas = mapperEntrada.ObtenerPorListaFechaEventoIds(idsFecha);

            var entradasPorFechaEvento = entradas.GroupBy(t => t.idFechaEvento)
                                                 .ToDictionary(g => g.Key, g => g.ToList());

            var horariosPorEvento = horarios.GroupBy(h => h.idEvento)
                                            .ToDictionary(g => g.Key, g => g.ToList());
            DateTime ahora = DateTime.Now;

            var eventosDTO = listaEventos.Select(e =>
            {
                var horariosDeEvento = horariosPorEvento.ContainsKey(e.id)
                    ? horariosPorEvento[e.id]
                    : new List<FechaEvento>();

                decimal ingresosBrutosEvento = 0;

                var horariosDTO = horariosDeEvento.Select(h =>
                {
                    var listaEntradas = entradasPorFechaEvento.ContainsKey(h.id ?? 0)
                        ? entradasPorFechaEvento[h.id ?? 0]
                        : new List<TipoEntrada>();

                    int actual = listaEntradas.Sum(t => t.cantidadVendida ?? 0);
                    int total = listaEntradas.Sum(t => t.cantidadEntradas ?? 0);

                    foreach (var tipo in listaEntradas)
                    {
                        int vendidas = tipo.cantidadVendida ?? 0;
                        decimal precio = tipo.precio;
                        ingresosBrutosEvento += vendidas * precio;
                    }

                    return new EventoHorarioDTO
                    {
                        Horario = h.fechaHora ?? DateTime.MinValue,
                        Ocupacion = new OcupacionDTO
                        {
                            Actual = actual,
                            Total = total
                        }
                    };
                }).ToList();

                string estado = "Creado";

                if (e.isDeleted)
                {
                    estado = "Cancelado";
                }
                else if (horariosDTO.Count > 0 && horariosDTO.All(h => h.Horario < ahora))
                {
                    estado = "Concluido";
                }
                else if (ahora < e.fechaPublicacion)
                {
                    estado = "Creado";
                }
                else if (ahora >= e.fechaPublicacion && ahora < e.fechaCompra)
                {
                    estado = "Publicado";
                }
                else if (ahora >= e.fechaCompra)
                {
                    // Si aún hay horarios futuros → "En venta"
                    bool hayFuturos = horariosDTO.Any(h => h.Horario >= ahora);
                    estado = hayFuturos ? "En venta" : "Concluido";
                }

                return new ResponseEventoGetEventsEventos
                {
                    Id = e.id,
                    Nombre = e.nombre,
                    Local = e.Local?.nombre ?? "",
                    Tipo = e.TipoEvento?.nombre ?? "",
                    FechaPublicacion = e.fechaPublicacion,
                    FechaCompra = e.fechaCompra,
                    Horarios = horariosDTO,
                    Estado = estado,
                    IngresosBrutos = ingresosBrutosEvento
                };

            }).ToList();

            return new ResponseEventoGetEvents
            {
                Data = eventosDTO,
                Pagination = new Pagination
                {
                    CurrentPage = page,
                    TotalPages = totalPaginas,
                    TotalEvents = totalEventos
                }
            };
        }

        public List<ResponseEventoGetEventosMasVendidos> EventoGetEventosMasVendidos()
        {
            var mapper = new EventoMapper(globales, DB);

            var lista = mapper.ObtenerEventosMasVendidos();

            return lista;
        }

        public GenericResponse<string> ActualizarEvento(ActualizarEventoRequest request)
        {
            var eventoMapper = new EventoMapper(globales, DB);
            var response = eventoMapper.ActualizarEvento(request);

            return new GenericResponse<string>
            {
                Success = true,
                Message = "Evento actualizado correctamente.",
                Error = null,
                Data = response
            };
        }

        public GenericResponse<bool> EliminarEvento(int idEvento, int idAdmin)
        {
            try
            {
                var eventoMapper = new EventoMapper(globales, DB);

                // 1️⃣ Verificar que el evento existe (sin cargar relaciones pesadas)
                var evento = eventoMapper.ObtenerEventoPorIdSimple(idEvento);
                if (evento == null)
                {
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "El evento no existe.",
                        Error = "Evento no encontrado.",
                        Data = false
                    };
                }

                // 2️⃣ Verificar que el evento no esté ya eliminado
                if (evento.isDeleted)
                {
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "El evento ya fue eliminado previamente.",
                        Error = "Evento ya eliminado.",
                        Data = false
                    };
                }

                // 3️⃣ Realizar eliminación lógica
                evento.isDeleted = true;
                int filasAfectadas = eventoMapper.ModificarEvento(evento);

                if (filasAfectadas > 0)
                {
                    return new GenericResponse<bool>
                    {
                        Success = true,
                        Message = "Evento eliminado correctamente.",
                        Error = null,
                        Data = true
                    };
                }
                else
                {
                    return new GenericResponse<bool>
                    {
                        Success = false,
                        Message = "No se pudo eliminar el evento.",
                        Error = "Error al actualizar la base de datos.",
                        Data = false
                    };
                }
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    Success = false,
                    Message = "Error interno al eliminar el evento.",
                    Error = ex.Message,
                    Data = false
                };
            }
        }

        public GenericResponse<CrearEventoResponseDTO> CrearEventoCompleto(CrearEventoDTOFinal dto, int creadorId)
        {
            try
            {
                // 1. Instanciar Mappers
                var eventoMapper = new EventoMapper(globales, DB);
                var fechaMapper = new FechaEventoMapper(globales, DB);
                var entradaMapper = new TipoEntradaMapper(globales, DB);
                // No necesitamos DescuentoMapper, usaremos eventoMapper

                // 2. Crear el Evento Padre
                var evento = new Evento
                {
                    nombre = dto.nombre,
                    descripcion = dto.descripcion,
                    idLocal = dto.localId,
                    idTipoEvento = dto.tipoEventoId,
                    creadoPor = creadorId,
                    fechaPublicacion = DateTime.Parse(dto.fechaPublicacion),
                    fechaCompra = DateTime.Parse(dto.fechaCompra),
                    imagenURL = dto.imagenURL,
                    isDeleted = false
                };

                int idEvento = eventoMapper.InsertarEvento(evento);

                // 3. Iterar sobre los Horarios
                if (dto.horarios != null)
                {
                    foreach (var horarioStr in dto.horarios)
                    {
                        DateTime fechaHora = DateTime.Parse(horarioStr);
                        int idFecha = fechaMapper.InsertarFechaEvento(fechaHora, idEvento);

                        // 4. Por cada horario, crear sus Tipos de Entrada
                        if (dto.entradas != null)
                        {
                            foreach (var entDTO in dto.entradas)
                            {
                                var entrada = new TipoEntrada
                                {
                                    nombre = entDTO.nombre,
                                    precio = entDTO.precio,
                                    cantidadEntradas = entDTO.cantidad,
                                    limiteCompra = entDTO.limiteCompra,
                                    cantidadVendida=0,
                                    puntos = entDTO.puntos,
                                    idFechaEvento = idFecha
                                };

                                int idRealEntrada = entradaMapper.InsertarTipoEntrada(entrada);

                                // 5. Insertar Descuentos (Usando EventoMapper como medida provisional)
                                if (dto.descuentos != null)
                                {
                                    var descuentosParaEstaEntrada = dto.descuentos
                                        .Where(d => d.tipoEntradaId == entDTO.idTemporal).ToList();

                                    foreach (var descDTO in descuentosParaEstaEntrada)
                                    {
                                        var descuento = new Descuento
                                        {
                                            nombre = descDTO.nombre,
                                            codigo = descDTO.codigo,
                                            tipo = descDTO.tipo,
                                            valor = descDTO.valor,
                                            fechaInicio = DateTime.Parse(descDTO.fechaInicio),
                                            fechaFin = DateTime.Parse(descDTO.fechaFin),
                                            usosMaximos = descDTO.usosMaximos,
                                            usosActuales = 0,
                                            idTipoEntrada = idRealEntrada
                                        };
                                        // CAMBIO: Llamamos al método en EventoMapper
                                        eventoMapper.InsertarDescuento(descuento);
                                    }
                                }
                            }
                        }
                    }
                }

                return new GenericResponse<CrearEventoResponseDTO>
                {
                    Success = true,
                    Message = "Evento creado exitosamente.",
                    Data = new CrearEventoResponseDTO { id = idEvento, nombre = evento.nombre }
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<CrearEventoResponseDTO>
                {
                    Success = false,
                    Message = "Error creando el evento.",
                    Error = ex.Message
                };
            }
        }

        public GenericResponse<ActualizarEventoResponseDTO> ActualizarEventoCompleto(ActualizarEventoDTO dto, int creadorId)
        {
            try
            {
                // LÓGICA INTELIGENTE: Si ID es 0, redirigir a CREAR
                // (Esta parte se mantiene porque es correcta para el caso de evento NUEVO)
                if (dto.idEvento == 0)
                {
                    var crearDto = new CrearEventoDTOFinal
                    {
                        nombre = dto.nombre,
                        descripcion = dto.descripcion,
                        localId = dto.localId,
                        tipoEventoId = dto.tipoEventoId,
                        capacidad = dto.capacidad,
                        fechaPublicacion = dto.fechaPublicacion,
                        fechaCompra = dto.fechaCompra,
                        imagenURL = dto.imagenURL,
                        horarios = dto.horarios.Select(h => $"{h.fecha}T{h.hora}").ToList(),
                        entradas = dto.entradas.Select(e => new EntradaCreacionDTO
                        {
                            idTemporal = 0,
                            nombre = e.nombre,
                            precio = e.precio,
                            cantidad = e.cantidadEntradas,
                            limiteCompra = e.limiteCompra,
                            puntos = e.puntos
                        }).ToList(),
                        descuentos = dto.descuentos.Select(d => new DescuentoCreacionDTO
                        {
                            nombre = d.nombre,
                            codigo = d.codigo,
                            tipo = d.tipo,
                            valor = d.valor,
                            fechaInicio = d.fechaInicio,
                            fechaFin = d.fechaFin,
                            usosMaximos = d.usosMaximos,
                            tipoEntradaId = d.tipoEntradaId
                        }).ToList()
                    };

                    // Usamos el ID real que vino del controller
                    var resultadoCreacion = CrearEventoCompleto(crearDto, creadorId);

                    if (resultadoCreacion.Success)
                    {
                        return new GenericResponse<ActualizarEventoResponseDTO>
                        {
                            Success = true,
                            Message = "Evento creado exitosamente (desde actualizar).",
                            Data = new ActualizarEventoResponseDTO
                            {
                                idEvento = resultadoCreacion.Data.id,
                                nombre = resultadoCreacion.Data.nombre
                            }
                        };
                    }
                    else
                    {
                        return new GenericResponse<ActualizarEventoResponseDTO>
                        {
                            Success = false,
                            Message = resultadoCreacion.Message,
                            Error = resultadoCreacion.Error
                        };
                    }
                }

                var eventoMapper = new EventoMapper(globales, DB);
                var fechaMapper = new FechaEventoMapper(globales, DB);
                var entradaMapper = new TipoEntradaMapper(globales, DB);

                // 1. Validar y Actualizar Evento Padre
                var eventoExistente = eventoMapper.ObtenerEventoPorId(dto.idEvento);
                if (eventoExistente == null)
                {
                    return new GenericResponse<ActualizarEventoResponseDTO> { Success = false, Message = "Evento no encontrado.", Error = "404 Not Found" };
                }

                var eventoUpdate = new Evento
                {
                    id = dto.idEvento,
                    nombre = dto.nombre,
                    descripcion = dto.descripcion,
                    imagenURL = dto.imagenURL,
                    idLocal = dto.localId,
                    idTipoEvento = dto.tipoEventoId,
                    fechaPublicacion = DateTime.Parse(dto.fechaPublicacion),
                    fechaCompra = DateTime.Parse(dto.fechaCompra)
                };
                eventoMapper.ActualizarEventoExistente(eventoUpdate);

                // 2. Procesar Horarios (Upsert) - ¡LOGICA CORREGIDA AQUÍ!
                // Iteramos PRIMERO sobre todos los horarios para asegurar que existan en BD.
                if (dto.horarios != null)
                {
                    for (int i = 0; i < dto.horarios.Count; i++)
                    {
                        var h = dto.horarios[i];
                        DateTime fechaHoraCombinada = DateTime.Parse($"{h.fecha} {h.hora}");

                        if (h.id == 0)
                        {
                            // INSERTAR NUEVO HORARIO
                            int nuevoIdHorario = fechaMapper.InsertarFechaEvento(fechaHoraCombinada, dto.idEvento);

                            // ¡CLAVE! Actualizamos el ID en el objeto en memoria.
                            // Así, cuando procesemos las entradas, podrán encontrar este horario.
                            h.id = nuevoIdHorario;
                        }
                        else
                        {
                            // ACTUALIZAR HORARIO EXISTENTE
                            fechaMapper.ActualizarFechaEvento(h.id, fechaHoraCombinada);
                        }
                    }
                }

                // 3. Procesar Entradas (Upsert) - ¡LÓGICA CORREGIDA AQUÍ!
                if (dto.entradas != null)
                {
                    foreach (var e in dto.entradas)
                    {
                        int idHorarioReal = 0;

                        // Caso A: La entrada ya tiene un horario.id válido > 0 (entrada existente o vinculada a horario existente)
                        if (e.horario != null && e.horario.id > 0)
                        {
                            // Confiamos en el ID que viene del frontend
                            idHorarioReal = e.horario.id;
                        }
                        // Caso B: La entrada es nueva o su horario es nuevo (id=0)
                        else if (e.horario != null)
                        {
                            // Buscamos en la lista de horarios PRINCIPAL (dto.horarios) que YA TIENE LOS IDs REALES
                            // (porque el paso 2 ya se ejecutó y actualizó los IDs de 0 a >0)

                            // Usamos DateTime para comparar, no strings, para evitar problemas de formato "20:00" vs "20:00:00"
                            DateTime fechaHoraEntrada;
                            if (DateTime.TryParse($"{e.horario.fecha} {e.horario.hora}", out fechaHoraEntrada))
                            {
                                var horarioCoincidente = dto.horarios.FirstOrDefault(h =>
                                {
                                    DateTime fechaHoraLista;
                                    if (DateTime.TryParse($"{h.fecha} {h.hora}", out fechaHoraLista))
                                    {
                                        return fechaHoraLista == fechaHoraEntrada;
                                    }
                                    return false;
                                });

                                if (horarioCoincidente != null)
                                {
                                    idHorarioReal = horarioCoincidente.id;
                                }
                            }
                        }

                        // VALIDACIÓN CRÍTICA: Si no encontramos un ID válido, detenemos todo.
                        if (idHorarioReal <= 0 && e.idEntrada == 0)
                        {
                            return new GenericResponse<ActualizarEventoResponseDTO>
                            {
                                Success = false,
                                Message = $"Error crítico: No se encontró el horario para la entrada '{e.nombre}'. Fecha: {e.horario?.fecha} {e.horario?.hora}",
                                Error = "Foreign Key Error Prevented"
                            };
                        }

                        var entradaModelo = new TipoEntrada
                        {
                            id = e.idEntrada,
                            nombre = e.nombre,
                            precio = e.precio,
                            cantidadEntradas = e.cantidadEntradas,
                            limiteCompra = e.limiteCompra,
                            puntos = e.puntos,
                            idFechaEvento = idHorarioReal // Aquí usamos el ID real encontrado
                        };

                        if (e.idEntrada == 0)
                        {
                            // INSERTAR
                            entradaModelo.cantidadVendida = 0; // Inicializar
                            int nuevoIdEntrada = entradaMapper.InsertarTipoEntrada(entradaModelo);
                            e.idEntrada = nuevoIdEntrada; // Actualizamos ID en memoria
                        }
                        else
                        {
                           
                            if (idHorarioReal > 0)
                            {
                                entradaModelo.idFechaEvento = idHorarioReal;
                                entradaMapper.ActualizarTipoEntrada(entradaModelo);
                            }
                            else
                            {
                                // Si no encontramos el horario nuevo, quizás deberíamos mantener el viejo.
                                // Esto requeriría leer la entrada de la BD primero.
                                // Por ahora, asumimos que siempre enviamos horario válido.
                                entradaMapper.ActualizarTipoEntrada(entradaModelo);
                            }
                        }
                    }
                }

                // 4. Procesar Descuentos (Upsert)
                if (dto.descuentos != null)
                {
                    foreach (var d in dto.descuentos)
                    {
                        var descuentoModelo = new Descuento
                        {
                            id = d.id,
                            nombre = d.nombre,
                            codigo = d.codigo,
                            tipo = d.tipo,
                            valor = d.valor,
                            fechaInicio = DateTime.Parse(d.fechaInicio),
                            fechaFin = DateTime.Parse(d.fechaFin),
                            usosMaximos = d.usosMaximos,
                            idTipoEntrada = d.tipoEntradaId
                        };

                        if (d.id == 0)
                        {
                            if (d.tipoEntradaId > 0)
                            {
                                eventoMapper.InsertarDescuento(descuentoModelo);
                            }
                        }
                        else
                        {
                            eventoMapper.ActualizarPromocion(descuentoModelo);
                        }
                    }
                }

                return new GenericResponse<ActualizarEventoResponseDTO>
                {
                    Success = true,
                    Message = "Evento actualizado correctamente.",
                    Data = new ActualizarEventoResponseDTO { idEvento = dto.idEvento, nombre = dto.nombre }
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<ActualizarEventoResponseDTO>
                {
                    Success = false,
                    Message = "Error fatal actualizando el evento.",
                    Error = ex.Message
                };
            }
        }
    }
}