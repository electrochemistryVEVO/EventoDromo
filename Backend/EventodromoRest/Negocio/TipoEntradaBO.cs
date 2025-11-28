using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using Microsoft.AspNetCore.Mvc;
namespace EventodromoRest.Negocio
{
    public class TipoEntradaBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public GenericResponse<IEnumerable<TipoEntrada>> ListarTipoEntradaPorFechaEvento(int idFechaEvento)
        {
            var mapper = new TipoEntradaMapper(globales, DB);
            var respuesta = new GenericResponse<IEnumerable<TipoEntrada>>();
            respuesta.Success = true;
            respuesta.Data = mapper.ListarTipoEntradaPorFechaEvento(idFechaEvento);
            return respuesta;
        }


        public GenericResponse<DisponibilidadResponseDTO> ObtenerDisponibilidadPorTipoEntrada(int idTipoEntrada)
        {
            try
            {
                var tipoEntradaMapper = new TipoEntradaMapper(globales, DB);

                // 1. Consultar la BD
                var entrada = tipoEntradaMapper.obtenerDentradapoId(idTipoEntrada);

                if (entrada == null)
                {
                    return new GenericResponse<DisponibilidadResponseDTO>
                    {
                        Success = false,
                        Message = "No se encontró el tipo de entrada con ID " + idTipoEntrada,
                        Error = "404 Not Found"
                    };
                }


                var data = new DisponibilidadResponseDTO
                {
                    vendidas = entrada.cantidadVendida ?? 0,
                    total = entrada.cantidadEntradas ?? 0,
                };

                return new GenericResponse<DisponibilidadResponseDTO>
                {
                    Success = true,
                    Message = "Disponibilidad obtenida correctamente.",
                    Data = data
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<DisponibilidadResponseDTO>
                {
                    Success = false,
                    Message = "Error interno al obtener disponibilidad.",
                    Error = ex.Message
                };
            }
        }
    }
}
