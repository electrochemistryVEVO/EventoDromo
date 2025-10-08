"use client";
// 📍 Indica a Next.js que este archivo se ejecuta en el **navegador** (lado del cliente).
// Esto es necesario porque aquí se usa sessionStorage (que solo existe en el navegador).

import { autenticarUsuario } from "../service";
// 📡 Importa una función llamada `autenticarUsuario` desde `service.js`.
// Esa función probablemente hace la llamada al backend (por ejemplo con fetch o axios)
// para verificar si el correo y contraseña son correctos.


// 📤 Esta función se exporta y se usa en `page.js` cuando se envía el formulario
export async function onSubmit(formData) {
  try {
    // 🧱 1. Construimos un objeto con los datos del formulario:
    const loginInfo = {
      correo: formData.get("email"),     // 📩 Obtiene el valor del input con name="email"
      password: formData.get("password") // 🔑 Obtiene el valor del input con name="password"
    };

    // 📡 2. Llamamos a la función que valida el login en el backend
    // Le enviamos el correo y contraseña al servidor para que los verifique.
    const response = await autenticarUsuario(loginInfo);

    // ✅ 3. Si la autenticación fue exitosa:
    if (response.success) {
      // 🗂️ 4. Guardamos datos de sesión en el navegador:
      // En lugar de usar cookies del servidor, aquí se usa sessionStorage (propio del navegador)
      // Esto permite que la sesión se mantenga mientras la pestaña esté abierta.
      sessionStorage.setItem(
        "session",
        JSON.stringify({
          token: response.token,      // 🔑 Token devuelto por el backend (para autenticar futuras peticiones)
          user: loginInfo.correo,     // 📩 Correo del usuario logueado
          rol: response.rol,          // 👤 Rol del usuario (A = admin, U = usuario)
        }),
      );

      // 🧭 5. Retornamos un objeto con el resultado del login
      // Esto es lo que `page.js` recibe en `result`
      return {
        success: true,        // 🔥 Login exitoso
        rol: response.rol,    // 👤 Rol del usuario (para redirigir)
      };
    } 
    else {
      // ❌ Si el backend respondió que las credenciales son incorrectas:
      return { error: "Credenciales inválidas" };
    }
  } catch (error) {
    // 💥 Si algo falla en la petición (por ejemplo, el backend no responde):
    console.error("Error en el login:", error);
    return { error: "Error al intentar iniciar sesión" };
  }
}
