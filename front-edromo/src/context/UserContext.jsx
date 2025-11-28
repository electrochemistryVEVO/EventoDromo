// src/context/UserContext.jsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getResumenDromopuntos } from "@/services/mis-dromopuntos.service";

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

    // Obtener URL de redirección si existe
    const redirectUrl = searchParams.get("redirect");
    
    // Determinar destino según rol
    let destination;
    if (redirectUrl) {
      destination = redirectUrl;
    } else if (userData.rol === 'A') {
      destination = "/admin/dashboard";
    } else if (userData.rol === 'C') {
      destination = "/user/web/eventos/lista";
    } else {
      destination = "/";
    }

    // SIEMPRE usar window.location.href para forzar recarga completa
    // Esto limpia TODOS los estilos CSS en caché y carga los correctos
    console.log("Login exitoso, forzando recarga completa para cargar estilos correctos");
    window.location.href = destination;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("cartExpiration");
    } catch (error) {
      console.warn("Error al borrar usuario de localStorage:", error);
    }
    
    // Usar window.location.href para forzar recarga completa
    // Esto limpia todos los estilos CSS en caché
    console.log("Logout exitoso, forzando recarga completa");
    window.location.href = "/auth/login";
  };

  const isAdmin = () => {
    return user?.rol === 'A';
  };

  const isCliente = () => {
    return user?.rol === 'C';
  };

  const updateUserPoints = useCallback((newPoints) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      const updatedUser = { ...prevUser, totalPuntos: newPoints };
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.warn("Error al actualizar puntos en localStorage:", error);
      }
      return updatedUser;
    });
  }, []); // ✅ Función estable, no depende de nada externo

  const refreshUserPoints = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      const resumen = await getResumenDromopuntos(user.token);
      updateUserPoints(resumen.total || 0);
    } catch (error) {
      console.warn("Error al refrescar puntos del usuario:", error);
    }
  }, [user?.token, updateUserPoints]); // ✅ Solo cambia si el token cambia

  // ✅ Actualizar puntos automáticamente en segundo plano (silencioso)
  useEffect(() => {
    if (!user?.token) return;

    // ✅ NO refrescar inmediatamente - evita parpadeo inicial
    // Los puntos se cargan desde localStorage al iniciar sesión
    
    // Configurar intervalo para refrescar cada 60 segundos (más espaciado)
    const intervalId = setInterval(() => {
      refreshUserPoints();
    }, 60000); // 60 segundos

    return () => clearInterval(intervalId);
  }, [user?.token, refreshUserPoints]);

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
        updateUserPoints,
        refreshUserPoints,
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