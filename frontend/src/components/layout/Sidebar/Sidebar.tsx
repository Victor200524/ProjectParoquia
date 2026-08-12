"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logoParoquia from '@/images/logo_brasao_paroquia_sao_miguel.png'; 
import styles from '@/components/layout/Sidebar/sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { nome: 'Dashboard', rota: '/' },
    { nome: 'Acampamentos', rota: '/acampamentos' },
    { nome: 'Inscrições', rota: '/inscricoes' },
    { nome: 'Equipes & Quadrante', rota: '/equipes' },
    { nome: 'Estoque', rota: '/estoque' },
    { nome: 'Financeiro', rota: '/financeiro' },
    { nome: 'Usuários', rota: '/usuarios' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        
        <div className={styles.logoIcon}>
          <Image
            src={logoParoquia}
            alt="Brasão da Paróquia São Miguel Arcanjo"
            width={45}
            height={45}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        <div className={styles.logoText}>Paróquia<br/>São Miguel</div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link 
            key={item.rota} 
            href={item.rota}
            className={`${styles.navLink} ${pathname === item.rota ? styles.navLinkActive : ''}`}
          >
            {item.nome}
          </Link>
        ))}
      </nav>
    </aside>
  );
}