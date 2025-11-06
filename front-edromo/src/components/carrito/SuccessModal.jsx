"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const SuccessModal = ({ onClose }) => {
    const router = useRouter();
    const { clearCart } = useCart();

    const handleRedirect = () => {
        clearCart();
        router.push("/user/perfil?tab=entradas");
        // onClose(); // Opcional, si el modal debe cerrarse antes de redirigir
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-lg relative min-w-[350px]">
                <h2 className="mb-2 text-3xl font-bold text-center">Compra Exitosa</h2>
                <p className="mb-6 text-center text-gray-600">
                    Puede visualizar y descargar su(s) ticket en la pagina de Mis Entradas
                </p>
                <button
                    className="bg-[#00C49A] text-white rounded-xl px-8 py-2 font-bold text-lg shadow hover:bg-[#00b07e] transition"
                    onClick={handleRedirect}
                >
                    Mis Entradas
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;