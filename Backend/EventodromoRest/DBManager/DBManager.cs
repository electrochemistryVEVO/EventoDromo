<<<<<<< HEAD
﻿using Microsoft.Data.SqlClient;
using System.Diagnostics;
=======
﻿using EventodromoRest.Entidades.Utiles;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Identity.Client;
using System.Data;

namespace EventodromoRest.DBManager
{
    public class DBManager : DbContext
    {
        public DBManager(DbContextOptions<DBManager> options) : base(options) { }

        private SqlCommand? command;
        private SqlDataReader? reader;

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
            cmd.CommandText = sql;
            var arr = parameters.ToArray();
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
            cmd.CommandText = sql;
            var arr = parameters.ToArray();
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
            var arr = parameters.ToArray();
            cmd.Parameters.AddRange(arr);
            OpenConnection();

            using var reader = cmd.ExecuteReader();
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
            var arr = parameters.ToArray();
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
            return reader.GetDateTime(i);
        }

        public decimal GetDecimal(string column)
        {
            if (reader is null) throw new InvalidOperationException("DataReader no inicializado.");
            int i = reader.GetOrdinal(column);
            return reader.GetDecimal(i);
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
            command = (SqlCommand)Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;
            command.Transaction = (SqlTransaction?)Database.CurrentTransaction?.GetDbTransaction();

            var arr = parameters.ToArray();
            if (arr.Length > 0) command.Parameters.AddRange(arr);

            OpenConnection();
            reader = command.ExecuteReader();
        }
    }
}
