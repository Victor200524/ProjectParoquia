"use client";

import { useState, useEffect } from "react";
import styles from "./movimentoEstoque.module.css";
import { MovimentacaoEstoque } from "@/types/movimentoEstoque";
import { movimentoEstoqueService } from "@/services/movimentoEstoqueService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatarData, formatarTexto } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];


function ListaMovimentacoes(){

    const [listaMovimentacoes, setListaMovimentacoes] = useState<MovimentacaoEstoque[]>([]);

    // Na alteração só dá para mudar a quantidade e a observação;
    // para trocar o tipo ou o item, é só excluir e lançar de novo
    const [movimentacaoEditando, setMovimentacaoEditando] = useState<MovimentacaoEstoque | null>(null);

    async function carregarMovimentacoes(){
        try{
            const dados = await movimentoEstoqueService.listarMovimentoEstoque();
            setListaMovimentacoes(dados);
        }catch(error){
            alert("Erro ao buscar as movimentações: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarMovimentacoes();
    }, []);


    const handleExcluir = async (movimentacao: MovimentacaoEstoque) => {
        if(!confirm("Deseja excluir esta movimentação? O saldo do item será desfeito."))
            return;
        try{
            await movimentoEstoqueService.deletarMovimentoEstoque(movimentacao.idMovimentacaoEstoque!);
            await carregarMovimentacoes();
        }catch(error){
            alert("Erro ao excluir a movimentação: " + (error as Error).message);
        }
    };


    function abrirAlteracao(movimentacao: MovimentacaoEstoque){
        setMovimentacaoEditando(movimentacao);
    }

    function fecharAlteracao(){
        setMovimentacaoEditando(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setMovimentacaoEditando(prev => (prev ? { ...prev, [name]: type === 'number' ? Number(value) : value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!movimentacaoEditando)
            return;

        // manda só os ids dos objetos ligados, do mesmo jeito que o cadastro faz
        const dados = {
            tipoMovimentacaoEstoque: movimentacaoEditando.tipoMovimentacaoEstoque,
            qtdeMovimentacaoEstoque: movimentacaoEditando.qtdeMovimentacaoEstoque,
            dataMovimentacaoEstoque: movimentacaoEditando.dataMovimentacaoEstoque,
            obsMovimentacaoEstoque: movimentacaoEditando.obsMovimentacaoEstoque,
            itemEstoque: { idItemEstoque: movimentacaoEditando.itemEstoque.idItemEstoque! },
            usuario: { idUsuario: movimentacaoEditando.usuario?.idUsuario ?? 0 },
            acampamento: movimentacaoEditando.acampamento ? { idAcampamento: movimentacaoEditando.acampamento.idAcampamento! } : null,
            acampamentoDestino: movimentacaoEditando.acampamentoDestino ? { idAcampamento: movimentacaoEditando.acampamentoDestino.idAcampamento! } : null
        };

        try{
            await movimentoEstoqueService.alterarMovimentoEstoque(movimentacaoEditando.idMovimentacaoEstoque!, dados);
            await carregarMovimentacoes();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar a movimentação: " + (error as Error).message);
        }
    };

    // Ex.: "Acampamento A → Acampamento B" na transferência, ou só o nome nos outros tipos
    function textoAcampamento(movimentacao: MovimentacaoEstoque){
        const origem = movimentacao.acampamento?.nomeAcampamento ?? "-";
        if(movimentacao.acampamentoDestino)
            return origem + " → " + movimentacao.acampamentoDestino.nomeAcampamento;
        return origem;
    }

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Movimentações do Estoque</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua as movimentações. O saldo dos itens é ajustado automaticamente.</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {movimentacaoEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>
                            Alterar {formatarTexto(movimentacaoEditando.tipoMovimentacaoEstoque).toLowerCase()} de {movimentacaoEditando.itemEstoque?.nomeItemEstoque}
                        </h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Quantidade</label>
                                <input className={styles.inputField} type="number" min="1" name="qtdeMovimentacaoEstoque" value={movimentacaoEditando.qtdeMovimentacaoEstoque ?? 0} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Observação</label>
                                <textarea className={styles.inputField} rows={3} name="obsMovimentacaoEstoque" value={movimentacaoEditando.obsMovimentacaoEstoque ?? ""} onChange={handleChange} />
                                <span className={styles.fieldHint}>Para trocar o tipo, o item ou o acampamento, exclua e lance a movimentação de novo.</span>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaMovimentacoes.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma movimentação encontrada.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Tipo</th>
                                    <th>Item</th>
                                    <th>Qtde</th>
                                    <th>Acampamento</th>
                                    <th>Responsável</th>
                                    <th>Observação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaMovimentacoes.map(movimentacao => (
                                    <tr key={movimentacao.idMovimentacaoEstoque}>
                                        <td>{formatarData(movimentacao.dataMovimentacaoEstoque)}</td>
                                        <td>{formatarTexto(movimentacao.tipoMovimentacaoEstoque)}</td>
                                        <td>{movimentacao.itemEstoque?.nomeItemEstoque}</td>
                                        <td>{movimentacao.qtdeMovimentacaoEstoque}</td>
                                        <td>{textoAcampamento(movimentacao)}</td>
                                        <td>{movimentacao.usuario?.nomeUsuario}</td>
                                        <td>{movimentacao.obsMovimentacaoEstoque}</td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(movimentacao)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(movimentacao)}>Excluir</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
    );
}

export default function VisualizarMovimentacoes(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaMovimentacoes />
        </ProtectedRoute>
    );
}
