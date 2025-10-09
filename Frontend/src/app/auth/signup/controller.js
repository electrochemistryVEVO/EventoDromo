import { redirect } from "next/navigation";
import { insertarUsuario } from "../../../services/signUpService";

export async function onSubmit(formData) {
  try {
    const clienteData = {
      nombre: formData.get("nombres"),
      apellido: formData.get("apellidos"),
      correo: formData.get("email"),
      contrasena: formData.get("password"),
      tipoDocumento: formData.get("tipoDocumento"),
      numeroDocumento: formData.get("numeroDocumento"),
      fechaNacimiento: formData.get("fechaNacimiento"),
      telefono: formData.get("telefono"),
      pais: formData.get("pais"),
      ciudad: formData.get("ciudad"),
      sexo: formData.get("sexo"),
      aceptaPromociones: formData.get("promociones") === "on",
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
