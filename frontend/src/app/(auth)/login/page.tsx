// page.tsx
"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import logoParoquia from '@/images/logo_brasao_paroquia_sao_miguel.png';
import styles from './login.module.css';
import { login } from '@/services/authService';

export default function Login() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [cpf, setCpf] = useState(''); 
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ cpf, senha }); 
      router.push('/painel'); 
    } catch (err: any) {
      setError('CPF ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  const formatarCPF = (value: string) => {
  return value
    .replace(/\D/g, '') // remove tudo que não é número
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
  };

  return (
    <div className={styles.page}>

      {/* ================= PAINEL ESQUERDO ================= */}
      <aside className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.heroTop}>
          <div className={styles.heroLogoBadge}>
            <Image
              src={logoParoquia}
              alt="Brasão da Paróquia São Miguel Arcanjo"
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className={styles.heroBadgeText}>Paróquia São Miguel Arcanjo</span>
        </div>

        <div className={styles.heroBody}>
          <h1 className={styles.heroTitle}>
            Gestão dos<br />
            <span>Acampamentos</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Um só lugar para organizar inscrições, equipes e toda a jornada
            dos acampamentos da paróquia.
          </p>

          <ul className={styles.heroList}>
            <li>Controle de inscrições em tempo real</li>
            <li>Gestão de equipes e voluntários</li>
            <li>Relatórios simples e rápidos</li>
          </ul>
        </div>

        <button className={styles.btnAcampamentos} type="button">
          Ver Acampamentos
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>

      {/* ================= PAINEL DIREITO ================= */}
      <main className={styles.formPanel}>
        <div className={styles.formCard}>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
            <p className={styles.formSubtitle}>Entre com sua conta para continuar</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="cpf">CPF</label>
              <input
                className={styles.inputField}
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                autoComplete="off"
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="senha">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.inputField}
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Insira sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3l18 18" strokeLinecap="round" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" strokeLinecap="round" />
                      <path d="M9.5 5.2A10.4 10.4 0 0 1 12 5c5 0 9 4.5 9.9 7-.4 1-.9 1.9-1.6 2.7M6.6 6.6C4.4 8 2.9 10 2.1 12c1 3 5 7 9.9 7 1.4 0 2.7-.3 3.9-.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2.1 12S6 5 12 5s9.9 7 9.9 7-3.9 7-9.9 7-9.9-7-9.9-7Z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.rowBetween}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                Manter conectado
              </label>
              <a className={styles.forgotPassword} href="#">Esqueci a senha</a>
            </div>

            {error && <p className={styles.errorText} role="alert">{error}</p>}

            <button className={styles.btnSubmit} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} aria-hidden="true" /> : 'Entrar'}
            </button>
          </form>

          <p className={styles.footerNote}>
            (18) 99619-3996 · paroquiasaomiguelarcanjomm2026@gmail.com
          </p>
          <p className={styles.footerCopy}>
            © 2026 Paróquia São Miguel Arcanjo. Todos os direitos reservados.
          </p>
        </div>
      </main>

    </div>
  );
}