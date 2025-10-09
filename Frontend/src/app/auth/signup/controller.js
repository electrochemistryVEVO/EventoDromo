import { redirect } from "next/navigation";
import { insertarUsuario } from "@/services/signUpService";

export async function onSubmit(formData) {
  try {
    const clienteData = {
      nombres: formData.get("nombres"),
      apellidos: formData.get("apellidos"),
      email: formData.get("email"),
      passwordhash: formData.get("password"),
      idsexo: formData.get("sexo"),
      idtipodocumento: formData.get("tipoDocumento"),
      numerodocumento: formData.get("numeroDocumento"),
      telefono: formData.get("telefono"),
      idciudad: formData.get("ciudad"),
      politicadeprivacidad: formData.get("politicaPrivacidad") === "on",
      enviodepublicidad: formData.get("promociones") === "on",
    };

    const response = await insertarUsuario(clienteData);
    if (response.success) {
          // Redirigir al login después de un registro exitoso
      window.location.href = "/auth/login";
      return { success: true };
    } else {
      return { error: "No se pudo completar el registro" };
    }

    
  } catch (error) {
    console.error("Error en el registro:", error);
    return { error: "Error al procesar el registro" };
  }
}
