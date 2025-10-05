using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class FechaEventoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<FechaEvento> ListarFechaEvento()
        {
            List<FechaEvento> listaFechaEvento = new List<FechaEvento>();
            lock (DB)
            {
                string query = "SELECT * FROM FechaEvento";
                DB.Select(query, null);
                while (DB.Read())
                {
                    FechaEvento fechaEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        fechaHora = DB.GetDateTime("FECHAHORA"),
                        idEvento = DB.GetInt("IDEVENTO"),
                        Evento = ObtenerEventoPorId(DB.GetInt("IDEVENTO")),
                    };

                    listaFechaEvento.Add(fechaEvento);
                }
                return listaFechaEvento;
            }

        }

        public int InsertarFechaEvento(FechaEvento fechaEvento)
        {
            lock (DB)
            {
                string query = "INSERT INTO FechaEvento (FECHAHORA, IDEVENTO) " +
                               "VALUES (@FECHAHORA, @IDEVENTO); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@FECHAHORA", fechaEvento.fechaHora);
                parametros.Add("@IDEVENTO", fechaEvento.idEvento);

                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public FechaEvento ObtenerFechaEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM FechaEvento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    FechaEvento fechaEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        fechaHora = DB.GetDateTime("FECHAHORA"),
                        idEvento = DB.GetInt("IDEVENTO"),
                        Evento = ObtenerEventoPorId(DB.GetInt("IDEVENTO")),
                    };
                    
                    return fechaEvento;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarFechaEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM FechaEvento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarFechaEvento(FechaEvento fechaEvento)
        {
            lock (DB)
            {
                string query = "UPDATE FechaEvento SET FECHAHORA = @FECHAHORA, IDEVENTO = @IDEVENTO WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", fechaEvento.id);
                parametros.Add("@FECHAHORA", fechaEvento.fechaHora);
                parametros.Add("@IDEVENTO", fechaEvento.idEvento);
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
