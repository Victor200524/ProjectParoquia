import { HorarioMissa } from "../types/horarioMissa"; // Ajuste o caminho conforme necessário

const BASE_URL = "http://localhost:8080/horarioMissa";

export const horarioMissaService = {
    async listarHorarios(): Promise<HorarioMissa[]> {
        try {
            const response = await fetch(`${BASE_URL}/todosHorarios`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}` 
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao listar os horários de missa!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async buscarHorariosPorDia(semanaMissa: string): Promise<HorarioMissa[]> {
        try {
            const response = await fetch(`${BASE_URL}/buscarPorDia/${semanaMissa}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao buscar horários por dia!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async cadastrarHorario(horarioMissa: HorarioMissa): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/gravarHorario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(horarioMissa)
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao gravar o horário!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async alterarHorario(idHorario: number, horarioAtualizado: HorarioMissa): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarHorario/${idHorario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(horarioAtualizado)
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar horário!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarHorario(idHorario: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/excluirHorario/${idHorario}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao deletar horário!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};