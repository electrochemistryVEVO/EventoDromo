using System;

namespace EventodromoRest.Modelos
{
    public class EntradaEventoAuxiliar
    {
        public int? id { get; set; }
        public string? titulo { get; set; }
        public string? fecha { get; set; }
        public string? hora { get; set; }
        public string? direccion { get; set; }
        public int? cantidad { get; set; }
        public decimal? precio { get; set; }
        public string? imagen { get; set; }
        public string? estado { get; set; }
        public string? transaccion { get; set; }
    }
}