"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Layouts/navbar/navbar_con_login.jsx";
import { Footer } from "@/components/Layouts/footer";

export default function UserLoginWebLayoutClient({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Solo verificar: si es admin, mandarlo a su dashboard con recarga completa
    if (user && user.rol === 'A') {
      console.log("Admin detectado en zona user-login, redirigiendo con recarga completa");
      window.location.href = "/admin/dashboard";
    }
  }, [user, router]);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
