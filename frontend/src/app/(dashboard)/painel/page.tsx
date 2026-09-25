// src/app/(dashboard)/painel/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import styles from './painel.module.css';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; 

export default function DashboardPainel() {
  const [nivelUsuario, setNivelUsuario] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState<string>('Usuário');
  
  useEffect(() => {
    const nivel = localStorage.getItem('nivelUsuario');
    const nome = localStorage.getItem('nomeUsuario'); 
    
    if (nivel) setNivelUsuario(nivel);
    if (nome) setNomeUsuario(nome);
  }, []);

  const niveisComAcessoAoPainel = [
    'COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO', 'SERVO', 'CAMPISTA'
  ];

  const ehAdministracao = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA'].includes(nivelUsuario || '');
  const ehGestaoOperacional = ['COORDENADOR_GERAL', 'COORDENADOR_ACAMPAMENTO', 'SECRETARIA'].includes(nivelUsuario || '');
  const ehUsuarioComum = ['SERVO', 'CAMPISTA'].includes(nivelUsuario || '');

  return (
    <ProtectedRoute niveisPermitidos={niveisComAcessoAoPainel}>
      <div className={styles.painelContainer}>
        
        <div className={styles.welcomeHeader}>
          <h1 className={styles.welcomeTitle}>Olá, {nomeUsuario}!</h1>
          <p className={styles.welcomeSubtitle}>
            Bem-vindo ao sistema de gestão da Paróquia São Miguel Arcanjo.
          </p>
        </div>

        <div className={styles.dashboardGrid}>
          
          {ehAdministracao && (
            <div className={styles.dashCard}>
              <h3 className={styles.cardTitle}>📊 Visão Paroquial</h3>
              <p className={styles.placeholderMsg}>Resumo financeiro de doações, total de campistas inscritos no ano e quadro de comunidades.</p>
            </div>
          )}

          {ehGestaoOperacional && (
            <>
              <div className={styles.dashCard}>
                <h3 className={`${styles.cardTitle} ${styles.alertCritico}`}>
                  ⚠️ Alertas de Estoque
                </h3>
                <p className={styles.placeholderMsg}>Você tem <strong>3 itens</strong> com estoque zerado e <strong>2 itens</strong> próximos do vencimento.</p>
              </div>

              <div className={styles.dashCard}>
                <h3 className={styles.cardTitle}>📦 Últimas Movimentações</h3>
                <p className={styles.placeholderMsg}>Lista rápida das últimas entradas, saídas e perdas do almoxarifado.</p>
              </div>
            </>
          )}

          <div className={styles.dashCard}>
            <h3 className={styles.cardTitle}>⛺ Próximos Acampamentos</h3>
            <p className={styles.placeholderMsg}>Fique por dentro das datas dos próximos retiros, histórico e links de inscrição.</p>
          </div>

          {ehUsuarioComum && (
            <div className={styles.dashCard}>
              <h3 className={styles.cardTitle}>📸 Mural de Lembranças</h3>
              <p className={styles.placeholderMsg}>Confira as últimas fotos postadas e os próximos eventos das comunidades.</p>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}