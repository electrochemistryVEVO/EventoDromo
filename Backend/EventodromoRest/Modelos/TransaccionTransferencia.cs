namespace EventodromoRest.Modelos
{
    /// <summary>
    /// Tabla que vincula una transacción con una transferencia pendiente.
    /// Permite que las entradas transferidas y aceptadas se muestren como una nueva transacción
    /// en la cuenta del destinatario, separadas de la transacción original.
    /// </summary>
    public class TransaccionTransferencia
    {
        public int Id { get; set; }
        public int IdTransaccion { get; set; }
        public Transaccion? Transaccion { get; set; }
        public int IdTransferenciaPendiente { get; set; }
        public TransferenciaPendiente? TransferenciaPendiente { get; set; }
    }
}
