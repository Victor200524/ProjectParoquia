export type TipoDoacao = 'PERECIVEL' | 'NAO_PERECIVEL' | 'DINHEIRO';

export interface Doacao {
    idDoacao?: number;
    nomeDoacao: string;
    descricaoDoacao: string;
    nomeDoador: string;
    dataDoacao: string;
    dataValidadeDoacao: string;
    tipoDoacao: TipoDoacao | '';
    qtdeDoacao: number;
    valorDoacao?: number | null; // só na doação em DINHEIRO (R$)
    acampamento: { idAcampamento: number | ''; nomeAcampamento?: string }; // o nome só vem nas listagens
}