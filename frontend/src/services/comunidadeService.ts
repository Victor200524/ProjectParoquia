import { Comunidade } from "../types/comunidade";

const BASE_URL = "http://localhost:8080/comunidade";

export const comunidadeService = {
    async listarComunidades(): Promise<Comunidade[]> {
        try {
            const response = await fetch(`${BASE_URL}/todasComunidades`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}` 
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao listar as comunidades!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async buscarComunidadePorNome(nomeComunidade: string): Promise<Comunidade> {
        try {
            const response = await fetch(`${BASE_URL}/buscarComunidade/${nomeComunidade}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Erro ao buscar comunidade por nome!");
            }
            return await response.json();
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async cadastrarComunidade(comunidade: Comunidade, arquivoFoto: File | null): Promise<string> {
        try {
            const formData = new FormData();
            const jsonBlob = new Blob([JSON.stringify(comunidade)], { type: 'application/json' });
            formData.append('comunidade', jsonBlob);
            
            if (arquivoFoto) {
                formData.append('foto', arquivoFoto);
            }

            const response = await fetch(`${BASE_URL}/gravarComunidade`, {
                method: "POST",
                headers: {
                    // SEM Content-Type!
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: formData
            });
            
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao gravar a comunidade!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async alterarComunidade(idComunidade: number, comunidadeAtualizada: Comunidade, arquivoFoto: File | null): Promise<string> {
        try {
            const formData = new FormData();
            
            const jsonBlob = new Blob([JSON.stringify(comunidadeAtualizada)], { type: 'application/json' });
            formData.append('comunidade', jsonBlob);
            
            if (arquivoFoto) {
                formData.append('foto', arquivoFoto);
            }

            const response = await fetch(`${BASE_URL}/alterarComunidade/${idComunidade}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: formData
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao alterar comunidade!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    },

    async deletarComunidade(idComunidade: number): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/excluirComunidade/${idComunidade}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
            });

            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(responseText || "Erro ao deletar comunidade!");
            }
            return responseText;
        } catch (error) {
            console.error("Erro na camada de serviço: ", error);
            throw error;
        }
    }
};