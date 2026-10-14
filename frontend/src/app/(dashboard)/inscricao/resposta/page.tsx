"use client"

import { useState, useEffect } from "react";
import styles from "./resposta.module.css";
import { Resposta } from "@/types/resposta";
import { Formulario } from "@/types/formulario";
import { respostaService } from "@/services/respostaService";
import { formularioService } from "@/services/formularioService";
import { InscricaoAcampamento } from "@/types/inscricaoAcampamento";
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";
import Link from "next/link";


export default function ResponderFormulario(){

    const [listaFormularios, setListaFormularios] = useState<Formulario[]>([]);
    const [minhasInscricoes, setMinhasInscricoes] = useState<InscricaoAcampamento[]>([]); // inscrições do usuário logado

    useEffect(()=>{
        async function carregarFormularios(){
            try{
                const dados = await formularioService.listarFormularios();
                const hoje = new Date().toLocaleDateString('sv-SE');
                const abertos = dados.filter(formulario => formulario.dataInicioFormulario.slice(0, 10) <= hoje && formulario.dataFimFormulario.slice(0, 10) >= hoje);
                setListaFormularios(abertos);

                const idUsuarioLogado = Number(localStorage.getItem('idUsuario'));
                const dadosInscricoes = await inscricaoAcampamentoService.listarInscricoes();
                const doUsuario = dadosInscricoes.filter(inscricao => inscricao.usuario.idUsuario === idUsuarioLogado);
                setMinhasInscricoes(doUsuario);
            }catch(error){
                alert("Erro ao buscar os formulários: " + (error as Error).message);
            }
        }
        carregarFormularios();
    }, []);

    // verifica se o usuário logado já se inscreveu no acampamento daquele formulário
    function jaInscrito(formulario: Formulario){
        return minhasInscricoes.some(inscricao => inscricao.acampamento.idAcampamento === formulario.acampamento.idAcampamento);
    }

    return(
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitulo}>Formulários abertos</h1>
                <p className={styles.pageSubtitle}>Lista de todos os formulários disponíveis</p>
            </div>

            {listaFormularios.length === 0 ? (
                <p className={styles.vazio}>Nenhum formulário aberto no momento.</p>
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
                                <Link href={`/inscricao/resposta/${formulario.idFormulario}`} className={styles.btnPrimario}>
                                    {jaInscrito(formulario) ? "Ver minhas respostas" : "Responder"}
                                </Link>
                            </div>

                        </div> 
                    ))}

                </div>
            )}

        </div>
    );
}