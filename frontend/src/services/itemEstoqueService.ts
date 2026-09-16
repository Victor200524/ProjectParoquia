import {ItemEstoque} from '@/types/itemEstoque';
const BASE_URL = "http://localhost:8080/itemEstoque";

export const itemEstoqueService = {
    async criarItemEstoque(itemEstoque: ItemEstoque): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/gravarItemEstoque`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(itemEstoque)
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar item do estoque");
            }
            return responseText;
            
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async alterarItemEstoque(idItemEstoque: number, itemEstoque: ItemEstoque): Promise<ItemEstoque> {
        try{
            const response = await fetch(`${BASE_URL}/alterarItemEstoque/${idItemEstoque}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(itemEstoque)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar item do estoque!");
            }
            return await response.json();
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async listarItemEstoque(): Promise<ItemEstoque[]> {
        try{
            const response = await fetch(`${BASE_URL}/getAllItensEstoque`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(responseText || "Erro ao listar itens do estoque");
            }
            return await response.json();

        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },
    async deletarItemEstoque(idItemEstoque: number): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/deletarItemEstoque/${idItemEstoque}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao deletar item do estoque");
            }
            return responseText;
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};
