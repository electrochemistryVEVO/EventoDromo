using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class TipoEventoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TipoEvento> ListarTipoEvento()
        {
            List<TipoEvento> listaTipoEvento = new List<TipoEvento>();
            lock (DB)
            {
                string query = "SELECT * FROM TipoEvento";
                DB.Select(query, null);
                while (DB.Read())
                {
                    TipoEvento tipoEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                    };
                    listaTipoEvento.Add(tipoEvento);
                }
                return listaTipoEvento;
            }
        }
        public int InsertarTipoEvento(TipoEvento tipoEvento)
        {
            lock (DB)
            {
                string query = "INSERT INTO TipoEvento (NOMBRE, DESCRIPCION) " +
                               "VALUES (@NOMBRE); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", tipoEvento.nombre);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }
        public TipoEvento ObtenerTipoEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM TipoEvento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    TipoEvento tipoEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                    };
                    return tipoEvento;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTipoEvento(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM TipoEvento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTipoEvento(TipoEvento tipoEvento)
        {
            lock (DB)
            {
                string query = "UPDATE TipoEvento SET NOMBRE = @NOMBRE WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", tipoEvento.nombre);
                parametros.Add("@ID", tipoEvento.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
