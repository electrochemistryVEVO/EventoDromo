using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;

namespace EventodromoRest.Mappers
{
    public class AuditoriaMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        public List<Auditoria> ListarAuditorias()
        {
            List<Auditoria> listaAuditorias = new List<Auditoria>();
            lock (DB)
            {
                string query = "SELECT * FROM Auditoria";
                DB.Select(query, null);
                while (DB.Read())
                {
                    Auditoria auditoria = new()
                    {
                        id = DB.GetInt("id"),
                        idcliente = DB.GetInt("idCliente"),
                        idtipoauditoria = DB.GetInt("idTipoAuditoria"),
                        descripcion = DB.GetString("descripcion"),
                        fechahora = DB.GetDateTime("fechaHora"),
                        monto = DB.GetDecimal("monto"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente")),
                        tipoauditoria = ObtenerTipoAuditoriaPorId(DB.GetInt("idTipoAuditoria"))
                    };
                    listaAuditorias.Add(auditoria);
                }
                return listaAuditorias;
            }
        }

        public int InsertarAuditoria(Auditoria auditoria)
        {
            lock (DB)
            {
                string query = "INSERT INTO Auditoria (idCliente, idTipoAuditoria, descripcion, fechaHora, monto) VALUES (@idCliente, @idTipoAuditoria, @descripcion, @fechaHora, @monto); SELECT LAST_INSERT_ID();";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", auditoria.idcliente);
                parametros.Add("@idTipoAuditoria", auditoria.idtipoauditoria);
                parametros.Add("@descripcion", auditoria.descripcion);
                parametros.Add("@fechaHora", auditoria.fechahora);
                parametros.Add("@monto", auditoria.monto);
                object result = DB.ExecuteScalar(query, parametros);
                int newId = Convert.ToInt32(result);
                return newId;
            }
        }

        public Auditoria ObtenerAuditoriaPorId(int id)
        {
            lock (DB)
            {
                string query = "SELECT * FROM Auditoria WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                DB.Select(query, parametros);
                if (DB.Read())
                {
                    Auditoria auditoria = new()
                    {
                        id = DB.GetInt("id"),
                        idcliente = DB.GetInt("idCliente"),
                        idtipoauditoria = DB.GetInt("idTipoAuditoria"),
                        descripcion = DB.GetString("descripcion"),
                        fechahora = DB.GetDateTime("fechaHora"),
                        monto = DB.GetDecimal("monto"),
                        cliente = ObtenerClientePorId(DB.GetInt("idCliente")),
                        tipoauditoria = ObtenerTipoAuditoriaPorId(DB.GetInt("idTipoAuditoria"))
                    };
                    return auditoria;
                }
                else
                {
                    return null;
                }
            }
        }

        public int EliminarAuditoriaPorId(int id)
        {
            lock (DB)
            {
                string query = "DELETE FROM Auditoria WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@id", id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        public int ModificarAuditoria(Auditoria auditoria)
        {
            lock (DB)
            {
                string query = "UPDATE Auditoria SET idCliente = @idCliente, idTipoAuditoria = @idTipoAuditoria, descripcion = @descripcion, fechaHora = @fechaHora, monto = @monto WHERE id = @id";
                var parametros = new ParameterList();
                parametros.Add("@idCliente", auditoria.idcliente);
                parametros.Add("@idTipoAuditoria", auditoria.idtipoauditoria);
                parametros.Add("@descripcion", auditoria.descripcion);
                parametros.Add("@fechaHora", auditoria.fechahora);
                parametros.Add("@monto", auditoria.monto);
                parametros.Add("@id", auditoria.id);
                int rowsAffected = DB.ExecuteNonQuery(query, parametros);
                return rowsAffected;
            }
        }

        private Cliente ObtenerClientePorId(int id)
        {
            var clienteMapper = new ClienteMapper(globales, DB);
            return clienteMapper.ObtenerClientePorId(id);
        }

        private TipoAuditoria ObtenerTipoAuditoriaPorId(int id)
        {
            var tipoAuditoriaMapper = new TipoAuditoriaMapper(globales, DB);
            return tipoAuditoriaMapper.ObtenerTipoAuditoriaPorId(id);
        }
    }
}