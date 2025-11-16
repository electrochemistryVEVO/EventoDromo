"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Layouts/navbar/navbar_admin.jsx";

export default function AdminLayoutClient({ children }) {
  const { user, isAuthenticated, isAdmin } = useUser();
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

      // Si el usuario no es administrador, redirigir a la página de usuario
      if (userRole !== 'A') {
        console.warn("Acceso denegado: El usuario no es administrador. Rol:", userRole);
        router.push("/user/web/eventos/lista");
        return;
      }

      // Si llegamos aquí, el usuario es admin
      console.log("Acceso concedido al admin");
      setHasAccess(true);
      setIsChecking(false);
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

  // Si todo está bien, renderizar el layout normal
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
