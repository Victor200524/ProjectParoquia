'use client';

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import styles from './modalDetalhes.module.css';
import { Comunidade } from '@/types/comunidade';
import { AcampamentoPublico } from '@/types/acampamento';
import { formatarData, formatarDinheiro, dataParaInput } from '@/utils/formatters';

// Ordem dos dias para mostrar os horários de missa de domingo a sábado
const ORDEM_DIAS = ['domingo', 'segunda', 'terça', 'terca', 'quarta', 'quinta', 'sexta', 'sábado', 'sabado'];

function posicaoDoDia(dia: string) {
  const texto = dia.toLowerCase();
  const posicao = ORDEM_DIAS.findIndex(d => texto.startsWith(d));
  return posicao === -1 ? 99 : posicao;
}

function urlFoto(fotoBase64: string | undefined) {
  return fotoBase64 ? `data:image/jpeg;base64,${fotoBase64}` : '/images/placeholder-comunidade.jpg';
}

// Quantos dias faltam (ou se já começou/terminou)
function textoContagem(acampamento: AcampamentoPublico) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const [ano, mes, dia] = dataParaInput(acampamento.dataInicioAcampamento).split('-').map(Number);
  const [anoF, mesF, diaF] = dataParaInput(acampamento.dataFimAcampamento).split('-').map(Number);
  const inicio = new Date(ano, mes - 1, dia);
  const fim = new Date(anoF, mesF - 1, diaF);
  const dias = Math.round((inicio.getTime() - hoje.getTime()) / 86400000);

  if (dias > 1) return `Faltam ${dias} dias`;
  if (dias === 1) return 'Começa amanhã';
  if (dias === 0) return 'Começa hoje';
  if (hoje <= fim) return 'Acontecendo agora';
  return 'Já aconteceu';
}


// ===================== Janela (fundo escuro + caixa) =====================
function Janela({ titulo, foto, onFechar, children }: { titulo: string; foto?: string; onFechar: () => void; children: ReactNode }) {

  // Fecha com Esc e trava a rolagem da página de trás enquanto a janela está aberta
  useEffect(() => {
    function aoApertarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    document.addEventListener('keydown', aoApertarTecla);
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoApertarTecla);
      document.body.style.overflow = overflowAntes;
    };
  }, [onFechar]);

  return (
    // clicar no fundo escuro fecha; clicar dentro da caixa não (stopPropagation)
    <div className={styles.fundo} onClick={onFechar}>
      <div className={styles.janela} role="dialog" aria-modal="true" aria-labelledby="tituloDetalhes" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.btnFechar} onClick={onFechar} aria-label="Fechar">×</button>

        {/* foto inteira em 16:9 (formato recomendado no cadastro); o título fica embaixo para não cobrir a arte */}
        <div className={styles.capa} style={{ backgroundImage: `url(${urlFoto(foto)})` }} />

        <div className={styles.conteudo}>
          <h2 id="tituloDetalhes" className={styles.titulo}>{titulo}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}


