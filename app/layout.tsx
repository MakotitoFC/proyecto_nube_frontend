import type { Metadata } from "next";
// 1. IMPORTANTE: Importar ambas fuentes
import { Montserrat, WindSong, Oswald } from "next/font/google";
import "./globals.css";
// import { BookingProvider } from "@/components/BookingContext"; // REMOVED
import SiteLayout from "@/components/SiteLayout";
import { AuthProvider } from "./providers";
import { ToastProvider } from "@/components/ui/Toast";

// Configuración Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "800"], // Cargamos varios pesos por seguridad
  variable: "--font-montserrat", // Nombre de la variable para CSS
  display: "swap",
});

// Configuración WindSong
const windSong = WindSong({
  subsets: ["latin"],
  weight: ["400", "500"], // WindSong suele tener solo 400 o 500, cargamos ambos
  variable: "--font-windsong", // Nombre de la variable para CSS
  display: "swap",
});

// Configuración Oswald
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pelícanos Beach Club",
  description: "Tu lugar para conectar en Veracruz",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">

      <body className={`${montserrat.variable} ${windSong.variable} ${oswald.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <SiteLayout>
              {children}
            </SiteLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}