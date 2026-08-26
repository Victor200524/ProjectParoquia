'use client';

import React, { useState, useSyncExternalStore } from 'react';
import styles from '@/components/layout/Header/header.module.css';
import ThemeToggle from '@/components/layout/ThemeToogle/ThemeToggle'; // Importamos o botão

export default function Header() {
  // Estado para controlar se o menu está visível
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nomeUsuario = useSyncExternalStore(
    () => () => {},
    () => typeof window !== 'undefined' ? localStorage.getItem('nomeUsuario') || 'Usuário' : 'Usuário',
    () => 'Usuário'
  );

  // Função para abrir/fechar o menu ao clicar
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Função vazia pronta para você usar depois!
  const handleLogout = () => {
    console.log("Preparado para o logout!");
    // localStorage.removeItem('token');
    // localStorage.removeItem('idUsuario');
    // localStorage.removeItem('nomeUsuario');
    // router.push('/login');
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Sistema de Gestão</h2>
      
      <div className={styles.userControls}>
        <ThemeToggle />
        
        {/* Container que agrupa o nome, avatar e o dropdown */}
        <div className={styles.profileContainer}>
          
          {/* Área clicável do usuário */}
          <div className={styles.userInfo} onClick={toggleMenu}>
            <span className={styles.userName}>{nomeUsuario}</span>
            <div className={styles.avatar}>{nomeUsuario.charAt(0).toUpperCase()}</div>
          </div>

          {/* O Menu Dropdown (só aparece se isMenuOpen for true) */}
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={() => console.log("Editar clicado")}>
                Editar Perfil
              </button>
              
              <hr className={styles.dropdownDivider} />
              
              <button className={`${styles.dropdownItem} ${styles.logoutText}`} onClick={handleLogout}>
                Sair da Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}