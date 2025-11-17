"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useUser();

  useEffect(() => {
    // Solo limpiar cuando estamos en la página de login o signup
    if (pathname === "/auth/login" || pathname === "/auth/signup") {
      // Verificar si hay algún usuario guardado
      const hadUser = localStorage.getItem("user");
      
      if (hadUser) {
        console.log("Limpiando sesión previa en auth para evitar conflictos de estilos");
        
        // Limpiar localStorage
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("cart");
          localStorage.removeItem("cartExpiration");
          
          // Forzar actualización del contexto disparando el evento storage
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: null,
            oldValue: hadUser
          }));
        } catch (error) {
          console.warn("Error al limpiar datos:", error);
        }
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
