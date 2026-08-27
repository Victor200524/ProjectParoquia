'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './acesso-negado.module.css';

export default function AcessoNegado() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.125 8.25v-3a3.125 3.125 0 00-6.25 0v3h6.25zM8.25 15a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Acesso Restrito</h1>
        <p className={styles.message}>
          Você não tem o nível de permissão necessário para visualizar ou interagir com esta página.
        </p>
        
        <button className={styles.button} onClick={() => router.back()}>
          Voltar para a página anterior
        </button>
      </div>
    </div>
  );
}