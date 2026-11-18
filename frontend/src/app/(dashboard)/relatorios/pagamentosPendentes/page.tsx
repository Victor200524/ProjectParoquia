"use client";

import { useState, useEffect } from "react";
import styles from "./pagamentosPendentes.module.css";
import { AcampamentoPublico } from "@/types/acampamento";
import { AlertasPagamento } from "@/types/alertaPagamento";
import { acampamentoService } from "@/services/acampamentoService";
import { alertaPagamentoService } from "@/services/alertaPagamentoService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatarData, formatarDinheiro } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];

const NOME_PAROQUIA = "Paróquia São Miguel Arcanjo";

function textoDias(dias: number){
    if(dias === 0) return 'hoje';
    if(dias === 1) return '1 dia';
    return dias + ' dias';
}

function textoContagem(dias: number){
    if(dias > 0) return 'Faltam ' + textoDias(dias);
    if(dias === 0) return 'Começa hoje';
    return 'Já começou';
}


function RelatorioPagamentosPendentes(){

    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);
    const [idAcampamento, setIdAcampamento] = useState<number | null>(null);
    const [dados, setDados] = useState<AlertasPagamento | null>(null);

    // formulário da programação automática
    const [lembreteAtivo, setLembreteAtivo] = useState(false);
    const [intervaloDias, setIntervaloDias] = useState("10");

    // qual envio está em andamento: o id de uma inscrição, 'todos' ou null (nenhum)
    const [enviando, setEnviando] = useState<number | 'todos' | null>(null);
    const [salvando, setSalvando] = useState(false);

    async function carregarDados(id: number){
        try{
            const resposta = await alertaPagamentoService.listarPendentes(id);
            setDados(resposta);
            setLembreteAtivo(resposta.lembreteAtivo);
            setIntervaloDias(String(resposta.lembreteIntervaloDias ?? 10));
        }catch(error){
            alert("Erro ao buscar os pagamentos pendentes: " + (error as Error).message);
        }
    }

    function escolherAcampamento(valor: string){
        setDados(null);
        if(valor === ''){
            setIdAcampamento(null);
            return;
        }
        setIdAcampamento(Number(valor));
        carregarDados(Number(valor));
    }

    useEffect(()=>{
        async function carregarAcampamentos(){
            try{
                setListaAcampamentos(await acampamentoService.listarAcampamentosPublicos());
                // vindo do Dashboard (/relatorios/pagamentosPendentes?acampamento=13), já abre o acampamento
                const idDaUrl = new URLSearchParams(window.location.search).get('acampamento');
                if(idDaUrl)
                    escolherAcampamento(idDaUrl);
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarAcampamentos();
    }, []);

    async function enviarParaUm(idInscricao: number){
        setEnviando(idInscricao);
        try{
            alert(await alertaPagamentoService.enviarParaUm(idInscricao));
        }catch(error){
            alert((error as Error).message);
        }
        setEnviando(null);
    }

    async function enviarParaTodos(){
        if(!dados || !confirm(`Enviar o e-mail de cobrança para ${dados.pendentes.length} pessoa(s)?`))
            return;
        setEnviando('todos');
        try{
            const resultado = await alertaPagamentoService.enviarParaTodos(dados.idAcampamento);
            let mensagem = `${resultado.enviados} e-mail(s) enviado(s).`;
            if(resultado.falhas.length > 0)
                mensagem += `\n\nNão foi possível enviar para:\n- ${resultado.falhas.join('\n- ')}`;
            alert(mensagem);
            await carregarDados(dados.idAcampamento); // atualiza o "último envio"
        }catch(error){
            alert((error as Error).message);
        }
        setEnviando(null);
    }

    async function salvarProgramacao(){
        if(!dados) return;
        setSalvando(true);
        try{
            const intervalo = intervaloDias === '' ? null : Number(intervaloDias);
            alert(await alertaPagamentoService.salvarProgramacao(dados.idAcampamento, lembreteAtivo, intervalo));
            await carregarDados(dados.idAcampamento); // atualiza o "próximo envio"
        }catch(error){
            alert((error as Error).message);
        }
        setSalvando(false);
    }

    function textoProximoEnvio(){
        if(!dados) return '';
        if(!dados.lembreteAtivo) return 'Envio automático desligado.';
        if(dados.proximoEnvio === null) return 'Sem próximos envios: o acampamento já começou.';
        return `Próximo envio: ${formatarData(dados.proximoEnvio)}, às 9h.`;
    }

    const acampamento = listaAcampamentos.find(a => a.idAcampamento === idAcampamento);
    const pendentesOrdenados = dados ? [...dados.pendentes].sort((a, b) => a.nomeUsuario.localeCompare(b.nomeUsuario)) : [];
    const algumSemValor = dados ? dados.pendentes.some(p => p.valor === null) : false;
    const podeEnviar = dados !== null && dados.emailConfigurado && enviando === null;

    return(
            <div className={styles.pageContainer}>

                {/* Barra de cima: some na impressão */}
                <div className={styles.barra}>
                    <div>
                        <h1 className={styles.pageTitulo}>Pagamentos pendentes</h1>
                        <p className={styles.pageSubtitle}>Quem ainda não pagou a inscrição, com cobrança por e-mail</p>
                    </div>
                    <div className={styles.controles}>
                        <select className={styles.inputField} value={idAcampamento ?? ''} onChange={(e) => escolherAcampamento(e.target.value)}>
                            <option value="">Escolha o acampamento...</option>
                            {listaAcampamentos.map(a => (
                                <option key={a.idAcampamento} value={a.idAcampamento}>{a.nomeAcampamento}</option>
                            ))}
                        </select>
                        <button type="button" className={styles.btnImprimir} onClick={() => window.print()} disabled={!dados}>
                            Imprimir / Salvar PDF
                        </button>
                    </div>
                </div>

                {/* Na impressão, A4 em pé */}
                <style>{"@page { size: A4 portrait; margin: 14mm; }"}</style>

                {dados && (
                    <>
                        {/* ===== Painel de envio de e-mails (só na tela) ===== */}
                        <div className={styles.painelEnvio}>
                            {!dados.emailConfigurado && (
                                <p className={styles.aviso}>
                                    O envio de e-mail não está configurado no servidor (spring.mail no application.properties do backend).
                                </p>
                            )}

                            <div className={styles.cartaoEnvio}>
                                <h2 className={styles.cartaoTitulo}>Cobrar agora</h2>
                                <p className={styles.cartaoTexto}>
                                    Envia o e-mail de pagamento pendente para todas as pessoas da lista.
                                    {dados.lembreteUltimoEnvio && <> Último envio: <strong>{formatarData(dados.lembreteUltimoEnvio)}</strong>.</>}
                                </p>
                                <button type="button" className={styles.btnEnviar} onClick={enviarParaTodos}
                                        disabled={!podeEnviar || dados.pendentes.length === 0}>
                                    {enviando === 'todos' ? 'Enviando...' : `Enviar e-mail para todos (${dados.pendentes.length})`}
                                </button>
                            </div>

                            <div className={styles.cartaoEnvio}>
                                <h2 className={styles.cartaoTitulo}>Lembrete automático</h2>
                                <div className={styles.linhaProgramacao}>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" checked={lembreteAtivo} onChange={(e) => setLembreteAtivo(e.target.checked)} />
                                        Enviar automaticamente a cada
                                    </label>
                                    <input type="number" min={1} max={60} className={styles.inputDias} value={intervaloDias}
                                           onChange={(e) => setIntervaloDias(e.target.value)} disabled={!lembreteAtivo} />
                                    <span>dias</span>
                                    <button type="button" className={styles.btnSalvar} onClick={salvarProgramacao} disabled={salvando}>
                                        {salvando ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                                <p className={styles.cartaoTexto}>{textoProximoEnvio()}</p>
                                <p className={styles.dica}>Só recebe quem continuar pendente. Para sozinho quando o acampamento começar.</p>
                            </div>

                            {/* Explica o texto do e-mail: é um modelo fixo do sistema (AlertaPagamentoService.enviarEmail no backend) */}
                            <details className={styles.modeloEmail}>
                                <summary>Como é o e-mail enviado?</summary>
                                <p className={styles.cartaoTexto}>
                                    O texto é um <strong>modelo padrão do sistema</strong>, igual para todos os acampamentos (não é editável por esta tela).
                                    O sistema só preenche os dados de cada pessoa e do acampamento. Exemplo para este acampamento:
                                </p>
                                <pre className={styles.previaEmail}>
{`Assunto: Pagamento pendente - ${dados.nomeAcampamento}

Olá, [nome da pessoa]!

Sua inscrição como [CAMPISTA ou SERVO] no acampamento ${dados.nomeAcampamento}
(início em ${formatarData(dados.dataInicioAcampamento)}) ainda está com o pagamento pendente.

Valor: [preço do formulário da função, se tiver]

Como pagar:
${dados.aceitaPagamentoOnline ? '- Online: pelo sistema, em "Pagar online".\n' : ''}- Dinheiro ou PIX: procure a coordenação do acampamento.

Se você já fez o pagamento, desconsidere esta mensagem.

Dúvidas ou comprovante? É só responder este e-mail que
[responsável pelo acampamento], da coordenação, recebe.

Paróquia São Miguel`}
                                </pre>
                                <p className={styles.dica}>
                                    As respostas da pessoa vão direto para o e-mail do responsável pelo acampamento.
                                    {!dados.aceitaPagamentoOnline && ' A opção "Pagar online" só aparece quando o acampamento tem Mercado Pago configurado.'}
                                </p>
                            </details>
                        </div>

                        {/* ===== Documento (é o que sai na impressão) ===== */}
                        <div className={styles.documento}>
                            <div className={styles.cabecalho}>
                                <div>
                                    <p className={styles.paroquia}>{NOME_PAROQUIA}</p>
                                    <h2 className={styles.titulo}>Pagamentos pendentes</h2>
                                    <p className={styles.acampamento}>{dados.nomeAcampamento}</p>
                                    <p className={styles.info}>
                                        Início em {formatarData(dados.dataInicioAcampamento)}
                                        {acampamento?.comunidade?.nomeComunidade && ` · ${acampamento.comunidade.nomeComunidade}`}
                                    </p>
                                </div>
                                <p className={styles.emissao}>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
                            </div>

                            <div className={styles.resumo}>
                                <div className={styles.resumoItem}>
                                    <span className={styles.resumoRotulo}>Inscrições pendentes</span>
                                    <span className={styles.resumoValor}>{dados.pendentes.length}</span>
                                </div>
                                <div className={`${styles.resumoItem} ${styles.resumoDestaque}`}>
                                    <span className={styles.resumoRotulo}>Total a receber</span>
                                    <span className={styles.resumoValor}>{formatarDinheiro(dados.totalPendente)}</span>
                                </div>
                                <div className={styles.resumoItem}>
                                    <span className={styles.resumoRotulo}>Acampamento</span>
                                    <span className={styles.resumoValor}>{textoContagem(dados.diasParaAcampamento)}</span>
                                </div>
                            </div>

                            <section className={styles.secao}>
                                <h4 className={styles.secaoTitulo}>Inscrições com pagamento pendente</h4>
                                {pendentesOrdenados.length === 0 ? <p className={styles.semDados}>Nenhuma inscrição com pagamento pendente. 🎉</p> : (
                                    <table className={styles.tabela}>
                                        <thead>
                                            <tr>
                                                <th>Nome</th><th>Função</th><th>Contato</th><th>Inscrito há</th>
                                                <th className={styles.numero}>Valor</th>
                                                <th className={styles.somenteTela}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendentesOrdenados.map(p => (
                                                <tr key={p.idInscricao}>
                                                    <td>{p.nomeUsuario}</td>
                                                    <td>{p.funcao === 'CAMPISTA' ? 'Campista' : 'Equipe de trabalho'}</td>
                                                    <td>
                                                        {p.emailUsuario || <span className={styles.negativo}>sem e-mail</span>}
                                                        {p.contatoUsuario && <span className={styles.observacao}><br />{p.contatoUsuario}</span>}
                                                    </td>
                                                    <td className={p.diasDesdeInscricao >= 30 ? styles.negativo : ''}>{textoDias(p.diasDesdeInscricao)}</td>
                                                    <td className={styles.numero}>{p.valor === null ? 'Não informado' : formatarDinheiro(p.valor)}</td>
                                                    <td className={styles.somenteTela}>
                                                        <button type="button" className={styles.btnLinha} onClick={() => enviarParaUm(p.idInscricao)}
                                                                disabled={!podeEnviar || !p.emailUsuario}>
                                                            {enviando === p.idInscricao ? 'Enviando...' : 'Enviar e-mail'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={4}>Total a receber</td>
                                                <td className={styles.numero}>{formatarDinheiro(dados.totalPendente)}</td>
                                                <td className={styles.somenteTela}></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                )}
                            </section>

                            {algumSemValor && (
                                <p className={styles.nota}>
                                    &quot;Não informado&quot;: o formulário de inscrição desta função está sem preço, por isso não entra no total.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
    );
}

export default function PagamentosPendentesPagina(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <RelatorioPagamentosPendentes />
        </ProtectedRoute>
    );
}
