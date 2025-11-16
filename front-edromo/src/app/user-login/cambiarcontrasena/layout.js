// app/auth/changePassword/layout.js
import { Footer } from "@/components/Layouts/footer";
import { ChangePasswordHeader } from "@/components/Layouts/changePassword";
import UserLoginCambiarContrasenaLayoutClient from "./UserLoginCambiarContrasenaLayoutClient";

export default function ChangePasswordLayout({ children }) {
  return <UserLoginCambiarContrasenaLayoutClient>{children}</UserLoginCambiarContrasenaLayoutClient>;
}
