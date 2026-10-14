import {InscricaoAcampamento, CriarInscricaoAcampamento} from "@/types/inscricaoAcampamento";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/inscricaoAcampamento`;


export const inscricaoAcampamentoService = {

    async criarInscricaoAcampamento(inscricao: CriarInscricaoAcampamento): Promise<InscricaoAcampamento> {
        try {
            const response = await fetch(`${BASE_URL}/gravarInscricao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(inscricao)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao criar inscrição');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async listarInscricoes(): Promise<InscricaoAcampamento[]> {
        try {
            const response = await fetch(`${BASE_URL}/todasInscricoes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao listar inscrições');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async alterarInscricaoAcampamento(idInscricao: number, inscricao: CriarInscricaoAcampamento): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarInscricao/${idInscricao}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(inscricao)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao alterar inscrição');
            }
            return await response.text();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async alterarEquipe(idInscricao: number, equipe: string): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarEquipe/${idInscricao}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ equipe: equipe })
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao alterar a equipe');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async deletarInscricaoAcampamento(idInscricao: number): Promise<void> {
        try {
            const response = await fetch(`${BASE_URL}/deletarInscricao/${idInscricao}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao deletar inscrição');
            }
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    }


}