// src/components/navbar/Navbar.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
    href: "/admin/locales/gestion",
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
  const currentPath = usePathname();
  const { user, isAuthenticated, isLoading } = useUser();
  const [userName, setUserName] = useState("Administrador");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Cargar datos del usuario autenticado
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user?.token || user?.rol !== "A") {
        setUserName("Administrador");
        return;
      }

      try {
        const userData = await fetchUserData(user.token);
        setUserName(userData?.name || "Admin");
      } catch (error) {
        console.error("Error al cargar datos del admin:", error);
        setUserName("Admin");
      }
    };

    if (!isLoading) {
      loadUserData();
    }
  }, [user, isAuthenticated, isLoading]);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#00C49A] flex items-center justify-between px-6 py-2 text-white shadow-md h-[88px]" suppressHydrationWarning>
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
      <div className="flex items-center gap-2" ref={userMenuRef}>
        <div className="flex items-center gap-3">
          <span>Bienvenido, {userName}</span>
          <Image
            src="/images/icon/icon-user.png"
            alt="User icon"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>

        {/* Menú Desplegable de Usuario */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Abrir menú de usuario"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <Link
                href="/admin/dromopuntos"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configurar DromoPuntos
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
