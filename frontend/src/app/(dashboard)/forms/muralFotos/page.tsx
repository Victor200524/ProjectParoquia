'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './muralFotos.module.css';
import { acampamentoService } from '@/services/acampamentoService';
import { MuralFotos } from '@/types/muralFotos';
import { MuralFotosService } from '@/services/muralFotosService'; 

export default function CadastroMuralFotosPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
    const [acampamentos, setAcampamentos] = useState<any[]>([]); 
  
  const [formData, setFormData] = useState<MuralFotos>({
    tituloMuralFotos: '',
    dataEventoMuralFotos: '',
    linkDriveMuralFotos: '',
    acampamento: {
      idAcampamento: 0
    }
  });

  useEffect(() => {
    const carregarAcampamentos = async () => {
      try {
        const data = await acampamentoService.listarAcampamentos();
        setAcampamentos(data);
      } catch (err) {
        console.error("Erro ao buscar acampamentos:", err);
        setErro("Não foi possível carregar a lista de acampamentos.");
      }
    };
    
    carregarAcampamentos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'idAcampamento') {
      setFormData({
        ...formData,
        acampamento: { idAcampamento: Number(value) }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (formData.acampamento.idAcampamento === 0) {
      setErro('Por favor, selecione um acampamento.');
      return;
    }
    setCarregando(true);
    console.log('Dados do formulário (Mural):', formData);

    try {
      await MuralFotosService.criarMuralFotos(formData);
      setSucesso('Mural de fotos cadastrado com sucesso!');
      setFormData({
        tituloMuralFotos: '',
        dataEventoMuralFotos: '',
        linkDriveMuralFotos: '',
        acampamento: { idAcampamento: 0 }
      });

    } catch (error: any) {
      setErro(error.message || 'Erro ao cadastrar o mural de fotos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Novo Mural de Fotos</h1>
        <p className={styles.pageSubtitle}>Adicione álbuns e links do Google Drive dos acampamentos.</p>
      </div>

      <div className={styles.formCard}>
        <h2 className={styles.sectionTitle}>Detalhes do Mural</h2>

        {erro && <div className={styles.errorMsg}>{erro}</div>}
        {sucesso && <div className={styles.successMsg}>{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.grid2Col}>
            
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Título do Mural</label>
              <input 
                type="text" 
                name="tituloMuralFotos"
                value={formData.tituloMuralFotos}
                onChange={handleChange}
                className={styles.inputField} 
                required 
                placeholder="Ex: Fotos do 3º FAC"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Data do Evento</label>
              <input 
                type="date" 
                name="dataEventoMuralFotos"
                value={formData.dataEventoMuralFotos}
                onChange={handleChange}
                className={styles.inputField} 
                required 
              />
            </div>

            <div className={styles.fieldGroupFull}>
              <label className={styles.fieldLabel}>Acampamento Vinculado</label>
              <select 
                name="idAcampamento"
                value={formData.acampamento.idAcampamento}
                onChange={handleChange}
                className={styles.selectField}
                required
              >
                <option value={0} disabled>Selecione um acampamento...</option>
                
                {acampamentos.map(acamp => (
                  <option key={acamp.idAcampamento} value={acamp.idAcampamento}>
                    {acamp.nomeAcampamento}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroupFull}>
              <label className={styles.fieldLabel}>Link do Google Drive</label>
              <textarea 
                name="linkDriveMuralFotos"
                value={formData.linkDriveMuralFotos}
                onChange={handleChange}
                className={styles.textAreaField} 
                required 
                placeholder="Cole aqui o link de compartilhamento da pasta do Google Drive..."
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
              disabled={carregando || !formData.tituloMuralFotos.trim() || !formData.linkDriveMuralFotos.trim()}
            >
              {carregando ? 'Salvando...' : 'Salvar Mural'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}