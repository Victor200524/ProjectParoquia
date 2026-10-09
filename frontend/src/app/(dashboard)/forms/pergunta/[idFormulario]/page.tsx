"use client";

import { useState, useEffect } from "react";
import styles from "./pergunta.module.css";
import { CriarPergunta, Pergunta } from "@/types/pergunta";
import { Formulario } from "@/types/formulario";
import { perguntaService } from "@/services/perguntaService";
import { formularioService } from "@/services/formularioService";
import { useParams } from "next/navigation";


export default function CadastrarPerguntas(){
    const params = useParams();
    const idFormulario = Number(params.idFormulario);

    const [formulario, setFormulario] = useState<Formulario | null>(null);
    const [listaPerguntas, setListaPerguntas] = useState<Pergunta[]>([]);
    const [mostrarPergunta, setMostrarPergunta] = useState(false); // colquei pois serve para controlar quando estou dentro ou fora de um card que estao sendo criado a pergunta
    const [novaPergunta, setNovaPergunta] = useState<CriarPergunta>({
        textoPergunta: "",
        tipoPergunta: "TEXTO",
        condicaoPergunta: "OBRIGATORIA",
        formulario: {
            idFormulario: Number(params.idFormulario)
        }
    })
    
    async function carregarDados(){
        try{
            const dadosFormulario = await formularioService.buscarFormularioPorId(idFormulario);
            setFormulario(dadosFormulario);

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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNovaPergunta(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const condicao = e.target.checked ? "OBRIGATORIA" : "OPCIONAL";
        setNovaPergunta(prev => ({ ...prev, condicaoPergunta: condicao }));
    };

    const handleExcluir = async (idPergunta: number) =>{
        if(!confirm("Deseja excluir a pergunta?"))
            return;
        try{
            await perguntaService.deletarPergunta(idPergunta);
            await carregarDados();
        }catch(error){
            alert("Erro ao excluir a pergunta: " + (error as Error).message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await perguntaService.criarPergunta(novaPergunta);
            await carregarDados(); // recarrega a lista, pois o backend devolve só um texto, não a pergunta criada
            setNovaPergunta(prev => ({ ...prev, textoPergunta: "" }));
            setMostrarPergunta(false);
        } catch (error) {
            alert("Erro ao salvar a pergunta: " + (error as Error).message);
        }
    };

    return(
        <div className={styles.pageContainer}>
            <div className={styles.coluna}>

                <div className={styles.cardFormulario}>
                    <h1 className={styles.formularioTitulo}>{formulario?.tituloFormulario}</h1>
                    {formulario && (
                        <p className={styles.formularioInfo}>
                            {formulario.tipoFormulario} · {new Date(formulario.dataInicioFormulario).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} a {new Date(formulario.dataFimFormulario).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </p>
                    )}
                </div>

                {listaPerguntas.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma pergunta ainda. Adicione a primeira!</p>
                ) : (
                    listaPerguntas.map(pergunta => (
                        <div key={pergunta.idPergunta} className={styles.cardPergunta}>
                            <p className={styles.perguntaTexto}>
                                {pergunta.textoPergunta}
                                {pergunta.condicaoPergunta === 'OBRIGATORIA' && (
                                    <span className={styles.asterisco}>*</span>
                                )}
                            </p>
                            <div className={styles.respostaFalsa}>Resposta curta</div>
                            <div className={styles.rodapePergunta}>
                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(pergunta.idPergunta)}>🗑️</button>
                            </div>
                        </div>
                    ))
                )}

                {!mostrarPergunta && (
                    <button type="button" className={styles.btnAdicionar} onClick={() => setMostrarPergunta(true)}>
                        + Adicionar Pergunta
                    </button>
                )}

                {/* Só mostra quando a pergunta está sendo criada, ou seja, quando o usuário clicou no botão de adicionar pergunta */}
                {mostrarPergunta && (
                    <form className={`${styles.cardPergunta} ${styles.cardPerguntaAtiva}`} onSubmit={handleSubmit}>

                        <textarea
                            className={`${styles.inputField} ${styles.textAreaField}`}
                            name="textoPergunta"
                            placeholder="Digite a pergunta..."
                            value={novaPergunta.textoPergunta}
                            onChange={handleChange}
                            required
                        />

                        <div className={styles.rodapePergunta}>
                            <label className={styles.toggle}>
                                Obrigatória
                                <input
                                    type="checkbox"
                                    checked={novaPergunta.condicaoPergunta === 'OBRIGATORIA'}
                                    onChange={handleToggle}
                                />
                            </label>

                            <button type="button" className={styles.btnCancel} onClick={() => setMostrarPergunta(false)}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>

                    </form>
                )}

            </div>
        </div>
    );
}