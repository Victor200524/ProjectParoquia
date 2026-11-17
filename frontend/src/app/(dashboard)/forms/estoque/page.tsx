"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./estoque.module.css";
import { ItemEstoque } from "@/types/itemEstoque";
import { MovimentacaoEstoque } from "@/types/movimentoEstoque";
import { itemEstoqueService } from "@/services/itemEstoqueService";
import { movimentoEstoqueService } from "@/services/movimentoEstoqueService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { dataParaInput, formatarData, formatarTexto } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];

const DIAS_AVISO_VALIDADE = 30; // itens que vencem dentro desse prazo aparecem com alerta


// Quantos dias faltam para a data (negativo = já passou). Sem data, devolve null.
function diasAteVencer(validade: string | undefined){
    const data = dataParaInput(validade);
    if(data === '')
        return null;
    const vencimento = new Date(data + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.round((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

// Decide o texto e a cor da etiqueta de cada item
function situacaoItem(item: ItemEstoque){
    if(item.qtdeItemEstoque <= 0)
        return { texto: "Sem estoque", classe: styles.statusPerigo, alerta: true };

    const dias = diasAteVencer(item.dataValidadeItemEstoque);
    if(dias !== null && dias < 0)
        return { texto: "Vencido", classe: styles.statusPerigo, alerta: true };
    if(dias !== null && dias === 0)
        return { texto: "Vence hoje", classe: styles.statusAviso, alerta: true };
    if(dias !== null && dias <= DIAS_AVISO_VALIDADE)
        return { texto: "Vence em " + dias + " dias", classe: styles.statusAviso, alerta: true };

    return { texto: "OK", classe: styles.statusAtivo, alerta: false };
}


function VisaoGeralEstoque(){

    const [listaItens, setListaItens] = useState<ItemEstoque[]>([]);
    const [listaMovimentacoes, setListaMovimentacoes] = useState<MovimentacaoEstoque[]>([]);

    // filtros da tabela
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("");
    const [soAlertas, setSoAlertas] = useState(false);

    useEffect(()=>{
        async function carregarDados(){
            try{
                setListaItens(await itemEstoqueService.listarItemEstoque());
                setListaMovimentacoes(await movimentoEstoqueService.listarMovimentoEstoque());
            }catch(error){
                alert("Erro ao buscar o estoque: " + (error as Error).message);
            }
        }
        carregarDados();
    }, []);

    // === Números dos cards de resumo ===
    const totalUnidades = listaItens.reduce((soma, item) => soma + item.qtdeItemEstoque, 0);
    const semEstoque = listaItens.filter(item => item.qtdeItemEstoque <= 0).length;
    const comAlertaValidade = listaItens.filter(item => {
        const dias = diasAteVencer(item.dataValidadeItemEstoque);
        return item.qtdeItemEstoque > 0 && dias !== null && dias <= DIAS_AVISO_VALIDADE;
    }).length;

    // === Itens que aparecem na tabela, depois dos filtros ===
    const itensFiltrados = listaItens.filter(item => {
        if(busca !== "" && !item.nomeItemEstoque.toLowerCase().includes(busca.toLowerCase()))
            return false;
        if(categoria !== "" && item.categoriaItemEstoque !== categoria)
            return false;
        if(soAlertas && !situacaoItem(item).alerta)
            return false;
        return true;
    });

    // === As 5 movimentações mais recentes (a data vem como "2026-11-08T10:00:00", então dá para comparar como texto) ===
    const ultimasMovimentacoes = [...listaMovimentacoes]
        .sort((a, b) => (b.dataMovimentacaoEstoque ?? "").localeCompare(a.dataMovimentacaoEstoque ?? ""))
        .slice(0, 5);

    return(
            <div className={styles.pageContainer}>
                <div className={`${styles.header} ${styles.headerLinha}`}>
                    <div>
                        <h1 className={styles.pageTitulo}>Estoque</h1>
                        <p className={styles.pageSubtitle}>Saldo atual dos itens e avisos de validade</p>
                    </div>
                    <div className={styles.atalhos}>
                        <Link href="/forms/movimentoEstoque" className={styles.btnAtalho}>+ Lançar movimentação</Link>
                        <Link href="/forms/itemEstoque" className={styles.btnAtalhoSecundario}>+ Cadastrar item</Link>
                    </div>
                </div>

                {/* Cards de resumo */}
                <div className={styles.resumo}>
                    <div className={styles.cardResumo}>
                        <p className={styles.cardNumero}>{listaItens.length}</p>
                        <p className={styles.cardLegenda}>Itens cadastrados</p>
                    </div>
                    <div className={styles.cardResumo}>
                        <p className={styles.cardNumero}>{totalUnidades}</p>
                        <p className={styles.cardLegenda}>Unidades em estoque</p>
                    </div>
                    <div className={`${styles.cardResumo} ${semEstoque > 0 ? styles.cardResumoAlerta : ""}`}>
                        <p className={styles.cardNumero}>{semEstoque}</p>
                        <p className={styles.cardLegenda}>Sem estoque</p>
                    </div>
                    <div className={`${styles.cardResumo} ${comAlertaValidade > 0 ? styles.cardResumoAlerta : ""}`}>
                        <p className={styles.cardNumero}>{comAlertaValidade}</p>
                        <p className={styles.cardLegenda}>Vencidos ou vencendo em {DIAS_AVISO_VALIDADE} dias</p>
                    </div>
                </div>

                {/* Filtros da tabela */}
                <div className={styles.filtros}>
                    <input className={styles.inputField} type="text" placeholder="Buscar item pelo nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                    <select className={styles.inputField} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option value="">Todas as categorias</option>
                        <option value="MANUTENCAO">Manutenção</option>
                        <option value="COZINHA">Cozinha</option>
                        <option value="INTERCESSAO">Intercessão</option>
                        <option value="SECRETARIA">Secretaria</option>
                        <option value="BAR">Bar</option>
                        <option value="ORDEM">Ordem</option>
                        <option value="RECREACAO">Recreação</option>
                    </select>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" checked={soAlertas} onChange={(e) => setSoAlertas(e.target.checked)} />
                        Só itens com alerta
                    </label>
                </div>

                {itensFiltrados.length === 0 ? (
                    <p className={styles.vazio}>Nenhum item encontrado.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Categoria</th>
                                    <th>Tipo</th>
                                    <th>Quantidade</th>
                                    <th>Validade</th>
                                    <th>Situação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensFiltrados.map(item => {
                                    const situacao = situacaoItem(item);
                                    return (
                                        <tr key={item.idItemEstoque}>
                                            <td>{item.nomeItemEstoque}</td>
                                            <td>{formatarTexto(item.categoriaItemEstoque)}</td>
                                            <td>{formatarTexto(item.tipoItemEstoque)}</td>
                                            <td>{item.qtdeItemEstoque}</td>
                                            <td>{formatarData(item.dataValidadeItemEstoque)}</td>
                                            <td><span className={`${styles.status} ${situacao.classe}`}>{situacao.texto}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Últimas movimentações */}
                <h2 className={styles.secaoTitulo}>Últimas movimentações</h2>
                {ultimasMovimentacoes.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma movimentação lançada ainda.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Tipo</th>
                                    <th>Item</th>
                                    <th>Qtde</th>
                                    <th>Responsável</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ultimasMovimentacoes.map(movimentacao => (
                                    <tr key={movimentacao.idMovimentacaoEstoque}>
                                        <td>{formatarData(movimentacao.dataMovimentacaoEstoque)}</td>
                                        <td>{formatarTexto(movimentacao.tipoMovimentacaoEstoque)}</td>
                                        <td>{movimentacao.itemEstoque?.nomeItemEstoque}</td>
                                        <td>{movimentacao.qtdeMovimentacaoEstoque}</td>
                                        <td>{movimentacao.usuario?.nomeUsuario}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className={styles.filtros} style={{ marginTop: "0.75rem" }}>
                    <Link href="/views/movimentoEstoque" className={styles.btnAtalhoSecundario}>Ver todas as movimentações</Link>
                </div>

            </div>
    );
}

export default function Estoque(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <VisaoGeralEstoque />
        </ProtectedRoute>
    );
}
