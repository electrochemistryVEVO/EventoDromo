// app/auth/changePassword/layout.js
import { Footer } from "@/components/Layouts/footer";
import { ChangePasswordHeader } from "@/components/Layouts/changePassword";
import UserCambiarContrasenaLayoutClient from "./UserCambiarContrasenaLayoutClient";

export default function ChangePasswordLayout({ children }) {
  return <UserCambiarContrasenaLayoutClient>{children}</UserCambiarContrasenaLayoutClient>;
}
