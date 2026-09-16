import {MovimentacaoEstoque} from '../types/movimentoEstoque';
const BASE_URL = "http://localhost:8080/movimentacaoEstoque";

export const movimentoEstoqueService = {
    async criarMovimentoEstoque(movimentoEstoque: MovimentacaoEstoque): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/gravarMovimentoEstoque`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(movimentoEstoque)
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar movimento do estoque");
            }
            return responseText;
            
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async alterarMovimentoEstoque(idMovimentoEstoque: number, movimentoEstoque: MovimentacaoEstoque): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/alterarMovimentoEstoque/${idMovimentoEstoque}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(movimentoEstoque)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar movimento do estoque!");
            }
            return responseText;
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async listarMovimentoEstoque(): Promise<MovimentacaoEstoque[]> {
        try{
            const response = await fetch(`${BASE_URL}/todasMovimentacoes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(responseText || "Erro ao listar movimentos do estoque");
            }
            return await response.json();
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async deletarMovimentoEstoque(idMovimentoEstoque: number): Promise<void> {
        try {
            const response = await fetch(`${BASE_URL}/deletar/${idMovimentoEstoque}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao deletar movimento do estoque");
            }
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};
