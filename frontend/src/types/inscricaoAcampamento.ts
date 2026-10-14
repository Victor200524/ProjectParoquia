import { Acampamento } from "./acampamento";
import { Usuario } from "./usuario";

export type InscricaoAcampamentoStatus = 'APROVADO' | 'PAGAMENTO_PENDENTE' | 'REPROVADO';

export interface InscricaoAcampamento {
    idInscricao?: number;
    funcaoAcampamento: string;
    equipeAcampamento?: string; // equipe em que o servo foi alocado (vazio para campista)
    statusAprovacao: InscricaoAcampamentoStatus;
    dataRegistro: string;
    usuario: Usuario;
    acampamento: Acampamento;
}

export type CriarInscricaoAcampamento = Omit<InscricaoAcampamento, 'idInscricao' | 'usuario' | 'acampamento' | 'statusAprovacao' | 'dataRegistro'> & {
    usuario: { idUsuario: number };
    acampamento: { idAcampamento: number };
};