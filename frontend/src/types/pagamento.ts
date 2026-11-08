import { InscricaoAcampamento } from "./inscricaoAcampamento";

export type FormaPagamento = 'MERCADO_PAGO' | 'DINHEIRO' | 'PIX';

export interface PreferenciaPagamento {
    preferenceId: string;
    redirectUrl: string;
}

export interface Pagamento {
    idPagamento: number;
    valorPagamento: number;
    formaPagamento: FormaPagamento;
    dataPagamento: string;
    idMercadoPagoPagamento: string | null; // só existe quando foi pago pelo Mercado Pago
    inscricaoAcampamento: InscricaoAcampamento;
}