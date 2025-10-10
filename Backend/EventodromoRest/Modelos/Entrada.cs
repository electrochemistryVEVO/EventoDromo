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

    public class EntradaxCarritoDTO
    {
        public int idEntrada { get; set; }
        public string nombreEvento { get; set; }
        public string nombreLocal { get; set; }
        public string nombreTipoEntrada { get; set; }
        public decimal precio { get; set; }
        public string imagenURL { get; set; }
    }
}