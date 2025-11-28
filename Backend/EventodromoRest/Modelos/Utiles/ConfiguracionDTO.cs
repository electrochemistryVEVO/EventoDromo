namespace EventodromoRest.Modelos.Utiles
{
    /// <summary>
    /// DTO para retornar todas las configuraciones del sistema.
    /// </summary>
    public class ConfiguracionDTO
    {
        /// <summary>
        /// Cuántos soles vale 1 punto (ej: 10.00 significa que 1 punto = S/ 10)
        /// </summary>
        public decimal PuntosPorSol { get; set; }

        /// <summary>
        /// Tiempo de vigencia de los puntos en meses (ej: 6 = 6 meses)
        /// </summary>
        public int MesesVigenciaPuntos { get; set; }

        /// <summary>
        /// Tiempo de vigencia del carrito en minutos (ej: 30 = 30 minutos)
        /// </summary>
        public int MinutosVigenciaCarrito { get; set; }

        /// <summary>
        /// Tiempo de expiración de transferencias en horas (ej: 24 = 24 horas)
        /// </summary>
        public int HorasExpiracionTransferencia { get; set; }

        /// <summary>
        /// Tiempo de expiración del token de recuperación de contraseña en minutos (ej: 60 = 1 hora)
        /// </summary>
        public int MinutosExpiracionRecovery { get; set; }
    }

    /// <summary>
    /// DTO para actualizar las configuraciones del sistema.
    /// </summary>
    public class ActualizarConfiguracionDTO
    {
        /// <summary>
        /// Nuevo valor de conversión: cuántos soles vale 1 punto
        /// </summary>
        public decimal? PuntosPorSol { get; set; }

        /// <summary>
        /// Nueva vigencia de puntos en meses
        /// </summary>
        public int? MesesVigenciaPuntos { get; set; }

        /// <summary>
        /// Nueva vigencia del carrito en minutos
        /// </summary>
        public int? MinutosVigenciaCarrito { get; set; }

        /// <summary>
        /// Nueva vigencia de transferencias en horas
        /// </summary>
        public int? HorasExpiracionTransferencia { get; set; }

        /// <summary>
        /// Nueva vigencia del token de recuperación de contraseña en minutos
        /// </summary>
        public int? MinutosExpiracionRecovery { get; set; }
    }
}
