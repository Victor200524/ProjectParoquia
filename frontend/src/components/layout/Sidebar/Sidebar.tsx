"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logoParoquia from '@/images/logo_brasao_paroquia_sao_miguel.png'; 
import styles from '@/components/layout/Sidebar/sidebar.module.css';
import { itensMenuParaNivel} from '@/config/menuNavegacao';
import { useUsuarioLogado } from '@/hooks/useUsuarioLogado';

export default function Sidebar() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const {nivelUsuario} = useUsuarioLogado();

  const menuItems = nivelUsuario ? itensMenuParaNivel(nivelUsuario) : [];

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
          item.subMenu ? (
              <div key={item.nome} className={styles.navGroup}>
                  <button
                      type="button"
                      className={styles.navGroupHeader}
                      onClick={() => setMenuAberto(menuAberto === item.nome ? null : item.nome)}
                  >
                      {item.nome}
                  </button>
                  {menuAberto === item.nome && (
                      <div className={styles.navSubmenu}>
                          {item.subMenu.map((sub) => (
                              <Link
                                  key={sub.rota}
                                  href={sub.rota}
                                  className={`${styles.navSubLink} ${pathname === sub.rota ? styles.navLinkActive : ''}`}
                              >
                                  {sub.nome}
                              </Link>
                          ))}
                      </div>
                  )}
              </div>
          ) :  (
              <Link
                  key={item.rota}
                  href={item.rota ?? '#'}
                  className={`${styles.navLink} ${pathname === item.rota ? styles.navLinkActive : ''}`}
              >
                  {item.nome}
              </Link>
          )
        ))}
      </nav>
    </aside>
  );
}