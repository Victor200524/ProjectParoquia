"use client";

import { useState, useEffect } from "react";
import styles from "./inscricoes.module.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Types
import { InscricaoAcampamento, InscricaoAcampamentoStatus } from "@/types/inscricaoAcampamento";
import { Acampamento, AcampamentoPublico } from "@/types/acampamento";
import { FormaPagamento } from "@/types/pagamento";

// Services
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";
import { acampamentoService } from "@/services/acampamentoService";
import { pagamentoService } from "@/services/pagamentoService";

type FormaManual = Exclude<FormaPagamento, 'MERCADO_PAGO'>; // o coordenador só registra dinheiro ou PIX

// Só esses níveis podem abrir esta tela
const niveisPermitidos = ['COORDENADOR_GERAL', 'COORDENADOR_ACAMPAMENTO', 'PADRE', 'SECRETARIA'];


// Filho: só é montado depois que o ProtectedRoute liberou o acesso,
// assim o useEffect não busca as inscrições antes da checagem de nível
function ListaInscricoes(){

    const [listaInscricoes, setListaInscricoes] = useState<InscricaoAcampamento[]>([]);
    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);

    const [filtroTipo, setFiltroTipo] = useState("TODOS"); // TODOS, CAMPISTA ou SERVO
    const [filtroAcampamento, setFiltroAcampamento] = useState(0); // id do acampamento escolhido (0 = todos)

    const [equipes, setEquipes] = useState<Record<number, string>>({}); // "caderninho": a chave é o idInscricao e o valor é a equipe digitada
    const [formas, setFormas] = useState<Record<number, FormaManual>>({}); // "caderninho" da forma de pagamento escolhida em cada linha
    const [processando, setProcessando] = useState<number | null>(null); // idInscricao com pagamento em andamento (evita clique duplo)

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

            const dadosAcampamentos = await acampamentoService.listarAcampamentosPublicos();
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

    const handleAvaliar = async (inscricao: InscricaoAcampamento, aprovado: boolean) => {
        if(!confirm((aprovado ? "Aprovar" : "Reprovar") + " a inscrição de " + inscricao.usuario.nomeUsuario + "?"))
            return;
        try{
            const mensagem = await inscricaoAcampamentoService.avaliarInscricao(Number(inscricao.idInscricao), aprovado);
            await carregarDados();
            alert(mensagem);
        }catch(error){
            alert("Erro ao avaliar a inscrição: " + (error as Error).message);
        }
    };

    // Pagamento feito em mãos (dinheiro ou PIX direto para a paróquia)
    const handleRegistrarPagamento = async (inscricao: InscricaoAcampamento) => {
        const idInscricao = Number(inscricao.idInscricao);
        const forma = formas[idInscricao] ?? 'DINHEIRO'; // se não mexeu no select, vale o que aparece nele
        if(!confirm("Registrar pagamento em " + (forma === 'PIX' ? "PIX" : "dinheiro") + " para " + inscricao.usuario.nomeUsuario + "?"))
            return;
        setProcessando(idInscricao);
        try{
            const pagamento = await pagamentoService.registrarPagamentoManual(idInscricao, forma);
            await carregarDados();
            alert("Pagamento de R$ " + pagamento.valorPagamento.toFixed(2) + " registrado! Inscrição confirmada.");
        }catch(error){
            alert("Erro ao registrar o pagamento: " + (error as Error).message);
        }finally{
            setProcessando(null);
        }
    };

    // Pergunta ao Mercado Pago se essa inscrição já foi paga online
    const handleVerificarPagamento = async (inscricao: InscricaoAcampamento) => {
        const idInscricao = Number(inscricao.idInscricao);
        setProcessando(idInscricao);
        try{
            const confirmado = await pagamentoService.verificarPagamento(idInscricao);
            if(confirmado){
                await carregarDados();
                alert("Pagamento de " + inscricao.usuario.nomeUsuario + " aprovado no Mercado Pago! Inscrição confirmada.");
            }else{
                alert("Ainda não há pagamento aprovado no Mercado Pago para " + inscricao.usuario.nomeUsuario + ".");
            }
        }catch(error){
            alert("Erro ao verificar o pagamento: " + (error as Error).message);
        }finally{
            setProcessando(null);
        }
    };

    // fica só com as inscrições que passam nos dois filtros escolhidos
    const inscricoesFiltradas = listaInscricoes.filter(inscricao =>
        (filtroTipo === "TODOS" || inscricao.funcaoAcampamento === filtroTipo) &&
        (filtroAcampamento === 0 || inscricao.acampamento.idAcampamento === filtroAcampamento)
    );

    // troca o texto do banco (PAGAMENTO_PENDENTE) por um texto mais amigável
    function formatarStatus(status: InscricaoAcampamentoStatus){
        if(status === 'AGUARDANDO_APROVACAO')
            return "Aguardando aprovação";
        if(status === 'APROVADO')
            return "Aprovado";
        if(status === 'PAGAMENTO_PENDENTE')
            return "Pagamento pendente";
        if(status === 'CONFIRMADO')
              return "Confirmado";
        return "Reprovado";
    }

    // escolhe a cor da etiqueta: verde = confirmado, vermelho = falta pagar, amarelo = aguardando, azul = aprovado
    function classeStatus(status: InscricaoAcampamentoStatus){
        if(status === 'AGUARDANDO_APROVACAO')
            return styles.statusAguardando;
        if(status === 'APROVADO')
            return styles.statusAprovado;
        if(status === 'PAGAMENTO_PENDENTE')
            return styles.statusPendente;
        if(status === 'CONFIRMADO')
            return styles.statusConfirmado;
        return styles.statusReprovado;
    }

    return(
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
                                            {/* Só aparece para o servo que ainda espera a coordenação decidir */}
                                            {inscricao.statusAprovacao === 'AGUARDANDO_APROVACAO' && (
                                                <div className={styles.avaliacao}>
                                                    <button type="button" className={styles.btnAprovar} onClick={() => handleAvaliar(inscricao, true)}>Aprovar</button>
                                                    <button type="button" className={styles.btnReprovar} onClick={() => handleAvaliar(inscricao, false)}>Reprovar</button>
                                                </div>
                                            )}
                                            {/* Falta pagar: registrar em mãos ou conferir no Mercado Pago (se o acampamento aceita online) */}
                                            {inscricao.statusAprovacao === 'PAGAMENTO_PENDENTE' && (
                                                <div className={styles.pagamento}>
                                                    <select
                                                        className={styles.selectForma}
                                                        value={formas[Number(inscricao.idInscricao)] ?? 'DINHEIRO'}
                                                        onChange={(e) => setFormas(prev => ({ ...prev, [Number(inscricao.idInscricao)]: e.target.value as FormaManual }))}
                                                    >
                                                        <option value="DINHEIRO">Dinheiro</option>
                                                        <option value="PIX">PIX</option>
                                                    </select>
                                                    <button
                                                        type="button"
                                                        className={styles.btnRegistrar}
                                                        disabled={processando === inscricao.idInscricao}
                                                        onClick={() => handleRegistrarPagamento(inscricao)}
                                                    >
                                                        Registrar pagamento
                                                    </button>
                                                    {inscricao.acampamento.aceitaPagamentoOnline && (
                                                        <button
                                                            type="button"
                                                            className={styles.btnVerificar}
                                                            disabled={processando === inscricao.idInscricao}
                                                            onClick={() => handleVerificarPagamento(inscricao)}
                                                        >
                                                            Verificar Mercado Pago
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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
    );
}

export default function VisualizarInscricoes(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaInscricoes />
        </ProtectedRoute>
    );
}
