namespace EventodromoRest.Modelos
{
    public class Entrada
    {
        public int id { get; set; }
        public int idCarrito { get; set; }
        public Carrito carrito { get; set; }
        public int idTipoEntrada { get; set; }
        public TipoEntrada tipoEntrada { get; set; }
    }
}