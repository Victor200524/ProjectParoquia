import { PrestacaoContas } from "../types/relatorio";

const BASE_URL = "http://localhost:8080/relatorio";

export const relatorioService = {
    async buscarPrestacaoContas(idAcampamento: number): Promise<PrestacaoContas> {
        try {
            const response = await fetch(`${BASE_URL}/prestacaoContas/${idAcampamento}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao buscar a prestação de contas!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};
