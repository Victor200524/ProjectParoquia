"use client";

import Link from "next/link";
import styles from "./painel.module.css";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";
import { itensMenuParaNivel } from "@/config/menuNavegacao";
import { UsuarioTipoNivel } from "@/types/usuario";
import DashboardAcampamento from "./DashboardAcampamento";

// Painel (tela depois do login):
// - administração e coordenação veem o Dashboard do acampamento;
// - servos e campistas veem as boas-vindas e atalhos para o que eles podem acessar.

const NIVEIS_DASHBOARD: UsuarioTipoNivel[] = ['COORDENADOR_GERAL', 'PADRE', 'SECRETARIA', 'COORDENADOR_ACAMPAMENTO'];


// Atalhos = os mesmos itens do menu lateral daquele nível (os submenus viram atalhos soltos)
function AtalhosRapidos({ nivel }: { nivel: UsuarioTipoNivel }){
    const atalhos: { nome: string; rota: string }[] = [];
    for(const item of itensMenuParaNivel(nivel)){
        if(item.rota && item.rota !== '/painel')
            atalhos.push({ nome: item.nome, rota: item.rota });
        for(const sub of item.subMenu ?? [])
            atalhos.push({ nome: item.nome + " · " + sub.nome, rota: sub.rota });
    }

    return (
        <div className={styles.atalhos}>
            {atalhos.map(atalho => (
                <Link key={atalho.rota} href={atalho.rota} className={styles.atalho}>{atalho.nome}</Link>
            ))}
            <Link href="/perfil" className={styles.atalho}>Meu perfil</Link>
        </div>
    );
}


export default function Painel(){
    const usuario = useUsuarioLogado();

    // enquanto lê o localStorage, não mostra nada (evita piscar a tela errada)
    if(!usuario.nivelUsuario)
        return null;

    if(NIVEIS_DASHBOARD.includes(usuario.nivelUsuario))
        return <DashboardAcampamento />;

    return (
        <div className={styles.boasVindas}>
            <h1 className={styles.titulo}>Olá, {usuario.nomeUsuario}!</h1>
            <p className={styles.boasVindasTexto}>Bem-vindo ao sistema da Paróquia São Miguel Arcanjo. Por onde quer começar?</p>
            <AtalhosRapidos nivel={usuario.nivelUsuario} />
        </div>
    );
}
