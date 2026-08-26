import {Comunidade} from '@/types/comunidade';
const BASE_URL = "http://localhost:8080/comunidade";

export const comunidadeService = {
    async listarComunidades(): Promise<Comunidade[]> {
        try {
            const response = await fetch(`${BASE_URL}/todasComunidades`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao listar comunidades");
            }

            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};