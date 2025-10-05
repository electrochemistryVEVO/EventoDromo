using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class EliminarEventoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<EliminarEvento> ListarEliminarEvento()
        {
            List<EliminarEvento> listaEliminarEvento = new List<EliminarEvento>();
            lock (DB)
            {
                string query = "SELECT * FROM EliminarEvento";
                DB.Select(query, null);
                while (DB.Read())
                {
                    EliminarEvento eliminarEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        idEvento = DB.GetInt("IDEVENTO"),
                        evento = ObtenerEventoPorId(DB.GetInt("IDEVENTO")),
                        fechaEliminacion = DB.GetDateTime("FECHAELIMINACION"),
                        fechaEliminacionReal = DB.GetDateTime("FECHAELIMINACIONREAL"),
                    };
                    listaEliminarEvento.Add(eliminarEvento);
                }
                return listaEliminarEvento;
            }
        }

        public int InsertarEliminarEvento(EliminarEvento eliminarEvento)
        {
            lock (DB)
            {
                string query = "INSERT INTO EliminarEvento (IDEVENTO, FECHAELIMINACION, FECHAELIMINACIONREAL) VALUES (@IDEVENTO, @FECHAELIMINACION, @FECHAELIMINACIONREAL); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@IDEVENTO", eliminarEvento.idEvento);
                parametros.Add("@FECHAELIMINACION", eliminarEvento.fechaEliminacion);
                parametros.Add("@FECHAELIMINACIONREAL", eliminarEvento.fechaEliminacionReal);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public EliminarEvento ObtenerEliminarEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM EliminarEvento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    EliminarEvento eliminarEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        idEvento = DB.GetInt("IDEVENTO"),
                        evento = ObtenerEventoPorId(DB.GetInt("IDEVENTO")),
                        fechaEliminacion = DB.GetDateTime("FECHAELIMINACION"),
                        fechaEliminacionReal = DB.GetDateTime("FECHAELIMINACIONREAL"),
                    };
                    return eliminarEvento;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarEliminarEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM EliminarEvento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
       
        public int ModificarEliminarEvento(EliminarEvento eliminarEvento)
        {
            lock (DB)
            {
                string query = "UPDATE EliminarEvento SET IDEVENTO = @IDEVENTO, FECHAELIMINACION = @FECHAELIMINACION, FECHAELIMINACIONREAL = @FECHAELIMINACIONREAL WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@IDEVENTO", eliminarEvento.idEvento);
                parametros.Add("@FECHAELIMINACION", eliminarEvento.fechaEliminacion);
                parametros.Add("@FECHAELIMINACIONREAL", eliminarEvento.fechaEliminacionReal);
                parametros.Add("@ID", eliminarEvento.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Evento ObtenerEventoPorId(int v)
        {
            var eventoMapper = new EventoMapper(globales, DB);
            return eventoMapper.ObtenerEventoPorId(v);
        }
    }
}
