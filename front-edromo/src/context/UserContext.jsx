// src/context/UserContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.warn("Error al cargar usuario de localStorage:", error);
    }

    const handleStorageChange = (event) => {
      if (event.key === "user") {
        try {
          setUser(event.newValue ? JSON.parse(event.newValue) : null);
        } catch (error) {
          console.warn("Error al parsear usuario desde evento storage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.warn("Error al guardar usuario en localStorage:", error);
    }

    // --- LÓGICA DE REDIRECCIÓN MOVİDA AQUÍ ---
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      router.push(redirectUrl);
      return; // Salir
    }

    // Redirección basada en rol
    if (userData.rol === 'A') {
      router.push("/admin/dashboard");
    } else if (userData.rol === 'C') {
      router.push("/user/web/eventos/lista");
    } else {
      // Fallback por si el rol no es válido
      console.error('Rol de usuario no válido:', userData.rol);
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
      // Opcional: Limpia también el carrito de invitado si existe
      localStorage.removeItem("cart");
      localStorage.removeItem("cartExpiration");
    } catch (error) {
      console.warn("Error al borrar usuario de localStorage:", error);
    }
    // Redirige al login al cerrar sesión
    router.push("/auth/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: user === null && typeof window !== 'undefined' && !!localStorage.getItem("user"),
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};