using System.ComponentModel;

namespace EventodromoRest.Globales
{
    public static class Constantes
    {
        public static class ConstantesUsuario
        {
            public enum Rol
            {
                [Description("Adminsitrador")]
                Administrador = 1,
                [Description("Usuario")]
                Usuario = 2
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
