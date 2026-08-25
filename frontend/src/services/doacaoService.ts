import {Doacao} from "../types/doacao";
const BASE_URL = "http://localhost:8080/doacao";

export const doacaoService = {

    async criarDoacao(doacao: Doacao): Promise<string> {
        try{
            const response = await fetch(`${BASE_URL}/gravarDoacao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(doacao)
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao criar doação");
            }
            return responseText;
            
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async alterarDoacao(idDoacao: number, doacao: Doacao): Promise<Doacao> {
        try{
            const response = await fetch(`${BASE_URL}/alterarDoacao/${idDoacao}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(doacao)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Erro ao alterar doação!");
            }
            return await response.json();
        }catch (error){
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async listarDoacaoes() {
        try{
            const response = await fetch(`${BASE_URL}/todasDoacoes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Erro ao listar doações!");
            }
            return await response.json();   
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async buscarDoacaoPorNome(nome: string): Promise<Doacao[]>{
        try{
            const response = await fetch(`${BASE_URL}/buscarDoacao/${nome}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Erro ao buscar doação!");
            }
            return await response.json();
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarDoacao(idDoacao: number): Promise<void> {
        try{
            const response = await fetch(`${BASE_URL}/deletarDoacao/${idDoacao}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Erro ao deletar doação!");
            }
        }catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }

}
