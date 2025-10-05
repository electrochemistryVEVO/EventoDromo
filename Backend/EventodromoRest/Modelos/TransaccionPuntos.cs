
namespace EventodromoRest.Modelos
{
    public class TransaccionPuntos
    {
        public int id { get; set; }
        public int idTransaccion { get; set; }
        public Transaccion transaccion { get; set; }
        public Cliente cliente { get; set; }
        public int idCliente { get; set; }
    }
}
