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
import style from "@/css/navbar-style.css";

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
  const searchInputRef = useRef(null);
  const precioButtonRef = useRef(null);
  const categoriasButtonRef = useRef(null);
  const ciudadButtonRef = useRef(null);
  const fechasButtonRef = useRef(null);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleApplyFilters = (filterData) => {
    console.log("Filtro aplicado:", filterData);
  };

  const handleClearFilters = (filterType) => {
    console.log("Eliminar filtro de tipo:", filterType);
  };

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

  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   const term = searchInputRef.current?.value.trim();
  //   if (!term) {
  //     return;
  //   }
  //   router.push(`/user/eventos/buscar?search=${encodeURIComponent(term)}`);
  // };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/auth/login");
  };

  return (
    <>
      <nav className="relative navbar-container">
        <div className="navbar-logo">
          <Link href="/user/eventos/lista">
            <Image
              src="/images/logo/eventodromo.png"
              alt="EventoDromo Logo"
              width={180}
              height={40}
              priority
            />
          </Link>
        </div>

        <div className="navbar-search-section">
          <form className="search-bar-wrapper decorative-search" onSubmit={handleSearchSubmit}>
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
          </form>
        </div>

        <div className="navbar-filters">
          {/* Botones de filtro... (igual que en el navbar de no logueado) */}
          <button
            ref={precioButtonRef}
            className="filter-btn"
            onClick={() => openPopover('precio', precioButtonRef)}
          >
            <Image
              src={"/images/icon/precioFiltro.svg"}
              alt="Precio"
              width={20}
              height={20}
            />
            <span>Precio</span>
          </button>
          <button
            ref={categoriasButtonRef}
            className="filter-btn"
            onClick={() => openPopover("categorias", categoriasButtonRef)}
          >
            <Image src="/images/icon/categoriasFiltro.svg" alt="Categorías" width={20} height={20} />
            <span>Categorías</span>
          </button>
          <button
            ref={ciudadButtonRef}
            className="filter-btn"
            onClick={() => openPopover("ciudad", ciudadButtonRef)}
          >
            <Image src="/images/icon/ciudadFiltro.svg" alt="Ciudad" width={20} height={20} />
            <span>Ciudad</span>
          </button>
          <button
            ref={fechasButtonRef}
            className="filter-btn"
            onClick={() => openPopover("fechas", fechasButtonRef)}
          >
            <Image src="/images/icon/fechasFiltro.svg" alt="Fechas" width={20} height={20} />
            <span>Fechas</span>
          </button>
        </div>

        <div className="navbar-user-actions">
          <button className="icon-btn cart-btn" onClick={openCart}>
            <Image src="/images/icon/carrito.svg" alt="Carrito" width={28} height={28} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {isAuthenticated ? (
            <div className="user-profile-section" ref={dropdownRef}>
              <button className="icon-btn user-avatar-btn" onClick={() => setDropdownOpen((prev) => !prev)}>
                <Image src="/images/icon/cuenta-logged-in.png" alt="Usuario" width={48} height={48} />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link href="/user/perfil?tab=info" className="dropdown-item">
                    <Image src="/images/icon/mis-datos.svg" alt="" width={20} height={20} />
                    Mis datos
                  </Link>
                  <Link href="/user/perfil?tab=entradas" className="dropdown-item">
                    <Image src="/images/icon/mis-entradas.svg" alt="" width={20} height={20} />
                    Mis Entradas
                  </Link>
                  <Link href="/user/perfil?tab=dromopuntos" className="dropdown-item">
                    <Image src="/images/icon/mis-puntos.svg" alt="" width={20} height={20} />
                    Mis puntos
                  </Link>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
                    <Image src="/images/icon/cerrar-sesion.svg" alt="" width={20} height={20} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
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
                <Image src="/images/icon/cuenta.svg" alt="Usuario" width={32} height={32} />
              </div>
            </div>
          )}
        </div>
      </nav >

      {openFilterModal === "precio" && activeButtonRef && (
        <PrecioModal
          onClose={closePopover}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          buttonRef={activeButtonRef}
        />
      )}
      {
        openFilterModal === "categorias" && activeButtonRef && (
          <CategoriasModal
            onClose={closePopover}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            buttonRef={activeButtonRef}
          />
        )
      }
      {
        openFilterModal === "ciudad" && activeButtonRef && (
          <CiudadModal
            onClose={closePopover}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            buttonRef={activeButtonRef}
          />
        )
      }
      {
        openFilterModal === "fechas" && activeButtonRef && (
          <FechasModal
            onClose={closePopover}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            buttonRef={activeButtonRef}
          />
        )
      }

      <ModalCarritoController isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
