import type { Metadata } from "next";
import "./globals.css"; // ESSA É A LINHA MÁGICA QUE MATA AS BORDAS

export const metadata: Metadata = {
  title: "Paróquia São Miguel Arcanjo",
  description: "Sistema de Gestão dos Acampamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}