"use client";
import React, { useState, useRef } from "react"; // Importa useRef
import Link from "next/link";
import Image from "next/image";
import "@/css/navbar-style.css";
import ModalCarritoController from "@/components/carrito/ModalCarrito.controller";

// Asume que estas rutas son correctas para tu proyecto
import PrecioModal from "@/components/Layouts/navbar/filtros/PrecioModal";
import CategoriasModal from "@/components/Layouts/navbar/filtros/CategoriasModal";
import CiudadModal from "@/components/Layouts/navbar/filtros/CiudadModal";
import FechasModal from "@/components/Layouts/navbar/filtros/FechasModal";

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(null); // Tipo de popover abierto

  // Referencias para los botones de filtro
  const precioButtonRef = useRef(null);
  const categoriasButtonRef = useRef(null);
  const ciudadButtonRef = useRef(null);
  const fechasButtonRef = useRef(null);

  // Estado para guardar la referencia del botón que abrió el popover
  const [activeButtonRef, setActiveButtonRef] = useState(null);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // Función para abrir/cerrar popovers
  const openPopover = (modalType, buttonRef) => {
    // Si se hace clic en el mismo botón, cierra el popover
    if (openFilterModal === modalType && activeButtonRef === buttonRef) {
        closePopover();
    } else {
        setOpenFilterModal(modalType);
        setActiveButtonRef(buttonRef); // Guarda la referencia del botón clickeado
    }
  };

  // Función para cerrar cualquier popover abierto
  const closePopover = () => {
    setOpenFilterModal(null);
    setActiveButtonRef(null);
  };

  // Funciones placeholder para manejar los filtros (se llaman desde los modales)
  const handleApplyFilters = (filterData) => {
    console.log("Filtro aplicado:", filterData);
    // Podrías cerrar el popover aquí si lo deseas: closePopover();
  };

  const handleClearFilters = (filterType) => {
    console.log("Eliminar filtro de tipo:", filterType);
    // Podrías cerrar el popover aquí si lo deseas: closePopover();
  };

  return (
    <>
      {/* Añade 'relative' para que los popovers 'absolute' se posicionen correctamente */}
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
            />
          </div>

          <div className="navbar-filters">
            {/* Botones con ref y onClick actualizado */}
            <button
              ref={precioButtonRef} // Asigna la referencia
              className="filter-btn"
              onClick={() => openPopover('precio', precioButtonRef)} // Llama a openPopover
            >
              <Image src={"/images/icon/precioFiltro.svg"} alt="Precio" width={20} height={20}/>
              <span>Precio</span>
            </button>
            <button
              ref={categoriasButtonRef}
              className="filter-btn"
              onClick={() => openPopover('categorias', categoriasButtonRef)}
            >
               <Image src={"/images/icon/categoriasFiltro.svg"} alt="Categorías" width={20} height={20}/>
              <span>Categorías</span>
            </button>
            <button
              ref={ciudadButtonRef}
              className="filter-btn"
              onClick={() => openPopover('ciudad', ciudadButtonRef)}
             >
              <Image src={"/images/icon/ciudadFiltro.svg"} alt="Ciudad" width={20} height={20}/>
              <span>Ciudad</span>
            </button>
            <button
              ref={fechasButtonRef}
              className="filter-btn"
              onClick={() => openPopover('fechas', fechasButtonRef)}
            >
               <Image src={"/images/icon/fechasFiltro.svg"} alt="Fechas" width={20} height={20}/>
              <span>Fechas</span>
            </button>
          </div>
        </div>

        {/* 3. Acciones de Usuario */}
        <div className="navbar-user-actions">
          <button className="icon-btn cart-btn" onClick={openCart}>
            <Image
              src={"/images/icon/carrito.svg"}
              alt="Carrito"
              width={28}
              height={28}
            />
          </button>

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
                src={"/images/icon/cuenta.svg"}
                alt="Usuario"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Renderizado Condicional de Popovers */}
      {/* Pasa la referencia del botón activo al modal/popover */}
      {openFilterModal === 'precio' && activeButtonRef && (
        <PrecioModal
          onClose={closePopover} // Pasa la función para cerrar
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          buttonRef={activeButtonRef} // Pasa la referencia del botón
        />
      )}
      {openFilterModal === 'categorias' && activeButtonRef && (
        <CategoriasModal
          onClose={closePopover}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          buttonRef={activeButtonRef}
        />
      )}
       {openFilterModal === 'ciudad' && activeButtonRef && (
        <CiudadModal
          onClose={closePopover}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          buttonRef={activeButtonRef}
        />
      )}
       {openFilterModal === 'fechas' && activeButtonRef && (
        <FechasModal
          onClose={closePopover}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          buttonRef={activeButtonRef}
        />
      )}

      {/* Modal del Carrito */}
      <ModalCarritoController isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;