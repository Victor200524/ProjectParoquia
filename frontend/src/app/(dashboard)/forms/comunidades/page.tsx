'use client';

import React, { useState } from 'react';
import styles from './comunidades.module.css';
import { comunidadeService } from '@/services/comunidadeService'; // Ajuste o caminho se necessário

interface HorarioMissa {
  semanaMissa: string;
  horarioMissa: string;
}

export default function CadastroComunidade() {
  const [formData, setFormData] = useState({
    nomeComunidade: '',
    enderecoComunidade: '',
    contatoComunidade: '',
    fotoComunidade: '',
    horariosMissa: [] as HorarioMissa[],
  });

  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  
  // Estados para feedback visual
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArquivoFoto(e.target.files[0]);
    }
  };

  // === LÓGICA DOS HORÁRIOS DE MISSA (1:N) ===
  const adicionarHorario = () => {
    setFormData((prev) => ({
      ...prev,
      horariosMissa: [...prev.horariosMissa, { semanaMissa: '', horarioMissa: '' }],
    }));
  };

  const removerHorario = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      horariosMissa: prev.horariosMissa.filter((_, i) => i !== index),
    }));
  };

  const handleHorarioChange = (index: number, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const novosHorarios = [...prev.horariosMissa];
      novosHorarios[index] = { ...novosHorarios[index], [name]: value };
      return { ...prev, horariosMissa: novosHorarios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem(null);

    try {
      // Passando o formData E o arquivoFoto
      const resposta = await comunidadeService.cadastrarComunidade(formData as any, arquivoFoto);
      
      setMensagem({ tipo: 'sucesso', texto: resposta });
      
      setFormData({
        nomeComunidade: '',
        enderecoComunidade: '',
        contatoComunidade: '',
        fotoComunidade: '',
        horariosMissa: [],
      });
      setArquivoFoto(null);

    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.pageTitle}>Cadastrar Nova Comunidade</h1>
        <p className={styles.pageSubtitle}>Preencha os dados da comunidade e defina os horários das missas.</p>

        {/* Caixa de Mensagens de Sucesso ou Erro */}
        {mensagem && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            backgroundColor: mensagem.tipo === 'sucesso' ? '#d4edda' : '#f8d7da',
            color: mensagem.tipo === 'sucesso' ? '#155724' : '#721c24',
            border: `1px solid ${mensagem.tipo === 'sucesso' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* DADOS DA COMUNIDADE */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Gerais</h2>
            
            <div className={styles.fieldGroupFull}>
              <label className={styles.fieldLabel} htmlFor="nomeComunidade">Nome da Comunidade *</label>
              <input
                className={styles.inputField}
                id="nomeComunidade"
                name="nomeComunidade"
                type="text"
                placeholder="Ex: Comunidade São Pedro"
                value={formData.nomeComunidade}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroupFull}>
              <label className={styles.fieldLabel} htmlFor="enderecoComunidade">Endereço Completo *</label>
              <input
                className={styles.inputField}
                id="enderecoComunidade"
                name="enderecoComunidade"
                type="text"
                placeholder="Ex: Rua das Flores, 123 - Bairro Centro"
                value={formData.enderecoComunidade}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.grid2Col}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="contatoComunidade">Contato (Telefone/WhatsApp)</label>
                <input
                  className={styles.inputField}
                  id="contatoComunidade"
                  name="contatoComunidade"
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={formData.contatoComunidade}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="fotoComunidade">Foto da Comunidade</label>
                <input
                  className={styles.inputFieldFile}
                  id="fotoComunidade"
                  name="fotoComunidade"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* HORÁRIOS DE MISSA (1:N) */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Horários de Missa</h2>
              <button type="button" className={styles.btnAdd} onClick={adicionarHorario}>
                + Adicionar Horário
              </button>
            </div>

            {formData.horariosMissa.length === 0 ? (
              <p className={styles.emptyMessage}>Nenhum horário de missa cadastrado ainda.</p>
            ) : (
              <div className={styles.horariosList}>
                {formData.horariosMissa.map((horario, index) => (
                  <div key={index} className={styles.horarioRow}>
                    <div className={styles.horarioField}>
                      <label className={styles.fieldLabel}>Dia da Semana *</label>
                      <select
                        className={styles.inputField}
                        name="semanaMissa"
                        value={horario.semanaMissa}
                        onChange={(e) => handleHorarioChange(index, e)}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="Domingo">Domingo</option>
                        <option value="Segunda-feira">Segunda-feira</option>
                        <option value="Terça-feira">Terça-feira</option>
                        <option value="Quarta-feira">Quarta-feira</option>
                        <option value="Quinta-feira">Quinta-feira</option>
                        <option value="Sexta-feira">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                      </select>
                    </div>

                    <div className={styles.horarioField}>
                      <label className={styles.fieldLabel}>Horário *</label>
                      <input
                        className={styles.inputField}
                        type="time"
                        name="horarioMissa"
                        value={horario.horarioMissa}
                        onChange={(e) => handleHorarioChange(index, e)}
                        required
                      />
                    </div>

                    <div className={styles.horarioAction}>
                      <button 
                        type="button" 
                        className={styles.btnRemove} 
                        onClick={() => removerHorario(index)}
                        title="Remover Horário"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel}>Cancelar</button>
            <button type="submit" className={styles.btnSubmit} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Comunidade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}