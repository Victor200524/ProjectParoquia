"use client"

import { useState, useEffect } from "react";
import styles from "./formularios.module.css";
import { Formulario } from "@/types/formulario";
import { formularioService } from "@/services/formularioService";
import Link from "next/link";


export default function VisualizarFormularios(){

    const [listaFormularios, setListaFormularios] = useState<Formulario[]>([]);

    useEffect(()=>{
        async function carregarFormularios(){
            try{
                const dados = await formularioService.listarFormularios();
                setListaFormularios(dados);
                console.log("Dados enviados ao backend: ", dados);
            }catch(error){
                alert("Erro ao buscar os formulários: " + (error as Error).message);
            }
        }
        carregarFormularios();
    }, []);

    return(
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitulo}>Formulários</h1>
                <p className={styles.pageSubtitle}>Lista de todos os formulários disponíveis</p>
            </div>

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

                            <div className={styles.cardAcoes}>
                                <Link href={`/forms/pergunta/${formulario.idFormulario}`} className={styles.btnPrimario}>Perguntas</Link>
                                <Link href={`/views/formulariosPerguntasRespostas/${formulario.idFormulario}`} className={styles.btnSecundario}>Respostas</Link>
                            </div>

                        </div> 
                    ))}

                </div>
            )}

        </div>
    );
}