"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

/**
 * Componente para proteger rutas de administrador
 * Solo permite el acceso a usuarios con rol 'A' (Administrador)
 */
export default function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    // Si el usuario no es administrador, redirigir a la página de usuario
    if (!isAdmin()) {
      console.warn("Acceso denegado: El usuario no es administrador");
      router.push("/user/web/eventos/lista");
      return;
    }
  }, [user, isAuthenticated, isAdmin, router]);

  // Mientras se verifica el rol, mostrar un loading o nada
  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar los hijos
  return <>{children}</>;
}
