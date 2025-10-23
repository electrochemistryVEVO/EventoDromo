"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logos/eventodromo.png';
import lupa from '@/assets/icons/lupa.svg';
import ModalCarritoController from '../carrito/ModalCarrito.controller';

import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoReorderThree } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <>
    {open ? (
      <IoClose className="h-8 w-8" />
    ) : (
      <IoReorderThree className="h-8 w-8 text-[#3fc499]" />
    )}
  </>
);

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <div>
      <div className="relative flex items-center justify-between h-[92px] px-2 bg-white border-b border-[#EAE8E8] font-sans">
        {/* 1. Logo (Responsive) */}
        <div className="flex-shrink-0">
          <Link href="/user/eventos/lista">
            <Image
              src={logo}
              alt="EventoDromo Logo"
              width={200} // Prop: Tamaño máximo de la imagen para optimización
              height={100} // Prop: Tamaño máximo de la imagen para optimización
              priority
              className="h-15 w-auto xl:h-24" // Clase: Tamaño renderizado
            />
          </Link>
        </div>

        {/* 2. Barra de Búsqueda y Filtros (Oculto en móvil, visible en md y xl) */}
        <div className="hidden md:flex items-center justify-center md:gap-4 xl:gap-8">
          {/* Barra de búsqueda (Responsive) */}
          <div className="relative flex items-center">
            <FaMagnifyingGlass className="absolute left-4 pointer-events-none w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="
                border-none py-2.5 pr-5 pl-12 text-sm outline-none 
                flex-shrink-0 rounded-md bg-[#D9D9D9]
                w-full md:max-w-280 lg:max-w-sm xl:w-[448px] h-10
              "
            />
          </div>

          {/* Filtros (Oculto hasta xl) */}
          <div className="hidden xl:flex gap-4">
            <button className="flex flex-col items-center w-[80px] text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaMoneyBills className="w-10 h-10 text-[#3fc499]" />
              <span>Precio</span>
            </button>
            <button className="flex flex-col items-center w-[80px] text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaTicketAlt className="w-10 h-10 text-[#3fc499]" />
              <span>Categorías</span>
            </button>
            <button className="flex flex-col items-center w-[80px] text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaMapMarkerAlt className="w-10 h-10 text-[#3fc499]" />
              <span>Ciudad</span>
            </button>
            <button className="flex flex-col items-center w-[80px] text-base font-bold text-[#333] hover:text-[#00A699]">
              <FaCalendarDay className="w-10 h-10 text-[#3fc499]" />
              <span>Fechas</span>
            </button>
          </div>
        </div>

        {/* 3. Acciones de Usuario (Responsive) */}
        <div className="flex items-center gap-2 md:gap-4 xl:gap-6">

          {/* Icono Búsqueda Móvil (visible solo en móvil) */}
          <button className="cursor-pointer md:hidden">
            <FaMagnifyingGlass className="w-5 h-5" />
          </button>

          {/* Carrito (Icono responsive) */}
          <button className="cursor-pointer" onClick={openCart}>
            <FaShoppingCart className='w-7 h-7 text-[#3fc499]' />
          </button>
          {/* Autenticación (Icono y texto responsive) */}
          <div className="flex items-center gap-3">
            {/* Texto (Oculto hasta xl) */}
            <div className="hidden xl:flex flex-col text-right">
              <Link href="/auth/login" className="text-base font-bold text-[#777] no-underline leading-[1.2] hover:underline hover:text-[#333]">
                Ingresa
              </Link>
              <Link href="/auth/signup" className="text-base font-bold text-[#777] no-underline leading-[1.2] hover:underline hover:text-[#333]">
                Regístrate
              </Link>
            </div>
          </div>

          {/* Botón Hamburguesa (visible solo hasta xl) */}
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

      {/* Menú Desplegable Móvil */}
      <div
        className={`
          absolute top-[92px] left-0 w-full bg-white border-b border-[#EAE8E8] z-50
          transition-all duration-300 ease-in-out
          xl:hidden 
          ${isMenuOpen ? 'max-h-screen opacity-100 shadow-lg' : 'max-h-0 opacity-0 overflow-hidden'}
        `}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* Filtros (Estilo móvil) */}
          <h3 className="font-bold text-sm text-gray-500 uppercase px-2">Filtros</h3>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaMoneyBills className="w-6 h-6 text-[#3fc499]" />
            <span>Precio</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaTicketAlt className="w-6 h-6 text-[#3fc499]" />
            <span>Categorías</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaMapMarkerAlt className="w-6 h-6 text-[#3fc499]" />
            <span>Ciudad</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaCalendarDay className="w-6 h-6 text-[#3fc499]" />
            <span>Fechas</span>
          </button>

          <hr className="my-2" />

          {/* Autenticación (Visible solo en el menú móvil) */}
          <div className="xl:hidden flex flex-col gap-2">
            <Link href="/auth/login" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
              Ingresa
            </Link>
            <Link href="/auth/signup" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
              Regístrate
            </Link>
          </div>
        </div>
      </div>

      <ModalCarritoController isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Navbar;