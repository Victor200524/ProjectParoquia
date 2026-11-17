// Prestação de contas de um acampamento (GET /relatorio/prestacaoContas/{idAcampamento})
export interface PrestacaoContas {
    // Parte 1: estoque
    movimentos: {
        data: string | null;
        tipo: string;                     // ENTRADA, SAIDA, TRANSFERENCIA, PERDA_VALIDADE
        sentido: 'ENTRADA' | 'SAIDA';     // do ponto de vista deste acampamento
        item: string;
        quantidade: number;
        detalhe: string;                  // ex.: "Transferido para Acampamento Y"
        observacao: string | null;
        responsavel: string | null;
    }[];
    resumoItens: { item: string; entradas: number; saidas: number }[];
    doacoesProdutos: { data: string; nome: string; tipo: string; quantidade: number; doador: string }[];

    // Parte 2: financeiro
    inscricoes: { funcao: string; forma: string; quantidade: number; total: number }[];
    doacoesDinheiro: { data: string; nome: string; doador: string; valor: number }[];
    pendentes: { nome: string; funcao: string; valor: number }[];
}
