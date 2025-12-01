namespace EventodromoRest.Modelos
{
    public class Promocion
    {
        public int? id { get; set; }
        public string nombre { get; set; }
        public string codigo { get; set; }
        public string tipo { get; set; } // "PORCENTAJE" o "MONTO_FIJO"
        public decimal valor { get; set; }
        public DateTime fechaInicio { get; set; }
        public DateTime fechaFin { get; set; }
        public int? usosMaximos { get; set; }
        public int usosActuales { get; set; }
    }

    // DTOs para las respuestas
    public class ResponseValidarPromocion
    {
        public bool valido { get; set; }
        public string mensaje { get; set; }
        public decimal? descuentoPorcentaje { get; set; }
        public decimal? descuentoMonto { get; set; }
        public string? tipo { get; set; }
        public string? codigo { get; set; }
    }

    public class ResponseAplicarPromocion
    {
        public bool exito { get; set; }
        public string mensaje { get; set; }
        public decimal descuentoAplicado { get; set; }
        public decimal subtotal { get; set; }
        public decimal total { get; set; }
        public PromocionAplicada promocion { get; set; }
    }

    public class PromocionAplicada
    {
        public string codigo { get; set; }
        public string tipo { get; set; }
        public decimal valor { get; set; }
    }

    // Request DTOs
    public class ValidarCodigoRequest
    {
        public string codigo { get; set; }
        public int? idCarrito { get; set; }
    }

    public class AplicarCodigoRequest
    {
        public string codigo { get; set; }
        public int idCarrito { get; set; }
    }
}