// ===================== Detalhes da comunidade (capela) =====================
export function ModalComunidade({ comunidade, acampamentos, onFechar }: {
  comunidade: Comunidade;
  acampamentos: AcampamentoPublico[]; // próximos acampamentos (para listar os desta comunidade)
  onFechar: () => void;
}) {
  const horarios = [...(comunidade.horariosMissa ?? [])].sort((a, b) => posicaoDoDia(a.semanaMissa) - posicaoDoDia(b.semanaMissa));
  const acampamentosDaqui = acampamentos.filter(a => a.comunidade?.idComunidade === comunidade.idComunidade);
  const telefone = comunidade.contatoComunidade?.replace(/\D/g, '');

  return (
    <Janela titulo={comunidade.nomeComunidade ?? 'Comunidade'} foto={comunidade.fotoComunidade} onFechar={onFechar}>

      <div className={styles.infos}>
        {comunidade.enderecoComunidade && (
          <div className={styles.info}>
            <span className={styles.infoIcone}>📍</span>
            <div>
              <span className={styles.infoRotulo}>Endereço</span>
              <span>{comunidade.enderecoComunidade}</span>
              <a className={styles.link} target="_blank" rel="noopener noreferrer"
                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comunidade.enderecoComunidade)}`}>
                Ver no mapa ↗
              </a>
            </div>
          </div>
        )}
        {comunidade.contatoComunidade && (
          <div className={styles.info}>
            <span className={styles.infoIcone}>📞</span>
            <div>
              <span className={styles.infoRotulo}>Contato</span>
              <a className={styles.link} href={`tel:${telefone}`}>{comunidade.contatoComunidade}</a>
            </div>
          </div>
        )}
      </div>

      <section className={styles.secao}>
        <h3 className={styles.secaoTitulo}>Horários de Missa</h3>
        {horarios.length === 0 ? <p className={styles.vazio}>Horários não informados.</p> : (
          <ul className={styles.horarios}>
            {horarios.map((h, i) => (
              <li key={i}>
                <span>{h.semanaMissa}</span>
                <strong>{h.horarioMissa}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      {acampamentosDaqui.length > 0 && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Próximos acampamentos desta comunidade</h3>
          <ul className={styles.listaSimples}>
            {acampamentosDaqui.map(a => (
              <li key={a.idAcampamento}>
                <strong>{a.nomeAcampamento}</strong> · {formatarData(a.dataInicioAcampamento)} a {formatarData(a.dataFimAcampamento)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </Janela>
  );
}


// ===================== Detalhes do acampamento =====================
export function ModalAcampamento({ acampamento, logado, onFechar }: {
  acampamento: AcampamentoPublico;
  logado: boolean;
  onFechar: () => void;
}) {
  const comunidade = acampamento.comunidade;

  return (
    <Janela titulo={acampamento.nomeAcampamento} foto={acampamento.fotoAcampamento} onFechar={onFechar}>

      {acampamento.temaAcampamento && <p className={styles.tema}>“{acampamento.temaAcampamento}”</p>}

      <span className={styles.selo}>{textoContagem(acampamento)}</span>

      {/* Destaques em blocos */}
      <div className={styles.destaques}>
        <div className={styles.destaque}>
          <span className={styles.destaqueRotulo}>Quando</span>
          <span className={styles.destaqueValor}>{formatarData(acampamento.dataInicioAcampamento)}</span>
          <span className={styles.destaqueDetalhe}>até {formatarData(acampamento.dataFimAcampamento)}</span>
        </div>
        <div className={styles.destaque}>
          <span className={styles.destaqueRotulo}>Idade</span>
          <span className={styles.destaqueValor}>{acampamento.idadeMinAcampamento} a {acampamento.idadeMaxAcampamento}</span>
          <span className={styles.destaqueDetalhe}>anos</span>
        </div>
        <div className={styles.destaque}>
          <span className={styles.destaqueRotulo}>Vagas</span>
          <span className={styles.destaqueValor}>{acampamento.vagasAcampamento}</span>
          <span className={styles.destaqueDetalhe}>no total</span>
        </div>
        <div className={styles.destaque}>
          <span className={styles.destaqueRotulo}>Taxa</span>
          <span className={styles.destaqueValor}>{formatarDinheiro(acampamento.taxaInscricaoAcampamento)}</span>
          <span className={styles.destaqueDetalhe}>de inscrição</span>
        </div>
      </div>

      <div className={styles.infos}>
        {acampamento.localAcampamento && (
          <div className={styles.info}>
            <span className={styles.infoIcone}>📍</span>
            <div>
              <span className={styles.infoRotulo}>Local</span>
              <span>{acampamento.localAcampamento}</span>
            </div>
          </div>
        )}
        {comunidade?.nomeComunidade && (
          <div className={styles.info}>
            <span className={styles.infoIcone}>⛪</span>
            <div>
              <span className={styles.infoRotulo}>Comunidade</span>
              <span>{comunidade.nomeComunidade}</span>
              {comunidade.contatoComunidade && <span className={styles.infoExtra}>📞 {comunidade.contatoComunidade}</span>}
            </div>
          </div>
        )}
      </div>

      {acampamento.informacoesAcampamento && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Sobre o acampamento</h3>
          <p className={styles.texto}>{acampamento.informacoesAcampamento}</p>
        </section>
      )}

      {/* Inscrição só pelo sistema, depois do login */}
      <div className={styles.avisoInscricao}>
        {logado ? (
          <p>Para se inscrever, acesse o painel do site e vá em <strong>Inscrições</strong>.</p>
        ) : (
          <p>
            Para se inscrever, <Link href="/login" className={styles.link}>faça login no site</Link>.
            Ainda não tem conta? <Link href="/cadastro" className={styles.link}>Cadastre-se</Link>.
          </p>
        )}
      </div>
    </Janela>
  );
}
