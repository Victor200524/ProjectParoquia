import { Formulario, CriarFormulario } from '@/types/formulario';
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/formulario`;

export const formularioService = {
    async criarFormulario(formulario: CriarFormulario): Promise<Formulario>{
        try{
            const response = await fetch(`${BASE_URL}/gravarFormulario`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(formulario)
            })
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Erro ao criar formulário');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async alterarFormulario(idFormulario: number, formulario: CriarFormulario): Promise<string>{
        try{
            const response = await fetch(`${BASE_URL}/alterarFormulario/${idFormulario}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(formulario)
            })
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao alterar formulário');
            }
            return responseText;
        }catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async listarFormularios(): Promise<Formulario[]> {
        try {
            const response = await fetch(`${BASE_URL}/todosFormularios`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (response.status === 404) {
                return [];
            }

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao listar os formulários');
            }
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async buscarFormularioPorTitulo(tituloFormulario: string): Promise<Formulario[]> {
        try {
            const response = await fetch(`${BASE_URL}/buscarFormulario/${tituloFormulario}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            
            if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                throw new Error(responseText || 'Erro ao buscar formulário por título');
            }
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    },

    async deletarFormulario(idFormulario: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/deletarFormulario/${idFormulario}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                }
            });
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || 'Erro ao deletar formulário');
            }
            return responseText;
        } catch (error) {
            console.error('Erro na camada de serviço:', error);
            throw error;
        }
    }

}