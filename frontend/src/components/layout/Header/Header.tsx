'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import styles from '@/components/layout/Header/header.module.css';
import ThemeToggle from '@/components/layout/ThemeToogle/ThemeToggle';
import { useRouter } from 'next/navigation';
import { usuarioService } from '@/services/usuarioService';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const nomeUsuario = useSyncExternalStore(
    // escuta o aviso da tela "Meu perfil": quando o nome muda lá, o cabeçalho lê o nome novo
    (avisar) => {
      window.addEventListener('perfilAtualizado', avisar);
      return () => window.removeEventListener('perfilAtualizado', avisar);
    },
    () => typeof window !== 'undefined' ? localStorage.getItem('nomeUsuario') || 'Usuário' : 'Usuário',
    () => 'Usuário'
  );

  // Foto do usuário no avatar: busca uma vez ao abrir o sistema (o Header fica montado entre as páginas)
  // e de novo quando a tela "Meu perfil" avisa que salvou ('perfilAtualizado')
  const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);

  useEffect(() => {
    async function carregarFoto() {
      try {
        const perfil = await usuarioService.buscarMeuPerfil();
        setFotoUsuario(perfil.foto);
      } catch {
        setFotoUsuario(null); // sem foto (ou sem conexão): fica a inicial do nome
      }
    }
    carregarFoto();
    window.addEventListener('perfilAtualizado', carregarFoto);
    return () => window.removeEventListener('perfilAtualizado', carregarFoto);
  }, []);

  // Função para abrir/fechar o menu ao clicar
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Função vazia pronta para você usar depois!
  const handleLogout = () => {
    console.log("Preparado para o logout!");
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('nivelUsuario');
    router.push('/login');
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
            {fotoUsuario ? (
              <img className={styles.avatar} src={`data:image/jpeg;base64,${fotoUsuario}`} alt={nomeUsuario} />
            ) : (
              <div className={styles.avatar}>{nomeUsuario.charAt(0).toUpperCase()}</div>
            )}
          </div>

          {/* O Menu Dropdown (só aparece se isMenuOpen for true) */}
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={() => { setIsMenuOpen(false); router.push('/perfil'); }}>
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