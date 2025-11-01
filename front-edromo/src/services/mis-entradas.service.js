export async function getEntradas() {
  // link test
  // const res = await fetch("/data/entradas.json");
  //link q funciona en individual: http://localhost:5189/api/EntradaEventoAuxiliar/ListarTodasLasEntradas"
  //link q funciona en docker: http://localhost:8081/api/EntradaEventoAuxiliar/ListarTodasLasEntradas"
  const res = await fetch("http://localhost:5189/api/EntradaEventoAuxiliar/ListarTodasLasEntradas"); // para cambiar al back
  console.log(res);
  if (!res.ok)
    throw new Error("Error cargando entradas (status " + res.status + ")");
  const json = await res.json();

  // GenericResponse { success: bool, mensaje: string, data: T, error: string }
  if (!json) throw new Error("Respuesta vacía del servicio de entradas");
  if (json.success === false) {
    // prioriza error, luego mensaje
    throw new Error(
      json.error || json.mensaje || "Error en respuesta del servicio"
    );
  }

  return json.data ?? [];
}
