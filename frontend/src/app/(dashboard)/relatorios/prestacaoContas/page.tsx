"use client";

import { useState, useEffect } from "react";
import styles from "./prestacaoContas.module.css";
import { AcampamentoPublico } from "@/types/acampamento";
import { PrestacaoContas } from "@/types/relatorio";
import { acampamentoService } from "@/services/acampamentoService";
import { relatorioService } from "@/services/relatorioService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatarData, formatarDinheiro, formatarTexto } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];

const NOME_PAROQUIA = "Paróquia São Miguel Arcanjo";

const FORMAS: Record<string, string> = { MERCADO_PAGO: 'Mercado Pago', PIX: 'PIX', DINHEIRO: 'Dinheiro' };

const TIPOS_MOVIMENTO: Record<string, string> = {
    ENTRADA: 'Entrada', SAIDA: 'Saída', TRANSFERENCIA: 'Transferência', PERDA_VALIDADE: 'Perda (validade)'
};

function soma(valores: number[]){
    return valores.reduce((total, valor) => total + valor, 0);
}

function nomeFuncao(funcao: string){
    return funcao === 'CAMPISTA' ? 'Campistas' : 'Equipe de trabalho';
}


function RelatorioPrestacaoContas(){

    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);
    const [idAcampamento, setIdAcampamento] = useState<number | null>(null);
    const [dados, setDados] = useState<PrestacaoContas | null>(null);

    useEffect(()=>{
        async function carregarAcampamentos(){
            try{
                setListaAcampamentos(await acampamentoService.listarAcampamentosPublicos());
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarAcampamentos();
    }, []);

    async function escolherAcampamento(valor: string){
        setDados(null);
        if(valor === ''){
            setIdAcampamento(null);
            return;
        }
        setIdAcampamento(Number(valor));
        try{
            setDados(await relatorioService.buscarPrestacaoContas(Number(valor)));
        }catch(error){
            alert("Erro ao buscar a prestação de contas: " + (error as Error).message);
        }
    }

    const acampamento = listaAcampamentos.find(a => a.idAcampamento === idAcampamento);

    // ===== totais do estoque (em unidades) =====
    const totalEntradasEstoque = dados ? soma(dados.resumoItens.map(i => i.entradas)) : 0;
    const totalSaidasEstoque = dados ? soma(dados.resumoItens.map(i => i.saidas)) : 0;
    const totalItensDoados = dados ? soma(dados.doacoesProdutos.map(d => d.quantidade)) : 0;

    // ===== totais do financeiro (em R$) =====
    const totalInscricoes = dados ? soma(dados.inscricoes.map(i => i.total)) : 0;
    const totalDoacoesDinheiro = dados ? soma(dados.doacoesDinheiro.map(d => d.valor)) : 0;
    const totalRecebido = totalInscricoes + totalDoacoesDinheiro;
    const totalPendente = dados ? soma(dados.pendentes.map(p => p.valor)) : 0;

    return(
            <div className={styles.pageContainer}>

                {/* Barra de cima: some na impressão */}
                <div className={styles.barra}>
                    <div>
                        <h1 className={styles.pageTitulo}>Prestação de contas</h1>
                        <p className={styles.pageSubtitle}>Entradas e saídas do estoque e do dinheiro de cada acampamento</p>
                    </div>
                    <div className={styles.controles}>
                        <select className={styles.inputField} value={idAcampamento ?? ''} onChange={(e) => escolherAcampamento(e.target.value)}>
                            <option value="">Escolha o acampamento...</option>
                            {listaAcampamentos.map(a => (
                                <option key={a.idAcampamento} value={a.idAcampamento}>{a.nomeAcampamento}</option>
                            ))}
                        </select>
                        <button type="button" className={styles.btnImprimir} onClick={() => window.print()} disabled={!dados}>
                            Imprimir / Salvar PDF
                        </button>
                    </div>
                </div>

                {/* Na impressão, A4 em pé */}
                <style>{"@page { size: A4 portrait; margin: 14mm; }"}</style>

                {acampamento && dados && (
                    <div className={styles.documento}>

                        {/* ===== Cabeçalho ===== */}
                        <div className={styles.cabecalho}>
                            <div>
                                <p className={styles.paroquia}>{NOME_PAROQUIA}</p>
                                <h2 className={styles.titulo}>Prestação de contas</h2>
                                <p className={styles.acampamento}>{acampamento.nomeAcampamento}</p>
                                <p className={styles.info}>
                                    {formatarData(acampamento.dataInicioAcampamento)} a {formatarData(acampamento.dataFimAcampamento)}
                                    {acampamento.comunidade?.nomeComunidade && ` · ${acampamento.comunidade.nomeComunidade}`}
                                </p>
                            </div>
                            <p className={styles.emissao}>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
                        </div>

                        {/* ===== Resumo ===== */}
                        <div className={styles.resumo}>
                            <div className={styles.resumoItem}>
                                <span className={styles.resumoRotulo}>Estoque · entradas</span>
                                <span className={styles.resumoValor}>{totalEntradasEstoque} un.</span>
                            </div>
                            <div className={styles.resumoItem}>
                                <span className={styles.resumoRotulo}>Estoque · saídas</span>
                                <span className={styles.resumoValor}>{totalSaidasEstoque} un.</span>
                            </div>
                            <div className={`${styles.resumoItem} ${styles.resumoDestaque}`}>
                                <span className={styles.resumoRotulo}>Dinheiro recebido</span>
                                <span className={styles.resumoValor}>{formatarDinheiro(totalRecebido)}</span>
                            </div>
                        </div>

                        {/* ================= PARTE 1: ESTOQUE ================= */}
                        <h3 className={styles.parteTitulo}>Parte 1 · Estoque</h3>

                        <section className={styles.secao}>
                            <h4 className={styles.secaoTitulo}>1.1 Resumo por item</h4>
                            {dados.resumoItens.length === 0 ? <p className={styles.semDados}>Nenhuma movimentação de estoque para este acampamento.</p> : (
                                <table className={styles.tabela}>
                                    <thead>
                                        <tr><th>Item</th><th className={styles.numero}>Entradas</th><th className={styles.numero}>Saídas</th><th className={styles.numero}>Saldo</th></tr>
                                    </thead>
                                    <tbody>
                                        {dados.resumoItens.map(item => (
                                            <tr key={item.item}>
                                                <td>{item.item}</td>
                                                <td className={styles.numero}>{item.entradas}</td>
                                                <td className={styles.numero}>{item.saidas}</td>
                                                <td className={`${styles.numero} ${item.entradas - item.saidas < 0 ? styles.negativo : ''}`}>{item.entradas - item.saidas}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>Total</td>
                                            <td className={styles.numero}>{totalEntradasEstoque}</td>
                                            <td className={styles.numero}>{totalSaidasEstoque}</td>
                                            <td className={styles.numero}>{totalEntradasEstoque - totalSaidasEstoque}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </section>

                        <section className={styles.secao}>
                            <h4 className={styles.secaoTitulo}>1.2 Movimentações</h4>
                            {dados.movimentos.length === 0 ? <p className={styles.semDados}>Nenhuma movimentação.</p> : (
                                <table className={styles.tabela}>
                                    <thead>
                                        <tr><th>Data</th><th>Tipo</th><th>Item</th><th className={styles.numero}>Qtde</th><th>Detalhe</th><th>Responsável</th></tr>
                                    </thead>
                                    <tbody>
                                        {dados.movimentos.map((mov, i) => (
                                            <tr key={i}>
                                                <td>{formatarData(mov.data)}</td>
                                                <td>{TIPOS_MOVIMENTO[mov.tipo] ?? formatarTexto(mov.tipo)}</td>
                                                <td>{mov.item}</td>
                                                <td className={`${styles.numero} ${mov.sentido === 'ENTRADA' ? styles.positivo : styles.negativo}`}>
                                                    {mov.sentido === 'ENTRADA' ? '+' : '−'}{mov.quantidade}
                                                </td>
                                                <td>
                                                    {mov.detalhe}
                                                    {mov.observacao && <span className={styles.observacao}> · {mov.observacao}</span>}
                                                </td>
                                                <td>{mov.responsavel ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </section>

                        <section className={styles.secao}>
                            <h4 className={styles.secaoTitulo}>1.3 Doações em produtos</h4>
                            {dados.doacoesProdutos.length === 0 ? <p className={styles.semDados}>Nenhuma doação em produtos.</p> : (
                                <table className={styles.tabela}>
                                    <thead>
                                        <tr><th>Data</th><th>Item</th><th>Tipo</th><th>Doador</th><th className={styles.numero}>Qtde</th></tr>
                                    </thead>
                                    <tbody>
                                        {dados.doacoesProdutos.map((d, i) => (
                                            <tr key={i}>
                                                <td>{formatarData(d.data)}</td>
                                                <td>{d.nome}</td>
                                                <td>{formatarTexto(d.tipo)}</td>
                                                <td>{d.doador || 'Anônimo'}</td>
                                                <td className={styles.numero}>{d.quantidade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr><td colSpan={4}>Total de itens doados</td><td className={styles.numero}>{totalItensDoados}</td></tr>
                                    </tfoot>
                                </table>
                            )}
                        </section>

                        {/* ================= PARTE 2: FINANCEIRO ================= */}
                        <h3 className={styles.parteTitulo}>Parte 2 · Financeiro</h3>

                        <section className={styles.secao}>
                            <h4 className={styles.secaoTitulo}>2.1 Entradas · inscrições pagas</h4>
                            {dados.inscricoes.length === 0 ? <p className={styles.semDados}>Nenhum pagamento de inscrição.</p> : (
                                <table className={styles.tabela}>
                                    <thead>
                                        <tr><th>Função</th><th>Forma de pagamento</th><th className={styles.numero}>Qtde</th><th className={styles.numero}>Valor</th></tr>
                                    </thead>
                                    <tbody>
                                        {dados.inscricoes.map(i => (
                                            <tr key={i.funcao + i.forma}>
                                                <td>{nomeFuncao(i.funcao)}</td>
                                                <td>{FORMAS[i.forma] ?? formatarTexto(i.forma)}</td>
                                                <td className={styles.numero}>{i.quantidade}</td>
                                                <td className={styles.numero}>{formatarDinheiro(i.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr><td colSpan={3}>Subtotal das inscrições</td><td className={styles.numero}>{formatarDinheiro(totalInscricoes)}</td></tr>
                                    </tfoot>
                                </table>
                            )}
                        </section>

                        <section className={styles.secao}>
                            <h4 className={styles.secaoTitulo}>2.2 Entradas · doações em dinheiro</h4>
                            {dados.doacoesDinheiro.length === 0 ? <p className={styles.semDados}>Nenhuma doação em dinheiro.</p> : (
                                <table className={styles.tabela}>
                                    <thead>
                                        <tr><th>Data</th><th>Descrição</th><th>Doador</th><th className={styles.numero}>Valor</th></tr>
                                    </thead>
                                    <tbody>
                                        {dados.doacoesDinheiro.map((d, i) => (
                                            <tr key={i}>
                                                <td>{formatarData(d.data)}</td>
                                                <td>{d.nome}</td>
                                                <td>{d.doador || 'Anônimo'}</td>
                                                <td className={styles.numero}>{formatarDinheiro(d.valor)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr><td colSpan={3}>Subtotal das doações</td><td className={styles.numero}>{formatarDinheiro(totalDoacoesDinheiro)}</td></tr>
                                    </tfoot>
                                </table>
                            )}
                        </section>

                        <div className={styles.totalGeral}>
                            <span>Total de dinheiro recebido</span>
                            <strong>{formatarDinheiro(totalRecebido)}</strong>
                        </div>

                        <section className={styles.secao}>
                            <h4 className={styles.secaoTitulo}>2.3 A receber · inscrições com pagamento pendente</h4>
                            {dados.pendentes.length === 0 ? <p className={styles.semDados}>Nenhuma inscrição com pagamento pendente.</p> : (
                                <table className={styles.tabela}>
                                    <thead>
                                        <tr><th>Nome</th><th>Função</th><th className={styles.numero}>Valor</th></tr>
                                    </thead>
                                    <tbody>
                                        {[...dados.pendentes].sort((a, b) => a.nome.localeCompare(b.nome)).map((p, i) => (
                                            <tr key={i}>
                                                <td>{p.nome}</td>
                                                <td>{p.funcao === 'CAMPISTA' ? 'Campista' : 'Equipe de trabalho'}</td>
                                                <td className={styles.numero}>{formatarDinheiro(p.valor)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr><td colSpan={2}>Total a receber</td><td className={styles.numero}>{formatarDinheiro(totalPendente)}</td></tr>
                                    </tfoot>
                                </table>
                            )}
                        </section>

                        <p className={styles.nota}>
                            As saídas de dinheiro (despesas) ainda não são registradas no sistema e não aparecem neste relatório.
                        </p>

                        {/* ===== Assinaturas ===== */}
                        <div className={styles.assinaturas}>
                            <div className={styles.assinatura}><span className={styles.linhaAssinatura} />Coordenação do acampamento</div>
                            <div className={styles.assinatura}><span className={styles.linhaAssinatura} />Tesouraria</div>
                            <div className={styles.assinatura}><span className={styles.linhaAssinatura} />Pároco</div>
                        </div>
                    </div>
                )}
            </div>
    );
}

export default function PrestacaoContasPagina(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <RelatorioPrestacaoContas />
        </ProtectedRoute>
    );
}
