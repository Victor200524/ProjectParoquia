import type { Metadata } from "next";
import { Providers } from "./providers"; // Importamos o provedor
import "./globals.css";

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
    // suppressHydrationWarning é obrigatório ao usar next-themes na tag html
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}