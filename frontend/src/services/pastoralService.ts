import { Pastoral } from "../types/pastoral";

const BASE_URL = "http://localhost:8080/pastoral";

export const pastoralService = {
    async listarPastorais(): Promise<Pastoral[]> {
        try {
            const response = await fetch(`${BASE_URL}/todasPastoral`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao listar as pastorais!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async cadastrarPastoral(pastoral: Pastoral): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/gravarPastoral`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(pastoral)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao cadastrar a pastoral!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async alterarPastoral(idPastoral: number, pastoral: Pastoral): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarPastoral/${idPastoral}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(pastoral)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar a pastoral!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarPastoral(idPastoral: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/excluirPastoral/${idPastoral}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao excluir a pastoral!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};
