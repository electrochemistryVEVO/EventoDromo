namespace EventodromoRest.Modelos
{
    /// <summary>
    /// DTO que representa un lote de puntos que está próximo a vencer.
    /// </summary>
    public class PuntoPorVencerDTO
    {
        public int Id { get; set; }
        public int Cantidad { get; set; }
        public DateTime FechaExpiracion { get; set; }
        public int DiasRestantes { get; set; }
    }

    /// <summary>
    /// DTO para un movimiento en el historial de DromoPuntos.
    /// </summary>
    public class MovimientoDromopuntoDTO
    {
        public int Id { get; set; }
        public string TipoMovimiento { get; set; } // "ingreso", "salida", "expiracion"
        public string? NombreEventoAsociado { get; set; }
        public DateTime FechaMovimiento { get; set; }
        public int Cantidad { get; set; }
    }

    /// <summary>
    /// DTO que agrupa toda la información necesaria para la página "Mis DromoPuntos".
    /// </summary>
    public class ResumenDromopuntosDTO
    {
        public int Total { get; set; }
        public decimal PuntosPorSol { get; set; }
        public List<PuntoPorVencerDTO> PorVencer { get; set; }
        public List<MovimientoDromopuntoDTO> Movimientos { get; set; }
    }

    public class ResponseDromoPuntosObtenerValorActual
    {
        public decimal? valorEnSoles { get; set; }
    }
}