using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class TipoAuditoriaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<TipoAuditoria> ListarTipoAuditorias()
        {
            List<TipoAuditoria> listaTipoAuditorias = new List<TipoAuditoria>();
            lock (DB)
            {
                string query = "SELECT * FROM TipoAuditoria";
                DB.Select(query, null);
                while (DB.Read())
                {
                    TipoAuditoria tipoAuditoria = new()
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre"),
                        iconourl = DB.GetString("iconoURL"),
                        color = DB.GetString("color")
                    };
                    listaTipoAuditorias.Add(tipoAuditoria);
                }
                return listaTipoAuditorias;
            }
        }

        public int InsertarTipoAuditoria(TipoAuditoria tipoAuditoria)
        {
            lock (DB)
            {
                string query = "INSERT INTO TipoAuditoria (nombre, iconoURL, color) VALUES (@nombre, @iconoURL, @color); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@nombre", tipoAuditoria.nombre);
                parametros.Add("@iconoURL", tipoAuditoria.iconourl);
                parametros.Add("@color", tipoAuditoria.color);

                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public TipoAuditoria ObtenerTipoAuditoriaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM TipoAuditoria WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    TipoAuditoria tipoAuditoria = new()
                    {
                        id = DB.GetInt("id"),
                        nombre = DB.GetString("nombre"),
                        iconourl = DB.GetString("iconoURL"),
                        color = DB.GetString("color")
                    };
                    return tipoAuditoria;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarTipoAuditoriaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM TipoAuditoria WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarTipoAuditoria(TipoAuditoria tipoAuditoria)
        {
            lock (DB)
            {
                string query = "UPDATE TipoAuditoria SET nombre = @nombre, iconoURL = @iconoURL, color = @color WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@nombre", tipoAuditoria.nombre);
                parametros.Add("@iconoURL", tipoAuditoria.iconourl);
                parametros.Add("@color", tipoAuditoria.color);
                parametros.Add("@id", tipoAuditoria.id);

                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }
    }
}