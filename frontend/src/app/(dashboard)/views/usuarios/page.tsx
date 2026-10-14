"use client";

import { useState, useEffect } from "react";
import styles from "./usuarios.module.css";
import { Usuario, UsuarioTipoStatus } from "@/types/usuario";
import { usuarioService } from "@/services/usuarioService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { formatarCPF, formatarTelefone } from "@/utils/formatters";

const niveisPermitidos = ['COORDENADOR_GERAL', 'COORDENADOR_ACAMPAMENTO', 'PADRE', 'SECRETARIA'];


export default function VisualizarUsuarios(){

    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);

    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null); 

    const [novaSenha, setNovaSenha] = useState(""); 

    async function carregarUsuarios(){
        try{
            const dados = await usuarioService.listarUsuarios();
            setListaUsuarios(dados);
        }catch(error){
            alert("Erro ao buscar os usuários: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarUsuarios();
    }, []);


    function montarDados(usuario: Usuario, status: UsuarioTipoStatus | undefined, senha: string): Usuario{
        return {
            idUsuario: usuario.idUsuario,
            nomeUsuario: usuario.nomeUsuario,
            cpfUsuario: usuario.cpfUsuario,
            emailUsuario: usuario.emailUsuario,
            contatoUsuario: usuario.contatoUsuario,
            nivelUsuario: usuario.nivelUsuario,
            statusUsuario: status,
            senhaUsuario: senha
        };
    }


    const handleAprovar = async (usuario: Usuario) => {
        try{
            await usuarioService.alterarUsuario(usuario.idUsuario, montarDados(usuario, 'ATIVO', ""));
            await carregarUsuarios();
        }catch(error){
            alert("Erro ao aprovar o usuário: " + (error as Error).message);
        }
    };

    const handleExcluir = async (usuario: Usuario) => {
        if(!confirm("Deseja excluir o usuário " + usuario.nomeUsuario + "?"))
            return;
        try{
            await usuarioService.deletarUsuario(usuario.idUsuario);
            await carregarUsuarios();
        }catch(error){
            alert("Erro ao excluir o usuário: " + (error as Error).message);
        }
    };


    function abrirAlteracao(usuario: Usuario){
        setUsuarioEditando(usuario);
        setNovaSenha("");
    }

    function fecharAlteracao(){
        setUsuarioEditando(null);
        setNovaSenha("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // formata o CPF e o telefone enquanto a pessoa digita
        let valor = value;
        if(name === 'cpfUsuario')
            valor = formatarCPF(value);
        if(name === 'contatoUsuario')
            valor = formatarTelefone(value);

        setUsuarioEditando(prev => (prev ? { ...prev, [name]: valor } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!usuarioEditando)
            return;
        try{
            await usuarioService.alterarUsuario(usuarioEditando.idUsuario, montarDados(usuarioEditando, usuarioEditando.statusUsuario, novaSenha));
            await carregarUsuarios();
            fecharAlteracao();
        }catch(error){
            alert("Erro ao alterar o usuário: " + (error as Error).message);
        }
    };

    // troca o texto do banco (COORDENADOR_GERAL) por um texto mais amigável (Coordenador geral)
    function formatarTexto(texto: string | undefined){
        if(!texto)
            return "";
        const minusculo = texto.replaceAll("_", " ").toLowerCase();
        return minusculo.charAt(0).toUpperCase() + minusculo.slice(1);
    }

    // escolhe a cor da etiqueta do status
    function classeStatus(status: UsuarioTipoStatus | undefined){
        if(status === 'ATIVO')
            return styles.statusAtivo;
        if(status === 'PENDENTE')
            return styles.statusPendente;
        return styles.statusInativo;
    }

    return(
        <ProtectedRoute niveisPermitidos={niveisPermitidos}>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Usuários</h1>
                    <p className={styles.pageSubtitle}>Aprove, altere ou exclua os usuários do sistema</p>
                </div>

                {/* Formulário de alteração: só aparece depois de clicar em "Alterar" em algum usuário */}
                {usuarioEditando && (
                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <h2 className={styles.formTitulo}>Alterar usuário</h2>

                        <div className={styles.grid2Col}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nome completo</label>
                                <input className={styles.inputField} type="text" name="nomeUsuario" value={usuarioEditando.nomeUsuario ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>CPF</label>
                                <input className={styles.inputField} type="text" name="cpfUsuario" value={usuarioEditando.cpfUsuario ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>E-mail</label>
                                <input className={styles.inputField} type="email" name="emailUsuario" value={usuarioEditando.emailUsuario ?? ""} onChange={handleChange} required />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Contato</label>
                                <input className={styles.inputField} type="text" name="contatoUsuario" value={usuarioEditando.contatoUsuario ?? ""} onChange={handleChange} placeholder="(00) 00000-0000" />                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nível de acesso</label>
                                <select className={styles.inputField} name="nivelUsuario" value={usuarioEditando.nivelUsuario ?? ""} onChange={handleChange} required>
                                    <option value="COORDENADOR_GERAL">Coordenador Geral</option>
                                    <option value="PADRE">Padre</option>
                                    <option value="SECRETARIA">Secretaria</option>
                                    <option value="COORDENADOR_ACAMPAMENTO">Coordenador dos Acampamentos</option>
                                    <option value="SERVO">Servo</option>
                                    <option value="CAMPISTA">Campista</option>
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Status</label>
                                <select className={styles.inputField} name="statusUsuario" value={usuarioEditando.statusUsuario ?? ""} onChange={handleChange} required>
                                    <option value="ATIVO">Ativo</option>
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="INATIVO">Inativo</option>
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nova senha</label>
                                <input
                                    className={styles.inputField}
                                    type="password"
                                    placeholder="Deixe em branco para manter a senha atual"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={fecharAlteracao}>Cancelar</button>
                            <button type="submit" className={styles.btnSubmit}>Salvar</button>
                        </div>
                    </form>
                )}

                {listaUsuarios.length === 0 ? (
                    <p className={styles.vazio}>Nenhum usuário encontrado.</p>
                ) : (
                    <div className={styles.tabelaCard}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>E-mail</th>
                                    <th>Contato</th>
                                    <th>Nível</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaUsuarios.map(usuario => (
                                    <tr key={usuario.idUsuario}>
                                        <td>{usuario.nomeUsuario}</td>
                                        <td>{usuario.cpfUsuario}</td>
                                        <td>{usuario.emailUsuario}</td>
                                        <td>{usuario.contatoUsuario}</td>
                                        <td>{formatarTexto(usuario.nivelUsuario)}</td>
                                        <td>
                                            <span className={`${styles.status} ${classeStatus(usuario.statusUsuario)}`}>
                                                {formatarTexto(usuario.statusUsuario)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.acoes}>
                                                {/* O botão Aprovar só aparece para quem ainda está pendente */}
                                                {usuario.statusUsuario === 'PENDENTE' && (
                                                    <button type="button" className={styles.btnAprovar} onClick={() => handleAprovar(usuario)}>Aprovar</button>
                                                )}
                                                <button type="button" className={styles.btnAlterar} onClick={() => abrirAlteracao(usuario)}>Alterar</button>
                                                <button type="button" className={styles.btnExcluir} onClick={() => handleExcluir(usuario)}>Excluir</button>
                                            </div>
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
