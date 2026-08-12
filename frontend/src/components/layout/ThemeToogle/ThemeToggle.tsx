"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 36, height: 36 }}></div>;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        background: isDark ? "#334155" : "#f1f5f9", // Fundo dinâmico (escuro/claro)
        border: "none",
        cursor: "pointer",
        padding: "0.5rem",
        borderRadius: "50%", // Deixa o botão perfeitamente redondo
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isDark ? "#f8fafc" : "#1e293b", // Força a cor preta/branca no ícone
        transition: "all 0.3s ease",
        marginRight: "0.5rem" // Dá um espacinho do texto
      }}
      title="Alternar Tema"
    >
      {isDark ? (
        // Ícone de Sol (Tema Claro)
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
        </svg>
      ) : (
        // Ícone de Lua (Tema Escuro)
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}