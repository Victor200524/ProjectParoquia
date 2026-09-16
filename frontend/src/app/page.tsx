'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './home.module.css';
import ThemeToggle from '@/components/layout/ThemeToogle/ThemeToggle';
import { comunidadeService } from '@/services/comunidadeService'; 
import { Comunidade } from '@/types/comunidade'; 
// Importe a service e o tipo de Acampamento (Ajuste o caminho se necessário)
import { acampamentoService } from '@/services/acampamentoService'; 
import { Acampamento } from '@/types/acampamento'; 

export default function LandingPage() {
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [carregandoComunidades, setCarregandoComunidades] = useState(true);
  
  const [acampamentos, setAcampamentos] = useState<Acampamento[]>([]);
  const [carregandoAcampamentos, setCarregandoAcampamentos] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca as comunidades
        const dadosComunidades = await comunidadeService.listarComunidades();
        setComunidades(dadosComunidades);
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error);
      } finally {
        setCarregandoComunidades(false);
      }

      try {
        // Busca os acampamentos (Ajuste o nome da função se a sua service usar outro nome, ex: getAllAcampamentos)
        const dadosAcampamentos = await acampamentoService.listarAcampamentos(); 
        setAcampamentos(dadosAcampamentos);
      } catch (error) {
        console.error('Erro ao buscar acampamentos:', error);
      } finally {
        setCarregandoAcampamentos(false);
      }
    }
    carregarDados();
  }, []);

  const formatarData = (dataString: string | undefined) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const renderizarFoto = (fotoBase64: string | undefined) => {
    if (!fotoBase64) {
      return '/images/placeholder-comunidade.jpg'; 
    }
    return `data:image/jpeg;base64,${fotoBase64}`;
  };

  return (
    <div className={styles.landingContainer}>
      
      {/* HEADER FIXO */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <Image 
            src="/images/logo_brasao_paroquia_sao_miguel.png" 
            alt="Brasão da Paróquia São Miguel Arcanjo" 
            width={50} 
            height={50} 
          />
          <span className={styles.paroquiaName}>Paróquia São Miguel Arcanjo</span>
        </div>
        
        <nav className={styles.navLinks}>
          <a href="#comunidades">Comunidades</a>
          <a href="#acampamentos">Acampamentos</a>
          <a href="#doacoes">Doações</a>
        </nav>

        <div className={styles.authButtons}>
          <ThemeToggle />
          <Link href="/cadastro" className={styles.btnCadastro}>
            Cadastre-se
          </Link>
          <Link href="/login" className={styles.btnLogin}>
            Entrar
          </Link>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Bem-vindo à Paróquia São Miguel Arcanjo</h1>
            <p className={styles.heroSubtitle}>
              Vivendo a fé, unidos em Cristo. Participe dos nossos acampamentos e encontre seu lugar na Igreja.
            </p>
            <div className={styles.heroActions}>
              <a href="#acampamentos" className={styles.btnPrimary}>
                Ver Próximos Acampamentos
              </a>
            </div>
          </div>
        </section>

        {/* COMUNIDADES E HORÁRIOS DINÂMICOS */}
        <section id="comunidades" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nossas Comunidades</h2>
            <p className={styles.sectionDesc}>Encontre a capela mais próxima e confira os horários de missa.</p>
          </div>
          
          {carregandoComunidades ? (
            <p style={{ textAlign: 'center' }}>Carregando comunidades...</p>
          ) : (
            <div className={styles.gridContainer}>
              {comunidades.map((comunidade) => (
                <div key={comunidade.idComunidade} className={styles.cardComunidade}>
                  <div 
                    className={styles.cardComunidadeFoto} 
                    style={{ backgroundImage: `url(${renderizarFoto(comunidade.fotoComunidade as any)})` }}
                  />
                  <div className={styles.cardComunidadeContent}>
                    <h3>{comunidade.nomeComunidade}</h3>
                    <p className={styles.endereco}>{comunidade.enderecoComunidade}</p>
                    
                    {comunidade.contatoComunidade && (
                      <p className={styles.contato}>📞 {comunidade.contatoComunidade}</p>
                    )}

                    <div className={styles.horariosContainer}>
                      <h4>Horários de Missa</h4>
                      {comunidade.horariosMissa && comunidade.horariosMissa.length > 0 ? (
                        <ul>
                          {comunidade.horariosMissa.map((horario, index) => (
                            <li key={index}>
                              <strong>{horario.semanaMissa}:</strong> {horario.horarioMissa}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.semHorario}>Horários não informados.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VITRINE DE ACAMPAMENTOS */}
        <section id="acampamentos" className={`${styles.section} ${styles.bgAlt}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Acampamentos</h2>
            <p className={styles.sectionDesc}>Viva uma experiência profunda com Deus. Inscreva-se nos próximos retiros.</p>
          </div>
          
          {carregandoAcampamentos ? (
            <p style={{ textAlign: 'center' }}>Carregando acampamentos...</p>
          ) : acampamentos.length > 0 ? (
            <div className={styles.gridContainer}>
              {acampamentos.map((acampamento) => (
                <div key={acampamento.idAcampamento} className={styles.cardComunidade}>
                  <div 
                    className={styles.cardComunidadeFoto} 
                    style={{ backgroundImage: `url(${renderizarFoto(acampamento.fotoAcampamento as any)})` }}
                  />
                  <div className={styles.cardComunidadeContent}>
                    <h3>{acampamento.nomeAcampamento}</h3>
                    {(acampamento.dataInicioAcampamento || acampamento.dataFimAcampamento) && (
                    <p className={styles.endereco}>
                        🗓️ Data: {formatarData(acampamento.dataInicioAcampamento as string)} até {formatarData(acampamento.dataFimAcampamento as string)}
                    </p>
                    )}
                    
                    <div className={styles.horariosContainer} style={{ marginTop: '1.5rem' }}>
                      <Link 
                        href={`/cadastro`} 
                        className={styles.btnPrimary} 
                        style={{ display: 'block', textAlign: 'center' }}
                      >
                        Inscrever-se
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>Nenhum acampamento com inscrições abertas no momento.</p>
          )}
        </section>

        {/* PORTAL DE DOAÇÕES */}
        <section id="doacoes" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Apoie Nossos Acampamentos</h2>
            <p className={styles.sectionDesc}>Sua doação ajuda a transformar vidas e manter a estrutura dos nossos retiros.</p>
          </div>
          <div className={styles.donationBox}>
             <div className={styles.placeholderCard}>Informações de Doação (Em Breve)</div>
          </div>
        </section>
      </main>

      {/* RODAPÉ INFORMATIVO */}
      <footer className={styles.footer}>
        {/* Restante do Footer igual ao anterior */}
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <h3>Secretaria Paroquial</h3>
            <p>📍 Rua Natalina Cordeiro Fonseca - Res. Maré Mansa</p>
            <p>Presidente Prudente - SP, 19028-060</p>
            <p>📞 (18) 99619-3996</p>
            <p>🕒 Atendimento: Segunda a Sexta, 08:00 às 17:50</p>
          </div>
          <div className={styles.footerSocial}>
            <h3>Siga-nos nas redes sociais</h3>
            <a 
              href="https://www.instagram.com/paroquia.smiguelmm/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialLink}
            >
              Instagram @paroquia.smiguelmm
            </a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Paróquia São Miguel Arcanjo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}