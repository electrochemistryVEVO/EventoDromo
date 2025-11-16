"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Layouts/navbar/navbar_con_login.jsx";
import { Footer } from "@/components/Layouts/footer";

export default function UserWebLayoutClient({ children }) {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Función para verificar acceso - /user permite acceso público (cualquiera menos admin)
    const checkAccess = () => {
      // Verificar rol directamente desde el objeto user
      const userRole = user?.rol;
      console.log("Verificando acceso en /user/web - Usuario autenticado:", isAuthenticated, "Rol:", userRole);

      // Si el usuario es administrador, redirigir al dashboard de admin
      if (isAuthenticated && userRole === 'A') {
        console.warn("Admin detectado en zona pública. Redirigiendo al dashboard de admin.");
        window.location.href = "/admin/dashboard";
        return;
      }

      // Permitir acceso a usuarios no autenticados o clientes
      console.log("Acceso permitido a /user/web");
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
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
