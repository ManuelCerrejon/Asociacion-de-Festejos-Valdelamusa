import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asociacion de Festejos Valdelamusa",
  description:
    "Web oficial de la Asociacion de Festejos Valdelamusa: eventos, noticias, galeria y contacto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
