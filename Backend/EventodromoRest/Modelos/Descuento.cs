namespace EventodromoRest.Modelos
{
    public class Descuento
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string codigo { get; set; }
        public string tipo { get; set; } // "Porcentaje" o "Fijo"
        public decimal valor { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaFin { get; set; }
        public int usosMaximos { get; set; }

        // Contador de usos (inicia en 0 al crear)
        public int usosActuales { get; set; }

        // FK: Vincula el descuento con un TipoEntrada específico
        public int idTipoEntrada { get; set; }
    }
}
