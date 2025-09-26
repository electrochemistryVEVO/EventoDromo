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
                Administrador = 'C',
                [Description("Usuario")]
                Usuario = 'U'
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
