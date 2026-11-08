import { Comunidade } from "./comunidade";
import { Usuario } from "./usuario";

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
    aceitaPagamentoOnline?: boolean; // calculado pelo backend (o token em si nunca volta para o front)
    usuario: Usuario;
    comunidade: Comunidade;
}

export interface AcampamentoPublico {
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
    comunidade: Comunidade;
}