"use client"

import { useState, useEffect } from "react";
import styles from "./formularios.module.css";
import { Formulario, CriarFormulario } from "@/types/formulario";
import { AcampamentoPublico } from "@/types/acampamento";
import { formularioService } from "@/services/formularioService";
import { acampamentoService } from "@/services/acampamentoService";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];

function VisualizarFormularios(){

    const [listaFormularios, setListaFormularios] = useState<Formulario[]>([]);
    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);

    const [idEditando, setIdEditando] = useState<number | null>(null); // id do formulário que está sendo alterado (null = nenhum)
    const [formData, setFormData] = useState<CriarFormulario | null>(null); // dados do formulário de alteração

    async function carregarFormularios(){
        try{
            const dados = await formularioService.listarFormularios();
            setListaFormularios(dados);
        }catch(error){
            alert("Erro ao buscar os formulários: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        async function carregarAcampamentos(){
            try{
                const dados = await acampamentoService.listarAcampamentosPublicos();
                setListaAcampamentos(dados);
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarFormularios();
        carregarAcampamentos();
    }, []);

    // copia os dados do card para o formulário de alteração
    // as datas vêm do banco com horário (2026-10-01T00:00:00...), o input date só aceita "2026-10-01"
    function abrirAlteracao(formulario: Formulario){
        setIdEditando(Number(formulario.idFormulario));
        setFormData({
            tituloFormulario: formulario.tituloFormulario,
            tipoFormulario: formulario.tipoFormulario,
            dataInicioFormulario: formulario.dataInicioFormulario.slice(0, 10),
            dataFimFormulario: formulario.dataFimFormulario.slice(0, 10),
            capacidadeFormulario: formulario.capacidadeFormulario,
            acampamento: { idAcampamento: Number(formulario.acampamento.idAcampamento) },
        });
        window.scrollTo({ top: 0, behavior: "smooth" }); // o formulário de alteração fica no topo da página
    }

    function fecharAlteracao(){
        setIdEditando(null);
        setFormData(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "acampamento") {
            setFormData(prev => (prev ? { ...prev, acampamento: { idAcampamento: Number(value) } } : prev));
            return;
        }
        if (name === "capacidadeFormulario") {
            setFormData(prev => (prev ? { ...prev, capacidadeFormulario: Number(value) } : prev)); // o input devolve texto, o banco espera número
            return;
        }
        setFormData(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(idEditando === null || !formData)
            return;
        try{
            const mensagem = await formularioService.alterarFormulario(idEditando, formData);
            await carregarFormularios();
            fecharAlteracao();
            alert(mensagem);
        }catch(error){
            alert("Erro ao alterar o formulário: " + (error as Error).message);
        }
    };

    return(
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitulo}>Formulários</h1>
                <p className={styles.pageSubtitle}>Lista de todos os formulários disponíveis</p>
            </div>

            {/* Formulário de alteração: só aparece depois de clicar em "Alterar" em algum card */}
            {formData && (
                <form className={styles.formCard} onSubmit={handleSubmit}>
                    <h2 className={styles.formTitulo}>Alterar formulário</h2>

                    <div className={styles.grid2Col}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="tituloFormulario">Título *</label>
                            <input className={styles.inputField} id="tituloFormulario" name="tituloFormulario" type="text" value={formData.tituloFormulario} onChange={handleChange} required />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="tipoFormulario">Tipo *</label>
                            <select className={styles.inputField} id="tipoFormulario" name="tipoFormulario" value={formData.tipoFormulario} onChange={handleChange} required>
                                <option value="CAMPISTA">Campista</option>
                                <option value="SERVO">Servo</option>
                            </select>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="acampamento">Acampamento *</label>
                            <select className={styles.inputField} id="acampamento" name="acampamento" value={formData.acampamento.idAcampamento} onChange={handleChange} required>
                                {listaAcampamentos.map(acampamento => (
                                    <option key={acampamento.idAcampamento} value={acampamento.idAcampamento}>{acampamento.nomeAcampamento}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="capacidadeFormulario">Capacidade de inscritos *</label>
                            <input className={styles.inputField} id="capacidadeFormulario" name="capacidadeFormulario" type="number" min={1} value={formData.capacidadeFormulario || ""} onChange={handleChange} required />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="dataInicioFormulario">Data de Início *</label>
                            <input className={styles.inputField} id="dataInicioFormulario" name="dataInicioFormulario" type="date" value={formData.dataInicioFormulario} onChange={handleChange} required />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel} htmlFor="dataFimFormulario">Data de Fim *</label>
                            <input className={styles.inputField} id="dataFimFormulario" name="dataFimFormulario" type="date" value={formData.dataFimFormulario} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button className={styles.btnCancel} type="button" onClick={fecharAlteracao}>Cancelar</button>
                        <button className={styles.btnSubmit} type="submit">Salvar alterações</button>
                    </div>
                </form>
            )}

            {listaFormularios.length === 0 ? (
                <p className={styles.vazio}>Nenhum formulário encontrado.</p>
            ):(
                <div className={styles.listaCards}>
                    {listaFormularios.map(formulario => (
                        <div key={formulario.idFormulario} className={styles.card}>
                            <h2 className={styles.cardTitle}>{formulario.tituloFormulario}</h2>
                            <span className={styles.badge}>{formulario.tipoFormulario}</span>

                            <p className={styles.cardInfo}><strong>Acampamento:</strong> {formulario.acampamento.nomeAcampamento}</p>
                            <p className={styles.cardInfo}><strong>Data de Início:</strong> {new Date(formulario.dataInicioFormulario).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                            <p className={styles.cardInfo}><strong>Data de Fim:</strong> {new Date(formulario.dataFimFormulario).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                            <p className={styles.cardInfo}><strong>Capacidade:</strong> {formulario.capacidadeFormulario ?? "Sem limite"}</p>

                            <div className={styles.cardAcoes}>
                                <Link href={`/forms/pergunta/${formulario.idFormulario}`} className={styles.btnPrimario}>Perguntas</Link>
                                <Link href={`/views/formulariosPerguntasRespostas/${formulario.idFormulario}`} className={styles.btnSecundario}>Respostas</Link>
                                <button type="button" className={styles.btnSecundario} onClick={() => abrirAlteracao(formulario)}>Alterar</button>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}


export default function ViewsFormularios(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <VisualizarFormularios />
        </ProtectedRoute>
    );
}
