import { Acampamento } from './acampamento';

export type TipoFormulario =  'CAMPISTA' | 'SERVO' ;

export interface Formulario {
    idFormulario?: number;
    tituloFormulario: string;
    tipoFormulario: TipoFormulario;
    dataInicioFormulario: string;
    dataFimFormulario: string;
    acampamento: Acampamento;
}

// O Omit funciona como uma forma de criar um novo tipo a partir de outro, mas omitindo algumas propriedades. 
// No caso do CriarFormulario, estamos criando um novo tipo baseado no Formulario, mas removendo as propriedades 'idFormulario' e 'acampamento'. 
// tipo usado para criar: sem id (o banco gera) e com acampamento só pelo id.
export type CriarFormulario = Omit<Formulario, 'idFormulario' | 'acampamento'> & {
    acampamento: { idAcampamento: number };
};