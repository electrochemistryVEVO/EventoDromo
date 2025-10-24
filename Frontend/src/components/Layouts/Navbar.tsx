"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logos/eventodromo.png';
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
      <IoClose className="w-8 h-8" />
    ) : (
      <IoReorderThree className="h-8 w-8 text-[#4ad9bf]" />
    )}
  </>
);

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <div>
      <div className="flex items-center justify-between h-20 px-2 bg-white border-b border-[#EAE8E8]">
        {/* 1. Logo (Responsive) */}
        <div className="flex-shrink-0">
          <Link href="/user/eventos/lista">
            <Image
              src={logo}
              alt="EventoDromo Logo"
              width={200} // Prop: Tamaño máximo de la imagen para optimización
              height={100} // Prop: Tamaño máximo de la imagen para optimización
              priority
              className="w-auto h-15 xl:h-18" // Clase: Tamaño renderizado
            />
          </Link>
        </div>

        {/* Barra de búsqueda (Responsive) */}
        <div className='gap-2 items-center bg-[#D9D9D9] px-3 py-2 rounded-md hidden md:flex'>
          <FaMagnifyingGlass className="w-5 h-5" />
          <input type="text" placeholder='Buscar eventos...' className='bg-[#D9D9D9] outline-none w-96' />
        </div>

        {/* 2. Barra de Búsqueda y Filtros (Oculto en móvil, visible en md y xl) */}
        <div className="items-center justify-center hidden md:flex md:gap-4 xl:gap-8">
          {/* Filtros (Oculto hasta xl) */}
          <div className="hidden gap-4 xl:flex">
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

        {/* 3. Acciones de Usuario (Responsive) */}
        <div className="flex items-center gap-3 md:gap-4 xl:gap-6">

          {/* Icono Búsqueda Móvil (visible solo en móvil) */}
          <button
            className="cursor-pointer md:hidden"
            aria-label="Buscar"
            onClick={() => setIsSearchOpen(v => !v)}
          >
            <FaMagnifyingGlass className="w-6 h-6" />
          </button>

          {/* Carrito (Icono responsive) */}
          <button className="cursor-pointer" onClick={openCart}>
            <FaShoppingCart className='w-9 h-9 text-[#4ad9bf]' />
          </button>

          {/* Autenticación (Icono y texto responsive) */}
          <div className="items-center hidden gap-2 text-right xl:flex">
            <div className='flex flex-col'>
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

      {isSearchOpen && (
          <div
            className="sticky top-20 z-50 w-full bg-white border-b border-[#EAE8E8] px-3 py-2 md:hidden"
            role="search"
          >
            <div className="flex items-center gap-2 rounded-md bg-[#F2F2F2] px-3 py-2">
              <FaMagnifyingGlass className="w-5 h-5" />
              <input
                type="search"
                placeholder="Buscar eventos…"
                className="w-full bg-transparent outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
              />
              <button
                className="text-sm font-medium text-[#00A699]"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      {/* Menú Desplegable Móvil */}
      <div
        className={`
          absolute top-20 left-0 w-full bg-white border-b border-[#EAE8E8] z-50
          transition-all duration-300 ease-in-out
          xl:hidden 
          ${isMenuOpen ? 'max-h-screen opacity-100 shadow-lg' : 'max-h-0 opacity-0 overflow-hidden'}
        `}
      >
        <div className="flex flex-col gap-1 p-4">
          {/* Filtros (Estilo móvil) */}
          <h3 className="px-2 text-sm font-bold text-gray-500 uppercase">Filtros</h3>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaMoneyBills className="w-6 h-6 text-[#4ad9bf]" />
            <span>Precio</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaTicketAlt className="w-6 h-6 text-[#4ad9bf]" />
            <span>Categorías</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaMapMarkerAlt className="w-6 h-6 text-[#4ad9bf]" />
            <span>Ciudad</span>
          </button>
          <button className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100">
            <FaCalendarDay className="w-6 h-6 text-[#4ad9bf]" />
            <span>Fechas</span>
          </button>

          <hr className="my-2" />

          {/* Autenticación (Visible solo en el menú móvil) */}
          <div className="flex flex-col gap-1 xl:hidden">
            <Link href="/auth/login" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100 no-underline hover:text-[#00A699]">
              Ingresa
            </Link>
            <Link href="/auth/signup" className="flex items-center gap-3 p-2 rounded-md text-base font-bold text-[#333] hover:bg-gray-100 no-underline hover:text-[#00A699]">
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