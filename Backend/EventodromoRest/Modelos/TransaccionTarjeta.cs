namespace EventodromoRest.Modelos
{
    public class TransaccionTarjeta
    {
        public int id { get; set; }
        public int idTransaccion { get; set; }
        public Transaccion transaccion { get; set; }
        public int idTarjeta { get; set; }
        public Tarjeta tarjeta { get; set; }
    }
}
