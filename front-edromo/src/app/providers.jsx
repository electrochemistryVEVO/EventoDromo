"use client";

import { UserProvider } from "@/context/UserContext.jsx";
import { CartProvider } from "@/context/CartContext.jsx";

export default function Providers({ children }) {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
}
