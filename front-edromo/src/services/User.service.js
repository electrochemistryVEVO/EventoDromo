export const getMisDatos = async (token) => {
  // Asumimos el mismo host/puerto que tu otro servicio
  const res = await fetch("http://localhost:5189/api/Cliente/GetMisDatosPersonales", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // 1. Verificación de error de red/HTTP (igual a tu ejemplo)
  if (!res.ok) {
    throw new Error("No se pudieron cargar los datos del cliente (status " + res.status + ")");
  }

  // 2. Parseo del GenericResponse (igual a tu ejemplo)
  const json = await res.json();

  // 3. Verificación de respuesta vacía (igual a tu ejemplo)
  if (!json) {
    throw new Error("Respuesta vacía del servicio de datos del cliente");
  }

  // 4. Verificación de error de la aplicación (igual a tu ejemplo)
  if (json.success === false) {
    throw new Error(
      json.error || json.message || "Error en respuesta del servicio de datos"
    );
  }

  // 5. Retorno del payload 'data'
  return json.data ?? null;
};