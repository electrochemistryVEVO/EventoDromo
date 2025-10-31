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
        }
        public GenericResponse<ResponseListarEventosYLocales> ListarEventosYLocales()
        {
            var eventoMapper = new EventoMapper(globales, DB);
            var localMapper = new LocalMapper(globales, DB);
            var ciudadMapper = new CiudadMapper(globales, DB);
            var tipoEventoMapper = new TipoEventoMapper(globales, DB);
            var listaEventos = eventoMapper.ListarEventosActivos();
            if (listaEventos.Count == 0)
            {
                return new GenericResponse<ResponseListarEventosYLocales>
                {
                    Success = true,
                    Message = "No hay eventos activos disponibles.",
                    Error = null,
                    Data = null
                };
            }
            else
            {
                var eventosResponse = new List<EventosLocalCiudadCategoriaDTO>();
                var localesResponse = new List<LocalCiudadImagenDTO>();
                foreach (var e in listaEventos)
                {
                    var local = localMapper.ObtenerLocalPorId(e.idLocal);
                    var ciudad = ciudadMapper.ObtenerCiudadPorId(local.idCiudad);
                    var tipoEvento = tipoEventoMapper.ObtenerTipoEventoPorId(e.idTipoEvento);

                    double precioMinimo = obtenerPrecioMinimoEvento(e);

                    var nuevoEvento = new EventosLocalCiudadCategoriaDTO
                    {
                        id = e.id,
                        nombre = e.nombre,
                        nombreLocal = local.nombre,
                        ciudad = ciudad.nombre,
                        categoria = tipoEvento.nombre,
                        precio = precioMinimo,
                        fecha = e.fechaProximoEvento.ToString("yyyy-MM-dd"),
                        imagen = e.imagenURL,
                    };
                    eventosResponse.Add(nuevoEvento);
                    var nuevoLocal = new LocalCiudadImagenDTO
                    {
                        id = local.id,
                        nombre = local.nombre,
                        ciudad = ciudad.nombre,
                        imagen = e.imagenURL
                    };
                    localesResponse.Add(nuevoLocal);
                }
                return new GenericResponse<ResponseListarEventosYLocales>
                {
                    Success = true,
                    Message = "Eventos y locales activos obtenidos correctamente.",
                    Error = null,
                    Data = new ResponseListarEventosYLocales
                    {
                        eventos = eventosResponse,
                        locales = [.. localesResponse.DistinctBy(l => l.id).Take(4)]
                    }
                };
            }
        }

        private double obtenerPrecioMinimoEvento(EventoActivoProxFechaDTO e)
        {
            FechaEvento fechaEvento = new FechaEventoMapper(globales, DB).ListarFechaEventoPorEvento(e.id)[0];
            List<TipoEntrada> tipoEntradas = new TipoEntradaMapper(globales, DB).ListarTipoEntradaPorFechaEvento((int)fechaEvento.id); //raro

            return double.Parse(tipoEntradas.Min(t => t.precio).ToString());
        }
    }
}
