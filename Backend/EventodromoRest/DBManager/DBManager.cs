using EventodromoRest.Modelos.Utiles;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;
using System.Data.Common;

namespace EventodromoRest.DBManager
{
    public class DBManager : DbContext
    {
        public DBManager(DbContextOptions<DBManager> options) : base(options) { }

        private DbCommand? command;
        private DbDataReader? reader;

        private IDbContextTransaction? _currentTransaction;

        public void BeginTransaction()
        {
            // Solo inicia una nueva transacción si no hay una activa
            if (_currentTransaction == null)
            {
                _currentTransaction = Database.BeginTransaction();
            }
        }

        public void Commit()
        {
            try
            {
                // Confirma la transacción si existe
                _currentTransaction?.Commit();
            }
            catch
            {
                // Si el commit falla, haz un rollback
                _currentTransaction?.Rollback();
                throw;
            }
            finally
            {
                // Limpia la transacción actual
                _currentTransaction?.Dispose();
                _currentTransaction = null;
            }
        }

        public void Rollback()
        {
            try
            {
                // Deshace la transacción si existe
                _currentTransaction?.Rollback();
            }
            finally
            {
                // Limpia la transacción actual
                _currentTransaction?.Dispose();
                _currentTransaction = null;
            }
        }

        public void OpenConnection()
        {
            if (Database.GetDbConnection().State != ConnectionState.Open)
                Database.GetDbConnection().Open();
        }

        public void CloseConnection()
        {
            if (Database.GetDbConnection().State != ConnectionState.Closed)
                Database.GetDbConnection().Close();
        }

        /// <summary>
        /// Ejecuta un comando SQL que no devuelve filas (INSERT, UPDATE, DELETE).
        /// </summary>
        public int ExecuteNonQuery(string sql, ParameterList parameters)
        {
            using var cmd = Database.GetDbConnection().CreateCommand();

            // ¡CAMBIO CLAVE! Asocia el comando a la transacción activa si existe.
            if (_currentTransaction != null)
            {
                cmd.Transaction = _currentTransaction.GetDbTransaction();
            }

            cmd.CommandText = sql;
            var arr = parameters.ToArray(cmd);
            cmd.Parameters.AddRange(arr);
            OpenConnection();
            return cmd.ExecuteNonQuery();
        }

        /// <summary>
        /// Ejecuta un comando SQL que devuelve un único valor 
        /// (ejemplo: COUNT, SUM, SCOPE_IDENTITY).
        /// </summary>
        public object? ExecuteScalar(string sql, ParameterList parameters)
        {
            using var cmd = Database.GetDbConnection().CreateCommand();

            // ¡CAMBIO CLAVE! Asocia el comando a la transacción activa si existe.
            if (_currentTransaction != null)
            {
                cmd.Transaction = _currentTransaction.GetDbTransaction();
            }

            cmd.CommandText = sql;
            var arr = parameters.ToArray(cmd);
            cmd.Parameters.AddRange(arr);
            OpenConnection();
            return cmd.ExecuteScalar();
        }

        /// <summary>
        /// Ejecuta un SELECT y convierte cada fila en un objeto de tipo T.
        /// </summary>
        public List<T> Query<T>(string sql, Func<IDataRecord, T> map, ParameterList parameters)
        {
            using var cmd = Database.GetDbConnection().CreateCommand();
            cmd.CommandText = sql;
            var arr = parameters.ToArray(cmd);
            cmd.Parameters.AddRange(arr);
            OpenConnection();

            using var reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            var result = new List<T>();
            while (reader.Read())
            {
                result.Add(map(reader));
            }
            return result;
        }

        /// <summary>
        /// Ejecuta un procedimiento almacenado (Stored Procedure).
        /// Soporta parámetros de entrada y salida.
        /// </summary>
        public int ExecuteStoredProcedure(string procedureName, ParameterList parameters)
        {
            using var cmd = Database.GetDbConnection().CreateCommand();
            cmd.CommandText = procedureName;
            cmd.CommandType = CommandType.StoredProcedure;
            var arr = parameters.ToArray(cmd);
            cmd.Parameters.AddRange(arr);
            OpenConnection();
            return cmd.ExecuteNonQuery();
        }

        public bool Read()
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            return reader.Read();
        }

        public bool IsDBNull(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            return reader.IsDBNull(i);
        }

        public string? GetString(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            if (reader.IsDBNull(i)) return null;
            return reader.GetString(i);
        }

        public int GetInt(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            return reader.GetInt32(i);
        }

        public DateTime GetDateTime(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            var dbValue = reader.GetDateTime(i);
            return DateTime.SpecifyKind(dbValue, DateTimeKind.Utc);
        }

        public DateTime? GetNullableDateTime(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            if (reader.IsDBNull(i))
                return null;
            var dbValue = reader.GetDateTime(i);
            return DateTime.SpecifyKind(dbValue, DateTimeKind.Utc);
        }

        public decimal GetDecimal(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            return reader.GetDecimal(i);
        }

        public decimal? GetNullableDecimal(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            if (reader.IsDBNull(i))
                return null;
            return reader.GetDecimal(i);
        }

        public bool GetBoolean(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            return reader.GetBoolean(i);
        }

        public string? GetStringOrNull(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            if (reader.IsDBNull(i))
                return null;
            return reader.GetString(i);
        }

        public int? GetIntOrNull(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            if (reader.IsDBNull(i))
                return null;
            return reader.GetInt32(i);
        }

        public bool? GetBoolOrNull(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            if (reader.IsDBNull(i))
                return null;
            return reader.GetBoolean(i);
        }

        public void CloseReader()
        {
            try
            {
                reader?.Close();
                reader?.Dispose();
                command?.Dispose();
            }
            finally
            {
                reader = null;
                command = null;
            }
        }

        public void Select(string sql, ParameterList parameters)
        {
            CloseReader();
            command = Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;

            // ¡CAMBIO CLAVE! Asocia el comando a la transacción activa si existe.
            if (_currentTransaction != null)
            {
                command.Transaction = _currentTransaction.GetDbTransaction();
            }

            if (parameters is null) parameters = new ParameterList();
            var arr = parameters.ToArray(command);
            if (arr.Length > 0) command.Parameters.AddRange(arr);

            OpenConnection();
            reader = command.ExecuteReader();
        }
    }
}
