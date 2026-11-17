"use client";

import { useState, useEffect } from "react";
import styles from "./muralFotos.module.css";
import { MuralFotos } from "@/types/muralFotos";
import { AcampamentoPublico } from "@/types/acampamento";
import { MuralFotosService } from "@/services/muralFotosService";
import { acampamentoService } from "@/services/acampamentoService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { dataParaInput, formatarData } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];


function ListaMurais(){

    const [listaMurais, setListaMurais] = useState<MuralFotos[]>([]);
    const [listaAcampamentos, setListaAcampamentos] = useState<AcampamentoPublico[]>([]);

    const [muralEditando, setMuralEditando] = useState<MuralFotos | null>(null);

    async function carregarMurais(){
        try{
            const dados = await MuralFotosService.listarMuralFotos();
            setListaMurais(dados);
        }catch(error){
            alert("Erro ao buscar os murais: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarMurais();

        async function carregarAcampamentos(){
            try{
                const dados = await acampamentoService.listarAcampamentosPublicos();
                setListaAcampamentos(dados);
            }catch(error){
                alert("Erro ao buscar os acampamentos: " + (error as Error).message);
            }
        }
        carregarAcampamentos();
    }, []);


    const handleExcluir = async (mural: MuralFotos) => {
        if(!confirm("Deseja excluir o mural " + mural.tituloMuralFotos + "?"))
            return;
        try{
            await MuralFotosService.deletarMuralFotos(mural.idMuralFotos!);
            await carregarMurais();
        }catch(error){
            alert("Erro ao excluir o mural: " + (error as Error).message);
        }
    };


    function abrirAlteracao(mural: MuralFotos){
        setMuralEditando({
            ...mural,
            dataEventoMuralFotos: dataParaInput(mural.dataEventoMuralFotos),
            acampamento: { idAcampamento: mural.acampamento.idAcampamento }
        });
    }

    function fecharAlteracao(){
        setMuralEditando(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // o acampamento vai como objeto, do jeito que o Java espera
        if(name === 'acampamento'){
            setMuralEditando(prev => (prev ? { ...prev, acampamento: { idAcampamento: Number(value) } } : prev));
            return;
        }

        setMuralEditando(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!muralEditando)
            return;
        try{
            await MuralFotosService.alterarMuralFotos(muralEditando.idMuralFotos!, muralEditando);
            await carregarMurais();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar o mural: " + (error as Error).message);
        }
    };

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Mural de Fotos</h1>
                    <p className={styles.pageSubtitle}>Altere ou exclua os álbuns cadastrados</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" */}
                {muralEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar mural</h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Título</label>
                                <input className={styles.inputField} type="text" name="tituloMuralFotos" value={muralEditando.tituloMuralFotos ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Data do evento</label>
                                <input className={styles.inputField} type="date" name="dataEventoMuralFotos" value={muralEditando.dataEventoMuralFotos ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Acampamento</label>
                                <select className={styles.inputField} name="acampamento" value={muralEditando.acampamento?.idAcampamento ?? ""} onChange={handleChange} required>
                                    <option value="">Selecione...</option>
                                    {listaAcampamentos.map(acampamento => (
                                        <option key={acampamento.idAcampamento} value={acampamento.idAcampamento}>{acampamento.nomeAcampamento}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Link do Google Drive</label>
                                <input className={styles.inputField} type="url" name="linkDriveMuralFotos" value={muralEditando.linkDriveMuralFotos ?? ""} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaMurais.length === 0 ? (
                    <p className={styles.vazio}>Nenhum mural encontrado.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Data do evento</th>
                                    <th>Acampamento</th>
                                    <th>Fotos</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaMurais.map(mural => (
                                    <tr key={mural.idMuralFotos}>
                                        <td>{mural.tituloMuralFotos}</td>
                                        <td>{formatarData(mural.dataEventoMuralFotos)}</td>
                                        <td>{mural.acampamento?.nomeAcampamento}</td>
                                        <td><a href={mural.linkDriveMuralFotos} target="_blank" rel="noopener noreferrer">Abrir álbum</a></td>
                                        <td>
                                            <div className={styles.acoes}>
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(mural)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(mural)}>Excluir</button>
                                            </div>
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

export default function VisualizarMurais(){
    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <ListaMurais />
        </ProtectedRoute>
    );
}
