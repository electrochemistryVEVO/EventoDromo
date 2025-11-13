using EventodromoRest.Controllers;
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

            // 1️⃣ Obtener eventos filtrados desde la BD
            List<Evento> listaEventos = mapper.ObtenerEventosFiltrados(
                search,
                localId,
                status,
                startDate,
                endDate,
                page,
                pageSize,
                out int totalEventos
            );

            if (listaEventos == null || listaEventos.Count == 0)
                return null;

            // 2️⃣ Calcular total de páginas
            int totalPaginas = (int)Math.Ceiling((double)totalEventos / pageSize);

            // 3️⃣ Mapear eventos a DTOs
            List<ResponseEventoGetEventsEventos> eventosDTO = listaEventos.Select(e => new ResponseEventoGetEventsEventos
            {
                Id = e.id,
                Nombre = e.nombre,
                Local = e.Local?.nombre ?? "Sin local",
                Tipo = e.TipoEvento?.nombre ?? "Sin tipo",
                FechaPublicacion = e.fechaPublicacion,
                FechaCompra = e.fechaCompra,
                /*Horario = e.fechaEvento, // si tienes ese campo
                Ocupacion = new OcupacionDTO
                {
                    Actual = e.ocupacionActual,
                    Total = e.ocupacionTotal
                },
                
                IngresosBrutos = e.ingresosBrutos
                */
            }).ToList();

            // 4️⃣ Armar respuesta
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

    }
}
