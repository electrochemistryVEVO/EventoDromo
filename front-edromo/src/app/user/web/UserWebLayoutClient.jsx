"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Layouts/navbar/navbar_con_login.jsx";
import { Footer } from "@/components/Layouts/footer";

export default function UserWebLayoutClient({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Solo verificar: si es admin, mandarlo a su dashboard con recarga completa
    if (user && user.rol === 'A') {
      console.log("Admin detectado en zona user, redirigiendo con recarga completa");
      window.location.href = "/admin/dashboard";
    }
  }, [user, router]);

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Navbar key={pathname} />
      {children}
      <Footer />
    </div>
  );
}
