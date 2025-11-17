"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

/**
 * Hook que detecta cambios de rol y fuerza recarga completa para limpiar estilos
 */
export function useRoleChangeDetector() {
  const { user } = useUser();
  const previousRoleRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const currentRole = user?.rol;

    // Si tenemos un rol previo y cambió
    if (previousRoleRef.current !== null && previousRoleRef.current !== currentRole) {
      console.log(`Cambio de rol detectado: ${previousRoleRef.current} -> ${currentRole}`);
      console.log("Forzando recarga completa para limpiar estilos...");
      
      // Determinar la ruta de destino según el nuevo rol
      if (currentRole === 'A') {
        window.location.href = "/admin/dashboard";
      } else if (currentRole === 'C') {
        window.location.href = "/user/web/eventos/lista";
      } else if (!currentRole) {
        window.location.href = "/auth/login";
      }
    }

    // Actualizar el rol previo
    previousRoleRef.current = currentRole;
  }, [user?.rol, pathname]);
}
