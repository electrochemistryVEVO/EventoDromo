import { Footer } from "@/components/Layouts/footer";
import { ChangePasswordHeader } from "@/components/Layouts/changePassword";

export default function ChangePasswordLayout({ children }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <ChangePasswordHeader />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  );
}
