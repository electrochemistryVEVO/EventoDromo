"use client";
// 1. IMPORTACIONES DE REACT Y NEXT
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// 2. IMPORTACIONES DE CONTEXTO (¡NUEVO!)
import { useUser } from "@/context/UserContext"; // Ajusta la ruta si es necesario
import { useCart } from "@/context/CartContext"; // Ajusta la ruta si es necesario
import PropTypes from 'prop-types';

// 3. IMPORTACIONES DE COMPONENTES
import logo from "public/images/logo/logo_eventodromo.png";
import ModalCarritoController from "@/components/carrito/ModalCarrito.controller";

// 4. IMPORTACIONES DE ICONOS
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdOutlineSpaceDashboard, MdOutlineLogout, MdPassword } from "react-icons/md";
import { HiMiniTicket } from "react-icons/hi2";
import { GiShadowFollower } from "react-icons/gi";


// Componente de Hamburguesa (sin cambios)
const HamburgerIcon = ({ open }) => (
  <>{open ? <IoClose className="w-8 h-8" /> : <IoReorderThree className="h-8 w-8 text-[#4ad9bf]" />}</>
);

// 3. Define los tipos de las props
HamburgerIcon.propTypes = {
  open: PropTypes.bool.isRequired
};

const Navbar = () => {
  // --- CONTEXTOS (¡NUEVO!) ---
  const { isAuthenticated, user, logout } = useUser();
  const { itemCount } = useCart();

  // --- ESTADOS ---
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Estados para el menú de perfil (¡NUEVO!)
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- HANDLERS ---
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); // Cierra dropdown
    setIsMenuOpen(false); // Cierra menú móvil
  };

  // Efecto para cerrar el menú de perfil si se hace clic fuera (¡NUEVO!)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div>
      {/* --- BARRA DE NAVEGACIÓN PRINCIPAL --- */}
      <div className="flex items-center justify-between h-20 px-2 bg-white border-b border-[#EAE8E8]">
        {/* 1. Logo */}
        <div className="shrink-0">
          <Link href={isAuthenticated ? "/user-login/eventos/lista" : "/user/eventos/lista"}>
            <Image
              src={logo}
              alt="EventoDromo Logo"
              width={200}
              height={100}
              priority
              className="w-auto h-15 xl:h-18"
            />
          </Link>
        </div>

        {/* 2. Barra de búsqueda (Desktop) */}
        <div className="gap-2 items-center bg-[#D9D9D9] px-3 py-2 rounded-md hidden md:flex">
          <FaMagnifyingGlass className="w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            className="bg-[#D9D9D9] outline-none w-96"
          />
        </div>

        {/* 3. Filtros (Oculto en móvil) */}
        <div className="items-center justify-center hidden md:flex md:gap-4 xl:gap-8">
          <div className="hidden gap-4 xl:flex">
            {/* ... (Tus botones de filtro: Precio, Categorías, etc. sin cambios) ... */}
            <button className="flex flex-col items-center w-20 h-13 text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaMoneyBills className="w-7 h-7 text-[#4ad9bf]" />
              <span>Precio</span>
            </button>
            <button className="flex flex-col items-center w-20 h-13 text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaTicketAlt className="w-7 h-7 text-[#4ad9bf]" />
              <span>Categorías</span>
            </button>
            <button className="flex flex-col items-center w-20 h-13 text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaMapMarkerAlt className="w-7 h-7 text-[#4ad9bf]" />
              <span>Ciudad</span>
            </button>
            <button className="flex flex-col items-center w-20 h-13 text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaCalendarDay className="w-7 h-7 text-[#4ad9bf]" />
              <span>Fechas</span>
            </button>
          </div>
        </div>

        {/* 4. Acciones de Usuario (Responsive) */}
        <div className="flex items-center gap-3 md:gap-4 xl:gap-6">
          {/* Icono Búsqueda Móvil */}
          <button
            className="cursor-pointer md:hidden"
            aria-label="Buscar"
            onClick={() => setIsSearchOpen((v) => !v)}
          >
            <FaMagnifyingGlass className="w-6 h-6" />
          </button>

          {/* Carrito (con badge) */}
          <button className="relative cursor-pointer" onClick={openCart}>
            <FaShoppingCart className="w-9 h-9 text-[#4ad9bf]" />
            {/* BADGE DE CARRITO (¡NUEVO!) */}
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          {/* --- LÓGICA DE AUTENTICACIÓN (DESKTOP) (¡MODIFICADO!) --- */}
          {isAuthenticated ? (
            // 4a. SI ESTÁ LOGUEADO (Desktop)
            <div className="relative hidden xl:flex" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="cursor-pointer">
                <FaUser className="w-9 h-9 text-[#4ad9bf]" />
              </button>

              {/* Menú Desplegable (Desktop) */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-50 flex flex-col py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full w-60">
                  <Link href="/user-login/web/perfil?tab=info" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
                    <MdOutlineSpaceDashboard className="w-5 h-5" /> Mis datos
                  </Link>
                  <Link href="/user-login/web/perfil" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
                    <HiMiniTicket className="w-5 h-5" /> Mis Entradas
                  </Link>
                  <Link href="/user-login/web/perfil?tab=dromopuntos" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
                    <GiShadowFollower className="w-5 h-5" /> Mis puntos
                  </Link>
                  <Link href="/user-login/web/cambiar-contrasena" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-100">
                    <MdPassword className="w-5 h-5" /> Cambiar Contraseña
                  </Link>
                  <div className="h-px my-2 bg-gray-200"></div>
                  <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 text-sm text-left text-red-600 hover:bg-gray-100">
                    <MdOutlineLogout className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 4b. SI NO ESTÁ LOGUEADO (Desktop)
            <div className="items-center hidden gap-2 text-right xl:flex">
              <div className="flex flex-col">
                <Link href="/auth/login" className="text-base font-bold text-[#777] no-underline leading-[1.2] hover:underline hover:text-[#333]">
                  INGRESA
                </Link>
                <Link href="/auth/signup" className="text-base font-bold text-[#777] no-underline leading-[1.2] hover:underline hover:text-[#333]">
                  REGÍSTRATE
                </Link>
              </div>
              <div>
                <FaUser className="w-9 h-9 text-[#4ad9bf]" />
              </div>
            </div>
          )}
          {/* --- FIN LÓGICA AUTENTICACIÓN (DESKTOP) --- */}

          {/* Botón Hamburguesa (Móvil) */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#333] p-1"
              aria-label="Abrir menú"
            >
              <HamburgerIcon open={isMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* --- BARRA DE BÚSQUEDA (MÓVIL) --- */}
      {isSearchOpen && (
        <div className="sticky top-20 z-50 w-full bg-white border-b border-[#EAE8E8] px-3 py-2 md:hidden" role="search">
          {/* ... (Tu barra de búsqueda móvil sin cambios) ... */}
          <div className="flex items-center gap-2 rounded-md bg-[#F2F2F2] px-3 py-2">
            <FaMagnifyingGlass className="w-5 h-5" />
            <input type="search" placeholder="Buscar eventos…" className="w-full bg-transparent outline-none" autoFocus onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)} />
            <button className="text-sm font-medium text-[#00A699]" onClick={() => setIsSearchOpen(false)} aria-label="Cerrar búsqueda">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* --- MENÚ DESPLEGABLE (MÓVIL) --- */}
      <div
        className={`
          absolute top-20 left-0 w-full bg-white border-b border-[#EAE8E8] z-50
          transition-all duration-300 ease-in-out
          xl:hidden 
          ${isMenuOpen ? "max-h-screen opacity-100 shadow-lg" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <div className="flex flex-col gap-1 p-4">
          {/* Filtros (Móvil) */}
          <h3 className="px-2 text-sm font-bold text-gray-500 uppercase">Filtros</h3>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaMoneyBills className="w-6 h-6 text-[#4ad9bf]" /> <span>Precio</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaTicketAlt className="w-6 h-6 text-[#4ad9bf]" /> <span>Categorías</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaMapMarkerAlt className="w-6 h-6 text-[#4ad9bf]" /> <span>Ciudad</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaCalendarDay className="w-6 h-6 text-[#4ad9bf]" /> <span>Fechas</span>
          </button>

          <hr className="my-2" />

          {/* --- LÓGICA DE AUTENTICACIÓN (MÓVIL) (¡MODIFICADO!) --- */}
          {isAuthenticated ? (
            // 5a. SI ESTÁ LOGUEADO (Móvil)
            <div className="flex flex-col gap-1">
              <h3 className="px-2 text-sm font-bold text-gray-500 uppercase">Mi Cuenta</h3>
              <Link href="/user-login/web/perfil?tab=info" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
                <MdOutlineSpaceDashboard className="w-6 h-6 text-[#4ad9bf]" /> Mis datos
              </Link>
              <Link href="/user-login/web/perfil" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
                <HiMiniTicket className="w-6 h-6 text-[#4ad9bf]" /> Mis Entradas
              </Link>
              <Link href="/user-login/web/perfil?tab=dromopuntos" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
                <GiShadowFollower className="w-6 h-6 text-[#4ad9bf]" /> Mis puntos
              </Link>
              <Link href="/user-login/web/cambiar-contrasena" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
                <MdPassword className="w-6 h-6 text-[#4ad9bf]" /> Cambiar Contraseña
              </Link>
              <button onClick={handleLogout} className="flex items-center w-full gap-3 p-2 text-base font-bold text-left text-red-600 rounded-md hover:bg-gray-100">
                <MdOutlineLogout className="w-6 h-6" /> Cerrar Sesión
              </button>
            </div>
          ) : (
            // 5b. SI NO ESTÁ LOGUEADO (Móvil)
            <div className="flex flex-col gap-1 xl:hidden">
              <Link href="/auth/login" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100 no-underline hover:text-[#00A699]">
                Ingresa
              </Link>
              <Link href="/auth/signup" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100 no-underline hover:text-[#00A699]">
                Regístrate
              </Link>
            </div>
          )}
          {/* --- FIN LÓGICA AUTENTICACIÓN (MÓVIL) --- */}

        </div>
      </div>

      <ModalCarritoController isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Navbar;