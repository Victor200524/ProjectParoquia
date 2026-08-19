export interface Acampamento {
    idAcampamento?: number;
    nomeAcampamento: string;
    localAcampamento: string;
    idadeMinAcampamento: number;
    idadeMaxAcampamento: number;
    taxaInscricaoAcampamento: number;
    vagasAcampamento: number;
    dataInicioAcampamento: string;
    dataFimAcampamento: string;
    informacoesAcampamento: string;
    fotoAcampamento: string;
    tokenMercadoPagoAcampamento: string;
    usuario: { idUsuario: number };
    comunidade: { idComunidade: number };
}