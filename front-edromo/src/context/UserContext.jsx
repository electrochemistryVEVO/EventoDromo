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
    // Verificar si hay un cambio de rol
    const previousRole = user?.rol;
    const newRole = userData?.rol;
    
    setUser(userData);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.warn("Error al guardar usuario en localStorage:", error);
    }

    // --- LÓGICA DE REDIRECCIÓN MOVİDA AQUÍ ---
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      // Si hay cambio de rol, forzar recarga completa
      if (previousRole && previousRole !== newRole) {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }
      return; // Salir
    }

    // Redirección basada en rol
    if (userData.rol === 'A') {
      // Si cambiamos de cliente a admin, forzar recarga completa
      if (previousRole === 'C') {
        window.location.href = "/admin/dashboard";
      } else {
        router.push("/admin/dashboard");
      }
    } else if (userData.rol === 'C') {
      // Si cambiamos de admin a cliente, forzar recarga completa
      if (previousRole === 'A') {
        window.location.href = "/user/web/eventos/lista";
      } else {
        router.push("/user/web/eventos/lista");
      }
    } else {
      // Fallback por si el rol no es válido
      console.error('Rol de usuario no válido:', userData.rol);
      router.push("/");
    }
  };

  const logout = () => {
    const wasAdmin = user?.rol === 'A';
    
    setUser(null);
    try {
      localStorage.removeItem("user");
      // Opcional: Limpia también el carrito de invitado si existe
      localStorage.removeItem("cart");
      localStorage.removeItem("cartExpiration");
    } catch (error) {
      console.warn("Error al borrar usuario de localStorage:", error);
    }
    
    // Si era admin, forzar recarga completa para limpiar estilos
    if (wasAdmin) {
      window.location.href = "/auth/login";
    } else {
      router.push("/auth/login");
    }
  };

  const isAdmin = () => {
    return user?.rol === 'A';
  };

  const isCliente = () => {
    return user?.rol === 'C';
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: user === null && typeof window !== 'undefined' && !!localStorage.getItem("user"),
        isAuthenticated: !!user,
        isAdmin,
        isCliente,
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