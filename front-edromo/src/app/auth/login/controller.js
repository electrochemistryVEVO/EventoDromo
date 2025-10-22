"use client";
// 📍 Indica a Next.js que este archivo se ejecuta en el **navegador** (lado del cliente).
// Esto es necesario porque aquí se usa sessionStorage (que solo existe en el navegador).

import { autenticarUsuario } from "@/services/loginService.js";
// 📡 Importa una función llamada `autenticarUsuario` desde `service.js`.
// Esa función probablemente hace la llamada al backend (por ejemplo con fetch o axios)
// para verificar si el correo y contraseña son correctos.

// 📤 Esta función se exporta y se usa en `page.js` cuando se envía el formulario
export async function onSubmit(formData) {
  try {
    // 🧱 1. Construimos un objeto con los datos del formulario:
    const loginInfo = {
      Correo: formData.get("email"), // 📩 Obtiene el valor del input con name="email"
      Password: formData.get("password"), // 🔑 Obtiene el valor del input con name="password"
    };

    // 📡 2. Llamamos a la función que valida el login en el backend
    // Le enviamos el correo y contraseña al servidor para que los verifique.
    const response = await autenticarUsuario(loginInfo);

    // ✅ 3. Si la autenticación fue exitosa:
    // 🗂️ 4. Guardamos datos de sesión en el navegador:
    // En lugar de usar cookies del servidor, aquí se usa sessionStorage (propio del navegador)
    // Esto permite que la sesión se mantenga mientras la pestaña esté abierta.
    if (response.success) {
      //const cliente = response.cliente;
      const rol = response.rol;

      // Guarda toda la información del cliente
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          //cliente,
          rol,
        })
      );

      return {
        success: true, //es obligatorio para que page.js sepa que fue exitoso aunque en el json de respuesta ya se envia un succes true porque si no no entra al if en page.js
        rol,
        //cliente,
      };
    } else {
      // ❌ Si el backend respondió que las credenciales son incorrectas:
      return { error: "Credenciales inválidas" };
    }
  } catch (error) {
    // 💥 Si algo falla en la petición (por ejemplo, el backend no responde):
    console.error("Error en el login:", error);
    return { error: "Error al intentar iniciar sesión" };
  }
}
