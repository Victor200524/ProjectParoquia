export interface Usuario{
    idUsuario: number;
    nomeUsuario?: string;
    emailUsuario?: string;
    senhaUsuario?: string;
    nivelUsuario?: number;
    statusUsuario?: number;
    contatoUsuario?: string;
    cpfUsuario?: string;
}

export interface LoginResponse {
    token: string;
    idUsuario: number;
    nomeUsuario: string;
}