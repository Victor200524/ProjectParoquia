"use client";

import { useState, useEffect } from "react";
import styles from "./pastorais.module.css";
import { Pastoral } from "@/types/pastoral";
import { pastoralService } from "@/services/pastoralService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA'];


function ListaPastorais(){

    const [listaPastorais, setListaPastorais] = useState<Pastoral[]>([]);

    const [pastoralEditando, setPastoralEditando] = useState<Pastoral | null>(null);

    async function carregarPastorais(){
        try{
            const dados = await pastoralService.listarPastorais();
            setListaPastorais(dados);
        }catch(error){
            alert("Erro ao buscar as pastorais: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarPastorais();
    }, []);


    const handleExcluir = async (pastoral: Pastoral) => {
        if(!confirm("Deseja excluir a pastoral " + pastoral.nomePastoral + "?"))
            return;
        try{
            await pastoralService.deletarPastoral(pastoral.idPastoral!);
            await carregarPastorais();
        }catch(error){
            alert("Erro ao excluir a pastoral: " + (error as Error).message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!pastoralEditando)
            return;
        try{
            await pastoralService.alterarPastoral(pastoralEditando.idPastoral!, pastoralEditando);
            await carregarPastorais();
            setPastoralEditando(null);
        }catch(error){
            alert("Erro ao alterar a pastoral: " + (error as Error).message);
        }
    };

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Pastorais</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua as pastorais cadastradas</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {pastoralEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar pastoral</h2>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Nome</label>
                            <input
                                className={styles.inputField}
                                type="text"
                                value={pastoralEditando.nomePastoral ?? ""}
                                onChange={(e) => setPastoralEditando({ ...pastoralEditando, nomePastoral: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={() => setPastoralEditando(null)}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaPastorais.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma pastoral encontrada.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaPastorais.map(pastoral => (
                                    <tr key={pastoral.idPastoral}>
                                        <td>{pastoral.nomePastoral}</td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => setPastoralEditando(pastoral)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(pastoral)}>Excluir</button>
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

export default function VisualizarPastorais(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaPastorais />
        </ProtectedRoute>
    );
}
