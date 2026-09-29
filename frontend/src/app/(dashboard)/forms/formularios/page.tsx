"use client";

import { useState, useEffect } from "react";
import styles from "./formularios.module.css";
import { CriarFormulario } from "@/types/formulario";
import { Acampamento } from "@/types/acampamento";
import { acampamentoService } from "@/services/acampamentoService";
import { formularioService } from "@/services/formularioService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";


export default function NovoFormulario() {
    const [formData, setFormData] = useState<CriarFormulario>({
        tituloFormulario: "",
        tipoFormulario: "CAMPISTA",
        dataInicioFormulario: "",
        dataFimFormulario: "",
        acampamento: { idAcampamento: 0 },
    });
    const [listaAcampamentos, setListaAcampamentos] = useState<Acampamento[]>([]);

    useEffect(() => {

        async function carregarAcampamentos() {
            try {
                const dados = await acampamentoService.listarAcampamentos();
                setListaAcampamentos(dados);
            } catch (error) {
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }

        carregarAcampamentos();

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "acampamento") {
            setFormData(prev => ({ ...prev, acampamento: { idAcampamento: Number(value) } })); // Atualiza o id do acampamento no estado
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value })); // Ele atualiza o estado do formulário com os novos valores
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await formularioService.criarFormulario(formData);
            alert("Formulário criado com sucesso!");
            setFormData({
                tituloFormulario: "",
                tipoFormulario: "CAMPISTA",
                dataInicioFormulario: "",
                dataFimFormulario: "",
                acampamento: { idAcampamento: 0 },
            });
        } catch (error) {
            alert("Erro ao criar o formulário: " + (error as Error).message);
        }
    };

    return (
        <ProtectedRoute niveisPermitidos={['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO']}>

            <div className={styles.pageContainer}>

                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Novo Formulário</h1>
                    <p className={styles.pageSubtitle}>Por favor, preencha os campos abaixo para criar um novo formulário.</p>
                </div>

                <form className={styles.formCard} onSubmit={handleSubmit}>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="tituloFormulario">Título *</label>
                        <input
                            className={styles.inputField}
                            id="tituloFormulario"
                            name="tituloFormulario"
                            type="text"
                            value={formData.tituloFormulario}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="tipoFormulario">Tipo *</label>
                        <select
                            className={styles.inputField}
                            id="tipoFormulario" 
                            name="tipoFormulario"
                            value={formData.tipoFormulario}
                            onChange={handleChange} required
                            >

                            <option value = "CAMPISTA">Campista</option>
                            <option value = "SERVO">Servo</option>
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="acampamento">Acampamento *</label>
                        <select
                            className={styles.inputField}
                            id="acampamento"
                            name="acampamento"
                            value={formData.acampamento.idAcampamento}
                            onChange={handleChange}
                            required
                            >
                            <option value="">Selecione um acampamento...</option>
                            {listaAcampamentos.map(acampamento => (
                                <option key={acampamento.idAcampamento} value={acampamento.idAcampamento}>
                                    {acampamento.nomeAcampamento}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h3 className={styles.sectionTitle}>Período do Formulário</h3>
                    <div className = {styles.grid2Col}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="dataInicioFormulario">Data de Início *</label>
                            <input
                                className={styles.inputField}
                                id="dataInicioFormulario"
                                name="dataInicioFormulario"
                                type="date"
                                value={formData.dataInicioFormulario}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="dataFimFormulario">Data de Fim *</label>
                            <input
                                className={styles.inputField}
                                id="dataFimFormulario"
                                name="dataFimFormulario"
                                type="date"
                                value={formData.dataFimFormulario}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.btnSubmit} type="submit">Salvar Formulário</button>
                    </div>

                </form>

            </div>
        </ProtectedRoute>
    );
}