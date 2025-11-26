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

        public List<FechaEvento> ListarFechaEventoPorEvento(int idEvento)
        {
            lock (DB)
            {
                string query = "SELECT * FROM FechaEvento WHERE IDEVENTO = @IDEVENTO";
                var parametros = new ParameterList();
                parametros.Add("@IDEVENTO", idEvento);
                DB.Select(query, parametros);
                List<FechaEvento> fechaEventos = new List<FechaEvento>();
                while (DB.Read())
                {
                    FechaEvento fechaEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        fechaHora = DB.GetDateTime("FECHAHORA"),
                        idEvento = DB.GetInt("IDEVENTO"),
                    };
                    fechaEventos.Add(fechaEvento);
                }
                
                foreach (FechaEvento fechaEvento in fechaEventos)
                {
                    fechaEvento.Evento = ObtenerEventoPorId(fechaEvento.idEvento);
                }
                return fechaEventos;
            }
        }

        public List<ResponseFechaEvento> ListarResponseFechaEventoPorEvento(int idEvento)
        {
            TipoEntradaMapper tipoEntradaMapper = new TipoEntradaMapper(globales, DB);
            lock (DB)
            {
                string query = "SELECT ID, FECHAHORA FROM FechaEvento WHERE IDEVENTO = @IDEVENTO";
                var parametros = new ParameterList();
                parametros.Add("@IDEVENTO", idEvento);
                DB.Select(query, parametros);
                List<ResponseFechaEvento> fechaEventos = new List<ResponseFechaEvento>();
                while (DB.Read())
                {
                    ResponseFechaEvento fechaEvento = new()
                    {
                        id = DB.GetInt("ID"),
                        tiposDeEntrada = new List<ResponseTipoEntrada>()
                    };
                    DateTime fechaHora = DB.GetDateTime("FECHAHORA");
                    fechaEvento.fecha = fechaHora.ToString("yyyy-MM-dd");
                    fechaEvento.hora = fechaHora.ToString("HH-mm");
                    fechaEventos.Add(fechaEvento);
                }

                foreach (ResponseFechaEvento fechaEvento in fechaEventos)
                {
                    fechaEvento.tiposDeEntrada = tipoEntradaMapper.ListarResponseTipoEntradaPorFechaEvento(fechaEvento.id);
                }
                return fechaEventos;
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
        public List<FechaEvento> ListarHorariosPorEvento(int idEvento)
        {
            var lista = new List<FechaEvento>();
            lock (DB)
            {
                string query = "SELECT * FROM FechaEvento WHERE idEvento = @ID_EVENTO ORDER BY fechaHora ASC";
                var parametros = new ParameterList();
                parametros.Add("@ID_EVENTO", idEvento);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    lista.Add(new FechaEvento
                    {
                        id = DB.GetInt("id"),
                        fechaHora = DB.GetDateTime("fechaHora"),
                        idEvento = DB.GetInt("idEvento")
                    });
                }
            }
            return lista;
        }

        public List<FechaEvento> ObtenerFechaEventosPorListaEventoIds(List<int> eventoIds)
        {
            if (eventoIds == null || eventoIds.Count == 0)
                return new List<FechaEvento>();

            lock (DB)
            {
                string ids = string.Join(",", eventoIds);

                string query = $@"
            SELECT * FROM FechaEvento
            WHERE IDEVENTO IN ({ids});
        ";

                DB.Select(query, null);

                List<FechaEvento> lista = new();
                while (DB.Read())
                {
                    lista.Add(new FechaEvento
                    {
                        id = DB.GetInt("ID"),
                        fechaHora = DB.GetDateTime("FECHAHORA"),
                        idEvento = DB.GetInt("IDEVENTO")
                    });
                }

                DB.CloseReader();
                return lista;
            }
        }

        public int InsertarFechaEvento(DateTime fechaHora, int idEvento)
        {
            lock (DB)
            {
                // Insertamos y obtenemos el ID generado automáticamente
                string query = "INSERT INTO FechaEvento (fechaHora, idEvento) VALUES (@FECHA, @IDEVENTO); SELECT LAST_INSERT_ID();";

                var p = new ParameterList();
                p.Add("@FECHA", fechaHora);
                p.Add("@IDEVENTO", idEvento);

                // Ejecutamos y convertimos el resultado a int
                return Convert.ToInt32(DB.ExecuteScalar(query, p));
            }
        }

    }
}