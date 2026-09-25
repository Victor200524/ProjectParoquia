import { Pergunta } from "./pergunta";
import { InscricaoAcampamento } from "./inscricaoAcampamento";


export interface Resposta {
    idResposta?: number;
    textoResposta: string;
    dataResposta: string;
    pergunta: Pergunta;
    inscricao: InscricaoAcampamento;
}


export type CriarResposta = Omit<Resposta, 'idResposta' | 'pergunta' | 'inscricao'> & {
    pergunta: { idPergunta: number };
    inscricao: { idInscricao: number };
};