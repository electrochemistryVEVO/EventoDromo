using EventodromoRest.Modelos;  
using EventodromoRest.Modelos.Utiles;
using System.Diagnostics;
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
            int lastFechaEvento = -1;
            Debug.WriteLine("meow");
            lock (DB)
            {
                string query = "SELECT E.ID AS 'E.ID',E.NOMBRE AS 'E.NOMBRE', E.DESCRIPCION AS 'E.DESCRIPCION', E.IDTIPOEVENTO AS 'E.IDTIPOEVENTO'," +
                    "E.IDLOCAL AS 'E.IDLOCAL',E.CREADOPOR AS 'E.CREADOPOR', E.FECHAPUBLICACION AS 'E.FECHAPUBLICACION', E.FECHACOMPRA AS 'E.FECHACOMPRA'," +
                    "E.ISDELETED AS 'E.ISDELETED', E.IMAGENURL AS 'E.IMAGENURL'," +
                    "FE.ID AS 'FE.ID', FE.FECHAHORA AS 'FE.FECHAHORA', " +
                    "TE.ID AS 'TE.ID', TE.PRECIO AS 'TE.PRECIO', TE.LIMITECOMPRA AS 'TE.LIMITECOMPRA', TE.PUNTOS AS 'TE.PUNTOS'," +
                    "TE.NOMBRE AS 'TE.NOMBRE', TE.CANTIDADENTRADAS AS 'TE.CANTIDADENTRADAS', TE.CANTIDADVENDIDA AS 'TE.CANTIDADVENDIDA' " +
                    "FROM Evento E"
                   +" INNER JOIN FechaEvento FE ON E.ID=FE.IDEVENTO"
                   +" INNER JOIN TipoEntrada TE ON FE.ID=TE.IDFECHAEVENTO"
                   + " WHERE E.ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Debug.WriteLine("mroooow");
                    Evento evento = new()
                    {
                        id = DB.GetInt("E.ID"),
                        nombre = DB.GetString("E.NOMBRE"),
                        descripcion = DB.GetString("E.DESCRIPCION"),
                        idTipoEvento = DB.GetInt("E.IDTIPOEVENTO"),
                        idLocal = DB.GetInt("E.IDLOCAL"),
                        creadoPor = DB.GetInt("E.CREADOPOR"),
                        fechaPublicacion = DB.GetDateTime("E.FECHAPUBLICACION"),
                        fechaCompra = DB.GetDateTime("E.FECHACOMPRA"),
                        isDeleted = DB.GetBoolean("E.ISDELETED"),
                        imagenURL = DB.GetString("E.IMAGENURL"),
                    };
                    List<FechaEvento> listFE = new List<FechaEvento>();
                    List<TipoEntrada> listTE = new List<TipoEntrada>();
                    do
                    {
                        int _id = DB.GetInt("FE.ID");
                        if (lastFechaEvento != _id)
                        {
                            lastFechaEvento = _id;
                            listFE.Add(new FechaEvento() { 
                                id = _id,
                                fechaHora = DB.GetDateTime("FE.FECHAHORA"),
                                idEvento = evento.id
                            });
                        }
                        listTE.Add(new TipoEntrada()
                        {
                            id=DB.GetInt("TE.ID"),
                            precio=DB.GetDecimal("TE.PRECIO"),
                            limiteCompra=DB.GetInt("TE.LIMITECOMPRA"),
                            puntos=DB.GetInt("TE.PUNTOS"),
                            nombre=DB.GetString("TE.NOMBRE"),
                            cantidadEntradas=DB.GetInt("TE.CANTIDADENTRADAS"),
                            cantidadVendida=DB.GetInt("TE.CANTIDADVENDIDA"),
                            idFechaEvento=lastFechaEvento
                        });
                    } while (DB.Read());
                    evento.Local = ObtenerLocalPorId(evento.idLocal);
                    evento.TipoEvento = ObtenerTipoEventoPorId(evento.idTipoEvento);
                    evento.fechasEvento = listFE.ToArray();
                    evento.tiposEntrada = listTE.ToArray();
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
    }
}