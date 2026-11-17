"use client";

import { useState, useEffect } from "react";
import styles from "./quadrante.module.css";
import { AcampamentoPublico } from "@/types/acampamento";
import { QuadrantePessoa } from "@/types/inscricaoAcampamento";
import { acampamentoService } from "@/services/acampamentoService";
import { inscricaoAcampamentoService } from "@/services/inscricaoAcampamentoService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatarData } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];

const NOME_PAROQUIA = "Paróquia São Miguel Arcanjo";

// Equipes que abrem o quadrante, nesta ordem; as outras vêm depois, em ordem alfabética
const EQUIPES_NO_INICIO = ['COORDENAÇÃO', 'COORDENACAO', 'DIREÇÃO', 'DIRECAO', 'DIRETOR ESPIRITUAL'];
const SEM_EQUIPE = 'SEM EQUIPE';


// Nome da equipe sempre em maiúsculas e sem espaços sobrando ("cozinha " vira "COZINHA")
function nomeEquipe(pessoa: QuadrantePessoa){
    const equipe = (pessoa.equipe ?? '').trim().toUpperCase();
    return equipe === '' ? SEM_EQUIPE : equipe;
}

// Posição da equipe na ordem do quadrante
function ordemEquipe(equipe: string){
    if(equipe === SEM_EQUIPE)
        return 1000; // sempre por último
    const posicao = EQUIPES_NO_INICIO.indexOf(equipe);
    return posicao === -1 ? 100 : posicao;
}

// Junta os servos por equipe: [ ["COORDENAÇÃO", [pessoas]], ["COZINHA", [pessoas]], ... ]
function agruparServosPorEquipe(servos: QuadrantePessoa[]){
    const grupos: Record<string, QuadrantePessoa[]> = {};
    for(const servo of servos){
        const equipe = nomeEquipe(servo);
        if(!grupos[equipe])
            grupos[equipe] = [];
        grupos[equipe].push(servo);
    }
    return Object.entries(grupos).sort(([a], [b]) => ordemEquipe(a) - ordemEquipe(b) || a.localeCompare(b));
}

function porNome(a: QuadrantePessoa, b: QuadrantePessoa){
    return a.nome.localeCompare(b.nome);
}

// Iniciais para quem não tem foto: "Maria da Silva" -> "MS"
function iniciais(nome: string){
    const partes = nome.trim().split(/\s+/);
    const primeira = partes[0]?.charAt(0) ?? '';
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
    return (primeira + ultima).toUpperCase();
}


// Cartão de uma pessoa (foto + dados)
function CartaoPessoa({ pessoa }: { pessoa: QuadrantePessoa }){
    return (
        <div className={styles.cartao}>
            {pessoa.foto ? (
                <img className={styles.foto} src={`data:image/jpeg;base64,${pessoa.foto}`} alt={pessoa.nome} />
            ) : (
                <div className={styles.semFoto}>{iniciais(pessoa.nome)}</div>
            )}
            <div className={styles.dados}>
                <p className={styles.nome}>{pessoa.nome}</p>
                <p className={styles.linha}><span className={styles.rotulo}>Telefone</span>{pessoa.telefone || '-'}</p>
                <p className={styles.linha}><span className={styles.rotulo}>Endereço</span>{pessoa.endereco || '-'}</p>
                <p className={styles.linha}><span className={styles.rotulo}>Nascimento</span>{formatarData(pessoa.dataNascimento)}</p>
            </div>
        </div>
    );
}


