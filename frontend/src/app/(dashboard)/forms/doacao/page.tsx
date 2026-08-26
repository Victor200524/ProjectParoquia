"use client";

import React, { useState, useEffect } from 'react';
import styles from './doacao.module.css';
import { acampamentoService } from '@/services/acampamentoService';
import { doacaoService } from '@/services/doacaoService'; 
import { Doacao } from '@/types/doacao';
import { Acampamento } from '@/types/acampamento';

export default function NovaDoacao() {
  const [formData, setFormData] = useState<Doacao>({
    nomeDoacao: '',
    descricaoDoacao: '',
    nomeDoador: '',
    dataDoacao: '',
    dataValidadeDoacao: '',
    tipoDoacao: '',
    qtdeDoacao: 0,
    acampamento: { idAcampamento: '' } 
  });

  // Estado para armazenar os acampamentos que vêm do banco
  const [listaAcampamentos, setListaAcampamentos] = useState<Acampamento[]>([]);

  // Busca os acampamentos ao carregar a página
  useEffect(() => {
    const carregarAcampamentos = async () => {
      try {
        const dados = await acampamentoService.listarAcampamentos();
        if (dados && dados.length > 0) {
          setListaAcampamentos(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar acampamentos:", error);
      }
    };

    carregarAcampamentos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'acampamento') {
      setFormData(prev => ({
        ...prev,
        acampamento: { idAcampamento: value === '' ? '' : Number(value) }
      }));
      return;
    }

    setFormData(prev => {
      const newData = { 
        ...prev, 
        [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value 
      };

      if (name === 'tipoDoacao' && value !== 'PERECIVEL') {
        newData.dataValidadeDoacao = '';
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Dados prontos para envio:", formData);
    try{
      await doacaoService.criarDoacao(formData);
      alert("Doação registrada com sucesso!");
      // Limpar o formulário após o envio bem-sucedido
      setFormData({
        nomeDoacao: '',
        descricaoDoacao: '',
        nomeDoador: '',
        dataDoacao: '',
        dataValidadeDoacao: '',
        tipoDoacao: '',
        qtdeDoacao: 0,
        acampamento: { idAcampamento: '' } 
      });
    }catch(error: any){
      alert("Erro ao salvar doação: " + error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Nova Doação</h1>
        <p className={styles.pageSubtitle}>Registre as doações recebidas para os acampamentos.</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        
        <h3 className={styles.sectionTitle}>Informações do Item</h3>
        
        <div className={styles.grid2Col}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="nomeDoacao">Item / Nome da Doação *</label>
            <input
              className={styles.inputField}
              id="nomeDoacao"
              name="nomeDoacao"
              type="text"
              placeholder="Ex: Fardo de Arroz, Copos Descartáveis..."
              value={formData.nomeDoacao}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="tipoDoacao">Tipo de Doação *</label>
            <select
              className={styles.inputField}
              id="tipoDoacao"
              name="tipoDoacao"
              value={formData.tipoDoacao}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo...</option>
              <option value="PERECIVEL">Perecivel</option>
              <option value="NAO_PERECIVEL">Não Perecivel</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="qtdeDoacao">Quantidade *</label>
            <input
              className={styles.inputField}
              id="qtdeDoacao"
              name="qtdeDoacao"
              type="number"
              placeholder="Ex: 10"
              value={formData.qtdeDoacao}
              onChange={handleChange}
              min="1"
              required
              onFocus={(e) => e.target.select()} 
            />
          </div>

          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="descricaoDoacao">Descrição Detalhada</label>
            <textarea
              className={styles.inputField}
              id="descricaoDoacao"
              name="descricaoDoacao"
              placeholder="Ex: Fardos de 5kg da marca Tio João..."
              value={formData.descricaoDoacao}
              onChange={handleChange}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* === SEÇÃO: DATAS E ORIGEM === */}
        <h3 className={styles.sectionTitle}>Datas e Origem</h3>
        
        <div className={styles.grid2Col}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="nomeDoador">Nome do Doador</label>
            <input
              className={styles.inputField}
              id="nomeDoador"
              name="nomeDoador"
              type="text"
              placeholder="Ex: João da Silva (Deixe em branco se anônimo)"
              value={formData.nomeDoador}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="dataDoacao">Data de Recebimento *</label>
            <input
              className={styles.inputField}
              id="dataDoacao"
              name="dataDoacao"
              type="date"
              value={formData.dataDoacao}
              onChange={handleChange}
              required
            />
          </div>

          {formData.tipoDoacao === 'PERECIVEL' && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="dataValidadeDoacao">Data de Validade *</label>
              <input
                className={styles.inputField}
                id="dataValidadeDoacao"
                name="dataValidadeDoacao"
                type="date"
                value={formData.dataValidadeDoacao}
                onChange={handleChange}
                required 
              />
            </div>
          )}
        </div>

        {/* === SEÇÃO: VÍNCULO === */}
        <h3 className={styles.sectionTitle}>Destino</h3>

        <div className={styles.grid2Col}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="acampamento">Vincular a qual Acampamento? *</label>
            <select
              className={styles.inputField}
              id="acampamento"
              name="acampamento"
              value={formData.acampamento.idAcampamento}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o acampamento...</option>
              {listaAcampamentos.map((acamp) => (
                <option key={acamp.idAcampamento} value={acamp.idAcampamento}>
                  {acamp.nomeAcampamento}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* === BOTÕES === */}
        <div className={styles.formActions}>
          <button type="button" className={styles.btnCancel}>Cancelar</button>
          <button type="submit" className={styles.btnSubmit}>Registrar Doação</button>
        </div>

      </form>
    </div>
  );
}