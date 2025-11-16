"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Layouts/navbar/navbar_admin.jsx";

export default function AdminLayoutClient({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Solo verificar: si hay usuario Y NO es admin, sacarlo con recarga completa
    if (user && user.rol !== 'A') {
      console.log("Usuario no-admin detectado en zona admin, redirigiendo con recarga completa");
      window.location.href = "/user/web/eventos/lista";
    }
  }, [user, router]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
