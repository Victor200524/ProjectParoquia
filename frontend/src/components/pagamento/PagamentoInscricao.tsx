"use client";

import { useState } from "react";
import styles from "./pagamentoInscricao.module.css";
import { InscricaoAcampamento, InscricaoAcampamentoStatus } from "@/types/inscricaoAcampamento";
import { pagamentoService } from "@/services/pagamentoService";

// Peças de pagamento usadas pelo campista/servo em mais de uma tela
// (lista de formulários e tela de responder o formulário)

const STATUS_TEXTO: Record<InscricaoAcampamentoStatus, string> = {
    AGUARDANDO_APROVACAO: "Aguardando aprovação",
    APROVADO: "Aprovado",
    PAGAMENTO_PENDENTE: "Pagamento pendente",
    CONFIRMADO: "Confirmado",
    REPROVADO: "Reprovado",
};

// Etiqueta colorida com a situação da inscrição
export function EtiquetaStatus({ status }: { status: InscricaoAcampamentoStatus }){
    return (
        <span className={`${styles.status} ${styles['status_' + status]}`}>
            {STATUS_TEXTO[status]}
        </span>
    );
}

interface AcoesPagamentoProps {
    inscricao: InscricaoAcampamento;
    rotaRetorno: string;                 // tela para onde o Mercado Pago devolve a pessoa (ex.: "/inscricao/resposta")
    onAtualizar: () => Promise<void>;    // recarrega a tela depois que o pagamento é confirmado
}

// Botões "Pagar online" / "Verificar pagamento", ou a orientação certa para cada situação
export function AcoesPagamento({ inscricao, rotaRetorno, onAtualizar }: AcoesPagamentoProps){
    const [processando, setProcessando] = useState(false); // evita clique duplo enquanto fala com o backend
    const idInscricao = Number(inscricao.idInscricao);

    // Gera o link do checkout no backend e manda o navegador para o Mercado Pago
    async function handlePagarOnline(){
        setProcessando(true);
        try{
            const urlRetorno = `${window.location.origin}${rotaRetorno}?retornoPagamento=${idInscricao}`;
            const preferencia = await pagamentoService.criarPreferencia(idInscricao, urlRetorno);
            window.location.href = preferencia.redirectUrl;
        }catch(error){
            alert("Erro ao gerar o pagamento: " + (error as Error).message);
            setProcessando(false);
        }
    }

    // Para quem pagou mas voltou sem passar pelo retorno automático
    async function handleVerificarPagamento(){
        setProcessando(true);
        try{
            const confirmado = await pagamentoService.verificarPagamento(idInscricao);
            await onAtualizar();
            alert(confirmado ? "Pagamento aprovado! Sua inscrição está confirmada." : "Ainda não há pagamento aprovado para esta inscrição.");
        }catch(error){
            alert("Erro ao verificar o pagamento: " + (error as Error).message);
        }finally{
            setProcessando(false);
        }
    }

    if(inscricao.statusAprovacao === 'AGUARDANDO_APROVACAO')
        return <p className={styles.aviso}>A coordenação vai analisar sua inscrição. Depois da aprovação, o pagamento é liberado aqui.</p>;

    if(inscricao.statusAprovacao === 'CONFIRMADO')
        return <p className={styles.aviso}>Tudo certo! Sua vaga está garantida.</p>;

    if(inscricao.statusAprovacao !== 'PAGAMENTO_PENDENTE')
        return null;

    if(!inscricao.acampamento.aceitaPagamentoOnline)
        return <p className={styles.aviso}>Pagamento em dinheiro ou PIX direto com a coordenação do acampamento.</p>;

    return (
        <div className={styles.acoes}>
            <button type="button" className={styles.btnPagar} disabled={processando} onClick={handlePagarOnline}>
                {processando ? "Aguarde..." : "Pagar online"}
            </button>
            <button type="button" className={styles.btnVerificar} disabled={processando} onClick={handleVerificarPagamento}>
                Verificar pagamento
            </button>
        </div>
    );
}

// Chamada ao abrir a tela: se a pessoa está voltando do checkout (?retornoPagamento=<idInscricao>),
// pergunta ao backend se o pagamento foi aprovado e avisa o resultado
export async function conferirRetornoPagamento(onAtualizar: () => Promise<void>){
    const idRetorno = Number(new URLSearchParams(window.location.search).get('retornoPagamento'));
    if(!idRetorno)
        return;
    window.history.replaceState(null, "", window.location.pathname); // limpa a URL para não verificar de novo ao recarregar
    try{
        const confirmado = await pagamentoService.verificarPagamento(idRetorno);
        await onAtualizar();
        alert(confirmado
            ? "Pagamento aprovado! Sua inscrição está confirmada."
            : "Ainda não recebemos a confirmação do Mercado Pago. Se você pagou, use \"Verificar pagamento\" daqui a pouco.");
    }catch(error){
        alert("Erro ao verificar o pagamento: " + (error as Error).message);
    }
}
