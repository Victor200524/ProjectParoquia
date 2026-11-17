"use client";

import { useState, useEffect } from "react";
import styles from "./acampamento.module.css";
import { Acampamento } from "@/types/acampamento";
import { Comunidade } from "@/types/comunidade";
import { acampamentoService } from "@/services/acampamentoService";
import { comunidadeService } from "@/services/comunidadeService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { dataParaInput, formatarData, formatarDinheiro } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA'];


function ListaAcampamentos(){

    const [listaAcampamentos, setListaAcampamentos] = useState<Acampamento[]>([]);
    const [listaComunidades, setListaComunidades] = useState<Comunidade[]>([]);

    const [acampamentoEditando, setAcampamentoEditando] = useState<Acampamento | null>(null);

    // O token do Mercado Pago nunca volta do backend; se ficar em branco, o backend mantém o atual
    const [novoToken, setNovoToken] = useState("");

    async function carregarAcampamentos(){
        try{
            const dados = await acampamentoService.listarAcampamentos();
            setListaAcampamentos(dados);
        }catch(error){
            alert("Erro ao buscar os acampamentos: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarAcampamentos();

        async function carregarComunidades(){
            try{
                const dados = await comunidadeService.listarComunidades();
                setListaComunidades(dados);
            }catch(error){
                alert("Erro ao buscar as comunidades: " + (error as Error).message);
            }
        }
        carregarComunidades();
    }, []);


    const handleExcluir = async (acampamento: Acampamento) => {
        if(!confirm("Deseja excluir o acampamento " + acampamento.nomeAcampamento + "?"))
            return;
        try{
            await acampamentoService.deletarAcampamento(acampamento.idAcampamento!);
            await carregarAcampamentos();
        }catch(error){
            alert("Erro ao excluir o acampamento: " + (error as Error).message);
        }
    };


    function abrirAlteracao(acampamento: Acampamento){
        // as datas vêm do banco com horário; o input de data só aceita "aaaa-mm-dd"
        setAcampamentoEditando({
            ...acampamento,
            dataInicioAcampamento: dataParaInput(acampamento.dataInicioAcampamento),
            dataFimAcampamento: dataParaInput(acampamento.dataFimAcampamento)
        });
        setNovoToken("");
    }

    function fecharAlteracao(){
        setAcampamentoEditando(null);
        setNovoToken("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // a comunidade vai como objeto, do jeito que o Java espera
        if(name === 'comunidade'){
            setAcampamentoEditando(prev => (prev ? { ...prev, comunidade: { idComunidade: Number(value) } } : prev));
            return;
        }

        setAcampamentoEditando(prev => (prev ? { ...prev, [name]: type === 'number' ? Number(value) : value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!acampamentoEditando)
            return;
        try{
            await acampamentoService.alterarAcampamento(acampamentoEditando.idAcampamento!, { ...acampamentoEditando, tokenMercadoPagoAcampamento: novoToken });
            await carregarAcampamentos();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar o acampamento: " + (error as Error).message);
        }
    };

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Acampamentos</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua os acampamentos cadastrados</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {acampamentoEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar acampamento</h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nome</label>
                                <input className={styles.inputField} type="text" name="nomeAcampamento" value={acampamentoEditando.nomeAcampamento ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Comunidade</label>
                                <select className={styles.inputField} name="comunidade" value={acampamentoEditando.comunidade?.idComunidade ?? ""} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    {listaComunidades.map(comunidade => (
                                        <option key={comunidade.idComunidade} value={comunidade.idComunidade}>{comunidade.nomeComunidade}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Local</label>
                                <input className={styles.inputField} type="text" name="localAcampamento" value={acampamentoEditando.localAcampamento ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Tema / Lema</label>
                                <input className={styles.inputField} type="text" name="temaAcampamento" value={acampamentoEditando.temaAcampamento ?? ""} onChange={handleChange} placeholder="Aparece na capa do quadrante" />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Data de início</label>
                                <input className={styles.inputField} type="date" name="dataInicioAcampamento" value={acampamentoEditando.dataInicioAcampamento ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Data de encerramento</label>
                                <input className={styles.inputField} type="date" name="dataFimAcampamento" value={acampamentoEditando.dataFimAcampamento ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Idade mínima</label>
                                <input className={styles.inputField} type="number" min="0" name="idadeMinAcampamento" value={acampamentoEditando.idadeMinAcampamento ?? 0} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Idade máxima</label>
                                <input className={styles.inputField} type="number" min="0" name="idadeMaxAcampamento" value={acampamentoEditando.idadeMaxAcampamento ?? 0} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Total de vagas</label>
                                <input className={styles.inputField} type="number" min="0" name="vagasAcampamento" value={acampamentoEditando.vagasAcampamento ?? 0} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Taxa (R$)</label>
                                <input className={styles.inputField} type="number" min="0" step="0.01" name="taxaInscricaoAcampamento" value={acampamentoEditando.taxaInscricaoAcampamento ?? 0} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Informações adicionais</label>
                                <textarea className={styles.inputField} rows={3} name="informacoesAcampamento" value={acampamentoEditando.informacoesAcampamento ?? ""} onChange={handleChange} />
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Novo access token do Mercado Pago</label>
                                <input
                                    className={styles.inputField}
                                    type="password"
                                    placeholder="Deixe em branco para manter o token atual"
                                    value={novoToken}
                                    onChange={(e) => setNovoToken(e.target.value)}
                                    autoComplete="off"
                                />
                                <span className={styles.fieldHint}>A foto do acampamento continua a mesma.</span>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaAcampamentos.length === 0 ? (
                    <p className={styles.vazio}>Nenhum acampamento encontrado.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Comunidade</th>
                                    <th>Período</th>
                                    <th>Idade</th>
                                    <th>Vagas</th>
                                    <th>Taxa</th>
                                    <th>Pagamento online</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaAcampamentos.map(acampamento => (
                                    <tr key={acampamento.idAcampamento}>
                                        <td>{acampamento.nomeAcampamento}</td>
                                        <td>{acampamento.comunidade?.nomeComunidade}</td>
                                        <td>{formatarData(acampamento.dataInicioAcampamento)} a {formatarData(acampamento.dataFimAcampamento)}</td>
                                        <td>{acampamento.idadeMinAcampamento} a {acampamento.idadeMaxAcampamento} anos</td>
                                        <td>{acampamento.vagasAcampamento}</td>
                                        <td>{formatarDinheiro(acampamento.taxaInscricaoAcampamento)}</td>
                                        <td>
                                            <span className={`${styles.status} ${acampamento.aceitaPagamentoOnline ? styles.statusOnline : styles.statusInativo}`}>
                                                {acampamento.aceitaPagamentoOnline ? "Sim" : "Não"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(acampamento)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(acampamento)}>Excluir</button>
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

export default function VisualizarAcampamentos(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaAcampamentos />
        </ProtectedRoute>
    );
}
