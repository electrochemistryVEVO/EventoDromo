"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/css/navbar-style.css"; // Importamos los estilos dedicados
import ModalCarritoController from "../carrito/ModalCarrito.controller";

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <>
      <nav className="navbar-container">
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
            <button className="filter-btn">
              <Image
                src={"/images/icon/precioFiltro.svg"}
                alt="Precio"
                width={20}
                height={20}
              />
              <span>Precio</span>
            </button>
            <button className="filter-btn">
              <Image
                src={"/images/icon/categoriasFiltro.svg"}
                alt="Categorías"
                width={20}
                height={20}
              />
              <span>Categorías</span>
            </button>
            <button className="filter-btn">
              <Image
                src={"/images/icon/ciudadFiltro.svg"}
                alt="Ciudad"
                width={20}
                height={20}
              />
              <span>Ciudad</span>
            </button>
            <button className="filter-btn">
              <Image
                src={"/images/icon/fechasFiltro.svg"}
                alt="Fechas"
                width={20}
                height={20}
              />
              <span>Fechas</span>
            </button>
          </div>
        </div>

        {/* 3. Acciones de Usuario (Carrito, Login/Registro) */}
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
      <ModalCarritoController isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
