using EventodromoRest.Modelos;

public class Auditoria
{
    public int? id { get; set; }
    public int? idcliente { get; set; }
    public Cliente? cliente { get; set; }
    public int? idtipoauditoria { get; set; }
    public TipoAuditoria? tipoauditoria { get; set; }
    public string? descripcion { get; set; }
    public DateTime? fechahora { get; set; }
    public decimal? monto { get; set; }
}