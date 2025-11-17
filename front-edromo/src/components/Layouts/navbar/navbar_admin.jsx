// src/components/navbar/Navbar.jsx

"use client"; // Declaramos que es un componente de cliente para poder usar hooks

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/services/admin-service";

import { useUser } from "@/context/UserContext";

// Array con la información de los enlaces de navegación
const navLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: "/images/icon/icon-dashboard-white.png",
    activeIcon: "/images/icon/icon-dashboard-teal.png",
  },
  {
    name: "Locales",
    href: "/admin/locales",
    icon: "/images/icon/icon-locales-white.png",
    activeIcon: "/images/icon/icon-locales-teal.png",
  },
  {
    name: "Eventos",
    href: "/admin/eventos/gestion",
    icon: "/images/icon/icon-eventos-white.png",
    activeIcon: "/images/icon/icon-eventos-teal.png",
  },
  {
    name: "Auditoría de clientes",
    href: "/admin/auditoria",
    icon: "/images/icon/icon-auditoria-white.png",
    activeIcon: "/images/icon/icon-auditoria-teal.png",
  },
];

const Navbar = () => {
  // Hook para obtener la ruta actual y determinar qué enlace está activo
  const currentPath = usePathname();
  // Estado para almacenar el nombre del usuario
  const [userName, setUserName] = useState("Cargando..."); // Mostramos '...' mientras carga
  const { user, isAuthenticated, isLoading } = useUser();
  useEffect(() => {
    // --- 1. ACEPTA EL TOKEN AQUÍ ---
    const getUser = async (token) => {
      try {
        // --- 2. PASA EL TOKEN AQUÍ ---
        const userData = await fetchUserData(token);
        if (userData && userData.name) {
          setUserName(userData.name);
        } else {
          setUserName("Admin"); // Fallback si el nombre no viene
        }
      } catch (error) {
        console.error("Navbar no pudo cargar datos del admin:", error);
        setUserName("Admin (Error)");
      }
    };

    if (!isLoading && isAuthenticated && user?.token && user?.rol === "A") {
      getUser(user.token); // <-- Ahora esto funciona
    } else if (!isLoading && !isAuthenticated) {
      setUserName("Administrador");
    }
  }, [user, isAuthenticated, isLoading]);

  /*
  if (isLoading) {
    return (
      <nav className="bg-[#00C49A] flex items-center justify-between px-6 py-2 text-white shadow-md h-[88px]">
        <div className="text-3xl font-bold tracking-wider">Cargando...</div>
      </nav>
    );
    
  }
  */
  return (
    <nav className="bg-[#00C49A] flex items-center justify-between px-6 py-2 text-white shadow-md">
      {/* Sección Izquierda: Logo y Título */}
      <div className="flex items-center gap-6">
        <Image
          src="/images/icon/logo-eventodromo.png"
          alt="Logo Eventodromo"
          width={150}
          height={40}
        />
        <h1 className="text-3xl font-bold tracking-wider">ADMINISTRADOR</h1>
      </div>

      {/* Sección Central: Enlaces de Navegación */}
      <div className="flex items-center gap-2">
        {navLinks.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <Link
              href={link.href}
              key={link.name}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 ease-in-out ${
                isActive
                  ? "bg-white text-[#00A99D] font-semibold"
                  : "hover:bg-white/20"
              }`}
            >
              <Image
                src={isActive ? link.activeIcon : link.icon}
                alt={`${link.name} icon`}
                width={24}
                height={24}
              />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Sección Derecha: Información de Usuario */}
      <div className="flex items-center gap-3">
        <span>Bienvenido, {userName}</span>
        <div className="rounded-full p-1">
          <Image
            src="/images/icon/icon-user.png"
            alt="User icon"
            width={50}
            height={50}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
