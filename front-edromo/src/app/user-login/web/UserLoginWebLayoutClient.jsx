"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Layouts/navbar/navbar_con_login.jsx";
import { Footer } from "@/components/Layouts/footer";

export default function UserLoginWebLayoutClient({ children }) {
  const { user, isAuthenticated } = useUser();
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
      console.log("Verificando rol de usuario en /user-login/web:", userRole);

      // Si el usuario es administrador, redirigir al dashboard de admin
      if (userRole === 'A') {
        console.warn("Admin detectado en zona de cliente. Redirigiendo al dashboard de admin.");
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

  // Si todo está bien, renderizar el layout normal
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
