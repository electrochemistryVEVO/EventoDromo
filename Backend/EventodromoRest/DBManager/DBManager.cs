using Microsoft.Data.SqlClient;

namespace EventodromoRest.DBManager
{
    public class DBManager : IDisposable
    {
        private readonly SqlConnection _connection;
        public bool Inicializado { get; private set; } = false;
        public string ErrorInicializacion { get; private set; } = string.Empty;

        public DBManager(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            _connection = new SqlConnection(connectionString);
            ErrorInicializacion = string.Empty;

            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                Inicializado = true;
            }

            if (!Inicializado)
            {
                try
                {
                    _connection.Open();
                    Inicializado = true;
                }
                catch (Exception ex)
                {
                    ErrorInicializacion = ex.Message;
                }
            }
        }

        public SqlConnection DBContext
        {
            get { return _connection; }
        }

        public void OpenConnection()
        {
            if (_connection.State == System.Data.ConnectionState.Closed)
            {
                _connection.Open();
            }
        }

        public void CloseConnection()
        {
            if (_connection.State == System.Data.ConnectionState.Open)
            {
                _connection.Close();
            }
        }

        public int ExecuteNonQuery(string query, params SqlParameter[] parameters)
        {
            OpenConnection();
            using (SqlCommand cmd = new SqlCommand(query, _connection))
            {
                cmd.Parameters.AddRange(parameters);
                return cmd.ExecuteNonQuery();
            }
        }

        public object ExecuteScalar(string query, params SqlParameter[] parameters)
        {
            OpenConnection();
            using (SqlCommand cmd = new SqlCommand(query, _connection))
            {
                cmd.Parameters.AddRange(parameters);
                return cmd.ExecuteScalar();
            }
        }

        public List<T> Query<T>(string query, Func<SqlDataReader, T> map, params SqlParameter[] parameters)
        {
            OpenConnection();
            using (SqlCommand cmd = new SqlCommand(query, _connection))
            {
                cmd.Parameters.AddRange(parameters);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    List<T> result = new List<T>();
                    while (reader.Read())
                    {
                        result.Add(map(reader));
                    }
                    return result;
                }
            }
        }

        public int Insert(string query, params SqlParameter[] parameters)
        {
            return ExecuteNonQuery(query, parameters);
        }

        public int Update(string query, params SqlParameter[] parameters)
        {
            return ExecuteNonQuery(query, parameters);
        }

        public int Delete(string query, params SqlParameter[] parameters)
        {
            return ExecuteNonQuery(query, parameters);
        }

        public void Dispose()
        {
            try
            {
                _connection.Dispose();
                GC.SuppressFinalize(this);
            }
            catch { }
        }
    }
}
