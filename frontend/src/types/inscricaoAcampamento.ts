import { Acampamento } from "./acampamento";
import { Usuario } from "./usuario";

export type InscricaoAcampamentoStatus = 'AGUARDANDO_APROVACAO' | 'APROVADO' | 'PAGAMENTO_PENDENTE' | 'REPROVADO' | 'CONFIRMADO';

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
// Uma pessoa do quadrante (GET /inscricaoAcampamento/quadrante/{idAcampamento}): só confirmados
export interface QuadrantePessoa {
    nome: string;
    telefone: string | null;
    endereco: string | null;
    dataNascimento: string | null; // "2000-12-31"
    funcao: string;                // CAMPISTA ou SERVO
    equipe: string | null;
    foto: string | null;           // base64 (sem o "data:image/jpeg;base64,")
}
