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
                        Id = h.id??0,
                        Fecha = h.fechaHora.HasValue ? h.fechaHora.Value.ToString("yyyy-MM-dd") : "", // Formato YYYY-MM-DD
                        Hora = h.fechaHora.HasValue ? h.fechaHora.Value.ToString("HH:mm") : ""      // Formato HH:mm
                    }).ToList(),

                    // Mapear la lista de entradas
                    Entradas = entradasDB.Select(e => new EventoDatosEntradaDTO
                    {
                        Id = e.id,
                        Nombre = e.nombre,
                        Precio = e.precio,
                        Cantidad = e.cantidadEntradas??0, // Renombrado
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

        public GenericResponse<EventoCrearMasivoResponseData> InsertarEventosMasivo(List<EventoMasivoItem> eventos, int idAdministrador)
        {
            var errores = new List<string>();
            int insertados = 0;
            int fallidos = 0;

            try
            {
                // 1. Validar que el array no esté vacío
                if (eventos == null || !eventos.Any())
                {
                    return new GenericResponse<EventoCrearMasivoResponseData>
                    {
                        Success = false,
                        Message = "El array de eventos no puede estar vacío.",
                        Data = new EventoCrearMasivoResponseData 
                        { 
                            insertados = 0, 
                            fallidos = 0,
                            errores = new List<string> { "El array de eventos no puede estar vacío." }
                        }
                    };
                }

                // Preparar mappers
                var eventoMapper = new EventoMapper(globales, DB);
                var localMapper = new LocalMapper(globales, DB);
                var tipoEventoMapper = new TipoEventoMapper(globales, DB);
                var fechaMapper = new FechaEventoMapper(globales, DB);
                var entradaMapper = new TipoEntradaMapper(globales, DB);

                // Obtener listas de IDs válidos para validación
                var localesExistentes = localMapper.ListarLocales2().Select(l => l.id).ToList();
                var tiposEventoExistentes = tipoEventoMapper.ListarTipoEvento().Select(t => t.id).ToList();

                // 2. Procesar cada evento individualmente
                for (int i = 0; i < eventos.Count; i++)
                {
                    var evento = eventos[i];
                    var nombreEvento = string.IsNullOrWhiteSpace(evento.nombre) ? $"Evento {i + 1}" : evento.nombre;

                    try
                    {
                        // Validar campos obligatorios
                        if (string.IsNullOrWhiteSpace(evento.nombre))
                        {
                            errores.Add($"Evento {i + 1}: El nombre es requerido.");
                            fallidos++;
                            continue;
                        }

                        if (string.IsNullOrWhiteSpace(evento.descripcion))
                        {
                            errores.Add($"Evento '{nombreEvento}': La descripción es requerida.");
                            fallidos++;
                            continue;
                        }

                        if (evento.localId <= 0)
                        {
                            errores.Add($"Evento '{nombreEvento}': El ID de local es requerido.");
                            fallidos++;
                            continue;
                        }

                        if (evento.tipoEventoId <= 0)
                        {
                            errores.Add($"Evento '{nombreEvento}': El ID de tipo de evento es requerido.");
                            fallidos++;
                            continue;
                        }

                        if (evento.capacidad <= 0)
                        {
                            errores.Add($"Evento '{nombreEvento}': La capacidad debe ser mayor a 0.");
                            fallidos++;
                            continue;
                        }

                        // Validar que localId exista
                        if (!localesExistentes.Contains(evento.localId))
                        {
                            errores.Add($"Evento '{nombreEvento}': El local con ID {evento.localId} no existe.");
                            fallidos++;
                            continue;
                        }

                        // Validar que tipoEventoId exista
                        if (!tiposEventoExistentes.Contains(evento.tipoEventoId))
                        {
                            errores.Add($"Evento '{nombreEvento}': El tipo de evento con ID {evento.tipoEventoId} no existe.");
                            fallidos++;
                            continue;
                        }

                        // Validar horarios
                        if (evento.horarios == null || !evento.horarios.Any())
                        {
                            errores.Add($"Evento '{nombreEvento}': Debe tener al menos un horario.");
                            fallidos++;
                            continue;
                        }

                        // Validar entradas
                        if (evento.entradas == null || !evento.entradas.Any())
                        {
                            errores.Add($"Evento '{nombreEvento}': Debe tener al menos una entrada.");
                            fallidos++;
                            continue;
                        }

                        // Validar formato de fechas
                        DateTime fechaPublicacion;
                        DateTime fechaCompra;

                        if (!DateTime.TryParse(evento.fechaPublicacion, out fechaPublicacion))
                        {
                            errores.Add($"Evento '{nombreEvento}': Formato de fecha de publicación inválido.");
                            fallidos++;
                            continue;
                        }

                        if (!DateTime.TryParse(evento.fechaCompra, out fechaCompra))
                        {
                            errores.Add($"Evento '{nombreEvento}': Formato de fecha de compra inválido.");
                            fallidos++;
                            continue;
                        }

                        // Validar que fechaPublicacion sea anterior a fechaCompra
                        if (fechaPublicacion >= fechaCompra)
                        {
                            errores.Add($"Evento '{nombreEvento}': La fecha de publicación debe ser anterior a la fecha de compra.");
                            fallidos++;
                            continue;
                        }

                        // Validar formato de horarios
                        var horariosValidos = new List<DateTime>();
                        bool horarioInvalido = false;
                        foreach (var horario in evento.horarios)
                        {
                            DateTime horarioDateTime;
                            if (!DateTime.TryParse(horario, out horarioDateTime))
                            {
                                errores.Add($"Evento '{nombreEvento}': Formato de horario inválido '{horario}'.");
                                horarioInvalido = true;
                                break;
                            }
                            horariosValidos.Add(horarioDateTime);
                        }

                        if (horarioInvalido)
                        {
                            fallidos++;
                            continue;
                        }

                        // Validar entradas
                        int totalEntradasEvento = 0;
                        bool entradaInvalida = false;

                        foreach (var entrada in evento.entradas)
                        {
                            if (string.IsNullOrWhiteSpace(entrada.nombre))
                            {
                                errores.Add($"Evento '{nombreEvento}': El nombre de la entrada no puede estar vacío.");
                                entradaInvalida = true;
                                break;
                            }

                            if (entrada.precio < 0)
                            {
                                errores.Add($"Evento '{nombreEvento}': El precio de la entrada '{entrada.nombre}' debe ser mayor o igual a 0.");
                                entradaInvalida = true;
                                break;
                            }

                            if (entrada.cantidad <= 0)
                            {
                                errores.Add($"Evento '{nombreEvento}': La cantidad de la entrada '{entrada.nombre}' debe ser mayor a 0.");
                                entradaInvalida = true;
                                break;
                            }

                            if (entrada.limiteCompra <= 0)
                            {
                                errores.Add($"Evento '{nombreEvento}': El límite de compra de la entrada '{entrada.nombre}' debe ser mayor a 0.");
                                entradaInvalida = true;
                                break;
                            }

                            totalEntradasEvento += entrada.cantidad;
                        }

                        if (entradaInvalida)
                        {
                            fallidos++;
                            continue;
                        }

                        // Validar que la suma de entradas no exceda la capacidad
                        if (totalEntradasEvento > evento.capacidad)
                        {
                            errores.Add($"Evento '{nombreEvento}': La suma de entradas ({totalEntradasEvento}) excede la capacidad del evento ({evento.capacidad}).");
                            fallidos++;
                            continue;
                        }

                        // ✅ Todas las validaciones pasaron, proceder a insertar
                        var nuevoEvento = new Evento
                        {
                            nombre = evento.nombre,
                            descripcion = evento.descripcion,
                            idLocal = evento.localId,
                            idTipoEvento = evento.tipoEventoId,
                            creadoPor = idAdministrador,
                            fechaPublicacion = fechaPublicacion,
                            fechaCompra = fechaCompra,
                            isDeleted = false,
                            imagenURL = evento.imagenURL
                        };

                        // Insertar el evento usando la lógica existente
                        int idEvento = CrearEvento(nuevoEvento, evento.horarios, evento.entradas);

                        insertados++;
                    }
                    catch (Exception ex)
                    {
                        errores.Add($"Evento '{nombreEvento}': Error al insertar - {ex.Message}");
                        fallidos++;
                    }
                }

                // 3. Preparar respuesta
                var success = insertados > 0;
                var message = insertados == eventos.Count
                    ? $"{insertados} eventos creados exitosamente"
                    : $"Se crearon {insertados} eventos, fallaron {fallidos}";

                return new GenericResponse<EventoCrearMasivoResponseData>
                {
                    Success = success,
                    Message = message,
                    Data = new EventoCrearMasivoResponseData
                    {
                        insertados = insertados,
                        fallidos = fallidos,
                        errores = errores
                    }
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<EventoCrearMasivoResponseData>
                {
                    Success = false,
                    Message = "Error fatal al procesar la carga masiva de eventos.",
                    Error = ex.Message,
                    Data = new EventoCrearMasivoResponseData
                    {
                        insertados = insertados,
                        fallidos = eventos?.Count ?? 0,
                        errores = errores
                    }
                };
            }
        }

    }
}
