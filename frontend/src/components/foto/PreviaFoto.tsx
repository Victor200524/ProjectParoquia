'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './previaFoto.module.css';

// Formato em que as fotos de acampamento e comunidade aparecem no site (cards, janela de detalhes)
export const LARGURA_RECOMENDADA = 1920;
export const ALTURA_RECOMENDADA = 1080;
const PROPORCAO = LARGURA_RECOMENDADA / ALTURA_RECOMENDADA; // 16:9

// Dica de resolução + prévia da imagem escolhida, do jeito que vai aparecer no site
export default function PreviaFoto({ arquivo }: { arquivo: File | null }) {

  // Endereço temporário da imagem escolhida (só existe no navegador)
  const url = useMemo(() => (arquivo ? URL.createObjectURL(arquivo) : null), [arquivo]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]); // libera a memória ao trocar de imagem

  // Tamanho real da imagem, lido quando ela termina de carregar
  const [tamanho, setTamanho] = useState<{ url: string; largura: number; altura: number } | null>(null);
  const tamanhoAtual = tamanho && tamanho.url === url ? tamanho : null;

  function avisos() {
    if (!tamanhoAtual) return [];
    const lista: string[] = [];
    const proporcao = tamanhoAtual.largura / tamanhoAtual.altura;
    if (Math.abs(proporcao - PROPORCAO) > 0.08) {
      lista.push(tamanhoAtual.altura > tamanhoAtual.largura
        ? 'A imagem está na vertical: no site ela vai aparecer cortada em cima e embaixo, como na prévia.'
        : 'A imagem não está no formato 16:9: as bordas vão aparecer cortadas, como na prévia.');
    }
    if (tamanhoAtual.largura < 960)
      lista.push('A imagem é pequena e pode ficar sem nitidez. Use pelo menos 960 × 540 px.');
    if (arquivo && arquivo.size > 2 * 1024 * 1024)
      lista.push('O arquivo tem mais de 2 MB e deixa a página mais lenta. Se puder, use uma versão menor.');
    return lista;
  }

  return (
    <div className={styles.container}>
      <p className={styles.dica}>
        Use uma imagem <strong>na horizontal</strong>, de preferência <strong>{LARGURA_RECOMENDADA} × {ALTURA_RECOMENDADA} px</strong> (formato 16:9;
        mínimo 960 × 540). JPG ou PNG, até 2 MB. Deixe textos e rostos longe das bordas.
      </p>

      {url && (
        <div className={styles.previa}>
          <span className={styles.previaRotulo}>Prévia de como vai aparecer no site</span>
          <div className={styles.moldura}>
            {/* eslint-disable-next-line @next/next/no-img-element -- imagem local (blob) só para a prévia */}
            <img
              src={url}
              alt="Prévia da imagem escolhida"
              className={styles.imagem}
              onLoad={(e) => setTamanho({ url, largura: e.currentTarget.naturalWidth, altura: e.currentTarget.naturalHeight })}
            />
          </div>

          {tamanhoAtual && (
            <span className={styles.medida}>
              Sua imagem: {tamanhoAtual.largura} × {tamanhoAtual.altura} px
              {avisos().length === 0 && <span className={styles.ok}> ✓ formato ideal</span>}
            </span>
          )}
          {avisos().map(aviso => <span key={aviso} className={styles.aviso}>⚠ {aviso}</span>)}
        </div>
      )}
    </div>
  );
}
