using EventodromoRest.Mappers;
using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Negocio
{
    public class AdministradorBO(Globales.Globales globales, DBManager.DBManager DB)
    {
        public FetchUserDataResponse ObtenerNombrePorId(int idAdmin)
        {
            var mapper = new AdministradorMapper(globales, DB);
            Administrador administrador = mapper.ObtenerAdministradorPorId(idAdmin);
            if (administrador != null)
            {
                return new FetchUserDataResponse
                {
                    status = "success",
                    message = "Admin encontrado.",
                    name = $"{administrador.nombres} {administrador.apellidos}"
                };
            }
            else
            {
                return new FetchUserDataResponse
                {
                    status = "error",
                    message = "Admin no encontrado.",
                    name = null
                };
            }
        }

        public GenericResponse<MetricasDashboardDTO> ObtenerIndicadoresDashboard(int idAdmin)
        {
            var mapper = new AdministradorMapper(globales, DB);
            var metricas = mapper.ObtenerMetricasDashboard();

            return new GenericResponse<MetricasDashboardDTO>
            {
                Success = true,
                Message = "Indicadores obtenidos correctamente.",
                Error = null,
                Data = metricas
            };

        }

        public GenericResponse<List<EventoMasVendidoDTO>> ObtenerEventosMasVendidos()
        {
            var mapper = new AdministradorMapper(globales, DB);
            var eventos = mapper.ObtenerEventosMasVendidos();

            if (eventos == null || eventos.Count == 0)
            {
                return new GenericResponse<List<EventoMasVendidoDTO>>
                {
                    Success = true,
                    Message = "No se encontraron eventos vendidos.",
                    Error = null,
                    Data = new List<EventoMasVendidoDTO>()
                };
            }

            return new GenericResponse<List<EventoMasVendidoDTO>>
            {
                Success = true,
                Message = "Eventos más vendidos obtenidos correctamente.",
                Error = null,
                Data = eventos
            };
        }
    }
}
