export type CategoriaItemEstoque = 'MANUTENCAO' | 'COZINHA' | 'INTERCESSAO' | 'SECRETARIA' | 'BAR' | 'ORDEM' | 'RECREACAO'; 
export type TipoItemEstoque = 'PERECIVEL' | 'NAO_PERECIVEL'; 

export interface ItemEstoque {
    idItemEstoque?: number;
    nomeItemEstoque: string;
    qtdeItemEstoque: number;
    categoriaItemEstoque: CategoriaItemEstoque | string;
    tipoItemEstoque: TipoItemEstoque | string;
    dataValidadeItemEstoque?: string; 
}