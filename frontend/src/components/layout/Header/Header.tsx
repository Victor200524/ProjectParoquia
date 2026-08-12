import React from 'react';
import styles from '@/components/layout/Header/header.module.css';
import ThemeToggle from '@/components/layout/ThemeToogle/ThemeToggle'; // Importamos o botão

export default function Header() {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Sistema de Gestão</h2>
      
      <div className={styles.userProfile}>
        <ThemeToggle /> {/* O botão de tema entra aqui! */}
        <span className={styles.userName}>Olá, Coordenador</span>
        <div className={styles.avatar}>C</div>
      </div>
    </header>
  );
}