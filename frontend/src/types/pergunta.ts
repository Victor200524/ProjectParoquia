import { Formulario } from "./formulario";

export type TipoPergunta = 'TEXTO';
export type CondicaoPergunta = 'OBRIGATORIA' | 'OPCIONAL';


export interface Pergunta {
    idPergunta?: number;
    textoPergunta: string;
    tipoPergunta: TipoPergunta;
    condicaoPergunta: CondicaoPergunta;
    formulario: Formulario;
}


export type CriarPergunta = Omit<Pergunta, 'idPergunta' | 'formulario'> & {
    formulario: { idFormulario: number };
};