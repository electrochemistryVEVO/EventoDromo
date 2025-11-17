"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function UserCarritoLayoutClient({ children }) {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Función para verificar acceso - /user permite acceso público (cualquiera menos admin)
    const checkAccess = () => {
      // Verificar rol directamente desde el objeto user
      const userRole = user?.rol;
      console.log("Verificando acceso en /user/carrito - Usuario autenticado:", isAuthenticated, "Rol:", userRole);

      // Si el usuario es administrador, redirigir al dashboard de admin
      if (isAuthenticated && userRole === 'A') {
        console.warn("Admin detectado en carrito público. Redirigiendo al dashboard de admin.");
        window.location.href = "/admin/dashboard";
        return;
      }

      // Permitir acceso a usuarios no autenticados o clientes
      console.log("Acceso permitido a /user/carrito");
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
    <div className="relative bg-gray-100">
      {/* Barra verde superior */}
      <div className="bg-[#00C49A] w-full h-[78px]" />

      {/* Contenedor para el logo */}
      <div className="absolute top-0 left-8 flex h-[134.5px] items-center">
        {/* Círculo del logo */}
        <div
          className="relative"
          style={{
            width: "113px",
            height: "113px",
          }}
        >
          <div className="bg-white rounded-full w-full h-full flex items-center justify-center shadow-lg">
            <Image
              src={"/images/logo/logo_eventodromo_minimo.png"}
              alt="Eventodromo Logo"
              width={75}
              height={75}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Contenido de la página con padding superior para no ser tapado por el logo */}
      <main className="px-8 pt-24 pb-8">{children}</main>
    </div>
  );
}
