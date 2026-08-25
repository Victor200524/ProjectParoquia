export type TipoDoacao = 'PERECIVEL' | 'NAO_PERECIVEL';

export interface Doacao {
    idDoacao?: number;
    nomeDoacao: string;
    descricaoDoacao: string;
    nomeDoador: string;
    dataDoacao: string;
    dataValidadeDoacao: string;
    tipoDoacao: TipoDoacao | '';
    qtdeDoacao: number;
    acampamento: { idAcampamento: number | ''};
}