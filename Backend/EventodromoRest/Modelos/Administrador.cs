namespace EventodromoRest.Modelos
{
    public class Administrador
    {
        public int? id { get; set; }
        public string? nombres { get; set; }
        public string? apellidos { get; set; }
        public string? email { get; set; }
        public string? passwordHash { get; set; }
        public DateTime? fechaCreacion { get; set; }
    }
    public class MetricasDashboardDTO
    {
        public MetricaConMontoDTO ingresosTotales { get; set; }
        public MetricaConMontoDTO puntosUsadosPromedio { get; set; }
        public MetricaConMontoDTO entradasVendidas { get; set; }
        public MetricaConMontoDTO usuariosNuevos { get; set; }
        public MetricaConMontoDTO tasaConversion { get; set; }
    }

    public class MetricaConMontoDTO
    {
        public decimal valor { get; set; }
        public decimal porcentajeCambio { get; set; }
    }

    public class ResponseEventosMasVendidos
    {
        public List<EventoMasVendidoDTO> data { get; set; }
    }

    public class RegistrarAdminRequest
    {
        public required string nombres { get; set; }
        public required string apellidos { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
    }

    public class RegistrarAdminResponse
    {
        public int id { get; set; }
        public required string nombres { get; set; }
        public required string apellidos { get; set; }
        public required string email { get; set; }
    }
}