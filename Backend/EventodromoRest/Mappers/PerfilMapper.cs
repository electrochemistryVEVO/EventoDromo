using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using System.Collections.Generic;
using System.Linq;

namespace EventodromoRest.Mappers
{
    public class PerfilMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly DBManager.DBManager DB = DB;

        // --- MÉTODO PÚBLICO PRINCIPAL ---
        public InformacionPersonal GetInformacionPersonalCompleta(int idCliente)
        {
            // Un solo 'lock' para todas las consultas
            lock (DB)
            {
                // Consulta 1: Obtener el cliente (rápido)
                Cliente cliente = ObtenerClientePorIdPrivado(idCliente);
                if (cliente == null)
                {
                    // El BO lanzará la excepción "Cliente no encontrado"
                    return null;
                }

                // Consulta 2: Obtener la lista de Sexos (rápido)
                List<Sexo> sexos = ListarSexosPrivado();

                // Consulta 3: Obtener Países y Ciudades (optimizado con tu idea)
                (List<Pais> paises, List<CiudadDTO> ciudadesDTO) = ListarPaisesYCiudadesDTOPrivado();

                // Construimos el DTO final
                var informacion = new InformacionPersonal
                {
                    sexos = sexos,
                    paises = paises,
                    ciudades = ciudadesDTO,
                    datosCliente = new DatosCliente
                    {
                        id = cliente.id,
                        nombres = cliente.nombres,
                        apellidos = cliente.apellidos,
                        email = cliente.email,
                        idciudad = cliente.idciudad,
                        idsexo = cliente.idsexo,
                        telefono = cliente.telefono,
                        fechanacimiento = cliente.fechanacimiento?.ToString("yyyy-MM-dd")
                    }
                };

                return informacion;
            }
        }

        // --- MÉTODOS PRIVADOS ---

        // Consulta 1: Obtiene solo los datos del cliente
        private Cliente ObtenerClientePorIdPrivado(int id)
        {
            // Usamos la consulta que ya tenías, pero quitamos los JOINS N+1
            string query = "SELECT * FROM Cliente WHERE id = @id";
            var parametros = new ParameterList();
            parametros.Add("@id", id);
            DB.Select(query, parametros);
            Cliente cliente = null;

            if (DB.Read())
            {
                // Usamos tu MapearClienteDesdeReader
                cliente = new Cliente
                {
                    id = DB.GetInt("id"),
                    nombres = DB.GetString("nombres"),
                    apellidos = DB.GetString("apellidos"),
                    email = DB.GetString("email"),
                    fechanacimiento = DB.IsDBNull("fechaNacimiento") ? (DateTime?)null : DB.GetDateTime("fechaNacimiento"),
                    idsexo = DB.IsDBNull("idSexo") ? (int?)null : DB.GetInt("idSexo"),
                    idtipodocumento = DB.IsDBNull("idTipoDocumento") ? (int?)null : DB.GetInt("idTipoDocumento"),
                    numerodocumento = DB.GetString("numeroDocumento"),
                    telefono = DB.GetString("telefono"),
                    idciudad = DB.IsDBNull("idCiudad") ? (int?)null : DB.GetInt("idCiudad")
                    // No necesitamos mapear el resto de campos para este DTO
                };
            }
            DB.CloseReader();
            return cliente;
        }

        // Consulta 2: Obtiene la lista de sexos
        private List<Sexo> ListarSexosPrivado()
        {
            var lista = new List<Sexo>();
            string query = "SELECT id, nombre FROM Sexo";
            DB.Select(query, null);
            while (DB.Read())
            {
                lista.Add(new Sexo
                {
                    id = DB.GetInt("id"),
                    nombre = DB.GetString("nombre")
                });
            }
            DB.CloseReader();
            return lista;
        }

        // Consulta 3: Obtiene Países y Ciudades (DTO)
        private (List<Pais>, List<CiudadDTO>) ListarPaisesYCiudadesDTOPrivado()
        {
            var paisesDict = new Dictionary<int, Pais>();
            var ciudadesList = new List<CiudadDTO>();

            // Misma consulta optimizada que hicimos para SignUp
            string query = @"
                SELECT 
                    P.ID AS PaisID, 
                    P.NOMBRE AS PaisNombre,
                    C.ID AS CiudadID, 
                    C.NOMBRE AS CiudadNombre,
                    C.IDPAIS
                FROM 
                    Pais P
                LEFT JOIN 
                    Ciudad C ON P.ID = C.IDPAIS
                ORDER BY
                    P.ID;
            ";

            DB.Select(query, null);

            while (DB.Read())
            {
                int paisId = DB.GetInt("PaisID");
                if (!paisesDict.ContainsKey(paisId))
                {
                    paisesDict.Add(paisId, new Pais
                    {
                        id = paisId,
                        nombre = DB.GetString("PaisNombre")
                    });
                }

                if (!DB.IsDBNull("CiudadID"))
                {
                    // Creamos el CiudadDTO, que no tiene el objeto 'pais' anidado
                    ciudadesList.Add(new CiudadDTO
                    {
                        id = DB.GetInt("CiudadID"),
                        nombre = DB.GetString("CiudadNombre"),
                        idPais = DB.GetInt("IDPAIS")
                    });
                }
            }
            DB.CloseReader();

            return (paisesDict.Values.ToList(), ciudadesList);
        }
    }
}