'use client';

import React, { useState } from 'react';
import styles from './usuarios.module.css';

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    cpfUsuario: '',
    emailUsuario: '',
    senhaUsuario: '',
    contatoUsuario: '',
    nivelUsuario: '', // Por padrão, começa como Campista/Servo
    statusUsuario: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A sua integração com a service entrará aqui!
    console.log('Dados prontos para envio:', formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.pageTitle}>Cadastrar Novo Usuário</h1>
        <p className={styles.pageSubtitle}>Preencha os dados abaixo para registrar um novo acesso ao sistema.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="nomeUsuario">Nome Completo *</label>
            <input
              className={styles.inputField}
              id="nomeUsuario"
              name="nomeUsuario"
              type="text"
              placeholder="Ex: João da Silva"
              value={formData.nomeUsuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.grid2Col}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="cpfUsuario">CPF *</label>
              <input
                className={styles.inputField}
                id="cpfUsuario"
                name="cpfUsuario"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpfUsuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="contatoUsuario">Contato / Celular *</label>
              <input
                className={styles.inputField}
                id="contatoUsuario"
                name="contatoUsuario"
                type="text"
                placeholder="(00) 00000-0000"
                value={formData.contatoUsuario}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="emailUsuario">E-mail *</label>
              <input
                className={styles.inputField}
                id="emailUsuario"
                name="emailUsuario"
                type="email"
                placeholder="usuario@email.com"
                value={formData.emailUsuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="senhaUsuario">Senha de Acesso *</label>
              <input
                className={styles.inputField}
                id="senhaUsuario"
                name="senhaUsuario"
                type="password"
                placeholder="Crie uma senha forte"
                value={formData.senhaUsuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="nivelUsuario">Nível de Acesso *</label>
              <select
                className={styles.inputField}
                id="nivelUsuario"
                name="nivelUsuario"
                value={formData.nivelUsuario}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o nível de acesso</option>
                <option value="COORDENADOR_GERAL">Coordenador Geral</option>
                <option value="PADRE">Padre</option>
                <option value="SECRETARIA">Secretaria</option>
                <option value="COORDENADOR_ACAMPAMENTO">Coordenador dos Acampamentos</option>
                <option value="COORDENADOR_ACAMPAMENTO">Coordenador dos Acampamentos</option>
                <option value="CAMPISTA">Servo</option>
                <option value="CAMPISTA">Servo</option>

              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="statusUsuario">Status *</label>
              <select
                className={styles.inputField}
                id="statusUsuario"
                name="statusUsuario"
                value={formData.statusUsuario}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o status do usuário</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="PENDENTE">Pendente</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel}>Cancelar</button>
            <button type="submit" className={styles.btnSubmit}>Salvar Usuário</button>
          </div>
        </form>
      </div>
    </div>
  );
}