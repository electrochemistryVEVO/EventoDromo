using EventodromoRest.Controllers;
using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
namespace EventodromoRest.Negocio
{
    public class EventoBO(Globales.Globales globales, DBManager.DBManager DB)
    {
<<<<<<< HEAD
        public GenericResponse<List<Evento>> ListarEventos()
        {
            var eventoMapper = new EventoMapper(globales, DB);

            return new GenericResponse<List<Evento>>
            {
                Success = true,
                Message = "Eventos obtenidos correctamente.",
                Data = eventoMapper.ListarEvento(),
                Error = null
            };
=======
        public GenericResponse<IEnumerable<Evento>> ListarEventosPorTipo(int tipoEventoId)
        {
            EventoMapper mapper = new EventoMapper(globales, DB);
            List<Evento> eventos = mapper.ListarEventosPorTipo(tipoEventoId);
            GenericResponse<IEnumerable<Evento>> response = new GenericResponse<IEnumerable<Evento>>();
            response.Success = true;
            response.Data = eventos;
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
                    var nuevoEvento = new EventosLocalCiudadCategoriaDTO 
                    {
                        id = e.id,
                        nombreEvento = e.nombre,
                        nombreLocal = local.nombre,
                        nombreCiudad = ciudad.nombre,
                        nombreCategoria = tipoEvento.nombre,
                        fechaEvento = e.fechaProximoEvento
                    };
                    eventosResponse.Add(nuevoEvento);
                    var nuevoLocal = new LocalCiudadImagenDTO
                    {
                        idLocal = local.id,
                        nombreLocal = local.nombre,
                        nombreCiudad = ciudad.nombre,
                        imagenURL = e.imagenURL
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
                        locales = localesResponse.DistinctBy(l => l.idLocal).ToList()
                    }
                };
            }
>>>>>>> origin/grupo3
        }
    }
}
