"use client";

import { autenticarUsuario } from "@/services/loginService.js";

export async function onSubmit(formData) {
  try {
    const loginInfo = {
      Correo: formData.get("email"),
      Password: formData.get("password"),
    };
    const response = await autenticarUsuario(loginInfo);
    return response;
  } catch (error) {
    console.error("Error crítico en onSubmit:", error);
    return { 
      success: false, 
      message: error.message || "Error de red al intentar iniciar sesión" 
    };
  }
}