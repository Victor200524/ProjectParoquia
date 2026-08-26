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
    usuario: Usuario;
    comunidade: Comunidade;
}