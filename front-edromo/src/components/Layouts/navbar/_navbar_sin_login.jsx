"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/css/navbar-style.css";
import "@/css/navbar-logged-in.css"; 
import ModalCarritoController from "@/components/carrito/ModalCarrito.controller";
import PrecioModal from "@/components/Layouts/navbar/filtros/PrecioModal";
import CategoriasModal from "@/components/Layouts/navbar/filtros/CategoriasModal";
import CiudadModal from "@/components/Layouts/navbar/filtros/CiudadModal";
import FechasModal from "@/components/Layouts/navbar/filtros/FechasModal";

// Importa el Hook
import { useNavbarController } from './controller-navbar.js'; // Ajusta la ruta si es necesario

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(null);
  const precioButtonRef = useRef(null);
  const categoriasButtonRef = useRef(null);
  const ciudadButtonRef = useRef(null);
  const fechasButtonRef = useRef(null);
  const [activeButtonRef, setActiveButtonRef] = useState(null);

  // Llama al Hook
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

  return (
    <>
      <nav className="navbar-container relative">
        {/* 1. Logo */}
        <div className="navbar-logo">
          <Link href="/user/eventos/lista">
            <Image
              src={"/images/logo/eventodromo.png"}
              alt="EventoDromo Logo"
              width={180}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* 2. Barra de Búsqueda y Filtros */}
        <div className="navbar-search-section">
          {/* Input de Búsqueda Conectado */}
          <div className="search-bar-wrapper decorative-search">
            <Image
              src={"/images/icon/lupa.svg"}
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

          {/* --- SECCIÓN DE FILTROS CORREGIDA --- */}
          <div className="navbar-filters">
            {/* Solo los cuatro botones completos */}
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
              onClick={() => openPopover('categorias', categoriasButtonRef)}
            >
              <Image src={"/images/icon/categoriasFiltro.svg"} alt="Categorías" width={20} height={20} />
              <span>Categorías</span>
            </button>
            <button
              ref={ciudadButtonRef}
              className="filter-btn"
              onClick={() => openPopover('ciudad', ciudadButtonRef)}
            >
              <Image src={"/images/icon/ciudadFiltro.svg"} alt="Ciudad" width={20} height={20} />
              <span>Ciudad</span>
            </button>
            <button
              ref={fechasButtonRef}
              className="filter-btn"
              onClick={() => openPopover('fechas', fechasButtonRef)}
            >
              <Image src={"/images/icon/fechasFiltro.svg"} alt="Fechas" width={20} height={20} />
              <span>Fechas</span>
            </button>
          </div>
        </div>

        {/* 3. Acciones de Usuario */}
        <div className="navbar-user-actions">
          <button className="icon-btn cart-btn" onClick={openCart}>
            <Image src={"/images/icon/carrito.svg"} alt="Carrito" width={28} height={28} />
            <span className="cart-badge">0</span>
          </button>
          <div className="auth-section">
            <div className="auth-buttons">
              <Link href="/auth/login" className="auth-link"> Ingresa </Link>
              <Link href="/auth/signup" className="auth-link"> Regístrate </Link>
            </div>
            <div className="user-icon">
              <Image src={"/images/icon/cuenta.svg"} alt="Usuario" width={32} height={32} />
            </div>
          </div>
        </div>
      </nav>

      {/* Renderizado Condicional de Popovers Conectados */}
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