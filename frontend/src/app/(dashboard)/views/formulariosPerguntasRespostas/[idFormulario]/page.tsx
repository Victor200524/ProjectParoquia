"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./formulariosPerguntasRespostas.module.css";

// Types
import { Resposta } from "@/types/resposta";
import { Pergunta } from "@/types/pergunta";
import { Formulario } from "@/types/formulario";
import { InscricaoAcampamento, InscricaoAcampamentoStatus } from "@/types/inscricaoAcampamento";

// Services
import { respostaService } from "@/services/respostaService";
import { formularioService } from "@/services/formularioService";
import { perguntaService } from "@/services/perguntaService";
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";


export default function VisualizarRespostas(){
    const params = useParams();
    const idFormulario = Number(params.idFormulario);

    const [formulario, setFormulario] = useState<Formulario | null>(null);
    const [listaPerguntas, setListaPerguntas] = useState<Pergunta[]>([]);
    const [listaRespostas, setListaRespostas] = useState<Resposta[]>([]);
    const [listaInscricoes, setListaInscricoes] = useState<InscricaoAcampamento[]>([]); // só as inscrições de quem respondeu este formulário
    const [indiceAtual, setIndiceAtual] = useState(0); // posição, na lista, da pessoa que está aparecendo na tela (0 = primeira)

    async function carregarDados(){
        try{
            const dadosFormulario = await formularioService.buscarFormularioPorId(idFormulario);
            setFormulario(dadosFormulario);

            const dadosPerguntas = await perguntaService.listarPerguntas();
            const perguntasDoFormulario = dadosPerguntas.filter(pergunta => pergunta.formulario.idFormulario === idFormulario);
            setListaPerguntas(perguntasDoFormulario);

            const dadosRespostas = await respostaService.listarRespostas();
            const respostasDoFormulario = dadosRespostas.filter(resposta => resposta.pergunta.formulario.idFormulario === idFormulario);
            setListaRespostas(respostasDoFormulario);

            // fica só com as inscrições que têm pelo menos uma resposta neste formulário
            const dadosInscricoes = await inscricaoAcampamentoService.listarInscricoes();
            const inscricoesDoFormulario = dadosInscricoes.filter(inscricao =>
                respostasDoFormulario.some(resposta => resposta.inscricao.idInscricao === inscricao.idInscricao)
            );
            setListaInscricoes(inscricoesDoFormulario);

        }catch(error){
            alert("Erro ao buscar os dados: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarDados();
    }, [idFormulario]);

    // procura o texto que aquela inscrição respondeu naquela pergunta
    function buscarTextoResposta(idInscricao: number | undefined, idPergunta: number){
        const resposta = listaRespostas.find(resposta =>
            resposta.inscricao.idInscricao === idInscricao && resposta.pergunta.idPergunta === idPergunta
        );
        return resposta ? resposta.textoResposta : "Não respondeu";
    }

    // troca o texto do banco (PAGAMENTO_PENDENTE) por um texto mais amigável
    function formatarStatus(status: InscricaoAcampamentoStatus){
        if(status === 'APROVADO')
            return "Pago · Aprovado";
        if(status === 'PAGAMENTO_PENDENTE')
            return "Pagamento pendente";
        return "Reprovado";
    }

    // escolhe a cor da etiqueta: verde para quem pagou, vermelho para quem não pagou
    function classeStatus(status: InscricaoAcampamentoStatus){
        if(status === 'APROVADO')
            return styles.statusAprovado;
        if(status === 'PAGAMENTO_PENDENTE')
            return styles.statusPendente;
        return styles.statusReprovado;
    }

    const inscricaoAtual = listaInscricoes[indiceAtual]; // a pessoa que está aparecendo agora

    return(
        <div className={styles.pageContainer}>
            <div className={styles.coluna}>

                <div className={styles.cardFormulario}>
                    <h1 className={styles.formularioTitulo}>{formulario?.tituloFormulario}</h1>
                    {formulario && (
                        <p className={styles.formularioInfo}>
                            {formulario.acampamento.nomeAcampamento} · {formulario.tipoFormulario} · {listaInscricoes.length} resposta(s)
                        </p>
                    )}
                    <Link href="/views/formularios" className={styles.btnVoltar}>Voltar para os formulários</Link>
                </div>

                {!inscricaoAtual ? (
                    <p className={styles.vazio}>Ninguém respondeu este formulário ainda.</p>
                ) : (
                    <>
                        {/* Setas para passar de uma pessoa para a outra, igual ao Google Forms */}
                        <div className={styles.navegacao}>
                            <button
                                type="button"
                                className={styles.btnSeta}
                                onClick={() => setIndiceAtual(indiceAtual - 1)}
                                disabled={indiceAtual === 0}
                            >
                                ‹
                            </button>
                            <span className={styles.navegacaoTexto}>{indiceAtual + 1} de {listaInscricoes.length}</span>
                            <button
                                type="button"
                                className={styles.btnSeta}
                                onClick={() => setIndiceAtual(indiceAtual + 1)}
                                disabled={indiceAtual === listaInscricoes.length - 1}
                            >
                                ›
                            </button>
                        </div>

                        <div className={styles.cardInscricao}>
                            <div className={styles.inscritoTopo}>
                                <h2 className={styles.inscritoNome}>{inscricaoAtual.usuario.nomeUsuario}</h2>
                                <span className={`${styles.status} ${classeStatus(inscricaoAtual.statusAprovacao)}`}>
                                    {formatarStatus(inscricaoAtual.statusAprovacao)}
                                </span>
                            </div>
                            <p className={styles.inscritoInfo}>
                                Enviado em {new Date(inscricaoAtual.dataRegistro).toLocaleDateString('pt-BR')}
                            </p>

                            {listaPerguntas.map(pergunta => (
                                <div key={pergunta.idPergunta} className={styles.blocoResposta}>
                                    <p className={styles.perguntaTexto}>{pergunta.textoPergunta}</p>
                                    <p className={styles.respostaTexto}>{buscarTextoResposta(inscricaoAtual.idInscricao, pergunta.idPergunta)}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
