"use client";

import React, { useState } from 'react';
import styles from './acampamento.module.css';
import {acampamentoService} from '@/services/acampamentoService';
import {Acampamento} from '@/types/acampamento';

export default function NovoAcampamento() {
  const [formData, setFormData] = useState<Acampamento>({
    nomeAcampamento: '',
    localAcampamento: '',
    dataInicioAcampamento: '',
    dataFimAcampamento: '',
    idadeMinAcampamento: 0,
    idadeMaxAcampamento: 0,
    vagasAcampamento: 0,
    taxaInscricaoAcampamento: 0,
    informacoesAcampamento: '',
    fotoAcampamento: '',
    tokenMercadoPagoAcampamento: '',
    usuario: { idUsuario: Number(localStorage.getItem('idUsuario'))}, // Pega o id do usuário logado do localStorage
    comunidade: { idComunidade: 1 }
  });

  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Pegamos o 'type' para saber se o HTML está mandando um número disfarçado de texto
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      // Se for input numérico, converte para Number. Senão, deixa o texto normal.
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ele impede recarregar a pagina inteira ao clicar em gravar
    console.log("Dados prontos para o Back-end:", formData);
    try{
      await acampamentoService.criarAcampamento(formData, fotoArquivo);
      alert("Acampamento salvo com sucesso!");
      // Aqui você pode redirecionar ou limpar o formulário, se necessário
      setFormData({ // Limpa o formulário após salvar0
        nomeAcampamento: '',
        localAcampamento: '',
        dataInicioAcampamento: '',
        dataFimAcampamento: '',
        idadeMinAcampamento: 0,
        idadeMaxAcampamento: 0,
        vagasAcampamento: 0,
        taxaInscricaoAcampamento: 0,
        informacoesAcampamento: '',
        fotoAcampamento: '',
        tokenMercadoPagoAcampamento: '',
        usuario: { idUsuario: 2 }, 
        comunidade: { idComunidade: 1 }
      });
      setFotoArquivo(null); // Limpa o arquivo de foto
    }catch(error: any){
      alert("Erro ao salvar o acampamento: " + error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Novo Acampamento</h1>
        <p className={styles.pageSubtitle}>Preencha as informações estruturais do evento.</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        
        {/* === SEÇÃO: DADOS GERAIS === */}
        <h3 className={styles.sectionTitle}>Dados Gerais</h3>
        <div className={styles.grid2Col}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="nomeAcampamento">Nome do Acampamento *</label>
            <input
              className={styles.inputField}
              id="nomeAcampamento"
              name="nomeAcampamento"
              type="text"
              placeholder="Ex: 1º Acampamento de Jovens"
              value={formData.nomeAcampamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="comunidade">Comunidade Responsável *</label>
            <select 
              className={styles.inputField} 
              id="comunidade" 
              name="comunidade"
              value={formData.comunidade.idComunidade}
              onChange={(e) => setFormData(prev => ({ ...prev, comunidade: { idComunidade: Number(e.target.value) } }))}
              required
            >
              <option value="">Selecione a comunidade...</option>
              <option value="1">Capela São Miguel Arcanjo</option>
              {/* No futuro, as comunidades virão do Back-end */}
            </select>
          </div>

          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="localAcampamento">Local do Evento (Sítio/Chácara) *</label>
            <input
              className={styles.inputField}
              id="localAcampamento"
              name="localAcampamento"
              type="text"
              placeholder="Ex: Chácara São José - Endereço completo"
              value={formData.localAcampamento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* === SEÇÃO: DATAS === */}
        <h3 className={styles.sectionTitle}>Período do Evento</h3>
        <div className={styles.grid2Col}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="dataInicioAcampamento">Data de Início *</label>
            <input
              className={styles.inputField}
              id="dataInicioAcampamento"
              name="dataInicioAcampamento"
              type="date"
              value={formData.dataInicioAcampamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="dataFimAcampamento">Data de Encerramento *</label>
            <input
              className={styles.inputField}
              id="dataFimAcampamento"
              name="dataFimAcampamento"
              type="date"
              value={formData.dataFimAcampamento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* === SEÇÃO: REGRAS E CAPACIDADE === */}
        <h3 className={styles.sectionTitle}>Regras e Capacidade</h3>
        <div className={styles.grid2Col}>
          
          {/* Idades ocupam uma coluna dividida em duas menores no CSS ou em flex */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.fieldLabel} htmlFor="idadeMinAcampamento">Idade Mín. *</label>
              <input
                className={styles.inputField}
                id="idadeMinAcampamento"
                name="idadeMinAcampamento"
                type="number"
                placeholder="Ex: 18"
                value={formData.idadeMinAcampamento}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.fieldLabel} htmlFor="idadeMaxAcampamento">Idade Máx.</label>
              <input
                className={styles.inputField}
                id="idadeMaxAcampamento"
                name="idadeMaxAcampamento"
                type="number"
                placeholder="Ex: 30"
                value={formData.idadeMaxAcampamento}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.fieldLabel} htmlFor="vagasAcampamento">Total de Vagas *</label>
              <input
                className={styles.inputField}
                id="vagasAcampamento"
                name="vagasAcampamento"
                type="number"
                placeholder="Ex: 120"
                value={formData.vagasAcampamento}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.fieldLabel} htmlFor="taxaInscricaoAcampamento">Taxa (R$) *</label>
              <input
                className={styles.inputField}
                id="taxaInscricaoAcampamento"
                name="taxaInscricaoAcampamento"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.taxaInscricaoAcampamento}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* === SEÇÃO: MÍDIA E DETALHES === */}
        <h3 className={styles.sectionTitle}>Mídia e Detalhes Adicionais</h3>
        <div className={styles.grid2Col}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="fotoAcampamento">Arte / Foto do Acampamento *</label>
            <input
              className={styles.inputField}
              id="fotoAcampamento"
              name="fotoAcampamento"
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFotoArquivo(e.target.files[0]);
                } else {
                  setFotoArquivo(null);
                }
              }}
            />
          </div>

          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="informacoesAcampamento">Informações Adicionais</label>
            <textarea
              className={`${styles.inputField} ${styles.textAreaField}`}
              id="informacoesAcampamento"
              name="informacoesAcampamento"
              placeholder="O que os campistas precisam saber? (O que levar, avisos importantes, etc.)"
              value={formData.informacoesAcampamento}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* === BOTÕES === */}
        <div className={styles.formActions}>
          <button type="button" className={styles.btnCancel}>Cancelar</button>
          <button type="submit" className={styles.btnSubmit}>Salvar Acampamento</button>
        </div>

      </form>
    </div>
  );
}