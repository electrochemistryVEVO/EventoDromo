using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class SexoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Sexo> ListarSexos()
        {
            List<Sexo> listaSexos = new List<Sexo>();
            lock (DB)
            {
                string query = "SELECT * FROM Sexo";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Sexo sexo = new()
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre")
                    };
                    listaSexos.Add(sexo);
                }
                DB.CloseReader();
                return listaSexos;
            }
        }

        public int InsertarSexo(Sexo sexo)
        {
            lock (DB)
            {
                string query = "INSERT INTO Sexo (nombre) VALUES (@nombre); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@nombre", sexo.nombre);

                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Sexo ObtenerSexoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Sexo WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);

                Sexo sexo = null;
                if (DB.Read())
                {
                    sexo = new()
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre")
                    };
                }
                
                DB.CloseReader();
                return sexo;
            }
        }

        public int EliminarSexoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Sexo WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarSexo(Sexo sexo)
        {
            lock (DB)
            {
                string query = "UPDATE Sexo SET nombre = @nombre WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@nombre", sexo.nombre);
                parametros.Add("@id", sexo.id);

                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }       
    }
}