import { Pergunta, CriarPergunta } from '@/types/pergunta';
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/pergunta`;

export const perguntaService = {
    async criarPergunta(pergunta: CriarPergunta): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/gravarPergunta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(pergunta)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao criar pergunta');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async alterarPergunta(idPergunta: number, pergunta: CriarPergunta): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/alterarPergunta/${idPergunta}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(pergunta)
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao alterar pergunta');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async listarPerguntas(): Promise<Pergunta[]> {
        try {
            const response = await fetch(`${BASE_URL}/todasPerguntas`, {
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
                throw new Error(errorData || 'Erro ao listar perguntas');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async deletarPergunta(idPergunta: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/deletarPergunta/${idPergunta}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao deletar pergunta');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    }

}