using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace EventodromoRest.Modelos.Utiles
{
    // DTO para los parámetros que envía el frontend
    public class FiltroEntradasRequest
    {
        public string? fechaInicio { get; set; }
        public string? fechaFin { get; set; }
        // Recibimos los estados como una lista de strings
        [FromQuery(Name = "estados")]
        public List<string> estados { get; set; } = new List<string>();
        public int pagina { get; set; } = 1;
        public int tamanoPagina { get; set; } = 10;
    }

    // DTO para la respuesta que espera el frontend
    public class PaginacionResponse<T>
    {
        public List<T> items { get; set; }
        public int totalItems { get; set; }
        public int totalPages { get; set; }
        public int currentPage { get; set; }
    }
}