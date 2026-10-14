"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./responder.module.css";

// Types
import { Pergunta} from "@/types/pergunta";
import { Resposta } from "@/types/resposta";
import { Formulario } from "@/types/formulario";

// Services
import { respostaService } from "@/services/respostaService";
import { formularioService } from "@/services/formularioService";
import { perguntaService } from "@/services/perguntaService";
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";



export default function ResponderFormulario(){
    const params = useParams();
    const idFormulario = Number(params.idFormulario);

    const [formulario, setFormulario] = useState<Formulario | null>(null);

    const [listaPerguntas, setListaPerguntas] = useState<Pergunta[]>([]);

    const [respostas, setRespostas] = useState<Record<number, string>>({}); // "caderninho": a chave é o idPergunta e o valor é o texto digitado

    const [jaInscrito, setJaInscrito] = useState(false); // quando o usuário já se inscreveu, troca o formulário pelas respostas dele

    const [minhasRespostas, setMinhasRespostas] = useState<Resposta[]>([]); // respostas que o usuário logado já enviou

    async function carregarDados(){
        try{
            const dadosFormulario = await formularioService.buscarFormularioPorId(idFormulario);
            setFormulario(dadosFormulario);

            // verifica se o usuário logado já tem inscrição no acampamento deste formulário
            const idUsuarioLogado = Number(localStorage.getItem('idUsuario'));
            const dadosInscricoes = await inscricaoAcampamentoService.listarInscricoes();
            const minhaInscricao = dadosInscricoes.find(inscricao =>
                inscricao.usuario.idUsuario === idUsuarioLogado &&
                inscricao.acampamento.idAcampamento === dadosFormulario.acampamento.idAcampamento
            );

            // se já se inscreveu, busca as respostas dele para mostrar no lugar do formulário
            if(minhaInscricao){
                const dadosRespostas = await respostaService.listarRespostas();
                const daInscricao = dadosRespostas.filter(resposta => resposta.inscricao.idInscricao === minhaInscricao.idInscricao);
                setMinhasRespostas(daInscricao);
                setJaInscrito(true);
            }

            const dadosPerguntas = await perguntaService.listarPerguntas();
            const doFormulario = dadosPerguntas.filter(pergunta => pergunta.formulario.idFormulario === idFormulario);
            setListaPerguntas(doFormulario);

        }catch(error){
            alert("Erro ao buscar os dados: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarDados();
    }, [idFormulario]);

    const handleChange = (idPergunta: number, valor: string) => {
        setRespostas(prev => ({ ...prev, [idPergunta]: valor }));
    };

    // procura o texto que o usuário respondeu naquela pergunta
    function buscarMinhaResposta(idPergunta: number){
        const resposta = minhasRespostas.find(resposta => resposta.pergunta.idPergunta === idPergunta);
        return resposta ? resposta.textoResposta : "Não respondeu";
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const idUsuarioLogado = localStorage.getItem('idUsuario');
        if(!formulario || !idUsuarioLogado){
            alert("Faça login para responder o formulário.");
            return;
        }

        try{
            // 1º cria a inscrição, pois toda resposta precisa estar ligada a uma inscrição
            const inscricao = await inscricaoAcampamentoService.criarInscricaoAcampamento({
                funcaoAcampamento: formulario.tipoFormulario,
                usuario: { idUsuario: Number(idUsuarioLogado) },
                acampamento: { idAcampamento: Number(formulario.acampamento.idAcampamento) }
            });

            // 2º grava uma resposta para cada pergunta que foi preenchida
            for(const pergunta of listaPerguntas){
                const texto = respostas[pergunta.idPergunta];
                if(texto){
                    await respostaService.criarResposta({
                        textoResposta: texto,
                        dataResposta: new Date().toISOString(),
                        pergunta: { idPergunta: pergunta.idPergunta },
                        inscricao: { idInscricao: Number(inscricao.idInscricao) }
                    });
                }
            }

            await carregarDados(); // recarrega: agora o usuário já está inscrito, então a tela passa a mostrar as respostas dele
        }catch(error){
            alert("Erro ao enviar as respostas: " + (error as Error).message);
        }
    };

    return(
        <div className={styles.pageContainer}>
            <div className={styles.coluna}>

                <div className={styles.cardFormulario}>
                    <h1 className={styles.formularioTitulo}>{formulario?.tituloFormulario}</h1>
                    {formulario && (
                        <p className={styles.formularioInfo}>
                            {formulario.acampamento.nomeAcampamento} · {formulario.tipoFormulario}
                        </p>
                    )}
                    {jaInscrito ? (
                        <p className={styles.avisoObrigatoria}>Você já respondeu este formulário. Veja abaixo as suas respostas.</p>
                    ) : (
                        <p className={styles.avisoObrigatoria}>* Indica uma pergunta obrigatória</p>
                    )}
                </div>

                {/* Quem já se inscreveu não vê o formulário, só as respostas que enviou */}
                {jaInscrito ? (
                    <>
                        {listaPerguntas.map(pergunta => (
                            <div key={pergunta.idPergunta} className={styles.cardPergunta}>
                                <p className={styles.perguntaTexto}>{pergunta.textoPergunta}</p>
                                <p className={styles.respostaTexto}>{buscarMinhaResposta(pergunta.idPergunta)}</p>
                            </div>
                        ))}
                        <Link href="/inscricao/resposta" className={styles.btnVoltar}>Voltar para a lista de formulários</Link>
                    </>
                ) : listaPerguntas.length === 0 ? (
                    <p className={styles.vazio}>Este formulário ainda não tem perguntas.</p>
                ) : (
                    <form className={styles.coluna} onSubmit={handleSubmit}>

                        {listaPerguntas.map(pergunta => (
                            <div key={pergunta.idPergunta} className={styles.cardPergunta}>
                                <p className={styles.perguntaTexto}>
                                    {pergunta.textoPergunta}
                                    {pergunta.condicaoPergunta === 'OBRIGATORIA' && (
                                        <span className={styles.asterisco}>*</span>
                                    )}
                                </p>
                                <textarea
                                    className={`${styles.inputField} ${styles.textAreaField}`}
                                    placeholder="Sua resposta"
                                    value={respostas[pergunta.idPergunta] ?? ""}
                                    onChange={(e) => handleChange(pergunta.idPergunta, e.target.value)}
                                    required={pergunta.condicaoPergunta === 'OBRIGATORIA'}
                                />
                            </div>
                        ))}

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.btnSubmit}>Enviar</button>
                        </div>

                    </form>
                )}

            </div>
        </div>
    );
}
