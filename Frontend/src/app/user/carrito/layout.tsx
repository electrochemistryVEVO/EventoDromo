
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapClient from '@/components/BootstrapComponent';
import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <section className='bg-[#00C49A] w-full h-16'>
        <div>Logo</div>
      </section>
      {children}
    </>
  );
}
