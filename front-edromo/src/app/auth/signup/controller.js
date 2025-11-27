import { redirect } from "next/navigation";
import { insertarUsuario } from "@/services/signUpService";

export async function onSubmit(formData, redirectUrl = null) {
  try {
    const clienteData = {
      nombres: formData.get("nombres"),
      apellidos: formData.get("apellidos"),
      email: formData.get("email"),
      password: formData.get("password"),
      idsexo: parseInt(formData.get("idsexo")),           // ✅ viene del mapeo en page.js
      idtipoDocumento: parseInt(formData.get("idtipoDocumento")),
      idciudad: parseInt(formData.get("idciudad")),
      
      numeroDocumento: formData.get("numeroDocumento"),
      telefono: formData.get("telefono"),
      
      
      fechaNacimiento: formData.get("fechaNacimiento"),
      politicaDePrivacidad: formData.get("terminos") === "on",
      envioDePublicidad: formData.get("promociones") === "on",
    };

    const response = await insertarUsuario(clienteData);
    if (response.success) {
      // Redirigir al login preservando el redirect para volver al detalle del evento
      const loginUrl = redirectUrl 
        ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
        : "/auth/login";
      window.location.href = loginUrl;
      return { success: true };
    } else {
      return { error: "No se pudo completar el registro" };
    }

    
  } catch (error) {
    console.error("Error en el registro:", error);
    return { error: "Error al procesar el registro" };
  }
}
