"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './movimentoEstoque.module.css';

import { acampamentoService } from '@/services/acampamentoService';
import { itemEstoqueService } from '@/services/itemEstoqueService';
import { movimentoEstoqueService } from '@/services/movimentoEstoqueService';

import type { Acampamento } from '@/types/acampamento';
import type { ItemEstoque } from '@/types/itemEstoque';
import type { CriarMovimentacaoEstoque } from '@/types/movimentoEstoque';

function obterDataHoraLocal() {
  const agora = new Date();
  const doisDigitos = (numero: number) => String(numero).padStart(2, '0');
  return `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}` +
    `T${doisDigitos(agora.getHours())}:${doisDigitos(agora.getMinutes())}:${doisDigitos(agora.getSeconds())}`;
}

export default function NovaMovimentacao() {
  const [listaAcampamentos, setListaAcampamentos] = useState<Acampamento[]>([]);
  const [listaItens, setListaItens] = useState<ItemEstoque[]>([]);
  const [dataRegistro, setDataRegistro] = useState<string>('');
  const [formData, setFormData] = useState({
    tipoMovimentacaoEstoque: '',
    qtdeMovimentacaoEstoque: 0,
    obsMovimentacaoEstoque: '',
    itemEstoque: { idItemEstoque: 0 },
    acampamento: { idAcampamento: 0 },
    acampamentoDestino: { idAcampamento: 0 },
  });

  useEffect(() => {

    const atualizarData = () => setDataRegistro(obterDataHoraLocal());
    const inicio = window.setTimeout(atualizarData, 0);
    const intervalo = window.setInterval(atualizarData, 1000);

    const carregarDados = async () => {
      try {
        const [acampamentos, itens] = await Promise.all([
          acampamentoService.listarAcampamentos(),
          itemEstoqueService.listarItemEstoque() 
        ]);
        
        if (acampamentos) setListaAcampamentos(acampamentos);
        if (itens) setListaItens(itens);
      } catch (error) {
        console.error("Erro ao carregar dados auxiliares:", error);
      }
    };
    carregarDados();
    return () => {
      window.clearTimeout(inicio);
      window.clearInterval(intervalo);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'idItemEstoque') {
      setFormData(prev => ({ ...prev, itemEstoque: { idItemEstoque: Number(value) } }));
      return;
    }
    if (name === 'idAcampamento') {
      setFormData(prev => ({ ...prev, acampamento: { idAcampamento: Number(value) } }));
      return;
    }
    if (name === 'idAcampamentoDestino') {
      setFormData(prev => ({ ...prev, acampamentoDestino: { idAcampamento: Number(value) } }));
      return;
    }

    setFormData(prev => {
      const newData = { 
        ...prev, 
        [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value 
      };

      if (name === 'tipoMovimentacaoEstoque' && value !== 'TRANSFERENCIA') {
        newData.acampamentoDestino = { idAcampamento: 0 };
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataHoraLocal = obterDataHoraLocal();
    setDataRegistro(dataHoraLocal);
    const userIdLogado = localStorage.getItem('idUsuario');
    const payloadEnvio: CriarMovimentacaoEstoque = {
      ...formData,
      dataMovimentacaoEstoque: dataHoraLocal,
      usuario: { idUsuario: userIdLogado ? Number(userIdLogado) : 1 },
      acampamento: formData.acampamento.idAcampamento === 0 ? null : formData.acampamento,
      acampamentoDestino: formData.acampamentoDestino.idAcampamento === 0 ? null : formData.acampamentoDestino,
    };

    console.log("Dados para o Back-end:", payloadEnvio);

    try {
      await movimentoEstoqueService.criarMovimentoEstoque(payloadEnvio);
      await new Promise(r => setTimeout(r, 600)); 
      alert("Movimentação registrada com sucesso!");
      
      setFormData({
        tipoMovimentacaoEstoque: '',
        qtdeMovimentacaoEstoque: 0,
        obsMovimentacaoEstoque: '',
        itemEstoque: { idItemEstoque: 0 },
        acampamento: { idAcampamento: 0 },
        acampamentoDestino: { idAcampamento: 0 }
      });
    } catch(error: unknown) {
      alert("Erro ao registrar movimentação: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Movimentar Estoque</h1>
        <p className={styles.pageSubtitle}>Registre entradas, saídas, perdas e transferências do almoxarifado.</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        
        <h3 className={styles.sectionTitle}>Detalhes da Movimentação</h3>
        
        <div className={styles.grid2Col}>
          
          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="idItemEstoque">Item do Estoque *</label>
            <select
              className={styles.selectField}
              id="idItemEstoque"
              name="idItemEstoque"
              value={formData.itemEstoque.idItemEstoque}
              onChange={handleChange}
              required
            >
              <option value={0} disabled>Selecione qual item será movimentado...</option>
              {listaItens.map((item) => (
                <option key={item.idItemEstoque} value={item.idItemEstoque}>
                  {item.nomeItemEstoque} (Atual: {item.qtdeItemEstoque})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="tipoMovimentacaoEstoque">Tipo de Movimentação *</label>
            <select
              className={styles.selectField}
              id="tipoMovimentacaoEstoque"
              name="tipoMovimentacaoEstoque"
              value={formData.tipoMovimentacaoEstoque}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo...</option>
              <option value="ENTRADA">Entrada (+)</option>
              <option value="SAIDA">Saída (-)</option>
              <option value="TRANSFERENCIA">Transferência (⇆)</option>
              <option value="PERDA_VALIDADE">Perda / Validade (-)</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="qtdeMovimentacaoEstoque">Quantidade *</label>
            <input
              className={styles.inputField}
              id="qtdeMovimentacaoEstoque"
              name="qtdeMovimentacaoEstoque"
              type="number"
              placeholder="Ex: 15"
              value={formData.qtdeMovimentacaoEstoque}
              onChange={handleChange}
              min="1"
              required
              onFocus={(e) => e.target.select()} 
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="dataMovimentacaoEstoque">Data da Movimentação</label>
            <input
              className={styles.inputField}
              id="dataMovimentacaoEstoque"
              name="dataMovimentacaoEstoque"
              type="datetime-local"
              value={dataRegistro}
              step={1}
              disabled 
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="idAcampamento">Acampamento (Origem/Local)</label>
            <select
              className={styles.selectField}
              id="idAcampamento"
              name="idAcampamento"
              value={formData.acampamento.idAcampamento}
              onChange={handleChange}
            >
              <option value={0}>Nenhum / Geral</option>
              {listaAcampamentos.map((acamp) => (
                <option key={acamp.idAcampamento} value={acamp.idAcampamento}>
                  {acamp.nomeAcampamento}
                </option>
              ))}
            </select>
          </div>

          {formData.tipoMovimentacaoEstoque === 'TRANSFERENCIA' && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="idAcampamentoDestino">Acampamento Destino *</label>
              <select
                className={styles.selectField}
                id="idAcampamentoDestino"
                name="idAcampamentoDestino"
                value={formData.acampamentoDestino.idAcampamento}
                onChange={handleChange}
                required
              >
                <option value={0} disabled>Selecione o destino...</option>
                {listaAcampamentos.map((acamp) => (
                  <option key={acamp.idAcampamento} value={acamp.idAcampamento}>
                    {acamp.nomeAcampamento}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.fieldGroupFull}>
            <label className={styles.fieldLabel} htmlFor="obsMovimentacaoEstoque">Observações</label>
            <textarea
              className={styles.textAreaField}
              id="obsMovimentacaoEstoque"
              name="obsMovimentacaoEstoque"
              placeholder="Ex: Arroz estragado por umidade, ou doação recebida da Pastoral X..."
              value={formData.obsMovimentacaoEstoque}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/painel" className={styles.btnCancel}>
            Cancelar
          </Link>
          <button 
            type="submit" 
            className={styles.btnSubmit} 
            disabled={formData.itemEstoque.idItemEstoque === 0 || formData.tipoMovimentacaoEstoque === ''}
          >
            Registrar Movimento
          </button>
        </div>

      </form>
    </div>
  );
}
