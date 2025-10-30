"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/css/navbar-style.css"; // Importamos los estilos base que ya tenías
import "@/css/navbar-logged-in.css"; // Importamos los nuevos estilos para el menú

export function ChangePasswordHeader() {
  // Estado para controlar la visibilidad del menú desplegable
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Función para alternar la visibilidad del menú
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    // Función que se ejecuta cada vez que hay un clic en la página
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic fue fuera del contenedor del menú...
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // ...cierra el menú
      }
    };
    // Agregamos el listener para el clic fuera
    document.addEventListener("mousedown", handleClickOutside);
    // Limpiamos el efecto eliminando el listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="navbar-container">
      {/* 1. Logo (sin cambios) */}
      <div className="navbar-logo">
        <Link href="/user-login/web/eventos/lista">
          <Image
            src={"/images/logo/eventodromo.png"}
            alt="EventoDromo Logo"
            width={180}
            height={40}
            priority
          />
        </Link>
      </div>
      {/* 3. Acciones de Usuario (Carrito y Perfil con Desplegable) */}
      <div className="navbar-user-actions">
        <div className="user-profile-section">
          <button className="icon-btn user-avatar-btn" onClick={toggleDropdown}>
            <Image
              src={"/images/icon/cuenta-logged-in.png"} // Icono de usuario logueado
              alt="Usuario"
              width={100}
              height={60}
            />
          </button>

          {/* Menú Desplegable */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link
                href="/user-login/web/perfil?tab=info"
                className="dropdown-item"
              >
                <Image
                  src="/images/icon/mis-datos.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Mis datos
              </Link>
              <Link href="/user-login/web/perfil" className="dropdown-item">
                <Image
                  src="/images/icon/mis-entradas.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Mis Entradas
              </Link>
              <Link
                href="/user-login/web/perfil?tab=dromopuntos"
                className="dropdown-item"
              >
                <Image
                  src="/images/icon/mis-puntos.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Mis puntos
              </Link>
              <Link
                href="/user-login/web/cambiar-contrasena"
                className="dropdown-item"
              >
                <Image
                  src="/images/icon/cambiar-contrasena.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Cambiar Contraseña
              </Link>
              <div className="dropdown-divider"></div>
              <button
                onClick={() => {
                  /* Lógica para cerrar sesión */
                }}
                className="dropdown-item dropdown-item-logout"
              >
                <Image
                  src="/images/icon/cerrar-sesion.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
