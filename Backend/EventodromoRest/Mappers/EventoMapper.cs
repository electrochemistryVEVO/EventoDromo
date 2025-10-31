using EventodromoRest.Modelos;  
using EventodromoRest.Modelos.Utiles;
namespace EventodromoRest.Mappers
{
    public class EventoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Evento> ListarEventos()
        {
            List<Evento> listaEvento = new List<Evento>();
            var parametros = new ParameterList();
            lock (DB)
            {
                string query = "SELECT * FROM Evento";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),
                    };
                    listaEvento.Add(evento);
                }
                foreach (Evento evento in listaEvento)
                {
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }
                return listaEvento;
            }
        }

        public List<Evento> ListarEventosPorTipo(int idTipoEvento)
        {
            List<Evento> listaEvento = new List<Evento>();
            lock (DB)
            {
                string query = "SELECT * FROM Evento WHERE idTipoEvento=@ID_TIPO_EVENTO";
                var parametros = new ParameterList();
                parametros.Add("@ID_TIPO_EVENTO",idTipoEvento);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),

                    };
                    listaEvento.Add(evento);
                }
                //NOTA: Hacer las solicitudes anidadas despues de completar toda la lectura
                //Aparentemente, cuando el DB hace otra solicitud, se olvida de esta
                foreach(Evento evento in listaEvento){
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }
                return listaEvento;
            }
        }
        public int InsertarEvento(Evento evento)
        {
            lock (DB)
            {
                string query = "INSERT INTO Evento (NOMBRE, DESCRIPCION, IDTIPOEVENTO, IDLOCAL, CREADOPOR, FECHAPUBLICACION, FECHACOMPRA, ISDELETED, IMAGENURL) " +
                               "VALUES (@NOMBRE, @DESCRIPCION, @IDTIPOEVENTO, @IDLOCAL, @CREADOPOR, @FECHAPUBLICACION, @FECHACOMPRA, @ISDELETED, @IMAGENURL); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", evento.nombre);
                parametros.Add("@DESCRIPCION", evento.descripcion);
                parametros.Add("@IDTIPOEVENTO", evento.idTipoEvento);
                parametros.Add("@IDLOCAL", evento.idLocal);
                parametros.Add("@CREADOPOR", evento.creadoPor);
                parametros.Add("@FECHAPUBLICACION", evento.fechaPublicacion);
                parametros.Add("@FECHACOMPRA", evento.fechaCompra);
                parametros.Add("@ISDELETED", evento.isDeleted);
                parametros.Add("@IMAGENURL", evento.imagenURL);
                
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Evento ObtenerEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Evento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),

                    };
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    return evento;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarEventoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Evento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarEvento(Evento evento)
        {
            lock (DB)
            {
                string query = "UPDATE Evento SET NOMBRE = @NOMBRE, DESCRIPCION = @DESCRIPCION, IDTIPOEVENTO = @IDTIPOEVENTO, IDLOCAL = @IDLOCAL, CREADOPOR = @CREADOPOR, FECHAPUBLICACION = @FECHAPUBLICACION, FECHACOMPRA = @FECHACOMPRA, ISDELETED = @ISDELETED, IMAGENURL = @IMAGENURL WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", evento.id);
                parametros.Add("@NOMBRE", evento.nombre);
                parametros.Add("@DESCRIPCION", evento.descripcion);
                parametros.Add("@IDTIPOEVENTO", evento.idTipoEvento);
                parametros.Add("@IDLOCAL", evento.idLocal);
                parametros.Add("@CREADOPOR", evento.creadoPor);
                parametros.Add("@FECHAPUBLICACION", evento.fechaPublicacion);
                parametros.Add("@FECHACOMPRA", evento.fechaCompra);
                parametros.Add("@ISDELETED", evento.isDeleted);
                parametros.Add("@IMAGENURL", evento.imagenURL);

                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;

            }
        }

        private TipoEvento ObtenerTipoEventoPorId(int v)
        {
            var tipoEventoMapper = new TipoEventoMapper(globales, DB);
            return tipoEventoMapper.ObtenerTipoEventoPorId(v);
        }

        private Local ObtenerLocalPorId(int v)
        {
            var localMapper = new LocalMapper(globales, DB);
            return localMapper.ObtenerLocalPorId(v);
        }

        public List<EventoActivoProxFechaDTO> ListarEventosActivos()
        {
            lock (DB)
            {
                List<EventoActivoProxFechaDTO> listaEventos = new List<EventoActivoProxFechaDTO>();
                string query = "SELECT e.*, MIN(f.fechaHora) AS proximaFecha " +
                    "FROM Evento AS e " +
                    "INNER JOIN FechaEvento f ON e.id = f.idEvento " +
                    "WHERE e.fechaPublicacion < @fechaActual AND f.fechaHora > @fechaActual " +
                    "GROUP BY e.id, e.nombre, e.descripcion, e.fechaPublicacion " +
                    "ORDER BY proximaFecha ASC;";
                var parametros = new ParameterList();
                parametros.Add("@fechaActual", DateTime.Now);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    EventoActivoProxFechaDTO evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),
                        fechaProximoEvento = DB.GetDateTime("proximaFecha")
                    };
                    listaEventos.Add(evento);
                }
                return listaEventos;
            }
        }

        public List<Evento> ListarEventosBusqueda(string busqueda)
        {
            lock (DB)
            {
                List<Evento> listaEvento = new List<Evento>();
                string query = "SELECT * FROM  Evento WHERE NOMBRE LIKE CONCAT('%',@busqueda,'%')";
                var parametros = new ParameterList();
                parametros.Add("@busqueda", busqueda);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    Evento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        idTipoEvento = DB.GetInt("IDTIPOEVENTO"),
                        idLocal = DB.GetInt("IDLOCAL"),
                        creadoPor = DB.GetInt("CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("ISDELETED"),
                        imagenURL = DB.GetString("IMAGENURL"),

                    };
                    listaEvento.Add(evento);
                }
                //NOTA: Hacer las solicitudes anidadas despues de completar toda la lectura
                //Aparentemente, cuando el DB hace otra solicitud, se olvida de esta
                foreach (Evento evento in listaEvento)
                {
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                }
                return listaEvento;
            }
        }

        public ResponseEvento ObtenerResponseEventoPorId(int eventoId)
        {
            lock (DB)
            {
                string query = "SELECT id, nombre, descripcion, imagenURL, idTipoEvento FROM Evento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", eventoId);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    ResponseEvento evento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        descripcion = DB.GetString("DESCRIPCION"),
                        imagenUrl = DB.GetString("IMAGENURL"),
                        tipoEvento = new TipoEvento
                        {
                            id = DB.GetInt("IDTIPOEVENTO"),
                        }
                    };
                    evento.tipoEvento = ObtenerTipoEventoPorId((int)evento.tipoEvento.id);
                    return evento;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}