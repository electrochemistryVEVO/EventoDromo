"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import ModalCarritoController from "@/components/carrito/ModalCarrito.controller";
import PrecioModal from "@/components/Layouts/navbar/filtros/PrecioModal";
import CategoriasModal from "@/components/Layouts/navbar/filtros/CategoriasModal";
import CiudadModal from "@/components/Layouts/navbar/filtros/CiudadModal";
import FechasModal from "@/components/Layouts/navbar/filtros/FechasModal";
import "@/css/navbar-style.css";
import "@/css/navbar-logged-in.css";

import { useNavbarController } from './controller-navbar.js';

const Navbar = () => {
  const router = useRouter();
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useUser();
  const [isCartOpen, setCartOpen] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(null);
  const [activeButtonRef, setActiveButtonRef] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Referencias para los botones de filtro
  const precioButtonRef = useRef(null);
  const categoriasButtonRef = useRef(null);
  const ciudadButtonRef = useRef(null);
  const fechasButtonRef = useRef(null);

  // ✅ MEJORADO: Manejo del dropdown como en el navbar antiguo
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FUNCIONES DEL CONTROLADOR PARA FILTROS
  const {
    applyFilter,
    clearFilter,
    handleSearchChange,
    handleSearchSubmit,
    activeFilters,
    searchTerm,
  } = useNavbarController();

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const openPopover = (modalType, buttonRef) => {
    if (openFilterModal === modalType && activeButtonRef === buttonRef) {
      closePopover();
    } else {
      setOpenFilterModal(modalType);
      setActiveButtonRef(buttonRef);
    }
  };

  const closePopover = () => {
    setOpenFilterModal(null);
    setActiveButtonRef(null);
  };

  // ✅ MEJORADO: Función de logout completa
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/auth/login");
  };

  return (
    <>
      <nav className="navbar-container relative">
        {/* 1. Logo */}
        <div className="navbar-logo">
          <Link href={isAuthenticated ? "/user/eventos/lista" : "/"}>
            <Image
              src="/images/logo/eventodromo.png"
              alt="EventoDromo Logo"
              width={180}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* 2. Barra de Búsqueda y Filtros - ESTRUCTURA DEL ANTIGUO NAVBAR */}
        <div className="navbar-search-section">
          <div className="search-bar-wrapper decorative-search">
            <Image
              src="/images/icon/lupa.svg"
              alt="Buscar"
              width={20}
              height={20}
              className="search-icon-decorative"
            />
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(e); }}
            />
          </div>

          <div className="navbar-filters">
            <button
              ref={precioButtonRef}
              className="filter-btn"
              onClick={() => openPopover('precio', precioButtonRef)}
            >
              <Image
                src="/images/icon/precioFiltro.svg"
                alt="Precio"
                width={20}
                height={20}
              />
              <span>Precio</span>
            </button>
            <button
              ref={categoriasButtonRef}
              className="filter-btn"
              onClick={() => openPopover('categorias', categoriasButtonRef)}
            >
              <Image
                src="/images/icon/categoriasFiltro.svg"
                alt="Categorías"
                width={20}
                height={20}
              />
              <span>Categorías</span>
            </button>
            <button
              ref={ciudadButtonRef}
              className="filter-btn"
              onClick={() => openPopover('ciudad', ciudadButtonRef)}
            >
              <Image
                src="/images/icon/ciudadFiltro.svg"
                alt="Ciudad"
                width={20}
                height={20}
              />
              <span>Ciudad</span>
            </button>
            <button
              ref={fechasButtonRef}
              className="filter-btn"
              onClick={() => openPopover('fechas', fechasButtonRef)}
            >
              <Image
                src="/images/icon/fechasFiltro.svg"
                alt="Fechas"
                width={20}
                height={20}
              />
              <span>Fechas</span>
            </button>
          </div>
        </div>

        {/* 3. Acciones de Usuario - COMBINA AMBAS VERSIONES */}
        <div className="navbar-user-actions">
          <button className="icon-btn cart-btn" onClick={openCart}>
            <Image
              src="/images/icon/carrito.svg"
              alt="Carrito"
              width={28}
              height={28}
            />
            {/* ✅ Badge dinámico del carrito */}
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {isAuthenticated ? (
            // ✅ USUARIO AUTENTICADO - Versión mejorada del navbar antiguo
            <div className="user-profile-section" ref={dropdownRef}>
              <button 
                className="icon-btn user-avatar-btn" 
                onClick={toggleDropdown}
              >
                <Image
                  src="/images/icon/cuenta-logged-in.png"
                  alt="Usuario"
                  width={48}
                  height={48}
                />
              </button>

              {/* ✅ MENÚ DESPLEGABLE COMPLETO - Igual al navbar antiguo */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    href="/user/perfil?tab=info"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Image
                      src="/images/icon/mis-datos.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    Mis datos
                  </Link>
                  <Link 
                    href="/user/perfil?tab=entradas" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Image
                      src="/images/icon/mis-entradas.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    Mis Entradas
                  </Link>
                  <Link
                    href="/user/perfil?tab=dromopuntos"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
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
                    href="/user/cambiar-contrasena"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
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
                    onClick={handleLogout}
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
          ) : (
            // ✅ USUARIO NO AUTENTICADO - Del nuevo navbar
            <div className="auth-section">
              <div className="auth-buttons">
                <Link href="/auth/login" className="auth-link">
                  Ingresa
                </Link>
                <Link href="/auth/signup" className="auth-link">
                  Regístrate
                </Link>
              </div>
              <div className="user-icon">
                <Image 
                  src="/images/icon/cuenta.svg" 
                  alt="Usuario" 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ MODALES DE FILTROS CORREGIDOS - Usan funciones del controlador */}
      {openFilterModal === 'precio' && activeButtonRef && (
        <PrecioModal
          onClose={closePopover}
          onApply={applyFilter}
          onClear={clearFilter}
          buttonRef={activeButtonRef}
          initialFilters={activeFilters}
        />
      )}
      {openFilterModal === 'categorias' && activeButtonRef && (
        <CategoriasModal
          onClose={closePopover}
          onApply={applyFilter}
          onClear={clearFilter}
          buttonRef={activeButtonRef}
          initialFilters={activeFilters}
        />
      )}
      {openFilterModal === 'ciudad' && activeButtonRef && (
        <CiudadModal
          onClose={closePopover}
          onApply={applyFilter}
          onClear={clearFilter}
          buttonRef={activeButtonRef}
          initialFilters={activeFilters}
        />
      )}
      {openFilterModal === 'fechas' && activeButtonRef && (
        <FechasModal
          onClose={closePopover}
          onApply={applyFilter}
          onClear={clearFilter}
          buttonRef={activeButtonRef}
          initialFilters={activeFilters}
        />
      )}

      {/* Modal del Carrito */}
      <ModalCarritoController isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;