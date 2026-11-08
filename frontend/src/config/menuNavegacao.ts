import { UsuarioTipoNivel } from "@/types/usuario";

export type SubMenuItem = {
    nome: string;
    rota: string;
    nivelAcesso: UsuarioTipoNivel[];
}

export type MenuItem = {
    nome: string;
    rota?: string;
    nivelAcesso: UsuarioTipoNivel[];
    subMenu?: SubMenuItem[];
}

const ADMIN: UsuarioTipoNivel[] = ['COORDENADOR_GERAL' , 'PADRE' , 'SECRETARIA'];
const ADMIN_COORD: UsuarioTipoNivel[] = ['COORDENADOR_GERAL' , 'PADRE' , 'SECRETARIA' , 'COORDENADOR_ACAMPAMENTO'];
const TODOS: UsuarioTipoNivel[] = ['COORDENADOR_GERAL' , 'PADRE' , 'SECRETARIA' , 'COORDENADOR_ACAMPAMENTO' , 'SERVO' , 'CAMPISTA'];

export const menuNavegacao: MenuItem[] = [
    { nome: 'Início', rota: '/', nivelAcesso: TODOS },
    { nome: 'Painel', rota: '/painel', nivelAcesso: TODOS },
    { nome: 'Acampamentos', nivelAcesso: ADMIN, subMenu: [
        { nome: 'Cadastrar', rota: '/forms/acampamento', nivelAcesso: ADMIN },
        { nome: 'Visualizar', rota: '/views/acampamento', nivelAcesso: ADMIN },
    ]},
    { nome: 'Comunidades', rota: '/forms/comunidades', nivelAcesso: ADMIN },
    { nome: 'Doações', rota: '/forms/doacao', nivelAcesso: ADMIN_COORD },
    { nome: 'Mural de Fotos', rota: '/forms/muralFotos', nivelAcesso: ADMIN_COORD },
    { nome: 'Itens do Estoque', rota: '/forms/itemEstoque', nivelAcesso: ADMIN_COORD },
    { nome: 'Movimentos do Estoque', rota: '/forms/movimentoEstoque', nivelAcesso: ADMIN_COORD },
    { nome: 'Usuários', nivelAcesso: ADMIN, subMenu: [
        { nome: 'Cadastrar', rota: '/forms/usuarios', nivelAcesso: ADMIN },
        { nome: 'Visualizar', rota: '/views/usuarios', nivelAcesso: ADMIN },
    ]},
    { nome: 'Formulários', nivelAcesso: TODOS, subMenu: [
        { nome: 'Cadastrar Formulários', rota: '/forms/formularios', nivelAcesso: ADMIN_COORD },
        { nome: 'Visualizar', rota: '/views/formularios', nivelAcesso: ADMIN_COORD },
        { nome: 'Inscrever-se', rota: '/inscricao/resposta', nivelAcesso: TODOS },
    ]},
    { nome: 'Inscrições', rota: '/views/inscricoes', nivelAcesso: ADMIN_COORD },
    { nome: 'Estoque', rota: '/forms/estoque', nivelAcesso: ADMIN_COORD },
    { nome: 'Equipes & Quadrante', rota: '/forms/equipes', nivelAcesso: ADMIN_COORD },
    { nome: 'Financeiro', rota: '/forms/financeiro', nivelAcesso: ADMIN_COORD }
];

export function itensMenuParaNivel(nivel: UsuarioTipoNivel): MenuItem[] {
    return menuNavegacao.filter(item => item.nivelAcesso.includes(nivel)).map(item => {
        if(!item.subMenu){
            return item;
        }
        return{...item, subMenu: item.subMenu.filter(subItem => subItem.nivelAcesso.includes(nivel))};
    })
}