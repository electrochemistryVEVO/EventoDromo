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
        public int idTipoEntrada { get; set; }
        public string imagenURL { get; set; }
        public string nombreEvento { get; set; }
        public string nombreTipoEntrada { get; set; }
        public int cantidad { get; set; }
        public decimal precio { get; set; }
    }

    public class EntradaDTO
    {
        public int idTipoEntrada { get; set; }
        public string nombreTipoEntrada { get; set; }
        public decimal precio { get; set; }
        public int cantidad { get; set; } = 0;
    }

    public class EntradaAgregarAlCarritoDTO
    {
        public int idTipoEntrada { get; set; }
        public int cantidad { get; set; }
    }
}