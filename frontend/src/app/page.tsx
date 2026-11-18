'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './home.module.css';
import ThemeToggle from '@/components/layout/ThemeToogle/ThemeToggle';
import { comunidadeService } from '@/services/comunidadeService';
import { Comunidade } from '@/types/comunidade';
import { acampamentoService } from '@/services/acampamentoService';
import { AcampamentoPublico } from '@/types/acampamento';
import { verificarSessao } from '@/services/authService';
import { dataParaInput, formatarData } from '@/utils/formatters';
import { ModalComunidade, ModalAcampamento } from '@/components/home/ModalDetalhes';
import { MuralFotosService } from '@/services/muralFotosService';
import { MuralFotos } from '@/types/muralFotos';

// Hoje no formato "2026-11-17" (fuso do navegador), para comparar com as datas dos acampamentos
function hojeComoTexto() {
  const hoje = new Date();
  return hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
}

// Só aceita links que começam com http:// ou https:// (evita um "javascript:..." salvo no banco virar um botão)
function linkSeguro(link: string | undefined) {
  if (!link) return false;
  const texto = link.trim().toLowerCase();
  return texto.startsWith('http://') || texto.startsWith('https://');
}

export default function LandingPage() {
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [carregandoComunidades, setCarregandoComunidades] = useState(true);
  
  const [acampamentos, setAcampamentos] = useState<AcampamentoPublico[]>([]);
  const [carregandoAcampamentos, setCarregandoAcampamentos] = useState(true);

  const [murais, setMurais] = useState<MuralFotos[]>([]);
  const [carregandoMurais, setCarregandoMurais] = useState(true);

  const [logado, setLogado] = useState(false); // se o usuário já está logado, o cabeçalho mostra o botão do painel

  // Janela de detalhes aberta no momento (null = fechada)
  const [comunidadeAberta, setComunidadeAberta] = useState<Comunidade | null>(null);
  const [acampamentoAberto, setAcampamentoAberto] = useState<AcampamentoPublico | null>(null);

  useEffect(() => {
    async function conferirLogin() {
      setLogado(await verificarSessao());
    }
    conferirLogin();
  }, []);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosComunidades = await comunidadeService.listarComunidades();
        setComunidades(dadosComunidades);
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error);
      } finally {
        setCarregandoComunidades(false);
      }

      try {
        // Só os acampamentos que ainda não começaram (os que já aconteceram não aceitam mais inscrição)
        const dadosAcampamentos = await acampamentoService.listarAcampamentosPublicos();
        const hoje = hojeComoTexto();
        setAcampamentos(dadosAcampamentos.filter(a => dataParaInput(a.dataInicioAcampamento) >= hoje));
      } catch (error) {
        console.error('Erro ao buscar acampamentos:', error);
      } finally {
        setCarregandoAcampamentos(false);
      }

      try {
        // Todos os álbuns, inclusive de acampamentos que já passaram (é um mural de lembranças),
        // do mais recente para o mais antigo. Comparar "2026-10-12" com "2026-09-01" como texto já funciona.
        const dadosMurais = await MuralFotosService.listarMuralFotosPublico();
        dadosMurais.sort((a, b) => dataParaInput(b.dataEventoMuralFotos).localeCompare(dataParaInput(a.dataEventoMuralFotos)));
        setMurais(dadosMurais);
      } catch (error) {
        console.error('Erro ao buscar mural de fotos:', error);
      } finally {
        setCarregandoMurais(false);
      }
    }
    carregarDados();
  }, []);

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
          <a href="#mural">Mural de Fotos</a>
        </nav>

        <div className={styles.authButtons}>
          <ThemeToggle />
          {logado ? (
            <Link href="/painel" className={styles.btnLogin}>
              Acessar o Painel
            </Link>
          ) : (
            <>
              <Link href="/cadastro" className={styles.btnCadastro}>
                Cadastre-se
              </Link>
              <Link href="/login" className={styles.btnLogin}>
                Entrar
              </Link>
            </>
          )}
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
                    style={{ backgroundImage: `url(${renderizarFoto(comunidade.fotoComunidade)})` }}
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

                    <button type="button" className={styles.btnDetalhes} onClick={() => setComunidadeAberta(comunidade)}>
                      Ver detalhes
                    </button>
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
            <p className={styles.sectionDesc}>Viva uma experiência profunda com Deus. Conheça os próximos retiros.</p>
            {/* A inscrição é feita dentro do sistema, depois do login */}
            <p className={styles.avisoLogin}>
              {logado ? (
                <>Para se inscrever, acesse o <Link href="/painel">painel</Link> e vá em <strong>Inscrições</strong>.</>
              ) : (
                <>Para se inscrever, <Link href="/login">faça login no site</Link>. Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>.</>
              )}
            </p>
          </div>
          
          {carregandoAcampamentos ? (
            <p style={{ textAlign: 'center' }}>Carregando acampamentos...</p>
          ) : acampamentos.length > 0 ? (
            <div className={styles.gridContainer}>
              {acampamentos.map((acampamento) => (
                <div key={acampamento.idAcampamento} className={styles.cardComunidade}>
                  <div 
                    className={styles.cardComunidadeFoto} 
                    style={{ backgroundImage: `url(${renderizarFoto(acampamento.fotoAcampamento)})` }}
                  />
                  <div className={styles.cardComunidadeContent}>
                    <h3>{acampamento.nomeAcampamento}</h3>
                    {(acampamento.dataInicioAcampamento || acampamento.dataFimAcampamento) && (
                    <p className={styles.endereco}>
                        🗓️ Data: {formatarData(acampamento.dataInicioAcampamento)} até {formatarData(acampamento.dataFimAcampamento)}
                    </p>
                    )}
                    
                    {acampamento.localAcampamento && <p className={styles.endereco}>📍 {acampamento.localAcampamento}</p>}

                    <button type="button" className={styles.btnDetalhes} onClick={() => setAcampamentoAberto(acampamento)}>
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>Nenhum acampamento com inscrições abertas no momento.</p>
          )}
        </section>

        {/* MURAL DE FOTOS (álbuns do Google Drive) */}
        <section id="mural" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mural de Fotos</h2>
            <p className={styles.sectionDesc}>Reviva os momentos dos nossos acampamentos.</p>
          </div>

          {carregandoMurais ? (
            <p style={{ textAlign: 'center' }}>Carregando mural...</p>
          ) : murais.length > 0 ? (
            <div className={styles.gridContainer}>
              {murais.map((mural) => (
                <div key={mural.idMuralFotos} className={styles.cardComunidade}>
                  {/* O álbum não tem foto própria: o topo do card é um bloco colorido com um ícone */}
                  <div className={styles.muralCapa} aria-hidden="true">📷</div>
                  <div className={styles.cardComunidadeContent}>
                    <h3>{mural.tituloMuralFotos}</h3>
                    {mural.acampamento?.nomeAcampamento && (
                      <p className={styles.endereco}>⛺ {mural.acampamento.nomeAcampamento}</p>
                    )}
                    <p className={styles.endereco}>🗓️ {formatarData(mural.dataEventoMuralFotos)}</p>

                    {linkSeguro(mural.linkDriveMuralFotos) && (
                      <a
                        href={mural.linkDriveMuralFotos.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btnDetalhes} ${styles.btnFotos}`}
                      >
                        Ver fotos ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>Nenhum álbum publicado ainda.</p>
          )}
        </section>

      </main>

      {/* Janelas de detalhes (só aparecem depois de clicar em "Ver detalhes") */}
      {comunidadeAberta && (
        <ModalComunidade comunidade={comunidadeAberta} acampamentos={acampamentos} onFechar={() => setComunidadeAberta(null)} />
      )}
      {acampamentoAberto && (
        <ModalAcampamento acampamento={acampamentoAberto} logado={logado} onFechar={() => setAcampamentoAberto(null)} />
      )}

      {/* RODAPÉ INFORMATIVO */}
      <footer className={styles.footer}>
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