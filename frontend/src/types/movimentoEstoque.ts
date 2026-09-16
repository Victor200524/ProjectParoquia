import { ItemEstoque } from './itemEstoque';
import { Usuario } from './usuario'; 
import { Acampamento } from './acampamento'; 

export type TipoMovimentacaoEstoque = 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA' | 'PERDA_VALIDADE';

export interface MovimentacaoEstoque {
    idMovimentacaoEstoque?: number;
    tipoMovimentacaoEstoque: TipoMovimentacaoEstoque | string;
    qtdeMovimentacaoEstoque: number;
    dataMovimentacaoEstoque?: string; 
    obsMovimentacaoEstoque?: string;

    itemEstoque: ItemEstoque;
    usuario?: Usuario;
    acampamento?: Acampamento;
    acampamentoDestino?: Acampamento;
}