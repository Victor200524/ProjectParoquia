'use client';

import React, { useState } from 'react';
import styles from './usuarios.module.css';
import { usuarioService } from '@/services/usuarioService'; // Ajuste o caminho conforme a sua estrutura

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    cpfUsuario: '',
    emailUsuario: '',
    senhaUsuario: '',
    contatoUsuario: '',
    nivelUsuario: '', 
    statusUsuario: ''
  });

  // Estados para dar feedback visual ao usuário
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem(null);

    try {
      // Chama o serviço passando o objeto preenchido
      const resposta = await usuarioService.cadastrarUsuario(formData as any);
      
      setMensagem({ tipo: 'sucesso', texto: resposta });
      
      // Limpa o formulário após o sucesso
      setFormData({
        nomeUsuario: '',
        cpfUsuario: '',
        emailUsuario: '',
        senhaUsuario: '',
        contatoUsuario: '',
        nivelUsuario: '',
        statusUsuario: ''
      });
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.pageTitle}>Cadastrar Novo Usuário</h1>
        <p className={styles.pageSubtitle}>Preencha os dados abaixo para registrar um novo acesso ao sistema.</p>

        {/* Exibe as mensagens de erro ou sucesso acima do formulário */}
        {mensagem && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: mensagem.tipo === 'sucesso' ? '#d4edda' : '#f8d7da',
            color: mensagem.tipo === 'sucesso' ? '#155724' : '#721c24',
            border: `1px solid ${mensagem.tipo === 'sucesso' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {mensagem.texto}
          </div>
        )}

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
                required
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
                <option value="SERVO">Servo</option>
                <option value="CAMPISTA">Campista</option>
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
            <button type="submit" className={styles.btnSubmit} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}