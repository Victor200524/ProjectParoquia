export type UsuarioTipoNivel = 'COORDENADOR_GERAL' | 'PADRE' | 'SECRETARIA' | 'COORDENADOR_ACAMPAMENTO' | 'SERVO' | 'CAMPISTA';

export type UsuarioTipoStatus = 'ATIVO' | 'INATIVO' | 'PENDENTE';

export interface Usuario{
    idUsuario: number;
    nomeUsuario?: string;
    emailUsuario?: string;
    senhaUsuario?: string;
    nivelUsuario?: UsuarioTipoNivel;
    statusUsuario?: UsuarioTipoStatus;
    contatoUsuario?: string;
    cpfUsuario?: string;
    enderecoUsuario?: string;
    dataNascimentoUsuario?: string; // "2000-12-31"
    fotoUsuario?: string | null;    // só é enviada (base64); o backend não devolve a foto nas listagens
}

export interface LoginResponse {
    token: string;
    idUsuario: number;
    nomeUsuario: string;
    nivelUsuario: string; // Mantido como string para consistência com o armazenamento no localStorage
}
// "Meu perfil" (GET /usuario/meuPerfil): os dados do próprio usuário logado
export interface Perfil {
    nome: string;
    email: string;
    cpf: string;
    contato: string;
    endereco: string | null;
    dataNascimento: string | null; // "2000-12-31"
    nivel: UsuarioTipoNivel;
    foto: string | null;           // base64 (sem o "data:image/jpeg;base64,")
}

// O que vai no PUT /usuario/meuPerfil
export interface AlterarPerfil {
    nome: string;
    email: string;
    contato: string;
    endereco: string;
    dataNascimento: string | null;
    foto: string | null;     // foto nova; null = mantém a atual
    removerFoto: boolean;
    senhaAtual: string;
    novaSenha: string;       // vazia = mantém a senha
}
