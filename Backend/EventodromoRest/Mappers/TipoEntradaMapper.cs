using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
<<<<<<< HEAD
using Microsoft.EntityFrameworkCore.Internal;
=======
using EventodromoRest.Negocio;
>>>>>>> origin/grupo3

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
                    tipoEntrada.FechaEvento = ObtenerFechaEventoPorId(tipoEntrada.idFechaEvento ?? 0);
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
    }
}
