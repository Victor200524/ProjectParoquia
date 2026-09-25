import { Resposta, CriarResposta } from '@/types/resposta';
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/resposta`;

export const respostaService = {
    async criarResposta(resposta: CriarResposta): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/gravarResposta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(resposta)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao criar resposta');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async alterarResposta(idResposta: number, resposta: CriarResposta): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarResposta/${idResposta}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(resposta)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao alterar resposta');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async listarRespostas(): Promise<Resposta[]> {
        try {
            const response = await fetch(`${BASE_URL}/todasRespostas`, {
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
                const errorData = await response.text();
                throw new Error(errorData || 'Erro ao listar respostas');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async deletarResposta(idResposta: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/deletarResposta/${idResposta}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao deletar resposta');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    }
};