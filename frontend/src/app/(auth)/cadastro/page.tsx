'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './cadastro.module.css';
import { formatarCPF, formatarTelefone } from '@/utils/formatters';
import { usuarioService } from '@/services/usuarioService';
import RecorteFoto from '@/components/foto/RecorteFoto';

export default function CadastroPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    cpfUsuario: '',
    emailUsuario: '',
    contatoUsuario: '',
    senhaUsuario: '',
    nivelUsuario: '',
    enderecoUsuario: '',
    dataNascimentoUsuario: ''
  });

  // Foto: primeiro a pessoa escolhe o arquivo (imagemParaRecortar), ajusta o recorte
  // e só então a foto final (fotoUsuario, em base64) fica guardada para enviar
  const [imagemParaRecortar, setImagemParaRecortar] = useState<string | null>(null);
  const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);

  const handleEscolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo)
      return;
    // lê o arquivo como "data:image/...;base64,..." para mostrar na tela de recorte
    const leitor = new FileReader();
    leitor.onload = () => setImagemParaRecortar(leitor.result as string);
    leitor.readAsDataURL(arquivo);
    e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // formata o CPF e o telefone enquanto a pessoa digita
    let valor = value;
    if(name === 'cpfUsuario')
        valor = formatarCPF(value);
    if(name === 'contatoUsuario')
        valor = formatarTelefone(value);

    setFormData(prev => ({ ...prev, [name]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await usuarioService.cadastrarUsuario({ ...formData, fotoUsuario } as any);
      alert('Cadastro realizado com sucesso! Faça seu login.');
      router.push('/login');
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crie sua Conta</h1>
          <p className={styles.subtitle}>Junte-se à nossa comunidade paroquial.</p>
        </div>

        {erro && <div className={styles.errorMsg}>{erro}</div>}

        {/* Janela de recorte: aparece depois de escolher o arquivo da foto */}
        {imagemParaRecortar && (
          <RecorteFoto
            imagem={imagemParaRecortar}
            onConfirmar={(foto) => { setFotoUsuario(foto); setImagemParaRecortar(null); }}
            onCancelar={() => setImagemParaRecortar(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          {/* Foto (opcional): aparece no quadrante dos acampamentos */}
          <div className={styles.fotoArea}>
            {fotoUsuario ? (
              <img className={styles.fotoPreview} src={`data:image/jpeg;base64,${fotoUsuario}`} alt="Sua foto" />
            ) : (
              <div className={styles.fotoVazia}>Sem foto</div>
            )}
            <label className={styles.btnFoto}>
              {fotoUsuario ? 'Trocar foto' : 'Escolher foto'}
              <input type="file" accept="image/*" onChange={handleEscolherFoto} hidden />
            </label>
          </div>

          <div className={styles.formGrid}>
            
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Nome Completo</label>
              <input 
                type="text" 
                name="nomeUsuario"
                value={formData.nomeUsuario}
                onChange={handleChange}
                className={styles.input} 
                required 
                placeholder="Ex: João da Silva"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>CPF</label>
              <input 
                type="text" 
                name="cpfUsuario"
                value={formData.cpfUsuario}
                onChange={handleChange}
                className={styles.input} 
                required 
                placeholder="000.000.000-00"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefone / Contato</label>
              <input 
                type="text" 
                name="contatoUsuario"
                value={formData.contatoUsuario}
                onChange={handleChange}
                className={styles.input} 
                required 
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Endereço</label>
              <input
                type="text"
                name="enderecoUsuario"
                value={formData.enderecoUsuario}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="Rua, número - Bairro"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Data de nascimento</label>
              <input
                type="date"
                name="dataNascimentoUsuario"
                value={formData.dataNascimentoUsuario}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail</label>
              <input 
                type="email" 
                name="emailUsuario"
                value={formData.emailUsuario}
                onChange={handleChange}
                className={styles.input} 
                required 
                placeholder="exemplo@email.com"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Você é</label>
              <select
                name="nivelUsuario"
                value={formData.nivelUsuario}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="">Selecione uma opção</option>
                <option value="CAMPISTA">Campista</option>
                <option value="SERVO">Servo</option>
              </select>
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Senha</label>
              <input 
                type="password" 
                name="senhaUsuario"
                value={formData.senhaUsuario}
                onChange={handleChange}
                className={styles.input} 
                required 
                placeholder="Crie uma senha segura"
              />
            </div>

          </div>

          <button type="submit" className={styles.btnSubmit} disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div className={styles.footer}>
          Já possui uma conta? <Link href="/login" className={styles.link}>Faça Login aqui</Link>.
          <br /><br />
          <Link href="/" className={styles.link}>Voltar para a Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}