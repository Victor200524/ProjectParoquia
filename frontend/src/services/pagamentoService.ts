import { FormaPagamento, Pagamento, PreferenciaPagamento } from "@/types/pagamento";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/pagamento`;

export const pagamentoService = {
    // idAcampamento é opcional: sem ele, o backend devolve os pagamentos de todos os acampamentos
    async listarPagamentos(idAcampamento?: number): Promise<Pagamento[]> {
        try {
            const filtro = idAcampamento ? `?idAcampamento=${idAcampamento}` : "";
            const response = await fetch(`${BASE_URL}/listarPagamentos${filtro}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao listar pagamentos');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    // Coordenador registra um pagamento feito em mãos (dinheiro ou PIX direto para a paróquia)
    async registrarPagamentoManual(idInscricao: number, formaPagamento: Exclude<FormaPagamento, 'MERCADO_PAGO'>): Promise<Pagamento> {
        try {
            const response = await fetch(`${BASE_URL}/registrarPagamentoManual/${idInscricao}?formaPagamento=${formaPagamento}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao registrar pagamento');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    // Pede ao backend o link do checkout do Mercado Pago para o dono da inscrição pagar
    async criarPreferencia(idInscricao: number, urlRetorno: string): Promise<PreferenciaPagamento> {
        try {
            const response = await fetch(`${BASE_URL}/criarPreferencia`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    idInscricao: idInscricao,
                    backUrls: { success: urlRetorno, failure: urlRetorno, pending: urlRetorno }
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao gerar o link de pagamento');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },
    // Pergunta ao backend se o Mercado Pago já aprovou o pagamento
    // true = confirmado agora (201) | false = ainda não pago (200) 
    async verificarPagamento(idInscricao: number): Promise<boolean> {
        try {
            const response = await fetch(`${BASE_URL}/verificarPagamento/${idInscricao}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao verificar o pagamento');
            }
            return response.status === 201;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },
}