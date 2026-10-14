"use client";

import { useState, useEffect } from "react";
import styles from "./inscricoes.module.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Types
import { InscricaoAcampamento, InscricaoAcampamentoStatus } from "@/types/inscricaoAcampamento";
import { Acampamento } from "@/types/acampamento";

// Services
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";
import { acampamentoService } from "@/services/acampamentoService";

// Só esses níveis podem abrir esta tela
const niveisPermitidos = ['COORDENADOR_GERAL', 'COORDENADOR_ACAMPAMENTO', 'PADRE', 'SECRETARIA'];


export default function VisualizarInscricoes(){

    const [listaInscricoes, setListaInscricoes] = useState<InscricaoAcampamento[]>([]);
    const [listaAcampamentos, setListaAcampamentos] = useState<Acampamento[]>([]);

    const [filtroTipo, setFiltroTipo] = useState("TODOS"); // TODOS, CAMPISTA ou SERVO
    const [filtroAcampamento, setFiltroAcampamento] = useState(0); // id do acampamento escolhido (0 = todos)

    const [equipes, setEquipes] = useState<Record<number, string>>({}); // "caderninho": a chave é o idInscricao e o valor é a equipe digitada

    async function carregarDados(){
        try{
            const dadosInscricoes = await inscricaoAcampamentoService.listarInscricoes();
            setListaInscricoes(dadosInscricoes);

            // preenche o caderninho com a equipe que cada inscrição já tem gravada no banco
            const equipesSalvas: Record<number, string> = {};
            for(const inscricao of dadosInscricoes){
                equipesSalvas[Number(inscricao.idInscricao)] = inscricao.equipeAcampamento ?? "";
            }
            setEquipes(equipesSalvas);

            const dadosAcampamentos = await acampamentoService.listarAcampamentos();
            setListaAcampamentos(dadosAcampamentos);

        }catch(error){
            alert("Erro ao buscar os dados: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarDados();
    }, []);

    // o texto da equipe já fica em maiúsculas enquanto o coordenador digita
    const handleChangeEquipe = (idInscricao: number, valor: string) => {
        setEquipes(prev => ({ ...prev, [idInscricao]: valor.toUpperCase() }));
    };

    const handleSalvarEquipe = async (inscricao: InscricaoAcampamento) => {
        const idInscricao = Number(inscricao.idInscricao);
        try{
            await inscricaoAcampamentoService.alterarEquipe(idInscricao, equipes[idInscricao] ?? "");
            await carregarDados();
            alert("Equipe de " + inscricao.usuario.nomeUsuario + " alterada com sucesso!");
        }catch(error){
            alert("Erro ao salvar a equipe: " + (error as Error).message);
        }
    };

    // fica só com as inscrições que passam nos dois filtros escolhidos
    const inscricoesFiltradas = listaInscricoes.filter(inscricao =>
        (filtroTipo === "TODOS" || inscricao.funcaoAcampamento === filtroTipo) &&
        (filtroAcampamento === 0 || inscricao.acampamento.idAcampamento === filtroAcampamento)
    );

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

    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Inscrições</h1>
                    <p className={styles.pageSubtitle}>Veja quem se inscreveu nos acampamentos e aloque os servos nas equipes</p>
                </div>

                {/* Filtros */}
                <div className={styles.filtros}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Tipo</label>
                        <select className={styles.inputField} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                            <option value="TODOS">Todos</option>
                            <option value="CAMPISTA">Campistas</option>
                            <option value="SERVO">Servos</option>
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Acampamento</label>
                        <select className={styles.inputField} value={filtroAcampamento} onChange={(e) => setFiltroAcampamento(Number(e.target.value))}>
                            <option value={0}>Todos</option>
                            {listaAcampamentos.map(acampamento => (
                                <option key={acampamento.idAcampamento} value={acampamento.idAcampamento}>{acampamento.nomeAcampamento}</option>
                            ))}
                        </select>
                    </div>

                    <p className={styles.contador}>{inscricoesFiltradas.length} inscrição(ões)</p>
                </div>

                {inscricoesFiltradas.length === 0 ? (
                    <p className={styles.vazio}>Nenhuma inscrição encontrada.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Acampamento</th>
                                    <th>Tipo</th>
                                    <th>Status</th>
                                    <th>Data</th>
                                    <th>Equipe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscricoesFiltradas.map(inscricao => (
                                    <tr key={inscricao.idInscricao}>
                                        <td>{inscricao.usuario.nomeUsuario}</td>
                                        <td>{inscricao.acampamento.nomeAcampamento}</td>
                                        <td>{inscricao.funcaoAcampamento === 'SERVO' ? "Servo" : "Campista"}</td>
                                        <td>
                                            <span className={`${styles.status} ${classeStatus(inscricao.statusAprovacao)}`}>
                                                {formatarStatus(inscricao.statusAprovacao)}
                                            </span>
                                        </td>
                                        <td>{new Date(inscricao.dataRegistro).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            {/* Só o servo é alocado em equipe; para o campista não aparece o campo */}
                                            {inscricao.funcaoAcampamento === 'SERVO' ? (
                                                <div className={styles.equipe}>
                                                    <input
                                                        className={styles.inputEquipe}
                                                        type="text"
                                                        placeholder="SEM EQUIPE"
                                                        maxLength={45}
                                                        value={equipes[Number(inscricao.idInscricao)] ?? ""}
                                                        onChange={(e) => handleChangeEquipe(Number(inscricao.idInscricao), e.target.value)}
                                                    />
                                                    <button type="button" className={styles.btnSalvar} onClick={() => handleSalvarEquipe(inscricao)}>Salvar</button>
                                                </div>
                                            ) : (
                                                <span className={styles.semEquipe}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </ProtectedRoute>
    );
}
