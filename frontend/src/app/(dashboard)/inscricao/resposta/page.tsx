"use client"

import { useState, useEffect } from "react";
import styles from "./resposta.module.css";
import { Resposta } from "@/types/resposta";
import { Formulario } from "@/types/formulario";
import { respostaService } from "@/services/respostaService";
import { formularioService } from "@/services/formularioService";
import { InscricaoAcampamento } from "@/types/inscricaoAcampamento";
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";
import { EtiquetaStatus, AcoesPagamento, conferirRetornoPagamento } from "@/components/pagamento/PagamentoInscricao";
import Link from "next/link";


export default function ResponderFormulario(){

    const [listaFormularios, setListaFormularios] = useState<Formulario[]>([]);
    const [minhasInscricoes, setMinhasInscricoes] = useState<InscricaoAcampamento[]>([]); // inscrições do usuário logado

    async function carregarMinhasInscricoes(){
        const dadosInscricoes = await inscricaoAcampamentoService.listarMinhasInscricoes();
        setMinhasInscricoes(dadosInscricoes);
    }

    useEffect(()=>{
        async function carregarFormularios(){
            try{
                const dados = await formularioService.listarFormularios();
                const nivel = localStorage.getItem('nivelUsuario');
                const hoje = new Date().toLocaleDateString('sv-SE');
                // campista só vê formulário de campista e servo só de servo; os outros níveis veem todos
                const ehCampistaOuServo = nivel === 'CAMPISTA' || nivel === 'SERVO';
                const abertos = dados.filter(formulario => formulario.dataInicioFormulario.slice(0, 10) <= hoje && formulario.dataFimFormulario.slice(0, 10) >= hoje
                    && (!ehCampistaOuServo || formulario.tipoFormulario === nivel));
                setListaFormularios(abertos);

                await carregarMinhasInscricoes();
            }catch(error){
                alert("Erro ao buscar os formulários: " + (error as Error).message);
            }
        }

        carregarFormularios();
        conferirRetornoPagamento(carregarMinhasInscricoes); // voltando do checkout do Mercado Pago?
    }, []);

    // verifica se o usuário logado já se inscreveu no acampamento daquele formulário
    function jaInscrito(formulario: Formulario){
        return minhasInscricoes.some(inscricao => inscricao.acampamento.idAcampamento === formulario.acampamento.idAcampamento);
    }

    // bateu a capacidade: ninguém mais consegue se inscrever por este formulário
    function esgotado(formulario: Formulario){
        return formulario.capacidadeFormulario != null && (formulario.totalInscritos ?? 0) >= formulario.capacidadeFormulario;
    }

    return(
        <div className={styles.pageContainer}>
            {/* === MINHAS INSCRIÇÕES (status e pagamento) === */}
            {minhasInscricoes.length > 0 && (
                <>
                    <div className={styles.header}>
                        <h1 className={styles.pageTitulo}>Minhas inscrições</h1>
                        <p className={styles.pageSubtitle}>Acompanhe a situação das suas inscrições e faça o pagamento</p>
                    </div>

                    <div className={`${styles.listaCards} ${styles.secaoInscricoes}`}>
                        {minhasInscricoes.map(inscricao => (
                            <div key={inscricao.idInscricao} className={styles.card}>
                                <h2 className={styles.cardTitle}>{inscricao.acampamento.nomeAcampamento}</h2>
                                <EtiquetaStatus status={inscricao.statusAprovacao} />

                                <p className={styles.cardInfo}><strong>Inscrito como:</strong> {inscricao.funcaoAcampamento === 'SERVO' ? "Servo" : "Campista"}</p>
                                <p className={styles.cardInfo}><strong>Data da inscrição:</strong> {new Date(inscricao.dataRegistro).toLocaleDateString('pt-BR')}</p>

                                <div className={styles.cardPagamento}>
                                    <AcoesPagamento inscricao={inscricao} rotaRetorno="/inscricao/resposta" onAtualizar={carregarMinhasInscricoes} />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

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

                            {/* formulário antigo sem capacidade não tem limite, então não mostra as vagas */}
                            {formulario.capacidadeFormulario != null && (
                                <p className={styles.cardInfo}><strong>Vagas:</strong> {formulario.totalInscritos ?? 0} de {formulario.capacidadeFormulario} preenchidas</p>
                            )}

                            <div className={styles.cardAcoes}>
                                {/* quem já se inscreveu continua podendo ver as respostas, mesmo esgotado */}
                                {!jaInscrito(formulario) && esgotado(formulario) ? (
                                    <span className={styles.btnEsgotado}>Esgotado</span>
                                ) : (
                                    <Link href={`/inscricao/resposta/${formulario.idFormulario}`} className={styles.btnPrimario}>
                                        {jaInscrito(formulario) ? "Ver minhas respostas" : "Responder"}
                                    </Link>
                                )}
                            </div>

                        </div> 
                    ))}

                </div>
            )}

        </div>
    );
}