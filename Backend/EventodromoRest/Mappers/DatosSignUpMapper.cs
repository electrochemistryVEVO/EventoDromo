using EventodromoRest.Modelos;
using EventodromoRest.Modelos.Utiles;
using System.Collections.Generic;
using System.Linq; // Necesario para .ToList()

namespace EventodromoRest.Mappers
{
    public class DatosSignUpMapper(Globales.Globales globales, DBManager.DBManager DB)
    {
        private readonly DBManager.DBManager DB = DB;

        public DatosSignUp ObtenerDatosCompletos()
        {
            // Usamos un solo lock para las 3 consultas
            lock (DB)
            {
                // Consultas 1 y 2 (rápidas)
                List<Sexo> sexos = ListarSexosPrivado();
                List<TipoDocumento> tiposDocumento = ListarTiposDocumentoPrivado();

                // Consulta 3 (optimizada)
                // Este método ahora devuelve AMBAS listas
                (List<Pais> paises, List<Ciudad> ciudades) = ListarPaisesYCiudadesPrivado();

                // El DTO no se modifica
                return new DatosSignUp
                {
                    paises = paises,
                    ciudades = ciudades,
                    sexos = sexos,
                    tiposDocumento = tiposDocumento
                };
            }
        }

        // --- ESTE ES EL NUEVO MÉTODO COMBINADO ---
        // Devuelve las dos listas en una sola consulta
        private (List<Pais>, List<Ciudad>) ListarPaisesYCiudadesPrivado()
        {
            // 1. Usamos tu idea del diccionario para no duplicar países
            var paisesDict = new Dictionary<int, Pais>();
            var ciudadesList = new List<Ciudad>();

            // 2. Una SOLA consulta. Traemos todos los países,
            //    y si tienen ciudades, también las trae.
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
                    P.ID; -- Ordenar es opcional pero ayuda a procesar
            ";

            DB.Select(query, null);

            while (DB.Read())
            {
                int paisId = DB.GetInt("PaisID");
                Pais pais;

                // 3. Si el país (ej: "Perú") no está en el diccionario, lo creamos
                if (!paisesDict.TryGetValue(paisId, out pais))
                {
                    pais = new Pais
                    {
                        id = paisId,
                        nombre = DB.GetString("PaisNombre")
                    };
                    paisesDict.Add(paisId, pais);
                }

                // 4. Si esta fila tiene una ciudad (C.ID no es NULO)...
                if (!DB.IsDBNull("CiudadID"))
                {
                    // ...creamos la ciudad y le asignamos el país
                    // que ya creamos o encontramos en el diccionario.
                    ciudadesList.Add(new Ciudad
                    {
                        id = DB.GetInt("CiudadID"),
                        nombre = DB.GetString("CiudadNombre"),
                        idPais = DB.GetInt("IDPAIS"),
                        pais = pais // Asignamos la referencia al objeto País
                    });
                }
            }
            DB.CloseReader();

            // 5. Convertimos el diccionario de Países en la lista final
            List<Pais> paisesList = paisesDict.Values.ToList();

            // 6. Devolvemos ambas listas
            return (paisesList, ciudadesList);
        }

        // --- MÉTODOS PRIVADOS (SIN CAMBIOS) ---

        private List<Sexo> ListarSexosPrivado()
        {
            List<Sexo> lista = new List<Sexo>();
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

        private List<TipoDocumento> ListarTiposDocumentoPrivado()
        {
            List<TipoDocumento> lista = new List<TipoDocumento>();
            string query = "SELECT ID, NOMBRE FROM TipoDocumento";
            DB.Select(query, null);
            while (DB.Read())
            {
                lista.Add(new TipoDocumento
                {
                    id = DB.GetInt("ID"),
                    nombre = DB.GetString("NOMBRE")
                });
            }
            DB.CloseReader();
            return lista;
        }
    }
}