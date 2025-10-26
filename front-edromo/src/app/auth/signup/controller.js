import { redirect } from "next/navigation";
import { insertarUsuario } from "@/services/signUpService";

export async function onSubmit(formData) {
  try {
    const clienteData = {
      nombres: formData.get("nombres"),
      apellidos: formData.get("apellidos"),
      email: formData.get("email"),
      password: formData.get("password"),
      //sexo: formData.get("sexo"),
      idsexo: 1,
      
      //tipoDocumento se debe obtener por convertir lo que se ingresa en el formulario a su id correspondiente
      idtipoDocumento: 1,
      
      numeroDocumento: formData.get("numeroDocumento"),
      telefono: formData.get("telefono"),
      //ciudad  se debe obtener por convertir lo que se ingresa en el formulario a su id correspondiente,,
      idciudad: 1,
      
      fechaNacimiento: formData.get("fechaNacimiento"),
      politicaDePrivacidad: formData.get("terminos") === "on",
      envioDePublicidad: formData.get("promociones") === "on",
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
