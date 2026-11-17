"use client";

import { useState } from "react";
import styles from "./pastorais.module.css";
import { pastoralService } from "@/services/pastoralService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA'];


function CadastroPastoral(){

    const [nomePastoral, setNomePastoral] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await pastoralService.cadastrarPastoral({ nomePastoral });
            alert("Pastoral cadastrada com sucesso!");
            setNomePastoral("");
        }catch(error){
            alert("Erro ao cadastrar a pastoral: " + (error as Error).message);
        }
    };

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Nova Pastoral</h1>
                    <p className={styles.pageSubtitle}>Cadastre as pastorais da paróquia</p>
                </div>

                <form className={styles.formCard} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="nomePastoral">Nome da pastoral *</label>
                        <input
                            className={styles.inputField}
                            id="nomePastoral"
                            type="text"
                            placeholder="Ex: Pastoral da Juventude"
                            value={nomePastoral}
                            onChange={(e) => setNomePastoral(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => setNomePastoral("")}>Limpar</button>
                        <button type="submit" className={styles.btnSubmit}>Salvar Pastoral</button>
                    </div>
                </form>
            </div>
    );
}

export default function FormsPastorais(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <CadastroPastoral />
        </ProtectedRoute>
    );
}