function RelatorioQuadrante(){

    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);
    const [idAcampamento, setIdAcampamento] = useState<number | null>(null);
    const [pessoas, setPessoas] = useState<QuadrantePessoa[]>([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(()=>{
        async function carregarAcampamentos(){
            try{
                setListaAcampamentos(await acampamentoService.listarAcampamentosPublicos());
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarAcampamentos();
    }, []);

    async function escolherAcampamento(valor: string){
        if(valor === ''){
            setIdAcampamento(null);
            setPessoas([]);
            return;
        }
        setIdAcampamento(Number(valor));
        setCarregando(true);
        try{
            setPessoas(await inscricaoAcampamentoService.listarQuadrante(Number(valor)));
        }catch(error){
            alert("Erro ao buscar o quadrante: " + (error as Error).message);
        }finally{
            setCarregando(false);
        }
    }

    const acampamento = listaAcampamentos.find(a => a.idAcampamento === idAcampamento);
    const servos = pessoas.filter(p => p.funcao !== 'CAMPISTA');
    const campistas = pessoas.filter(p => p.funcao === 'CAMPISTA').sort(porNome);
    const equipes = agruparServosPorEquipe(servos);

    return(
            <div className={styles.pageContainer}>

                {/* Barra de cima: some na impressão */}
                <div className={styles.barra}>
                    <div>
                        <h1 className={styles.pageTitulo}>Quadrante</h1>
                        <p className={styles.pageSubtitle}>Equipes e campistas confirmados, prontos para imprimir ou salvar em PDF</p>
                    </div>
                    <div className={styles.controles}>
                        <select className={styles.inputField} value={idAcampamento ?? ''} onChange={(e) => escolherAcampamento(e.target.value)}>
                            <option value="">Escolha o acampamento...</option>
                            {listaAcampamentos.map(a => (
                                <option key={a.idAcampamento} value={a.idAcampamento}>{a.nomeAcampamento}</option>
                            ))}
                        </select>
                        <button type="button" className={styles.btnImprimir} onClick={() => window.print()} disabled={!acampamento || pessoas.length === 0}>
                            Imprimir / Salvar PDF
                        </button>
                    </div>
                    {acampamento && !carregando && (
                        <p className={styles.resumo}>
                            {servos.length} servo(s) em {equipes.length} equipe(s) · {campistas.length} campista(s)
                            {pessoas.some(p => !p.foto) && " · quem está sem foto aparece com as iniciais"}
                        </p>
                    )}
                </div>

                {carregando && <p className={styles.aviso}>Carregando...</p>}

                {acampamento && !carregando && pessoas.length === 0 && (
                    <p className={styles.aviso}>Nenhuma inscrição confirmada neste acampamento ainda.</p>
                )}

                {/* Na impressão, a folha do quadrante é A4 deitada (como o modelo) */}
                <style>{"@page { size: A4 landscape; margin: 10mm; }"}</style>

                {/* O documento em si: é só isso que sai na impressão */}
                {acampamento && !carregando && pessoas.length > 0 && (
                    <div className={styles.documento}>

                        {/* Capa */}
                        <section className={styles.capa}>
                            <p className={styles.capaParoquia}>{NOME_PAROQUIA}</p>
                            <p className={styles.capaRotulo}>Quadrante</p>
                            <h2 className={styles.capaNome}>{acampamento.nomeAcampamento}</h2>
                            {acampamento.temaAcampamento && (
                                <p className={styles.capaTema}>“{acampamento.temaAcampamento}”</p>
                            )}
                            {acampamento.fotoAcampamento && (
                                <img className={styles.capaFoto} src={`data:image/jpeg;base64,${acampamento.fotoAcampamento}`} alt={acampamento.nomeAcampamento} />
                            )}
                            <p className={styles.capaDatas}>
                                {formatarData(acampamento.dataInicioAcampamento)} a {formatarData(acampamento.dataFimAcampamento)}
                            </p>
                            {acampamento.comunidade?.nomeComunidade && (
                                <p className={styles.capaComunidade}>{acampamento.comunidade.nomeComunidade}</p>
                            )}
                        </section>

                        {/* Uma seção por equipe de servos */}
                        {equipes.map(([equipe, membros]) => (
                            <section key={equipe} className={styles.secao}>
                                <h3 className={styles.secaoTitulo}>
                                    Equipe: {equipe} <span className={styles.secaoQtde}>{membros.length}</span>
                                </h3>
                                <div className={styles.grade}>
                                    {[...membros].sort(porNome).map((pessoa, i) => (
                                        <CartaoPessoa key={equipe + i} pessoa={pessoa} />
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* Campistas: começam numa página nova */}
                        {campistas.length > 0 && (
                            <section className={`${styles.secao} ${styles.secaoCampistas}`}>
                                <h3 className={styles.secaoTitulo}>
                                    Campistas <span className={styles.secaoQtde}>{campistas.length}</span>
                                </h3>
                                <div className={styles.grade}>
                                    {campistas.map((pessoa, i) => (
                                        <CartaoPessoa key={'campista' + i} pessoa={pessoa} />
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                )}

            </div>
    );
}

export default function Quadrante(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <RelatorioQuadrante />
        </ProtectedRoute>
    );
}
