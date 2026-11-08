"use client";

import { useState, useEffect } from "react";
import styles from "./financeiro.module.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Types
import { Pagamento, FormaPagamento } from "@/types/pagamento";
import { AcampamentoPublico } from "@/types/acampamento";

// Services
import { pagamentoService } from "@/services/pagamentoService";
import { acampamentoService } from "@/services/acampamentoService";

// Só a equipe (administração e coordenação) vê o dinheiro recebido
const niveisPermitidos = ['COORDENADOR_GERAL', 'COORDENADOR_ACAMPAMENTO', 'PADRE', 'SECRETARIA'];

const FORMA_TEXTO: Record<FormaPagamento, string> = {
    MERCADO_PAGO: "Mercado Pago",
    DINHEIRO: "Dinheiro",
    PIX: "PIX",
};

// formata 1234.5 como "R$ 1.234,50"
function formatarReais(valor: number){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// Filho: só é montado depois que o ProtectedRoute liberou o acesso,
// assim o useEffect não busca os pagamentos antes da checagem de nível
function ListaPagamentos(){

    const [listaPagamentos, setListaPagamentos] = useState<Pagamento[]>([]);
    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);
    const [filtroAcampamento, setFiltroAcampamento] = useState(0); // 0 = todos os acampamentos

    // os acampamentos do filtro só precisam ser buscados uma vez
    useEffect(()=>{
        acampamentoService.listarAcampamentosPublicos()
            .then(setListaAcampamentos)
            .catch(error => alert("Erro ao buscar os acampamentos: " + (error as Error).message));
    }, []);

    // toda vez que o filtro muda, o backend devolve só os pagamentos daquele acampamento
    useEffect(()=>{
        pagamentoService.listarPagamentos(filtroAcampamento === 0 ? undefined : filtroAcampamento)
            .then(setListaPagamentos)
            .catch(error => alert("Erro ao buscar os pagamentos: " + (error as Error).message));
    }, [filtroAcampamento]);

    const total = listaPagamentos.reduce((soma, pagamento) => soma + pagamento.valorPagamento, 0);

    return(
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitulo}>Financeiro</h1>
                <p className={styles.pageSubtitle}>Pagamentos recebidos nas inscrições dos acampamentos</p>
            </div>

            {/* Filtro + resumo */}
            <div className={styles.filtros}>
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Acampamento</label>
                    <select className={styles.inputField} value={filtroAcampamento} onChange={(e) => setFiltroAcampamento(Number(e.target.value))}>
                        <option value={0}>Todos</option>
                        {listaAcampamentos.map(acampamento => (
                            <option key={acampamento.idAcampamento} value={acampamento.idAcampamento}>{acampamento.nomeAcampamento}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.resumo}>
                    <span className={styles.resumoLabel}>{listaPagamentos.length} pagamento(s)</span>
                    <span className={styles.resumoTotal}>{formatarReais(total)}</span>
                </div>
            </div>

            {listaPagamentos.length === 0 ? (
                <p className={styles.vazio}>Nenhum pagamento registrado.</p>
            ) : (
                <div className={styles.tabelaCard}>
                    <table className={styles.tabela}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Acampamento</th>
                                <th>Tipo</th>
                                <th>Forma</th>
                                <th>Data</th>
                                <th className={styles.colunaValor}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaPagamentos.map(pagamento => (
                                <tr key={pagamento.idPagamento}>
                                    <td>{pagamento.inscricaoAcampamento.usuario.nomeUsuario}</td>
                                    <td>{pagamento.inscricaoAcampamento.acampamento.nomeAcampamento}</td>
                                    <td>{pagamento.inscricaoAcampamento.funcaoAcampamento === 'SERVO' ? "Servo" : "Campista"}</td>
                                    <td><span className={styles.forma}>{FORMA_TEXTO[pagamento.formaPagamento]}</span></td>
                                    <td>{new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}</td>
                                    <td className={styles.colunaValor}>{formatarReais(pagamento.valorPagamento)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function Financeiro(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaPagamentos />
        </ProtectedRoute>
    );
}
