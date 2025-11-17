import "bootstrap/dist/css/bootstrap.css";
//import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import Image from "next/image";
import UserCarritoLayoutClient from "./UserCarritoLayoutClient";

export default function RootLayout({ children }) {
  return <UserCarritoLayoutClient>{children}</UserCarritoLayoutClient>;
}
