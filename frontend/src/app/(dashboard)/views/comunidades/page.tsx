"use client";

import { useState, useEffect } from "react";
import styles from "./comunidades.module.css";
import { Comunidade } from "@/types/comunidade";
import { HorarioMissa } from "@/types/horarioMissa";
import { comunidadeService } from "@/services/comunidadeService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatarTelefone } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA'];

const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];


function ListaComunidades(){

    const [listaComunidades, setListaComunidades] = useState<Comunidade[]>([]);

    const [comunidadeEditando, setComunidadeEditando] = useState<Comunidade | null>(null);

    // foto nova é opcional: se não escolher nenhuma, o backend mantém a atual
    const [novaFoto, setNovaFoto] = useState<File | null>(null);

    async function carregarComunidades(){
        try{
            const dados = await comunidadeService.listarComunidades();
            setListaComunidades(dados);
        }catch(error){
            alert("Erro ao buscar as comunidades: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarComunidades();
    }, []);


    const handleExcluir = async (comunidade: Comunidade) => {
        if(!confirm("Deseja excluir a comunidade " + comunidade.nomeComunidade + "?"))
            return;
        try{
            await comunidadeService.deletarComunidade(comunidade.idComunidade);
            await carregarComunidades();
        }catch(error){
            alert("Erro ao excluir a comunidade: " + (error as Error).message);
        }
    };


    function abrirAlteracao(comunidade: Comunidade){
        setComunidadeEditando({ ...comunidade, horariosMissa: comunidade.horariosMissa ?? [] });
        setNovaFoto(null);
    }

    function fecharAlteracao(){
        setComunidadeEditando(null);
        setNovaFoto(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const valor = name === 'contatoComunidade' ? formatarTelefone(value) : value;
        setComunidadeEditando(prev => (prev ? { ...prev, [name]: valor } : prev));
    };

    // === Horários de missa: adicionar, alterar e remover linhas da lista ===
    function adicionarHorario(){
        setComunidadeEditando(prev => (prev ? { ...prev, horariosMissa: [...(prev.horariosMissa ?? []), { semanaMissa: '', horarioMissa: '' }] } : prev));
    }

    function removerHorario(posicao: number){
        setComunidadeEditando(prev => (prev ? { ...prev, horariosMissa: (prev.horariosMissa ?? []).filter((_, i) => i !== posicao) } : prev));
    }

    function alterarHorario(posicao: number, campo: keyof HorarioMissa, valor: string){
        setComunidadeEditando(prev => {
            if(!prev)
                return prev;
            const horarios = [...(prev.horariosMissa ?? [])];
            horarios[posicao] = { ...horarios[posicao], [campo]: valor };
            return { ...prev, horariosMissa: horarios };
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!comunidadeEditando)
            return;
        try{
            await comunidadeService.alterarComunidade(comunidadeEditando.idComunidade, comunidadeEditando, novaFoto);
            await carregarComunidades();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar a comunidade: " + (error as Error).message);
        }
    };

    // Mostra os horários em uma linha: "Domingo 08:00, Sábado 19:00"
    function textoHorarios(comunidade: Comunidade){
        if(!comunidade.horariosMissa || comunidade.horariosMissa.length === 0)
            return "-";
        return comunidade.horariosMissa.map(h => h.semanaMissa + " " + h.horarioMissa.substring(0, 5)).join(", ");
    }

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Comunidades</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua as comunidades e seus horários de missa</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {comunidadeEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar comunidade</h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nome</label>
                                <input className={styles.inputField} type="text" name="nomeComunidade" value={comunidadeEditando.nomeComunidade ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Contato</label>
                                <input className={styles.inputField} type="text" name="contatoComunidade" value={comunidadeEditando.contatoComunidade ?? ""} onChange={handleChange} placeholder="(00) 00000-0000" />
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Endereço</label>
                                <input className={styles.inputField} type="text" name="enderecoComunidade" value={comunidadeEditando.enderecoComunidade ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Nova foto</label>
                                <input
                                    className={styles.inputField}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNovaFoto(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                                />
                                <span className={styles.fieldHint}>Deixe vazio para manter a foto atual.</span>
                            </div>

                            <div className={styles.fieldGroupFull}>
                                <label className={styles.fieldLabel}>Horários de missa</label>

                                {(comunidadeEditando.horariosMissa ?? []).map((horario, posicao) => (
                                    <div key={posicao} className={styles.horarioLinha}>
                                        <select className={styles.inputField} value={horario.semanaMissa} onChange={(e) => alterarHorario(posicao, 'semanaMissa', e.target.value)} required>
                                            <option value="">Dia da semana...</option>
                                            {diasSemana.map(dia => (
                                                <option key={dia} value={dia}>{dia}</option>
                                            ))}
                                        </select>
                                        <input className={styles.inputField} type="time" value={horario.horarioMissa} onChange={(e) => alterarHorario(posicao, 'horarioMissa', e.target.value)} required />
                                        <button type="button" className={styles.btnExcluir} onClick={() => removerHorario(posicao)}>Remover</button>
                                    </div>
                                ))}

                                <div>
                                    <button type="button" className={styles.btnAlterar} onClick={adicionarHorario}>+ Adicionar horário</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaComunidades.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma comunidade encontrada.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Endereço</th>
                                    <th>Contato</th>
                                    <th>Missas</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaComunidades.map(comunidade => (
                                    <tr key={comunidade.idComunidade}>
                                        <td>{comunidade.nomeComunidade}</td>
                                        <td>{comunidade.enderecoComunidade}</td>
                                        <td>{comunidade.contatoComunidade}</td>
                                        <td>{textoHorarios(comunidade)}</td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(comunidade)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(comunidade)}>Excluir</button>
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

export default function VisualizarComunidades(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaComunidades />
        </ProtectedRoute>
    );
}
