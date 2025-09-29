using Microsoft.Data.SqlClient;
using System.Collections;
using System.Data;

namespace EventodromoRest.Modelos.Utiles
{
    public class ParameterList
    {
        private readonly Dictionary<string, SqlParameter> parDeValores = new(StringComparer.OrdinalIgnoreCase);
        private readonly List<SqlParameter> parametros = new();

        private void AddParameter(SqlParameter parametro)
        {
            parametros.Add(parametro);
            parDeValores[parametro.ParameterName] = parametro;
        }

        public void Add(string name, object? value, DbType? type = null, int? size = null)
        {
            var p = new SqlParameter
            {
                ParameterName = name,
                Value = value ?? DBNull.Value,
                Direction = ParameterDirection.Input
            };
            if (type.HasValue) p.DbType = type.Value;
            if (size.HasValue) p.Size = size.Value;
            AddParameter(p);
        }

        public void AddOut(string name, DbType type, int size = 4000)
        {
            var p = new SqlParameter
            {
                ParameterName = name,
                Direction = ParameterDirection.Output,
                DbType = type,
                Size = size
            };
            AddParameter(p);
        }

        public SqlParameter[] ToArray() => parametros.ToArray();
    }
}
