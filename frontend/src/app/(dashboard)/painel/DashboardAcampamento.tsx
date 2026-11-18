"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./painel.module.css";
import { AcampamentoPublico } from "@/types/acampamento";
import { Dashboard } from "@/types/dashboard";
import { acampamentoService } from "@/services/acampamentoService";
import { dashboardService } from "@/services/dashboardService";
import { dataParaInput, formatarDinheiro } from "@/utils/formatters";

// Dashboard do acampamento (admin e coordenador): escolhe o acampamento e vê os números dele


// Quantos dias faltam até a data (negativo = já passou)
function diasAte(data: string){
    const dia = new Date(dataParaInput(data) + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.round((dia.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

// Texto da contagem regressiva
function textoContagem(acampamento: AcampamentoPublico){
    const faltaInicio = diasAte(acampamento.dataInicioAcampamento);
    const faltaFim = diasAte(acampamento.dataFimAcampamento);
    if(faltaInicio > 1) return `Faltam ${faltaInicio} dias`;
    if(faltaInicio === 1) return "É amanhã!";
    if(faltaInicio === 0) return "Começa hoje!";
    if(faltaFim >= 0) return "Acontecendo agora";
    return "Já aconteceu";
}

// Escolhe o acampamento que abre selecionado: o próximo que ainda não terminou (ou o mais recente)
function acampamentoInicial(lista: AcampamentoPublico[]){
    const futuros = lista
        .filter(a => diasAte(a.dataFimAcampamento) >= 0)
        .sort((a, b) => dataParaInput(a.dataInicioAcampamento).localeCompare(dataParaInput(b.dataInicioAcampamento)));
    if(futuros.length > 0)
        return futuros[0];
    return [...lista].sort((a, b) => dataParaInput(b.dataInicioAcampamento).localeCompare(dataParaInput(a.dataInicioAcampamento)))[0];
}


// Rosquinha de progresso: um arco verde (o que já foi feito) sobre um trilho cinza
function Rosquinha({ valor, total, titulo, detalhe }: { valor: number; total: number | null; titulo: string; detalhe: string }){
    const raio = 52;
    const circunferencia = 2 * Math.PI * raio;
    const temTotal = total !== null && total > 0;
    const porcentagem = temTotal ? Math.min(100, Math.round((valor / total) * 100)) : 0;

    return (
        <div className={styles.rosquinhaCard} title={`${titulo}: ${detalhe}`}>
            <svg viewBox="0 0 120 120" className={styles.rosquinha} role="img" aria-label={`${titulo}: ${temTotal ? porcentagem + "%" : valor}`}>
                <circle cx="60" cy="60" r={raio} className={styles.rosquinhaTrilho} />
                {temTotal && porcentagem > 0 && (
                    <circle
                        cx="60" cy="60" r={raio}
                        className={styles.rosquinhaArco}
                        strokeDasharray={`${(porcentagem / 100) * circunferencia} ${circunferencia}`}
                        transform="rotate(-90 60 60)" /* começa no topo, como um relógio */
                    />
                )}
                <text x="60" y="60" className={styles.rosquinhaValor}>{temTotal ? `${porcentagem}%` : valor}</text>
            </svg>
            <p className={styles.rosquinhaTitulo}>{titulo}</p>
            <p className={styles.rosquinhaDetalhe}>{detalhe}</p>
        </div>
    );
}


export default function DashboardAcampamento(){

    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);
    const [idAcampamento, setIdAcampamento] = useState<number | null>(null);
    const [dados, setDados] = useState<Dashboard | null>(null);

    async function carregarDashboard(id: number){
        setIdAcampamento(id);
        try{
            setDados(await dashboardService.buscarDashboard(id));
        }catch(error){
            alert("Erro ao buscar o dashboard: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        async function carregarAcampamentos(){
            try{
                const lista = await acampamentoService.listarAcampamentosPublicos();
                setListaAcampamentos(lista);
                const inicial = acampamentoInicial(lista);
                if(inicial?.idAcampamento)
                    carregarDashboard(inicial.idAcampamento);
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarAcampamentos();
    }, []);

    const acampamento = listaAcampamentos.find(a => a.idAcampamento === idAcampamento);

    // ===== contas a partir dos números do backend =====
    const recebido = dados ? dados.recebidoMercadoPago + dados.recebidoManual : 0;
    const faltaReceber = dados ? Math.max(0, dados.valorPrevisto - recebido) : 0;
    const baseBarra = Math.max(dados?.valorPrevisto ?? 0, recebido); // 100% da barra de dinheiro
    const maiorEquipe = Math.max(1, ...(dados?.servosPorEquipe.map(e => e.quantidade) ?? [1]));

    function vagasRestantes(capacidade: number | null, inscritos: number){
        return capacidade === null ? "sem limite" : String(Math.max(0, capacidade - inscritos));
    }

    function porcentoDaBarra(valor: number){
        return baseBarra > 0 ? (valor / baseBarra) * 100 : 0;
    }

    return(
        <div className={styles.dashboard}>

            {/* Cabeçalho: título, seletor e contagem regressiva */}
            <div className={styles.topo}>
                <div>
                    <p className={styles.paroquia}>Paróquia <span>São Miguel Arcanjo</span></p>
                    <h1 className={styles.titulo}>Dashboard do acampamento</h1>
                </div>
                <div className={styles.controles}>
                    <select className={styles.seletor} value={idAcampamento ?? ""} onChange={(e) => carregarDashboard(Number(e.target.value))}>
                        {idAcampamento === null && <option value="">Selecionar acampamento</option>}
                        {listaAcampamentos.map(a => (
                            <option key={a.idAcampamento} value={a.idAcampamento}>{a.nomeAcampamento}</option>
                        ))}
                    </select>
                    {acampamento && <span className={styles.contagem}>{textoContagem(acampamento)}</span>}
                </div>
            </div>

            {listaAcampamentos.length === 0 && <p className={styles.vazio}>Nenhum acampamento cadastrado ainda.</p>}

            {dados && (
                <>
                    {/* === Linha 1: as 4 rosquinhas === */}
                    <div className={styles.linhaRosquinhas}>
                        <Rosquinha
                            titulo="Inscrições de campistas"
                            valor={dados.campistasInscritos}
                            total={dados.campistasCapacidade}
                            detalhe={dados.campistasCapacidade !== null ? `${dados.campistasInscritos} de ${dados.campistasCapacidade} vagas` : `${dados.campistasInscritos} inscritos · sem formulário`}
                        />
                        <Rosquinha
                            titulo="Pagamentos de campistas"
                            valor={dados.campistasConfirmados}
                            total={dados.campistasInscritos}
                            detalhe={`${dados.campistasConfirmados} de ${dados.campistasInscritos} confirmados`}
                        />
                        <Rosquinha
                            titulo="Inscrições da equipe de trabalho"
                            valor={dados.servosInscritos}
                            total={dados.servosCapacidade}
                            detalhe={dados.servosCapacidade !== null ? `${dados.servosInscritos} de ${dados.servosCapacidade} vagas` : `${dados.servosInscritos} inscritos · sem formulário`}
                        />
                        <Rosquinha
                            titulo="Pagamentos da equipe de trabalho"
                            valor={dados.servosConfirmados}
                            total={dados.servosInscritos}
                            detalhe={`${dados.servosConfirmados} de ${dados.servosInscritos} confirmados`}
                        />
                    </div>

                    {/* === Linha 2: números grandes === */}
                    <div className={styles.linhaNumeros}>
                        <div className={styles.numeroCard}>
                            <p className={styles.numero}>{dados.itensRetirados}</p>
                            <p className={styles.numeroLegenda}>Itens pegos da paróquia</p>
                            <p className={styles.numeroDetalhe}>saídas e transferências do estoque</p>
                        </div>
                        <div className={styles.numeroCard}>
                            <p className={styles.numero}>{dados.doacoesRecebidas}</p>
                            <p className={styles.numeroLegenda}>Doações recebidas</p>
                            <p className={styles.numeroDetalhe}>{dados.itensDoados} itens doados</p>
                        </div>
                        <div className={styles.numeroCard}>
                            <p className={styles.numero}>{formatarDinheiro(recebido + dados.doacoesDinheiro)}</p>
                            <p className={styles.numeroLegenda}>Arrecadado</p>
                            <p className={styles.numeroDetalhe}>inscrições {formatarDinheiro(recebido)} + doações {formatarDinheiro(dados.doacoesDinheiro)}</p>
                        </div>
                    </div>

                    {/* === Linha 3: pendências === */}
                    <h2 className={styles.secaoTitulo}>Pendências</h2>
                    <div className={styles.linhaPendencias}>
                        <Link href="/views/inscricoes" className={`${styles.pendencia} ${dados.servosAguardandoAprovacao > 0 ? styles.pendenciaAtiva : ""}`}>
                            <span className={styles.pendenciaNumero}>{dados.servosAguardandoAprovacao}</span>
                            <span>servo(s) aguardando aprovação</span>
                        </Link>
                        <Link href={`/relatorios/pagamentosPendentes?acampamento=${idAcampamento}`} className={`${styles.pendencia} ${dados.pagamentosPendentes > 0 ? styles.pendenciaAtiva : ""}`}>
                            <span className={styles.pendenciaNumero}>{dados.pagamentosPendentes}</span>
                            <span>inscrição(ões) com pagamento pendente</span>
                        </Link>
                        <div className={styles.pendencia}>
                            <span className={styles.pendenciaNumero}>{vagasRestantes(dados.campistasCapacidade, dados.campistasInscritos)}</span>
                            <span>vaga(s) restante(s) para campistas</span>
                        </div>
                        <div className={styles.pendencia}>
                            <span className={styles.pendenciaNumero}>{vagasRestantes(dados.servosCapacidade, dados.servosInscritos)}</span>
                            <span>vaga(s) restante(s) na equipe de trabalho</span>
                        </div>
                    </div>

                    {/* === Linha 4: dinheiro e equipes === */}
                    <div className={styles.linhaPaineis}>

                        {/* Previsto x recebido */}
                        <div className={styles.painel}>
                            <h2 className={styles.painelTitulo}>Previsto x recebido</h2>
                            <p className={styles.painelSub}>
                                {formatarDinheiro(recebido)} recebidos de {formatarDinheiro(dados.valorPrevisto)} previstos
                            </p>
                            <div className={styles.barraDinheiro} role="img" aria-label="Previsto x recebido">
                                {dados.recebidoMercadoPago > 0 && (
                                    <div className={styles.fatiaMercadoPago} style={{ width: `${porcentoDaBarra(dados.recebidoMercadoPago)}%` }}
                                        title={`Mercado Pago: ${formatarDinheiro(dados.recebidoMercadoPago)}`} />
                                )}
                                {dados.recebidoManual > 0 && (
                                    <div className={styles.fatiaManual} style={{ width: `${porcentoDaBarra(dados.recebidoManual)}%` }}
                                        title={`Dinheiro/PIX: ${formatarDinheiro(dados.recebidoManual)}`} />
                                )}
                            </div>
                            <ul className={styles.legenda}>
                                <li><span className={`${styles.legendaCor} ${styles.fatiaMercadoPago}`} />Mercado Pago <strong>{formatarDinheiro(dados.recebidoMercadoPago)}</strong></li>
                                <li><span className={`${styles.legendaCor} ${styles.fatiaManual}`} />Dinheiro / PIX <strong>{formatarDinheiro(dados.recebidoManual)}</strong></li>
                                <li><span className={`${styles.legendaCor} ${styles.fatiaFalta}`} />Falta receber <strong>{formatarDinheiro(faltaReceber)}</strong></li>
                            </ul>
                            <p className={styles.painelNota}>Previsto = inscritos (sem reprovados e sem servos aguardando aprovação) × valor do formulário.</p>
                        </div>

                        {/* Servos por equipe */}
                        <div className={styles.painel}>
                            <h2 className={styles.painelTitulo}>Servos por equipe</h2>
                            {dados.servosPorEquipe.length === 0 ? (
                                <p className={styles.painelSub}>Nenhum servo inscrito ainda.</p>
                            ) : (
                                <ul className={styles.listaEquipes}>
                                    {dados.servosPorEquipe.map(equipe => (
                                        <li key={equipe.equipe} className={styles.equipeLinha} title={`${equipe.equipe}: ${equipe.quantidade}`}>
                                            <span className={styles.equipeNome}>{equipe.equipe}</span>
                                            <span className={styles.equipeTrilho}>
                                                <span className={styles.equipeBarra} style={{ width: `${(equipe.quantidade / maiorEquipe) * 100}%` }} />
                                            </span>
                                            <span className={styles.equipeQtde}>{equipe.quantidade}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
