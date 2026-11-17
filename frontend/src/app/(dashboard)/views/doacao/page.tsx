"use client";

import { useState, useEffect } from "react";
import styles from "./doacao.module.css";
import { Doacao } from "@/types/doacao";
import { AcampamentoPublico } from "@/types/acampamento";
import { doacaoService } from "@/services/doacaoService";
import { acampamentoService } from "@/services/acampamentoService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { dataParaInput, formatarData, formatarDinheiro, formatarTexto } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];


function ListaDoacoes(){

    const [listaDoacoes, setListaDoacoes] = useState<Doacao[]>([]);
    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);

    const [doacaoEditando, setDoacaoEditando] = useState<Doacao | null>(null);

    async function carregarDoacoes(){
        try{
            const dados = await doacaoService.listarDoacaoes();
            setListaDoacoes(dados);
        }catch(error){
            alert("Erro ao buscar as doações: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarDoacoes();

        async function carregarAcampamentos(){
            try{
                const dados = await acampamentoService.listarAcampamentosPublicos();
                setListaAcampamentos(dados);
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarAcampamentos();
    }, []);


    const handleExcluir = async (doacao: Doacao) => {
        if(!confirm("Deseja excluir a doação " + doacao.nomeDoacao + "?"))
            return;
        try{
            await doacaoService.deletarDoacao(doacao.idDoacao!);
            await carregarDoacoes();
        }catch(error){
            alert("Erro ao excluir a doação: " + (error as Error).message);
        }
    };


    function abrirAlteracao(doacao: Doacao){
        // as datas vêm do banco com horário; o input de data só aceita "aaaa-mm-dd"
        setDoacaoEditando({
            ...doacao,
            dataDoacao: dataParaInput(doacao.dataDoacao),
            dataValidadeDoacao: dataParaInput(doacao.dataValidadeDoacao),
            acampamento: { idAcampamento: doacao.acampamento?.idAcampamento ?? '' }
        });
    }

    function fecharAlteracao(){
        setDoacaoEditando(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // o acampamento vai como objeto, do jeito que o Java espera
        if(name === 'acampamento'){
            setDoacaoEditando(prev => (prev ? { ...prev, acampamento: { idAcampamento: value === '' ? '' : Number(value) } } : prev));
            return;
        }

        setDoacaoEditando(prev => (prev ? { ...prev, [name]: type === 'number' ? Number(value) : value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!doacaoEditando)
            return;
        try{
            await doacaoService.alterarDoacao(doacaoEditando.idDoacao!, doacaoEditando);
            await carregarDoacoes();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar a doação: " + (error as Error).message);
        }
    };

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Doações</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua as doações registradas</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {doacaoEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar doação</h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Item doado</label>
                                <input className={styles.inputField} type="text" name="nomeDoacao" value={doacaoEditando.nomeDoacao ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Doador</label>
                                <input className={styles.inputField} type="text" name="nomeDoador" value={doacaoEditando.nomeDoador ?? ""} onChange={handleChange} />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Tipo</label>
                                <select className={styles.inputField} name="tipoDoacao" value={doacaoEditando.tipoDoacao ?? ""} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    <option value="PERECIVEL">Perecível</option>
                                    <option value="NAO_PERECIVEL">Não perecível</option>
                                    <option value="DINHEIRO">Dinheiro</option>
                                </select>
                            </div>

                            {/* Doação em dinheiro tem valor em R$; doação de produto tem quantidade */}
                            {doacaoEditando.tipoDoacao === 'DINHEIRO' ? (
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Valor (R$)</label>
                                    <input className={styles.inputField} type="number" min="0.01" step="0.01" name="valorDoacao" value={doacaoEditando.valorDoacao ?? ""} onChange={handleChange} required />
                                </div>
                            ) : (
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Quantidade</label>
                                    <input className={styles.inputField} type="number" min="1" name="qtdeDoacao" value={doacaoEditando.qtdeDoacao ?? 0} onChange={handleChange} required />
                                </div>
                            )}

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Data da doação</label>
                                <input className={styles.inputField} type="date" name="dataDoacao" value={doacaoEditando.dataDoacao ?? ""} onChange={handleChange} required />
                            </div>

                            {doacaoEditando.tipoDoacao !== 'DINHEIRO' && (
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Validade</label>
                                    <input className={styles.inputField} type="date" name="dataValidadeDoacao" value={doacaoEditando.dataValidadeDoacao ?? ""} onChange={handleChange} />
                                </div>
                            )}

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Acampamento</label>
                                <select className={styles.inputField} name="acampamento" value={doacaoEditando.acampamento.idAcampamento} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    {listaAcampamentos.map(acampamento => (
                                        <option key={acampamento.idAcampamento} value={acampamento.idAcampamento}>{acampamento.nomeAcampamento}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Descrição</label>
                                <textarea className={styles.inputField} rows={3} name="descricaoDoacao" value={doacaoEditando.descricaoDoacao ?? ""} onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaDoacoes.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma doação encontrada.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Tipo</th>
                                    <th>Qtde / Valor</th>
                                    <th>Doador</th>
                                    <th>Data</th>
                                    <th>Validade</th>
                                    <th>Acampamento</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaDoacoes.map(doacao => (
                                    <tr key={doacao.idDoacao}>
                                        <td>{doacao.nomeDoacao}</td>
                                        <td>{formatarTexto(doacao.tipoDoacao)}</td>
                                        <td>{doacao.tipoDoacao === 'DINHEIRO' ? formatarDinheiro(doacao.valorDoacao) : doacao.qtdeDoacao}</td>
                                        <td>{doacao.nomeDoador}</td>
                                        <td>{formatarData(doacao.dataDoacao)}</td>
                                        <td>{formatarData(doacao.dataValidadeDoacao)}</td>
                                        <td>{doacao.acampamento?.nomeAcampamento}</td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(doacao)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(doacao)}>Excluir</button>
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

export default function VisualizarDoacoes(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaDoacoes />
        </ProtectedRoute>
    );
}
