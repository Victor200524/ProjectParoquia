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
}

export interface LoginResponse {
    token: string;
    idUsuario: number;
    nomeUsuario: string;
    nivelUsuario: string; // Mantido como string para consistência com o armazenamento no localStorage
}