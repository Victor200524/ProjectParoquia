"use client";

import { useState, useEffect } from "react";
import styles from "./itemEstoque.module.css";
import { ItemEstoque } from "@/types/itemEstoque";
import { itemEstoqueService } from "@/services/itemEstoqueService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { dataParaInput, formatarData, formatarTexto } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];


function ListaItensEstoque(){

    const [listaItens, setListaItens] = useState<ItemEstoque[]>([]);

    const [itemEditando, setItemEditando] = useState<ItemEstoque | null>(null);

    async function carregarItens(){
        try{
            const dados = await itemEstoqueService.listarItemEstoque();
            setListaItens(dados);
        }catch(error){
            alert("Erro ao buscar os itens do estoque: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarItens();
    }, []);


    const handleExcluir = async (item: ItemEstoque) => {
        if(!confirm("Deseja excluir o item " + item.nomeItemEstoque + "?"))
            return;
        try{
            await itemEstoqueService.deletarItemEstoque(item.idItemEstoque!);
            await carregarItens();
        }catch(error){
            alert("Erro ao excluir o item: " + (error as Error).message);
        }
    };


    function abrirAlteracao(item: ItemEstoque){
        setItemEditando({ ...item, dataValidadeItemEstoque: dataParaInput(item.dataValidadeItemEstoque) });
    }

    function fecharAlteracao(){
        setItemEditando(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItemEditando(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!itemEditando)
            return;
        try{
            // a quantidade não é alterada aqui: o backend mantém a do banco (ela só muda pelas movimentações)
            await itemEstoqueService.alterarItemEstoque(itemEditando.idItemEstoque!, itemEditando);
            await carregarItens();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar o item: " + (error as Error).message);
        }
    };

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Itens do Estoque</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua os itens. A quantidade muda só pelas movimentações do estoque.</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {itemEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar item</h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nome</label>
                                <input className={styles.inputField} type="text" name="nomeItemEstoque" value={itemEditando.nomeItemEstoque ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Categoria</label>
                                <select className={styles.inputField} name="categoriaItemEstoque" value={itemEditando.categoriaItemEstoque ?? ""} onChange={handleChange} required>
                                    <option value="MANUTENCAO">Manutenção</option>
                                    <option value="COZINHA">Cozinha</option>
                                    <option value="INTERCESSAO">Intercessão</option>
                                    <option value="SECRETARIA">Secretaria</option>
                                    <option value="BAR">Bar</option>
                                    <option value="ORDEM">Ordem</option>
                                    <option value="RECREACAO">Recreação</option>
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Tipo</label>
                                <select className={styles.inputField} name="tipoItemEstoque" value={itemEditando.tipoItemEstoque ?? ""} onChange={handleChange} required>
                                    <option value="PERECIVEL">Perecível</option>
                                    <option value="NAO_PERECIVEL">Não perecível</option>
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Validade</label>
                                <input className={styles.inputField} type="date" name="dataValidadeItemEstoque" value={itemEditando.dataValidadeItemEstoque ?? ""} onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaItens.length === 0 ? (
                    <p className={styles.vazio}>Nenhum item encontrado.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Categoria</th>
                                    <th>Tipo</th>
                                    <th>Quantidade</th>
                                    <th>Validade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaItens.map(item => (
                                    <tr key={item.idItemEstoque}>
                                        <td>{item.nomeItemEstoque}</td>
                                        <td>{formatarTexto(item.categoriaItemEstoque)}</td>
                                        <td>{formatarTexto(item.tipoItemEstoque)}</td>
                                        <td>{item.qtdeItemEstoque}</td>
                                        <td>{formatarData(item.dataValidadeItemEstoque)}</td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(item)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(item)}>Excluir</button>
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

export default function VisualizarItensEstoque(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaItensEstoque />
        </ProtectedRoute>
    );
}
