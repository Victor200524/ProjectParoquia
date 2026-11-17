"use client";

import { useState, useEffect } from "react";
import styles from "./perfil.module.css";
import { Perfil } from "@/types/usuario";
import { usuarioService } from "@/services/usuarioService";
import RecorteFoto from "@/components/foto/RecorteFoto";
import { formatarTelefone, formatarTexto } from "@/utils/formatters";

// Tela "Editar perfil": qualquer usuário logado edita os PRÓPRIOS dados.
// Não precisa de ProtectedRoute: o backend usa o usuário do token, então cada um só mexe no seu.

export default function EditarPerfil(){

    const [perfil, setPerfil] = useState<Perfil | null>(null);

    // Foto: fotoNova = recortada agora (ainda não salva); removerFoto = pediu para tirar a foto
    const [imagemParaRecortar, setImagemParaRecortar] = useState<string | null>(null);
    const [fotoNova, setFotoNova] = useState<string | null>(null);
    const [removerFoto, setRemoverFoto] = useState(false);

    // Troca de senha (opcional)
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [salvando, setSalvando] = useState(false);

    async function carregarPerfil(){
        try{
            setPerfil(await usuarioService.buscarMeuPerfil());
        }catch(error){
            alert("Erro ao buscar o perfil: " + (error as Error).message);
        }
    }

    useEffect(()=>{
        carregarPerfil();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const valor = name === 'contato' ? formatarTelefone(value) : value;
        setPerfil(prev => (prev ? { ...prev, [name]: valor } : prev));
    };

    const handleEscolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0];
        if(!arquivo)
            return;
        // lê o arquivo como "data:image/...;base64,..." para mostrar na tela de recorte
        const leitor = new FileReader();
        leitor.onload = () => setImagemParaRecortar(leitor.result as string);
        leitor.readAsDataURL(arquivo);
        e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    };

    // Qual foto mostrar: a nova recortada > nenhuma (se pediu para remover) > a que está salva
    const fotoNaTela = fotoNova ?? (removerFoto ? null : perfil?.foto ?? null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!perfil)
            return;
        if(novaSenha !== "" && novaSenha !== confirmarSenha){
            alert("A nova senha e a confirmação estão diferentes.");
            return;
        }

        setSalvando(true);
        try{
            const mensagem = await usuarioService.alterarMeuPerfil({
                nome: perfil.nome,
                email: perfil.email,
                contato: perfil.contato,
                endereco: perfil.endereco ?? "",
                dataNascimento: perfil.dataNascimento || null,
                foto: fotoNova,
                removerFoto: removerFoto,
                senhaAtual: senhaAtual,
                novaSenha: novaSenha
            });

            // o nome aparece no cabeçalho: atualiza o que está guardado no navegador e avisa o Header
            localStorage.setItem('nomeUsuario', perfil.nome);
            window.dispatchEvent(new Event('perfilAtualizado'));

            // limpa o que era só desta edição e recarrega do banco
            setFotoNova(null);
            setRemoverFoto(false);
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");
            await carregarPerfil();
            alert(mensagem);
        }catch(error){
            alert("Erro ao salvar o perfil: " + (error as Error).message);
        }finally{
            setSalvando(false);
        }
    };

    if(!perfil)
        return <div className={styles.pageContainer}><p className={styles.vazio}>Carregando...</p></div>;

    return(
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitulo}>Meu perfil</h1>
                    <p className={styles.pageSubtitle}>Atualize seus dados, sua foto e sua senha</p>
                </div>

                {/* Janela de recorte: aparece depois de escolher o arquivo da foto */}
                {imagemParaRecortar && (
                    <RecorteFoto
                        imagem={imagemParaRecortar}
                        onConfirmar={(foto) => { setFotoNova(foto); setRemoverFoto(false); setImagemParaRecortar(null); }}
                        onCancelar={() => setImagemParaRecortar(null)}
                    />
                )}

                <form className={styles.formCard} onSubmit={handleSubmit}>

                    {/* === Foto === */}
                    <div className={styles.fotoArea}>
                        {fotoNaTela ? (
                            <img className={styles.foto} src={`data:image/jpeg;base64,${fotoNaTela}`} alt="Sua foto" />
                        ) : (
                            <div className={styles.semFoto}>{perfil.nome.charAt(0).toUpperCase()}</div>
                        )}
                        <div className={styles.fotoInfo}>
                            <p className={styles.fotoNome}>{perfil.nome}</p>
                            <p className={styles.fotoNivel}>{formatarTexto(perfil.nivel)}</p>
                            <div className={styles.fotoBotoes}>
                                <label className={styles.btnFoto}>
                                    {fotoNaTela ? "Trocar foto" : "Adicionar foto"}
                                    <input type="file" accept="image/*" onChange={handleEscolherFoto} hidden />
                                </label>
                                {fotoNaTela && (
                                    <button type="button" className={styles.btnRemoverFoto} onClick={() => { setFotoNova(null); setRemoverFoto(true); }}>
                                        Remover foto
                                    </button>
                                )}
                            </div>
                            {(fotoNova || removerFoto) && <span className={styles.fieldHint}>Clique em Salvar para confirmar a mudança da foto.</span>}
                        </div>
                    </div>

                    {/* === Dados pessoais === */}
                    <h2 className={styles.formTitulo}>Dados pessoais</h2>
                    <div className={styles.grid2Col}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Nome completo</label>
                            <input className={styles.inputField} type="text" name="nome" value={perfil.nome ?? ""} onChange={handleChange} required />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>CPF</label>
                            <input className={styles.inputField} type="text" value={perfil.cpf ?? ""} disabled />
                            <span className={styles.fieldHint}>O CPF é o seu login; para mudar, fale com a secretaria.</span>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>E-mail</label>
                            <input className={styles.inputField} type="email" name="email" value={perfil.email ?? ""} onChange={handleChange} required />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Telefone</label>
                            <input className={styles.inputField} type="text" name="contato" value={perfil.contato ?? ""} onChange={handleChange} placeholder="(00) 00000-0000" required />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Endereço</label>
                            <input className={styles.inputField} type="text" name="endereco" value={perfil.endereco ?? ""} onChange={handleChange} placeholder="Rua, número - Bairro" />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Data de nascimento</label>
                            <input className={styles.inputField} type="date" name="dataNascimento" value={perfil.dataNascimento ?? ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* === Senha (opcional) === */}
                    <h2 className={styles.formTitulo}>Trocar senha <span className={styles.opcional}>(opcional)</span></h2>
                    <div className={styles.grid3Col}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Senha atual</label>
                            <input className={styles.inputField} type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} autoComplete="current-password" required={novaSenha !== ""} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Nova senha</label>
                            <input className={styles.inputField} type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} autoComplete="new-password" placeholder="Em branco = mantém a atual" />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Confirmar nova senha</label>
                            <input className={styles.inputField} type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} autoComplete="new-password" required={novaSenha !== ""} />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnSubmit} disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
    );
}
