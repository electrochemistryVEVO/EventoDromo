using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;


namespace EventodromoRest.Mappers
{
    public class TipoDocumentoMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TipoDocumento> ListarTipoDocumento()
        {
            List<TipoDocumento> listaTipoDocumento = new List<TipoDocumento>();
            lock (DB)
            {
                string query = "SELECT * FROM TipoDocumento";
                DB.Select(query, null);
                while (DB.Read())
                {
                    TipoDocumento tipoDocumento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE")
                    };
                    listaTipoDocumento.Add(tipoDocumento);
                }
                return listaTipoDocumento;
            }
        }

        public int InsertarTipoDocumento(TipoDocumento tipoDocumento)
        {
            lock (DB)
            {
                string query = "INSERT INTO TipoDocumento (NOMBRE) VALUES (@NOMBRE); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", tipoDocumento.nombre);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public TipoDocumento ObtenerTipoDocumentoPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM TipoDocumento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    TipoDocumento tipoDocumento = new()
                    {
                        id = DB.GetInt("ID"),
                        nombre = DB.GetString("NOMBRE")
                    };
                    return tipoDocumento;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTipoDocumentoPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM TipoDocumento WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@ID", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTipoDocumento(TipoDocumento tipoDocumento)
        {
            lock (DB)
            {
                string query = "UPDATE TipoDocumento SET NOMBRE = @NOMBRE WHERE ID = @ID";
                var parametros = new ParameterList();
                parametros.Add("@NOMBRE", tipoDocumento.nombre);
                parametros.Add("@ID", tipoDocumento.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}
