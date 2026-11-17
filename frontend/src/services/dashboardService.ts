import { Dashboard } from "../types/dashboard";

const BASE_URL = "http://localhost:8080/dashboard";

export const dashboardService = {
    async buscarDashboard(idAcampamento: number): Promise<Dashboard> {
        try {
            const response = await fetch(`${BASE_URL}/${idAcampamento}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao buscar o dashboard!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};
