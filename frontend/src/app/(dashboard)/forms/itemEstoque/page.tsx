"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './itemEstoque.module.css'; 
import { itemEstoqueService } from '@/services/itemEstoqueService';
import { ItemEstoque } from '@/types/itemEstoque';

export default function NovoItemEstoque() {
  const [formData, setFormData] = useState<ItemEstoque>({
    nomeItemEstoque: '',
    qtdeItemEstoque: 0,
    categoriaItemEstoque: '',
    tipoItemEstoque: '',
    dataValidadeItemEstoque: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const newData = { 
        ...prev, 
        [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value 
      };

      if (name === 'tipoItemEstoque' && value !== 'PERECIVEL') {
        newData.dataValidadeItemEstoque = '';
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Dados do Item de Estoque prontos para envio:", formData);
    
    try {
      await itemEstoqueService.criarItemEstoque(formData);
      alert("Item registrado no estoque com sucesso!");
      
      // Limpar o formulário após o envio bem-sucedido
      setFormData({
        nomeItemEstoque: '',
        qtdeItemEstoque: 0,
        categoriaItemEstoque: '',
        tipoItemEstoque: '',
        dataValidadeItemEstoque: ''
      });
    } catch(error: any) {
      alert("Erro ao salvar item no estoque: " + error.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Novo Item de Estoque</h1>
        <p className={styles.pageSubtitle}>Cadastre novos materiais e alimentos no almoxarifado da paróquia.</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        
        <h3 className={styles.sectionTitle}>Identificação do Item</h3>
        
        <div className={styles.grid2Col}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="nomeItemEstoque">Nome do Item *</label>
            <input
              className={styles.inputField}
              id="nomeItemEstoque"
              name="nomeItemEstoque"
              type="text"
              placeholder="Ex: Arroz 5kg, Papel Sulfite A4, Desinfetante..."
              value={formData.nomeItemEstoque}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="categoriaItemEstoque">Categoria *</label>
            <select
              className={styles.inputField}
              id="categoriaItemEstoque"
              name="categoriaItemEstoque"
              value={formData.categoriaItemEstoque}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a categoria...</option>
              <option value="MANUTENCAO">Manutenção</option>
              <option value="COZINHA">Cozinha</option>
              <option value="INTERCESSAO">Intercessão</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="BAR">Bar</option>
              <option value="ORDEM">Ordem</option>
              <option value="RECREACAO">Recreação</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="tipoItemEstoque">Tipo do Item *</label>
            <select
              className={styles.inputField}
              id="tipoItemEstoque"
              name="tipoItemEstoque"
              value={formData.tipoItemEstoque}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo...</option>
              <option value="PERECIVEL">Perecível</option>
              <option value="NAO_PERECIVEL">Não Perecível</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="qtdeItemEstoque">Quantidade Inicial</label>
            <input
              className={styles.inputField}
              id="qtdeItemEstoque"
              name="qtdeItemEstoque"
              type="number"
              value={formData.qtdeItemEstoque}
              disabled
              title="A quantidade só pode ser alterada via movimentação"
              style={{ backgroundColor: 'var(--bg-body)', cursor: 'not-allowed', opacity: 0.7 }}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.2rem', lineHeight: '1.2' }}>
              A quantidade deste item inicia zerada. Entradas e saídas devem ser registradas através do módulo de <strong>Movimentação de Estoque</strong>.
            </small>
          </div>

          {formData.tipoItemEstoque === 'PERECIVEL' && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="dataValidadeItemEstoque">Data de Validade *</label>
              <input
                className={styles.inputField}
                id="dataValidadeItemEstoque"
                name="dataValidadeItemEstoque"
                type="date"
                value={formData.dataValidadeItemEstoque}
                onChange={handleChange}
                required 
              />
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <Link href="/painel" className={styles.btnCancel}>
            Cancelar
          </Link>
          <button type="submit" className={styles.btnSubmit} disabled={!formData.nomeItemEstoque.trim() || formData.categoriaItemEstoque === '' || formData.tipoItemEstoque === ''}>
            Registrar Item
          </button>
        </div>

      </form>
    </div>
  );
}