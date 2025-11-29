using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using EventodromoRest.Negocio;

namespace EventodromoRest.Mappers
{
    public class TipoEntradaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TipoEntrada> ListarTipoEntrada()
        {
            List<TipoEntrada> listaTipoEntrada = new List<TipoEntrada>();
            lock (DB)
            {
                string query = "SELECT * FROM TipoEntrada";
                DB.Select(query, null);
                while (DB.Read())
                {
                    TipoEntrada tipoEntrada = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        cantidadEntradas = DB.GetInt("CANTIDADENTRADAS"),
                        cantidadVendida = DB.GetInt("CANTIDADVENIDA"),
                        precio = DB.GetDecimal("PRECIO"),
                        limiteCompra = DB.GetInt("LIMITECOMPRA"),
                        puntos = DB.GetInt("PUNTOS"),
                        idFechaEvento = DB.GetInt("IDFECHAEVENTO")
                    };
                    tipoEntrada.FechaEvento = ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                    listaTipoEntrada.Add(tipoEntrada);
                }
                return listaTipoEntrada;
            }

        }

        public List<TipoEntrada> ListarTipoEntradaPorFechaEvento(int idFechaEvento)
        {
            List<TipoEntrada> listaTipoEntrada = new List<TipoEntrada>();
            lock (DB)
            {
                string query = "SELECT * FROM TipoEntrada WHERE IDFECHAEVENTO=@IDFECHAEVENTO";
                var parametros = new ParameterList();
                parametros.Add("@IDFECHAEVENTO", idFechaEvento);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    TipoEntrada tipoEntrada = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        cantidadEntradas = DB.GetInt("CANTIDADENTRADAS"),
                        cantidadVendida = DB.GetInt("CANTIDADVENDIDA"),
                        precio = DB.GetDecimal("PRECIO"),
                        limiteCompra = DB.GetInt("LIMITECOMPRA"),
                        puntos = DB.GetInt("PUNTOS"),
                        idFechaEvento = DB.GetInt("IDFECHAEVENTO")
                    };
                    listaTipoEntrada.Add(tipoEntrada);
                }
                foreach(TipoEntrada tipoEntrada in listaTipoEntrada)
                {
                    tipoEntrada.FechaEvento = ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                }
                return listaTipoEntrada;
            }

        }

        public int InsertarTipoEntrada(TipoEntrada tipoEntrada)
        {
            lock (DB)
            {
                string query = "INSERT INTO TipoEntrada (NOMBRE, CANTIDADENTRADAS, CANTIDADVENDIDA, PRECIO, LIMITECOMPRA, PUNTOS, IDFECHAEVENTO) " +
                               "VALUES (@NOMBRE, @CANTIDADENTRADAS, @CANTIDADVENDIDA, @PRECIO, @LIMITECOMPRA, @PUNTOS, @IDFECHAEVENTO); SELECT LAST_INSERT_ID();";
                ;
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", tipoEntrada.nombre);
                parametros.Add("@CANTIDADENTRADAS", tipoEntrada.cantidadEntradas);
                parametros.Add("@CANTIDADVENDIDA", tipoEntrada.cantidadVendida);
                parametros.Add("@PRECIO", tipoEntrada.precio);
                parametros.Add("@LIMITECOMPRA", tipoEntrada.limiteCompra);
                parametros.Add("@PUNTOS", tipoEntrada.puntos);
                parametros.Add("@IDFECHAEVENTO", tipoEntrada.idFechaEvento);

                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public TipoEntrada ObtenerTipoEntradaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM TipoEntrada WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    TipoEntrada tipoEntrada = new()
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre"),
                        cantidadEntradas = DB.GetInt("cantidadEntradas"),
                        cantidadVendida = DB.GetInt("cantidadVendida"),
                        precio = DB.GetDecimal("precio"),
                        limiteCompra = DB.GetInt("limiteCompra"),
                        puntos = DB.GetInt("puntos"),
                        idFechaEvento = DB.GetInt("idFechaEvento")
                    };
                    tipoEntrada.FechaEvento = ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento);
                    return tipoEntrada;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTipoEntradaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM TipoEntrada WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTipoEntrada(TipoEntrada tipoEntrada)
        {
            lock (DB)
            {
                string query = "UPDATE TipoEntrada SET NOMBRE = @NOMBRE, CANTIDADENTRADAS = @CANTIDADENTRADAS, CANTIDADVENDIDA = @CANTIDADVENDIDA, " +
                               "PRECIO = @PRECIO, LIMITECOMPRA = @LIMITECOMPRA, PUNTOS = @PUNTOS, IDFECHAEVENTO = @IDFECHAEVENTO WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", tipoEntrada.id);
                parametros.Add("@NOMBRE", tipoEntrada.nombre);
                parametros.Add("@CANTIDADENTRADAS", tipoEntrada.cantidadEntradas);
                parametros.Add("@CANTIDADVENDIDA", tipoEntrada.cantidadVendida);
                parametros.Add("@PRECIO", tipoEntrada.precio);
                parametros.Add("@LIMITECOMPRA", tipoEntrada.limiteCompra);
                parametros.Add("@PUNTOS", tipoEntrada.puntos);
                parametros.Add("@IDFECHAEVENTO", tipoEntrada.idFechaEvento);

                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;

            }
        }

        private FechaEvento ObtenerFechaEventoPorId(int v)
        {
            var fechaEventoMapper = new FechaEventoMapper(globales, DB);
            return fechaEventoMapper.ObtenerFechaEventoPorId(v);
        }

        public List<ResponseTipoEntrada> ListarResponseTipoEntradaPorFechaEvento(int id)
        {
            List<ResponseTipoEntrada> listaTipoEntrada = new List<ResponseTipoEntrada>();
            lock (DB)
            {
                string query = "SELECT ID, NOMBRE, PRECIO, PUNTOS FROM TipoEntrada WHERE IDFECHAEVENTO=@IDFECHAEVENTO";
                var parametros = new ParameterList();
                parametros.Add("@IDFECHAEVENTO", id);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    ResponseTipoEntrada tipoEntrada = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        precio = double.Parse(DB.GetDecimal("PRECIO").ToString()),
                        puntos = DB.GetInt("PUNTOS"),
                        agotado = false
                    };
                    listaTipoEntrada.Add(tipoEntrada);
                }
                DB.CloseReader();
                return listaTipoEntrada;
            }
        }

        public List<TipoEntrada> ListarEntradasPorEvento(int idEvento)
        {
            var lista = new List<TipoEntrada>();
            lock (DB)
            {
                // Este query une TipoEntrada con FechaEvento para filtrar por el idEvento
                string query =
                    "SELECT te.* " +
                    "FROM TipoEntrada te " +
                    "INNER JOIN FechaEvento fe ON te.idFechaEvento = fe.id " +
                    "WHERE fe.idEvento = @ID_EVENTO";

                var parametros = new ParameterList();
                parametros.Add("@ID_EVENTO", idEvento);
                DB.Select(query, parametros);
                while (DB.Read())
                {
                    lista.Add(new TipoEntrada
                    {
                        id = DB.GetInt("id"),
                        precio = DB.GetDecimal("precio"),
                        limiteCompra = DB.GetInt("limiteCompra"),
                        puntos = DB.GetInt("puntos"),
                        nombre = DB.GetString("nombre"),
                        cantidadEntradas = DB.GetInt("cantidadEntradas"),
                        cantidadVendida = DB.GetInt("cantidadVendida"),
                        idFechaEvento = DB.GetInt("idFechaEvento")
                    });
                }
            }
            return lista;
        }
        public List<TipoEntrada> ObtenerPorFechaEventoId(int idFechaEvento)
        {
            List<TipoEntrada> lista = new List<TipoEntrada>();

            lock (DB)
            {
                string query = "SELECT * FROM TipoEntrada WHERE IDFECHAEVENTO=@ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", idFechaEvento);

                DB.Select(query, parametros);
                while (DB.Read())
                {
                    TipoEntrada tipo = new TipoEntrada
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        cantidadEntradas = DB.GetInt("CANTIDADENTRADAS"),
                        cantidadVendida = DB.GetInt("CANTIDADVENDIDA"),
                        precio = DB.GetDecimal("PRECIO"),
                        limiteCompra = DB.GetInt("LIMITECOMPRA"),
                        puntos = DB.GetInt("PUNTOS"),
                        idFechaEvento = DB.GetInt("IDFECHAEVENTO")
                    };

                    lista.Add(tipo);
                }

                DB.CloseReader();
            }

            return lista;
        }

        public List<TipoEntrada> ObtenerPorListaFechaEventoIds(List<int> idsFechaEvento)
        {
            if (idsFechaEvento == null || idsFechaEvento.Count == 0)
                return new List<TipoEntrada>();

            lock (DB)
            {
                string ids = string.Join(",", idsFechaEvento);

                string query = $@"
            SELECT * FROM TipoEntrada
            WHERE IDFECHAEVENTO IN ({ids});
        ";

                DB.Select(query, null);

                List<TipoEntrada> lista = new();
                while (DB.Read())
                {
                    lista.Add(new TipoEntrada
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE"),
                        cantidadEntradas = DB.GetInt("CANTIDADENTRADAS"),
                        cantidadVendida = DB.GetInt("CANTIDADVENDIDA"),
                        precio = DB.GetDecimal("PRECIO"),
                        limiteCompra = DB.GetInt("LIMITECOMPRA"),
                        puntos = DB.GetInt("PUNTOS"),
                        idFechaEvento = DB.GetInt("IDFECHAEVENTO")
                    });
                }

                DB.CloseReader();
                return lista;
            }
        }

        public int ActualizarTipoEntrada(TipoEntrada e)
        {
            lock (DB)
            {
                // Query para actualizar los datos de un tipo de entrada específico
                string query = "UPDATE TipoEntrada SET nombre=@NOM, precio=@PRECIO, cantidadEntradas=@CANT, " +
                               "limiteCompra=@LIM, puntos=@PTS " +
                               "WHERE id=@ID";

                var p = new ParameterList();
                p.Add("@NOM", e.nombre);
                p.Add("@PRECIO", e.precio);
                p.Add("@CANT", e.cantidadEntradas);
                p.Add("@LIM", e.limiteCompra);
                p.Add("@PTS", e.puntos);
                p.Add("@ID", e.id); // ID obligatorio para saber cuál actualizar

                // ExecuteNonQuery devuelve el número de filas afectadas
                return DB.ExecuteNonQuery(query, p);
            }
        }

        public void InsertarTipoEntradaBatch(List<TipoEntrada> entradas)
        {
            if (entradas == null || !entradas.Any())
                return;

            lock (DB)
            {
                var parametros = new ParameterList();
                var values = new List<string>();

                for (int i = 0; i < entradas.Count; i++)
                {
                    var e = entradas[i];
                    values.Add($"(@NOMBRE{i}, @CANTIDADENTRADAS{i}, @CANTIDADVENDIDA{i}, @PRECIO{i}, @LIMITECOMPRA{i}, @PUNTOS{i}, @IDFECHAEVENTO{i})");

                    parametros.Add($"@NOMBRE{i}", e.nombre);
                    parametros.Add($"@CANTIDADENTRADAS{i}", e.cantidadEntradas);
                    parametros.Add($"@CANTIDADVENDIDA{i}", e.cantidadVendida);
                    parametros.Add($"@PRECIO{i}", e.precio);
                    parametros.Add($"@LIMITECOMPRA{i}", e.limiteCompra);
                    parametros.Add($"@PUNTOS{i}", e.puntos);
                    parametros.Add($"@IDFECHAEVENTO{i}", e.idFechaEvento);
                }

                string query = $"INSERT INTO TipoEntrada (NOMBRE, CANTIDADENTRADAS, CANTIDADVENDIDA, PRECIO, LIMITECOMPRA, PUNTOS, IDFECHAEVENTO) " +
                               $"VALUES {string.Join(", ", values)};";

                DB.ExecuteNonQuery(query, parametros);
            }
        }
    }
}
