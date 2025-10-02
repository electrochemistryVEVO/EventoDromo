using System.Data;
using System.Data.Common;
using MySqlConnector;

namespace EventodromoRest.Modelos.Utiles
{
    public class ParameterList
    {
        private readonly List<DbParameter> parametros = new();
        private readonly Dictionary<string, DbParameter> parDeValores = new(StringComparer.OrdinalIgnoreCase);

        private void AddParameter(DbParameter parametro)
        {
            parametros.Add(parametro);
            parDeValores[parametro.ParameterName] = parametro;
        }

        /// <summary>
        /// Agrega parámetro de entrada (por defecto DbParameter se usa).
        /// </summary>
        public void Add(string name, object? value, DbType? type = null, int? size = null)
        {
            var p = new MySqlParameter   // MySQL Parameter
            {
                ParameterName = name,
                Value = value ?? DBNull.Value,
                Direction = ParameterDirection.Input
            };
            if (type.HasValue) p.DbType = type.Value;
            if (size.HasValue) p.Size = size.Value;
            AddParameter(p);
        }

        /// <summary>
        /// Agrega parámetro de salida (DbParameter).
        /// </summary>
        public void AddOut(string name, DbType type, int size = 4000)
        {
            var p = new MySqlParameter  // MySQL Parameter
            {
                ParameterName = name,
                Direction = ParameterDirection.Output,
                DbType = type,
                Size = size
            };
            AddParameter(p);
        }

        /// <summary>
        /// Convierte la lista de parámetros a un arreglo de DbParameters.
        /// </summary>
        public DbParameter[] ToArray(DbCommand cmd)
        {
            return parametros.ToArray(); // Ya son DbParameters creados
        }

        public int Count => parametros.Count;
    }
}
