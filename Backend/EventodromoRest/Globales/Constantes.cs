using System.ComponentModel;

namespace EventodromoRest.Globales
{
    public static class Constantes
    {
        public static class ConstantesUsuario
        {
            public enum Rol
            {
                [Description("Cliente")]
                Cliente = 'C',
                [Description("Administrador")]
                Administrador = 'A'
            }
        }
    }

    public enum Estado
    {
        [Description("Inactivo")]
        Inactivo = 0,
        [Description("Activo")]
        Activo = 1
    }
}
