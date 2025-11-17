"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

/**
 * Componente para proteger rutas de cliente
 * Solo permite el acceso a usuarios con rol 'C' (Cliente)
 * Los administradores serán redirigidos al dashboard de admin
 */
export default function ProtectedClientRoute({ children }) {
  const { user, isAuthenticated, isCliente } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Función para verificar acceso
    const checkAccess = () => {
      // Si no hay usuario autenticado, redirigir al login
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo al login...");
        router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }

      // Verificar rol directamente desde el objeto user
      const userRole = user?.rol;
      console.log("Verificando rol de usuario:", userRole);

      // Si el usuario es administrador, redirigir al dashboard de admin
      if (userRole === 'A') {
        console.warn("Acceso denegado: El usuario es administrador. Redirigiendo al dashboard de admin.");
        window.location.href = "/admin/dashboard";
        return;
      }

      // Si el usuario es cliente, permitir acceso
      if (userRole === 'C') {
        console.log("Acceso concedido al cliente");
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      // Si no es ni admin ni cliente, redirigir al login
      console.warn("Rol no reconocido:", userRole);
      router.push("/auth/login");
    };

    checkAccess();
  }, [user, isAuthenticated, router]);

  // Mientras se verifica el rol, mostrar un loading
  if (isChecking || !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar los hijos
  return <>{children}</>;
}
