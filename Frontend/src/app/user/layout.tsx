
import 'bootstrap/dist/css/bootstrap.css';
import "@/css/user-style.css"
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import Navbar from '@/components/Layouts/Navbar';
import Footer from '@/components/Layouts/Footer';

export const metadata: Metadata = {
  title: {
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className='grid min-h-dvh grid-rows-[auto_1fr_auto]'>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}