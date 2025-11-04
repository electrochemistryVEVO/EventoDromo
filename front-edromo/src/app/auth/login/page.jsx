"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Nunito } from "next/font/google";
import { useUser } from "@/context/UserContext.jsx";
import { autenticarUsuario } from "@/services/Login.service.js";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordModal from "@/components/ForgotPasswordModal/ForgotPasswordModal";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700", "900"] });

function App() {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await autenticarUsuario(email, password);
      login(response);

      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      if (response.rol === 'A') {
        router.push("/user/dashboard");
      } else if (response.rol === 'C') {
        router.push("/user/eventos/lista");
      } else {
        setError('Rol de usuario no válido');
      }
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className={`${nunito.className} flex min-h-screen bg-white`}>
      <div className="relative flex flex-1 flex-col px-8 py-10 lg:min-w-[40vw]">
        <div className="relative mb-8 h-[250px] w-[400px] max-w-full">
          <Image
            src={"/images/logo/logo_eventodromo.png"}
            alt="Logo"
            fill={true}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <Link
          href="/user/eventos/lista"
          className="relative z-10 mx-auto mb-8 block w-full max-w-[600px] px-8 text-base font-semibold text-[#00bfa6] transition hover:text-[#008f8f] hover:underline"
        >
          Volver al inicio
        </Link>

        <form
          className="mx-auto flex w-full max-w-[600px] flex-col space-y-6 px-8 text-base md:px-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-base transition focus:border-[#00bfa6] focus:bg-white focus:outline-none lg:min-w-[400px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="font-medium text-gray-800">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-base transition focus:border-[#00bfa6] focus:bg-white focus:outline-none lg:min-w-[400px]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mb-2 text-sm font-medium text-[#00bfa6] transition hover:text-[#008f8f] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="space-y-3 text-center text-gray-600">
            <button
              type="submit"
              className="w-full rounded-md bg-[#00bfa6] px-4 py-3 text-lg font-semibold text-white transition hover:bg-[#00a892] lg:min-w-[400px]"
            >
              Ingresa
            </button>
            <p className="text-sm">¿Aún no tienes cuenta?</p>
            <Link
              href="/auth/signup"
              className="font-semibold text-[#00bfa6] transition hover:text-[#008f8f] hover:underline"
            >
              Registrate Aquí
            </Link>
          </div>
        </form>
      </div>

      <div className="relative flex-1 hidden overflow-hidden lg:block">
        <Image
          src={"/images/otros/imagenMitad.png"}
          alt="Imagen de fondo"
          fill={true}
          className="object-cover brightness-90"
          priority
        />
      </div>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
