import React from 'react'
import logo from "@/assets/logos/eventodromo.png";
import Image from 'next/image';

import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { AiFillTikTok } from "react-icons/ai";

const Footer = () => {
    return (
        // 1. Envoltura principal del footer con fondo y padding
        <div className="bg-[#212529] text-[#adb5bd] py-6 px-4 font-sans">
            
            {/* 2. Contenedor principal (uno solo, no dos) */}
            <div className="max-w-[1200px] mx-auto">

                {/* 3. Layout principal: centrado y apilado en móvil, en fila en desktop */}
                <div className="
                    flex flex-col items-center gap-2
                    md:flex-row md:justify-between md:items-center
                ">
                    
                    {/* Logo (con tamaño responsive) */}
                    <div>
                        <Image
                            src={logo}
                            alt="EventoDromo Logo"
                            role="presentation"
                            className="h-[80px] w-auto md:h-[100px]" // Más pequeño en móvil
                        />
                    </div>

                    {/* Sección Social (centrada en móvil, alineada a la izquierda en desktop) */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-bold text-white mb-2">Conversemos</h2>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-opacity hover:opacity-80"
                            >
                                {/* Tamaño de ícono responsive */}
                                <FaFacebookSquare className="h-9 w-9 md:h-10 md:w-10 text-[#4ad9bf]" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-opacity hover:opacity-80"
                            >
                                <FaSquareXTwitter className="h-9 w-9 md:h-10 md:w-10 text-[#4ad9bf]" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-opacity hover:opacity-80"
                            >
                                <FaSquareInstagram className="h-9 w-9 md:h-10 md:w-10 text-[#4ad9bf]" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-opacity hover:opacity-80"
                            >
                                <AiFillTikTok className="h-9 w-9 md:h-10 md:w-10 text-[#4ad9bf]" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divisor y Copyright (ya eran responsives) */}
                <hr className="border-t border-[#495057] mt-3" />
                <div className="text-center text-sm">
                    © 2025 Eventodromo. Todos los derechos reservados.
                </div>
            </div>
        </div>
    )
}

export default Footer;